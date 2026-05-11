import { apiFetch } from "@/app/api/_utils";

export const runtime = "nodejs";

const ABSOLUTE_PUBLIC_MEDIA_RE =
  /^https?:\/\/[^/]+\/public\/media\/([^/?#]+)([?#].*)?$/i;
const RELATIVE_MEDIA_URL_RE = /^\/public\/media\/([^/?#]+)([?#].*)?$/;

const normalizeMediaUrl = (value: string): string => {
  if (value.startsWith("/api/public/media/")) {
    return value;
  }

  const absoluteMatch = value.match(ABSOLUTE_PUBLIC_MEDIA_RE);
  if (absoluteMatch) {
    const [, id, suffix = ""] = absoluteMatch;
    return `/api/public/media/${id}${suffix}`;
  }

  const relativeMatch = value.match(RELATIVE_MEDIA_URL_RE);
  if (relativeMatch) {
    const [, id, suffix = ""] = relativeMatch;
    return `/api/public/media/${id}${suffix}`;
  }

  return value;
};

const normalizeConfigMediaUrls = (value: unknown): unknown => {
  if (typeof value === "string") {
    return normalizeMediaUrl(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeConfigMediaUrls(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeConfigMediaUrls(nestedValue)])
    );
  }

  return value;
};

export async function GET() {
  let response: Response;
  try {
    response = await apiFetch("/public/config");
  } catch (err) {
    console.error("[api/public/app-config] Backend request failed:", err);
    return Response.json({ error: "API unavailable" }, { status: 502 });
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const text = await response.text();
  let data: unknown;
  if (isJson && text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = {};
    }
  } else {
    data = response.ok ? {} : { error: text || "Backend error" };
  }

  if (!response.ok) {
    return Response.json(data, { status: response.status });
  }

  const normalized = normalizeConfigMediaUrls(data);
  return Response.json(normalized, { status: 200 });
}
