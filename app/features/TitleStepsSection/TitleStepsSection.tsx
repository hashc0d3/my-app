import React from 'react';
import {titleStepSection} from "@/app/lib/titleStepSection";

const TitleStepsSection = () => {
    return (
        <section className="flex justify-center bg-white text-white pl-96 pr-96 pt-18 pb-11">
            <p
                className="text-[#2F2C33] text-[48px] leading-[100%] tracking-[-0.03em] font-medium text-center"
            >
                {titleStepSection.title}
                <span className="text-[#676682]">{titleStepSection.highlight}</span>
            </p>
        </section>
    );
};

export default TitleStepsSection;