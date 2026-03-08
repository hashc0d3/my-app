import { publicApiBaseUrl } from "@/src/shared/config/api";
import type { ContentDto } from "@/src/shared/types/content";

async function getContent(): Promise<ContentDto[]> {
  const res = await fetch(`${publicApiBaseUrl}/public/contents`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ContentPage() {
  const contents = await getContent();

  return (
    <div className="container py-4">
      <h2 className="mb-4">Контент из NestJS</h2>
      {contents.length === 0 ? (
        <div className="text-muted">Контента нет</div>
      ) : (
        <div className="row g-4">
          {contents.map((item) => (
            <div className="col-12 col-md-6" key={item.id}>
              <div className="card h-100 p-3 shadow-sm">
                <h5>{item.title}</h5>
                <p className="text-muted">{item.body}</p>
                {item.image && (
                  <img
                    src={item.image.url ?? ""}
                    alt={item.title}
                    style={{ width: "100%", borderRadius: "12px" }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
