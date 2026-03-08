"use client";

import { observer } from "mobx-react";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { HeaderInfoModal } from "@/src/features/header-info-modal";
import { headerStore } from "@/src/entities/header";
import { Footer } from "@/src/widgets/footer";
import { ProgressBar } from "@/src/widgets/progress-bar";
import { progressBarStore } from "@/src/entities/progress-bar";
import { TitleStepsSection } from "@/src/features/title-section";
import { WatchModelSelection } from "@/src/features/watch-model-selection";
import { FrameColors } from "@/src/features/frame-colors-selection";
import { StrapModelSelection } from "@/features/strap-model-selection";
import { StrapConfigurator } from "@/src/widgets/strap-configurator";
import { CheckoutStep } from "@/src/widgets/checkout-step";
import { PageSkeleton } from "@/src/shared/ui";

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return (
        <>
          <WatchModelSelection />
          <FrameColors />
        </>
      );
    case 2:
      return <StrapModelSelection />;
    case 3:
      return <StrapConfigurator />;
    case 4:
      return <CheckoutStep />;
    default:
      return null;
  }
}

const HomeContentInner = observer(() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentStep } = progressBarStore;
  const isUrlUpdateRef = useRef(false);
  const hasInitialSyncRef = useRef(false);

  // Один раз при монтировании: читаем step из URL и выставляем store; если step нет — редирект на ?step=1
  useEffect(() => {
    if (hasInitialSyncRef.current) return;
    hasInitialSyncRef.current = true;
    const stepFromUrl = searchParams.get("step");
    if (stepFromUrl) {
      const step = parseInt(stepFromUrl, 10);
      if (step >= 1 && step <= 4) {
        isUrlUpdateRef.current = true;
        progressBarStore.setCurrentStep(step);
        const actualStep = progressBarStore.currentStep;
        if (actualStep !== step) {
          router.replace(`/?step=${actualStep}`, { scroll: false });
        }
      }
    } else {
      router.replace("/?step=1", { scroll: false });
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  // При смене searchParams (назад/вперёд по истории или после редиректа): синхронизируем URL -> store
  useEffect(() => {
    if (!hasInitialSyncRef.current) return;
    const stepFromUrl = searchParams.get("step");
    if (!stepFromUrl) return;
    const step = parseInt(stepFromUrl, 10);
    if (step >= 1 && step <= 4 && step !== progressBarStore.currentStep) {
      isUrlUpdateRef.current = true;
      progressBarStore.setCurrentStep(step);
    }
  }, [searchParams]);

  // При смене шага в сторе (кнопка Далее/Назад): обновляем URL
  useEffect(() => {
    if (isUrlUpdateRef.current) {
      isUrlUpdateRef.current = false;
      return;
    }
    const stepFromUrl = searchParams.get("step");
    const urlStep = stepFromUrl ? parseInt(stepFromUrl, 10) : null;
    if (urlStep !== currentStep) {
      router.replace(`/?step=${currentStep}`, { scroll: false });
    }
  }, [currentStep, searchParams]);

  // Обработка навигации браузера (кнопка "назад"/"вперед")
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const stepFromUrl = params.get("step");
      if (stepFromUrl) {
        const step = parseInt(stepFromUrl, 10);
        if (step >= 1 && step <= 4 && step !== currentStep) {
          isUrlUpdateRef.current = true;
          progressBarStore.setCurrentStep(step);
          const actualStep = progressBarStore.currentStep;
          if (actualStep !== step) {
            router.replace(`/?step=${actualStep}`, { scroll: false });
          }
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep]);

  return (
    <div>
      <main className={headerStore.isOpenModal ? "blur-[15px]" : ""}>
        <Header />
        <TitleStepsSection />
        <ProgressBar />
        <StepContent step={currentStep} />
        <Footer />
      </main>
      <HeaderInfoModal />
    </div>
  );
});

export default function HomeContent() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContentInner />
    </Suspense>
  );
}
