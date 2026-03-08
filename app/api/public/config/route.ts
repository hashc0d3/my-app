import { apiFetch } from "@/app/api/_utils";

const ABSOLUTE_MEDIA_URL_RE =
  /^https?:\/\/(?:localhost|127\.0\.0\.1):4000\/public\/media\/([^/?#]+)([?#].*)?$/i;
const RELATIVE_MEDIA_URL_RE = /^\/public\/media\/([^/?#]+)([?#].*)?$/;

const normalizeMediaUrl = (value: string): string => {
  if (value.startsWith("/api/public/media/")) {
    return value;
  }

  const absoluteMatch = value.match(ABSOLUTE_MEDIA_URL_RE);
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
  const response = await apiFetch("/public/config");
  const data = await response.json();
  const normalized = normalizeConfigMediaUrls(data);
  return Response.json(normalized, { status: response.status });
}
