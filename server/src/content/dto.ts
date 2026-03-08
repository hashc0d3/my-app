import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateContentDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsString()
  @Length(1, 10000)
  body!: string;

  @IsOptional()
  @IsUUID()
  imageId?: string;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10000)
  body?: string;

  @IsOptional()
  @IsUUID()
  imageId?: string | null;
}
