import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";
import { PageSkeleton } from "@/src/shared/ui";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
