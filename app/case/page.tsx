import { Suspense } from "react";
import CasePageContent from "./CasePageContent";
import { PageSkeleton } from "@/src/shared/ui";

export const metadata = {
  title: "Конструктор чехлов — Slava Larionov",
  description: "Кастомизация кожаных чехлов для iPhone."
};

export default function CasePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CasePageContent />
    </Suspense>
  );
}
