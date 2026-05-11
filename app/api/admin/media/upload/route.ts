import { apiFetch } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const response = await apiFetch("/admin/media/upload", {
    method: "POST",
    body: formData,
    admin: true
  });
  const raw = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") && raw) {
    try {
      return Response.json(JSON.parse(raw) as unknown, { status: response.status });
    } catch {
      return new Response(raw, { status: response.status });
    }
  }
  return new Response(raw || null, { status: response.status });
}
