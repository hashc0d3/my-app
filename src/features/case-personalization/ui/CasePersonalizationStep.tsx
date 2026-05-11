"use client";

import { observer } from "mobx-react";
import { caseConfiguratorStore } from "@/src/entities/case-configurator";
import { CasePreview } from "@/src/features/case-preview";
import styles from "./CasePersonalizationStep.module.css";

const CasePersonalizationStep = observer(() => {
  return (
    <section className={styles.section}>
      <div className={styles.previewColumn}>
        <CasePreview />
      </div>
      <div className={styles.contentColumn}>
        <h2 className={styles.title}>Персонализация чехла</h2>
        <p className={styles.lead}>
          Уточните пожелания по тиснению, монограмме или гравировке. Менеджер свяжется с вами после оформления
          заказа.
        </p>
        <textarea
          className={styles.textarea}
          placeholder="Комментарий (необязательно)"
          value={caseConfiguratorStore.personalizationNote}
          onChange={(e) => caseConfiguratorStore.setPersonalizationNote(e.target.value)}
          maxLength={500}
        />
        <p className={styles.note}>До 500 символов. Этот текст сохранится в составе позиции в корзине.</p>
      </div>
    </section>
  );
});

export default CasePersonalizationStep;
