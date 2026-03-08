import { apiFetch } from "@/app/api/_utils";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await apiFetch("/public/promocodes/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
