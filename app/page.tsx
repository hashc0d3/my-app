import { Suspense } from "react";
import HomeContent from "./HomeContent";
import { PageSkeleton } from "@/src/shared/ui";

export const metadata = {
  title: "Slava Larionov — ремешки и аксессуары",
  description: "Конфигуратор ремешков для часов и чехлов. Выберите серию часов, модель ремешка и оформите заказ.",
};

export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
