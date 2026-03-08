import { apiFetch } from "@/app/api/_utils";

export async function GET() {
  const response = await apiFetch("/public/contents");
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
