"use client";

import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/src/widgets/header";
import { headerStore } from "@/src/entities/header";
import { Footer } from "@/src/widgets/footer";
import { ProgressBar } from "@/src/widgets/progress-bar";
import { progressBarStore } from "@/src/entities/progress-bar";
import { TitleStepsSection } from "@/src/features/title-section";
import { StartPage } from "@/src/features/start-page";
import WatchModelSelection from "@/src/features/watch-model-selection/ui/WatchModelSelection";
import FrameColors from "@/src/features/frame-colors-selection/ui/FrameColors";
import StrapModelSelection from "@/src/features/strap-model-selection/ui/StrapModelSelection";
import StrapConfigurator from "@/src/widgets/strap-configurator/ui/StrapConfigurator";
import { buildCaseStepRoute, buildHomeStepRoute, APP_ROUTES } from "@/src/shared/config/routes";
import { CASE_CONFIG_STEPS, isStepInRange, WATCH_CONFIG_STEPS } from "@/src/shared/config/steps";

const HeaderInfoModal = dynamic(
  () => import("@/src/features/header-info-modal/ui/HeaderInfoModal").then((m) => m.default)
);
const CheckoutStep = dynamic(
  () => import("@/src/widgets/checkout-step/ui/CheckoutStep").then((m) => m.default)
);

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

function parseConfiguratorStep(searchParams: ReturnType<typeof useSearchParams>): number | null {
  const raw = searchParams.get("step");
  if (raw == null) return null;
  const step = parseInt(raw, 10);
  if (!isStepInRange(step, WATCH_CONFIG_STEPS.min, WATCH_CONFIG_STEPS.max)) return null;
  return step;
}

const HomeContentInner = observer(() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentStep } = progressBarStore;
  const isUrlUpdateRef = useRef(false);
  const configStep = parseConfiguratorStep(searchParams);
  const isConfigurator = configStep !== null;

  useEffect(() => {
    const raw = searchParams.get("step");
    if (!raw) return;
    const step = parseInt(raw, 10);
    if (!isStepInRange(step, WATCH_CONFIG_STEPS.min, WATCH_CONFIG_STEPS.max)) {
      router.replace(APP_ROUTES.home, { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const stepFromUrl = searchParams.get("step");
    if (!stepFromUrl) return;
    const step = parseInt(stepFromUrl, 10);
    if (!isStepInRange(step, WATCH_CONFIG_STEPS.min, WATCH_CONFIG_STEPS.max)) return;
    if (step !== progressBarStore.currentStep) {
      isUrlUpdateRef.current = true;
      progressBarStore.setCurrentStep(step);
    }
    const actualStep = progressBarStore.currentStep;
    if (actualStep !== step) {
      router.replace(buildHomeStepRoute(actualStep), { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (isUrlUpdateRef.current) {
      isUrlUpdateRef.current = false;
      return;
    }
    if (!isConfigurator) return;
    const stepFromUrl = searchParams.get("step");
    const urlStep = stepFromUrl ? parseInt(stepFromUrl, 10) : null;
    if (urlStep !== currentStep) {
      router.replace(buildHomeStepRoute(currentStep), { scroll: false });
    }
  }, [currentStep, searchParams, isConfigurator, router]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const stepFromUrl = params.get("step");
      if (!stepFromUrl) return;
      const step = parseInt(stepFromUrl, 10);
      if (isStepInRange(step, WATCH_CONFIG_STEPS.min, WATCH_CONFIG_STEPS.max) && step !== currentStep) {
        isUrlUpdateRef.current = true;
        progressBarStore.setCurrentStep(step);
        const actualStep = progressBarStore.currentStep;
        if (actualStep !== step) {
          router.replace(buildHomeStepRoute(actualStep), { scroll: false });
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, router]);

  return (
    <div>
      <main className={headerStore.isOpenModal ? "blur-[15px]" : ""}>
        <Header />
        {isConfigurator ? (
          <>
            <TitleStepsSection />
            <ProgressBar />
            <StepContent step={currentStep} />
          </>
        ) : (
          <StartPage
            onChooseWatch={() => router.push(buildHomeStepRoute(WATCH_CONFIG_STEPS.initial))}
            onChooseIphone={() => router.push(buildCaseStepRoute(CASE_CONFIG_STEPS.initial))}
          />
        )}
        <Footer />
      </main>
      <HeaderInfoModal />
    </div>
  );
});

export default function HomeContent() {
  return <HomeContentInner />;
}
