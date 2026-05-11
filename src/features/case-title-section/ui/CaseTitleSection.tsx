import React from "react";
import { titleCaseSection } from "@/src/shared/lib/titleCaseSection";

/** Верхний блок над конструктором чехлов — те же отступы и типографика, что у TitleStepsSection (ремешки). */
const CaseTitleSection = () => {
  return (
    <section className="container-padding flex justify-center bg-white text-white pt-18 pb-11">
      <p className="text-[#2F2C33] text-[length:var(--fs-marketing)] leading-[100%] tracking-[-0.03em] font-medium text-center">
        {titleCaseSection.title}
        {titleCaseSection.titleLine2 != null && (
          <>
            <br />
            {titleCaseSection.titleLine2}
          </>
        )}
        <span className="text-[#676682]">{titleCaseSection.highlight}</span>
      </p>
    </section>
  );
};

export default CaseTitleSection;
