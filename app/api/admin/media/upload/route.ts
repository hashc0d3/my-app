import { apiFetch } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const response = await apiFetch("/admin/media/upload", {
    method: "POST",
    body: formData,
    admin: true
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
