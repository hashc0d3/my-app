import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContentDto, UpdateContentDto } from "./dto";
import { env } from "../config/env";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic() {
    const items = await this.prisma.content.findMany({
      orderBy: { createdAt: "desc" },
      include: { image: true }
    });
    return items.map((item) => this.withImageUrl(item));
  }

  async getPublic(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { image: true }
    });
    if (!content) throw new NotFoundException("Content not found");
    return this.withImageUrl(content);
  }

  async create(dto: CreateContentDto) {
    const content = await this.prisma.content.create({
      data: {
        title: dto.title,
        body: dto.body,
        imageId: dto.imageId ?? null
      },
      include: { image: true }
    });
    return this.withImageUrl(content);
  }

  async update(id: string, dto: UpdateContentDto) {
    await this.ensureExists(id);
    const content = await this.prisma.content.update({
      where: { id },
      data: {
        title: dto.title,
        body: dto.body,
        imageId: dto.imageId === undefined ? undefined : dto.imageId
      },
      include: { image: true }
    });
    return this.withImageUrl(content);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.content.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.content.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("Content not found");
  }

  private withImageUrl<T extends { image?: { id: string } | null }>(item: T) {
    if (!item.image) return item;
    return {
      ...item,
      image: {
        ...item.image,
        url: `${env.publicBaseUrl}/public/media/${item.image.id}`
      }
    };
  }
}
