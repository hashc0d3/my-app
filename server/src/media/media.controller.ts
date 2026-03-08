import { BadRequestException, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { memoryStorage } from "multer";
import { AdminAuthGuard } from "../common/admin-auth.guard";
import { env } from "../config/env";
import { MediaService } from "./media.service";
import path from "path";

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("public/media/:id")
  async serve(@Param("id") id: string, @Res() res: Response) {
    const media = await this.mediaService.getMedia(id);
    const filePath = path.resolve(env.uploadsDir, media.filename);
    res.setHeader("Content-Type", media.mimeType);
    return res.sendFile(filePath);
  }

  @UseGuards(AdminAuthGuard)
  @Post("admin/media/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: env.maxUploadMb * 1024 * 1024 }
    })
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    return this.mediaService.saveUpload(file);
  }

  @UseGuards(AdminAuthGuard)
  @Delete("admin/media/:id")
  remove(@Param("id") id: string) {
    return this.mediaService.deleteMedia(id);
  }
}
