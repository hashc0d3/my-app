"use client";

import React from 'react';
import {progressBar, progressBarMove} from "@/src/shared/lib/progressBar";
import Image from "next/image";
import { progressBarStore } from "@/src/entities/progress-bar";
import {observer} from "mobx-react-lite";
import {ProgressBarProps} from "@/src/shared/types/ProgressBarTypes";
import ProgressBarFilters from "./ProgressBarDropdown";
import { watchModelStore } from "@/src/entities/watch-model";
import { showToaster } from "@/src/shared/lib/toaster";
import { strapModelStore } from "@/entities/strap-model";
import { strapConfiguratorStore } from "@/src/entities/strap-configurator";
import styles from "./ProgressBar.module.css";

const HIGHLIGHT_DURATION_MS = 2500;
const NEXT_CLICK_GUARD_MS = 400;

const ProgressBar = observer(() => {
    const [isSticky, setIsSticky] = React.useState(false);
    const step3HighlightTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const nextClickGuardUntilRef = React.useRef(0);

    // Следование при скроле
    React.useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 49);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => () => {
        if (step3HighlightTimeoutRef.current) clearTimeout(step3HighlightTimeoutRef.current);
    }, []);

    // Валидация перехода к следующему шагу
    const validate = () => {
        const now = Date.now();
        if (now < nextClickGuardUntilRef.current) {
            return;
        }
        switch (progressBarStore.currentStep) {
            case 1: {
                if (watchModelStore.isConfigurationComplete) {
                    progressBarStore.onNextStep(progressBarStore.currentStep);
                    nextClickGuardUntilRef.current = Date.now() + NEXT_CLICK_GUARD_MS;
                } else {
                    showToaster(watchModelStore.configurationMessage);
                }
                break;
            }

            case 2: {
                if (strapModelStore.isConfigurationComplete) {
                    progressBarStore.onNextStep(progressBarStore.currentStep);
                    nextClickGuardUntilRef.current = Date.now() + NEXT_CLICK_GUARD_MS;
                } else {
                    showToaster(strapModelStore.configurationMessage);
                }
                break;
            }

            case 3: {
                if (strapConfiguratorStore.isConfigurationComplete) {
                    progressBarStore.onNextStep(progressBarStore.currentStep);
                    nextClickGuardUntilRef.current = Date.now() + NEXT_CLICK_GUARD_MS;
                } else {
                    showToaster(strapConfiguratorStore.configurationMessage);
                    const missingKey = strapConfiguratorStore.missingFilterKey;
                    if (missingKey) {
                        strapConfiguratorStore.setHighlightFilterKey(missingKey);
                        if (step3HighlightTimeoutRef.current) clearTimeout(step3HighlightTimeoutRef.current);
                        step3HighlightTimeoutRef.current = setTimeout(() => {
                            strapConfiguratorStore.setHighlightFilterKey(null);
                            step3HighlightTimeoutRef.current = null;
                        }, HIGHLIGHT_DURATION_MS);
                    }
                }
                break;
            }

            case 4: {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("checkout:add-to-cart"));
                }
                break;
            }

            default:
                break;
        }
    };

    /*
    * Компонент progress bar с шагами и кнопками Назад/Вперед
    * */
    return (
        <div className={styles.root}>

            <div className={styles.leftBlock}>
                {/*
                    Основной ProgressBar
                */}
                <div className={`${styles.stepControls} ${isSticky ? styles.controlsSticky : styles.controlsNormal}`}>
                    {progressBar.map((step: ProgressBarProps) => (
                        <div
                            key={step.step}
                            role="button"
                            tabIndex={0}
                            className={`${styles.stepItem} ${
                                progressBarStore.currentStep === step.step
                                    ? styles.stepItemActive
                                    : ""
                            }`}
                            onClick={() => progressBarStore.onSwitchStep(step.step)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    progressBarStore.onSwitchStep(step.step);
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
                {/*
                    Фильтры рядом с ProgressBar только со второго шага
                */}
                {progressBarStore.currentStep >= 2 ? (
                    <div className={styles.desktopFilters}>
                        <ProgressBarFilters isSticky={isSticky} />
                    </div>
                ) : ""}
            </div>
            {/*
                Блок кнопок перехода Назад/Вперед
            */}
            <div className={styles.actionsContainer}>
                <div className={`${styles.actionsWrap} ${isSticky ? styles.controlsSticky : styles.controlsNormal}`}>
                    {progressBarStore.currentStep >= 2 ? (
                        <div className={styles.mobileFilters}>
                            <ProgressBarFilters isSticky={isSticky} isCompact />
                        </div>
                    ) : ""}
                    <div
                        role="button"
                        tabIndex={0}
                        className={styles.actionBack}
                        onClick={() => progressBarStore.onPrevStep(progressBarStore.currentStep)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                progressBarStore.onPrevStep(progressBarStore.currentStep);
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
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                validate();
                            }
                        }}
                    >
                        {progressBarStore.currentStep === 4 ? (
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

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;