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
      const metadata = await sharp(file.buffer).metadata();
      width = metadata.width ?? null;
      height = metadata.height ?? null;
      outputBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
      outputMime = "image/webp";
      ext = ".webp";
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
