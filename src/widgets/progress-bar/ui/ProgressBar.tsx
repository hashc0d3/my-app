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
import {strapModelStore} from "@/entities/strap-model";

const ProgressBar = observer(() => {
    const [isSticky, setIsSticky] = React.useState(false);

    // Следование при скроле
    React.useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 49);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Валидация перехода к следующему шагу
    const validate = () => {
        switch (progressBarStore.currentStep) {
            case 1: {
                if (watchModelStore.isConfigurationComplete) {
                    progressBarStore.onNextStep(progressBarStore.currentStep);
                } else {
                    showToaster(watchModelStore.configurationMessage);
                }
                break;
            }

            case 2: {
                if (strapModelStore.isConfigurationComplete) {
                    progressBarStore.onNextStep(progressBarStore.currentStep);
                } else {
                    showToaster(strapModelStore.configurationMessage);
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
        <div className="sticky top-[49px] z-40 pt-[10px] container-padding pb-9 flex justify-between items-center">

            <div className="flex items-center gap-2">
                {/*
                    Основной ProgressBar
                */}
                <div className={`text-black rounded-[100px] inline-flex gap-2 p-1 transition-colors ${isSticky ? 'bg-[#D4E0FF99] backdrop-blur-md' : 'bg-[#D4E0FF]'}`}>
                {progressBar.map((step: ProgressBarProps, index) => (
                    <div
                        key={index}
                        className={`flex items-center rounded-[100px] gap-2 py-2 px-3 cursor-pointer transition-colors ${
                            progressBarStore.currentStep === step.step
                                ? "bg-[#7A9CF566]"
                                : ""
                        }`}
                        onClick={() => progressBarStore.onSwitchStep(step.step)}
                    >
                        {step.icon ? (
                            <div className="flex items-center">
                                <Image
                                    src={step.icon}
                                    alt={step.name}
                                    width={20}
                                    height={22}
                                    className="object-contain"
                                />
                            </div>
                        ) : null}
                        <span className="leading-none">{step.name}</span>
                    </div>
                ))}
            </div>
                {/*
                    Фильтры рядом с ProgressBar только со второго шага
                */}
                {progressBarStore.currentStep >= 2 ? <ProgressBarFilters isSticky={isSticky} /> : ""}
            </div>
            {/*
                Блок кнопок перехода Назад/Вперед
            */}
            <div>
                <div className={`rounded-[100px] inline-flex gap-2 p-1 transition-colors ${isSticky ? 'bg-[#D4E0FF99] backdrop-blur-md' : 'bg-[#D4E0FF]'}`}>
                    <div
                        className="py-2 px-3 text-[#5078DF] flex items-center cursor-pointer"
                        onClick={() => progressBarStore.onPrevStep(progressBarStore.currentStep)}
                    >
                        {progressBarMove.back}
                    </div>
                    <div
                        className="py-2 px-3 bg-[#5078DF] rounded-[100px] text-white flex items-center cursor-pointer"
                        onClick={() => validate()}
                    >
                        {progressBarStore.currentStep === 4 ? progressBarMove.offer : progressBarMove.next}
                    </div>
                </div>
            </div>
        </div>
    );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;