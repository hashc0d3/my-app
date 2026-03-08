import { NextResponse } from "next/server";
import { apiFetch } from "@/app/api/_utils";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const amount = Number(url.searchParams.get("amount") ?? 0);
  const orderId = url.searchParams.get("orderId") ?? undefined;

  const response = await apiFetch("/public/payments/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, orderId })
  });

  const data = await response.json();
  if (data?.redirectUrl) {
    return NextResponse.redirect(data.redirectUrl, { status: 302 });
  }

  return NextResponse.json({ error: "Payment redirect failed" }, { status: 500 });
}
