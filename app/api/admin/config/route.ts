import { apiFetch } from "@/app/api/_utils";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const body = await request.json();
  const response = await apiFetch("/admin/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    admin: true
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
