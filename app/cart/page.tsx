import { Suspense } from "react";
import CartContent from "./CartContent";
import { PageSkeleton } from "@/src/shared/ui";

export default function CartPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
