import { apiFetch } from "@/app/api/_utils";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const response = await apiFetch(`/admin/contents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    admin: true
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await apiFetch(`/admin/contents/${id}`, {
    method: "DELETE",
    admin: true
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
