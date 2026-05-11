"use client";

import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/src/widgets/header";
import { headerStore } from "@/src/entities/header";
import { Footer } from "@/src/widgets/footer";
import { CaseProgressBar } from "@/src/widgets/case-progress-bar";
import { caseProgressBarStore } from "@/src/entities/case-progress-bar";
import CaseTitleSection from "@/src/features/case-title-section/ui/CaseTitleSection";
import { buildCaseStepRoute } from "@/src/shared/config/routes";
import { CASE_CONFIG_STEPS, isStepInRange } from "@/src/shared/config/steps";

const HeaderInfoModal = dynamic(
  () => import("@/src/features/header-info-modal/ui/HeaderInfoModal").then((m) => m.default)
);
const CaseBasisStep = dynamic(
  () => import("@/src/features/case-basis/ui/CaseBasisStep").then((m) => m.default)
);
const CasePersonalizationStep = dynamic(
  () => import("@/src/features/case-personalization/ui/CasePersonalizationStep").then((m) => m.default)
);

const CasePageContentInner = observer(() => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isUrlUpdateRef = useRef(false);
  const { currentStep } = caseProgressBarStore;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const raw = searchParams.get("step");
    if (raw == null) {
      router.replace(buildCaseStepRoute(CASE_CONFIG_STEPS.initial), { scroll: false });
      return;
    }
    const step = parseInt(raw, 10);
    if (!isStepInRange(step, CASE_CONFIG_STEPS.min, CASE_CONFIG_STEPS.max)) {
      router.replace(buildCaseStepRoute(CASE_CONFIG_STEPS.initial), { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const stepFromUrl = searchParams.get("step");
    if (!stepFromUrl) return;
    const step = parseInt(stepFromUrl, 10);
    if (isStepInRange(step, CASE_CONFIG_STEPS.min, CASE_CONFIG_STEPS.max) && step !== caseProgressBarStore.currentStep) {
      isUrlUpdateRef.current = true;
      caseProgressBarStore.setCurrentStep(step);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isUrlUpdateRef.current) {
      isUrlUpdateRef.current = false;
      return;
    }
    if (!searchParams.get("step")) return;
    const urlStep = parseInt(searchParams.get("step")!, 10);
    if (urlStep !== currentStep) {
      router.replace(buildCaseStepRoute(currentStep), { scroll: false });
    }
  }, [currentStep, searchParams, router]);

  return (
    <div>
      <main className={headerStore.isOpenModal ? "blur-[15px]" : ""}>
        <Header />
        <CaseTitleSection />
        <CaseProgressBar />
        {caseProgressBarStore.currentStep === CASE_CONFIG_STEPS.initial ? <CaseBasisStep /> : <CasePersonalizationStep />}
        <Footer />
      </main>
      <HeaderInfoModal />
    </div>
  );
});

export default function CasePageContent() {
  return <CasePageContentInner />;
}
