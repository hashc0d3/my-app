export const runtime = "nodejs";

const isHttpUrl = (value: string): boolean => /^https?:\/\//i.test(value.trim());

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { url?: string } | null;
    const rawUrl = body?.url?.trim() ?? "";

    if (!rawUrl || !isHttpUrl(rawUrl)) {
      return Response.json({ message: "Некорректная ссылка" }, { status: 400 });
    }

    const response = await fetch(rawUrl, { cache: "no-store" });
    if (!response.ok) {
      return Response.json({ message: "Не удалось скачать изображение" }, { status: 400 });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return Response.json({ message: "Ссылка не указывает на изображение" }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return Response.json({ message: "Ошибка импорта изображения" }, { status: 500 });
  }
}
