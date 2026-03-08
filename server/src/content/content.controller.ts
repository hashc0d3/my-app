import { Controller, Get, Param } from "@nestjs/common";
import { ContentService } from "./content.service";

@Controller("public/contents")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  list() {
    return this.contentService.listPublic();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.contentService.getPublic(id);
  }
}
