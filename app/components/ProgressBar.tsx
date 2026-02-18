"use client";

import React from 'react';
import {progressBar, progressBarMove} from "@/app/lib/progressBar";
import Image from "next/image";
import progressBarStore from "@/app/store/ProgressBarStore";
import {observer} from "mobx-react-lite";
import {ProgressBarProps} from "@/app/types/ProgressBarTypes";
import ProgressBarFilters from "@/app/components/ProgreesBarDropdown";
import toast from "react-hot-toast";
import watchModelStore from "@/app/store/WatchModelStore";
import showToaster from "@/app/features/Toaster";

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
                        onClick={() => watchModelStore.isConfigurationComplete ? progressBarStore.onNextStep(progressBarStore.currentStep) : showToaster(watchModelStore.configurationMessage)}
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