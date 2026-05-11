import React from 'react';
import {titleStepSection} from "@/src/shared/lib/titleStepSection";

const TitleStepsSection = () => {
    return (
        <section className="container-padding flex justify-center bg-white text-white pt-18 pb-11">
            <p
                className="text-[#2F2C33] text-[length:var(--fs-marketing)] leading-[100%] tracking-[-0.03em] font-medium text-center"
            >
                {titleStepSection.title}
                {titleStepSection.titleLine2 != null && (
                    <>
                        <br />
                        {titleStepSection.titleLine2}
                    </>
                )}
                <span className="text-[#676682]">{titleStepSection.highlight}</span>
            </p>
        </section>
    );
};

export default TitleStepsSection;