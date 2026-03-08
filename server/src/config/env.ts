import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  adminToken: process.env.ADMIN_TOKEN ?? "changeme",
  uploadsDir: process.env.UPLOADS_DIR ?? "./uploads",
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "http://localhost:4000",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 10)
};
