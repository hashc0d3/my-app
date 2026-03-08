import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../common/admin-auth.guard";
import { CreateContentDto, UpdateContentDto } from "./dto";
import { ContentService } from "./content.service";

@UseGuards(AdminAuthGuard)
@Controller("admin/contents")
export class AdminContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contentService.remove(id);
  }
}
