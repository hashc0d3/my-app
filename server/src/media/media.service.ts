import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { env } from "../config/env";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

const passthroughMimeTypes = new Set(["image/svg+xml", "image/gif", "image/webp", "video/webm"]);

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUploadsDir() {
    await fs.mkdir(env.uploadsDir, { recursive: true });
  }

  async saveUpload(file: Express.Multer.File) {
    await this.ensureUploadsDir();

    const originalName = file.originalname || "upload";
    const isImage = file.mimetype.startsWith("image/");
    const isWebmVideo = file.mimetype === "video/webm";
    if (!isImage && !isWebmVideo) {
      throw new BadRequestException("Only image uploads and .webm videos are supported");
    }

    const isPassthrough = passthroughMimeTypes.has(file.mimetype);

    let outputBuffer = file.buffer;
    let outputMime = file.mimetype;
    let width: number | null = null;
    let height: number | null = null;
    let ext = path.extname(originalName) || ".bin";

    if (!isPassthrough && isImage) {
      let meta: { width?: number; height?: number } | undefined;
      try {
        meta = await sharp(file.buffer, { failOn: "none" }).metadata();
      } catch {
        meta = undefined;
      }
      width = meta?.width ?? null;
      height = meta?.height ?? null;

      // Без rotate() и mozjpeg — на части сборок Windows libvips падает с «A boolean was expected».
      type Encoded = { buffer: Buffer; mimeType: string; ext: string };
      const attempts: (() => Promise<Encoded>)[] = [
        async () => ({
          buffer: await sharp(file.buffer, { failOn: "none" }).webp({ quality: 80 }).toBuffer(),
          mimeType: "image/webp",
          ext: ".webp"
        }),
        async () => ({
          buffer: await sharp(file.buffer, { failOn: "none" }).jpeg({ quality: 85 }).toBuffer(),
          mimeType: "image/jpeg",
          ext: ".jpg"
        }),
        async () => ({
          buffer: await sharp(file.buffer, { failOn: "none" }).png({ compressionLevel: 9 }).toBuffer(),
          mimeType: "image/png",
          ext: ".png"
        })
      ];

      let encoded: Encoded | null = null;
      for (const run of attempts) {
        try {
          encoded = await run();
          break;
        } catch {
          /* следующий формат */
        }
      }

      if (encoded) {
        outputBuffer = encoded.buffer;
        outputMime = encoded.mimeType;
        ext = encoded.ext;
      } else {
        // Все перекодирования недоступны — сохраняем исходный файл как есть (тип уже проверен как image/*)
        const mimeExt: Record<string, string> = {
          "image/jpeg": ".jpg",
          "image/jpg": ".jpg",
          "image/png": ".png",
          "image/bmp": ".bmp",
          "image/tiff": ".tiff",
          "image/avif": ".avif",
          "image/heic": ".heic",
          "image/heif": ".heif",
          "image/webp": ".webp"
        };
        const fromName = path.extname(originalName).toLowerCase();
        ext = mimeExt[file.mimetype] ?? (fromName.length > 1 ? fromName : ".jpg");
        outputMime = file.mimetype;
        outputBuffer = file.buffer;
      }
    } else if (isPassthrough) {
      if (file.mimetype === "image/svg+xml") {
        ext = ".svg";
      } else if (file.mimetype === "image/gif") {
        ext = ".gif";
      } else if (file.mimetype === "image/webp") {
        ext = ".webp";
      } else if (file.mimetype === "video/webm") {
        ext = ".webm";
      }
    }

    const filename = `${crypto.randomUUID()}${ext}`;
    const filePath = path.resolve(env.uploadsDir, filename);

    await fs.writeFile(filePath, outputBuffer);

    const media = await this.prisma.media.create({
      data: {
        filename,
        mimeType: outputMime,
        size: outputBuffer.length,
        width,
        height
      }
    });

    return {
      ...media,
      url: `/api/public/media/${media.id}`
    };
  }

  async getMedia(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException("Media not found");
    return media;
  }

  async deleteMedia(id: string) {
    const media = await this.getMedia(id);
    const filePath = path.resolve(env.uploadsDir, media.filename);
    await fs.unlink(filePath).catch(() => undefined);
    await this.prisma.media.delete({ where: { id } });
    return { id };
  }
}
