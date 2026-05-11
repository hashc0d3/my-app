import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { env } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const origins = env.webOrigin
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length <= 1 ? (origins[0] ?? env.webOrigin) : origins,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // multipart (upload) даёт поля в body; forbidNonWhitelisted ломает POST /admin/media/upload
      forbidNonWhitelisted: false
    })
  );

  await app.listen(env.port);
  // eslint-disable-next-line no-console
  console.log(`API running on ${env.port}`);
}

bootstrap();
