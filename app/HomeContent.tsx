"use client";

import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/src/widgets/header";
import { HeaderInfoModal } from "@/src/features/header-info-modal";
import { headerStore } from "@/src/entities/header";
import { Footer } from "@/src/widgets/footer";
import { ProgressBar } from "@/src/widgets/progress-bar";
import { progressBarStore } from "@/src/entities/progress-bar";
import { TitleStepsSection } from "@/src/features/title-section";
import { WatchModelSelection } from "@/src/features/watch-model-selection";
import { watchModelStore } from "@/src/entities/watch-model";
import { watchModels } from "@/src/shared/lib/watchModel";
import { FrameColors } from "@/src/features/frame-colors-selection";
import { Toaster } from "react-hot-toast";
import {strapModelStore} from "@/entities/strap-model";
import {strapModel} from "@/shared/lib/strapModel";
import {StrapModelSelection} from "@/features/strap-model-selection";

const HomeContent = observer(() => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {currentStep} = progressBarStore;
    const isUrlUpdateRef = useRef(false);

    // Инициализация данных
    useEffect(() => {
        watchModelStore.setWatchModels(watchModels);
        strapModelStore.setStrapModels(strapModel);
    }, []);

    // Синхронизация URL с текущим шагом при монтировании
    useEffect(() => {
        const stepFromUrl = searchParams.get('step');
        if (stepFromUrl) {
            const step = parseInt(stepFromUrl, 10);
            if (step >= 1 && step <= 4) {
                isUrlUpdateRef.current = true;
                progressBarStore.setCurrentStep(step);
            }
        } else {
            // Если нет параметра step в URL, устанавливаем его
            router.replace(`/?step=${currentStep}`, { scroll: false });
        }

        // Прокрутка в начало страницы при загрузке
        window.scrollTo(0, 0);
    }, []);

    // Обновление URL при изменении шага (только если изменение произошло не из URL)
    useEffect(() => {
        if (isUrlUpdateRef.current) {
            isUrlUpdateRef.current = false;
            return;
        }

        const stepFromUrl = searchParams.get('step');
        const urlStep = stepFromUrl ? parseInt(stepFromUrl, 10) : null;

        if (urlStep !== currentStep) {
            router.replace(`/?step=${currentStep}`, { scroll: false });
        }
    }, [currentStep]);

    // Обработка навигации браузера (кнопка "назад"/"вперед")
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const stepFromUrl = params.get('step');
            if (stepFromUrl) {
                const step = parseInt(stepFromUrl, 10);
                if (step >= 1 && step <= 4 && step !== currentStep) {
                    isUrlUpdateRef.current = true;
                    progressBarStore.setCurrentStep(step);
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [currentStep]);

    const renderContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <WatchModelSelection />
                        <FrameColors />
                    </>
                );
            case 2:
                return (
                    <>
                        <StrapModelSelection />
                    </>
                );
            case 3:
                return null;
            case 4:
                return null;
            default:
                return null;
        }
    };

    return (
        <div>
            <main className={headerStore.isOpenModal ? 'blur-[15px]' : ''}>
                <Header />
                <TitleStepsSection />
                <ProgressBar />
                {renderContent()}
                <Footer />
            </main>
            <HeaderInfoModal />
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
});

export default HomeContent;
