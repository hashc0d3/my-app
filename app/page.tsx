"use client";

import { observer } from "mobx-react";
import { useEffect } from "react";
import Header from "@/app/components/Header";
import HeaderInfoModal from "@/app/features/HeaderInfoModal/HeaderInfoModal";
import headerStore from "@/app/store/HeaderStore";
import Footer from "@/app/components/Footer";
import ProgressBar from "@/app/components/ProgressBar";
import progressBarStore from "@/app/store/ProgressBarStore";
import TitleStepsSection from "@/app/features/TitleStepsSection/TitleStepsSection";
import WatchModelSelection from "@/app/components/Steps/WatchModelSelection";
import watchModelStore from "@/app/store/WatchModelStore";
import { watchModels } from "@/app/lib/watchModel";
import FrameColors from "@/app/components/Steps/FrameColors";
import {Toaster} from "react-hot-toast";

const Home = observer(() => {

    const {currentStep} = progressBarStore;

    useEffect(() => {
        watchModelStore.setWatchModels(watchModels);
    }, []);

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
                return null;
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

export default Home;
