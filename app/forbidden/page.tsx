import Link from "next/link";

export const metadata = {
  title: "Доступ запрещён",
  description: "У вас нет прав для просмотра этой страницы.",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center container-padding">
      <p className="text-6xl font-semibold text-[#676682] mb-2">403</p>
      <h1 className="text-xl font-medium text-[#111] mb-4">Доступ запрещён</h1>
      <p className="text-[#676682] mb-6 text-center max-w-md">
        У вас нет прав для просмотра этой страницы или выполнение действия запрещено.
      </p>
      <Link
        href="/"
        className="rounded-full border border-[#6f89f3] bg-[#f1f4ff] px-6 py-3 text-[#3a3f55] font-medium hover:opacity-90 transition-opacity"
      >
        На главную
      </Link>
    </div>
  );
}
