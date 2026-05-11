"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { caseProgressBarStore } from "@/src/entities/case-progress-bar";
import { caseConfiguratorStore } from "@/src/entities/case-configurator";
import { caseProgressSteps } from "@/src/shared/lib/caseProgressBar";
import { progressBarMove } from "@/src/shared/lib/progressBar";
import type { ProgressBarProps } from "@/src/shared/types/ProgressBarTypes";
import { showToaster } from "@/src/shared/lib/toaster";
import { useRouter } from "next/navigation";
import { cartStore } from "@/src/entities/cart";
import { appConfigStore } from "@/src/entities/app-config";
import { resolvePhoneCasePreviewUrls } from "@/src/shared/lib/phoneCaseConfig";
import type { CartCaseItemConfiguration } from "@/src/shared/types/CartItemConfiguration";
import styles from "@/src/widgets/progress-bar/ui/ProgressBar.module.css";

const CaseProgressBar = observer(() => {
  const router = useRouter();
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 49);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddCaseToCart = useCallback(() => {
    const cfg = caseConfiguratorStore;
    const pc = cfg.phoneCaseConfig;
    const palette = appConfigStore.config.colorLibrary ?? [];
    const outside = palette.find((c) => c.id === cfg.outsideColorId);
    const inside = palette.find((c) => c.id === cfg.insideColorId);
    const ft = cfg.selectedFormType;
    if (!cfg.iphoneModelId || !outside || !inside || !cfg.selectedModelLabel || !ft || !cfg.effectiveFormTypeId) {
      showToaster("Заполните параметры чехла");
      return;
    }

    const unitPrice = cfg.caseUnitPrice;
    const parameters: string[] = [
      `Модель: ${cfg.selectedModelLabel}`,
      `Тип формы: ${ft.label?.trim() || ft.id}`,
      `Цвет снаружи: ${outside.name}`,
      `Цвет внутри: ${inside.name}`
    ];
    if (cfg.personalizationNote.trim()) {
      parameters.push(`Комментарий: ${cfg.personalizationNote.trim()}`);
    }

    const previewUrls = resolvePhoneCasePreviewUrls(
      pc,
      cfg.effectiveFormTypeId,
      cfg.outsideColorId,
      cfg.insideColorId
    );

    const configuration: CartCaseItemConfiguration = {
      productType: "case",
      iphoneModelId: cfg.iphoneModelId,
      iphoneModelLabel: cfg.selectedModelLabel,
      caseFormTypeId: cfg.effectiveFormTypeId,
      caseFormTypeLabel: ft.label?.trim() || ft.id,
      outsideColorId: outside.id,
      outsideColorName: outside.name,
      outsideHex: outside.hex,
      insideColorId: inside.id,
      insideColorName: inside.name,
      insideHex: inside.hex,
      personalizationNote: cfg.personalizationNote.trim() || undefined
    };

    const preview = previewUrls.main.trim() || "/window.svg";

    cartStore.addConfiguredItem({
      title: `Чехол iPhone — ${cfg.selectedModelLabel}`,
      image: preview,
      unitPrice: unitPrice,
      parameters,
      configuration
    });

    router.push("/cart");
  }, [router]);

  const validate = () => {
    switch (caseProgressBarStore.currentStep) {
      case 1:
        if (caseConfiguratorStore.isBasisComplete) {
          caseProgressBarStore.onNextStep(1);
        } else {
          showToaster(caseConfiguratorStore.configurationMessage);
        }
        break;
      case 2:
        handleAddCaseToCart();
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.leftBlock}>
        <div className={`${styles.stepControls} ${isSticky ? styles.controlsSticky : styles.controlsNormal}`}>
          {caseProgressSteps.map((step: ProgressBarProps) => (
            <div
              key={step.step}
              role="button"
              tabIndex={0}
              className={`${styles.stepItem} ${
                caseProgressBarStore.currentStep === step.step ? styles.stepItemActive : ""
              }`}
              onClick={() => caseProgressBarStore.onSwitchStep(step.step)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  caseProgressBarStore.onSwitchStep(step.step);
                }
              }}
            >
              {step.icon ? (
                <div className={styles.stepIconWrap}>
                  <Image
                    src={step.icon}
                    alt={step.name}
                    width={20}
                    height={22}
                    className={styles.stepIcon}
                  />
                </div>
              ) : null}
              <span className={styles.stepName}>{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <div className={`${styles.actionsWrap} ${isSticky ? styles.controlsSticky : styles.controlsNormal}`}>
          <div
            role="button"
            tabIndex={0}
            className={styles.actionBack}
            onClick={() => caseProgressBarStore.onPrevStep(caseProgressBarStore.currentStep)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                caseProgressBarStore.onPrevStep(caseProgressBarStore.currentStep);
              }
            }}
          >
            {progressBarMove.back}
          </div>
          <div
            role="button"
            tabIndex={0}
            className={styles.actionNext}
            onClick={() => validate()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                validate();
              }
            }}
          >
            {caseProgressBarStore.currentStep === 2 ? (
              <>
                <span className={styles.actionNextDesktop}>{progressBarMove.offer}</span>
                <span className={styles.actionNextBottom}>{progressBarMove.offerShort}</span>
              </>
            ) : (
              progressBarMove.next
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CaseProgressBar.displayName = "CaseProgressBar";

export default CaseProgressBar;
