"use client";

import Image from "next/image";
import { observer } from "mobx-react";
import { appConfigStore } from "@/src/entities/app-config";
import { caseConfiguratorStore } from "@/src/entities/case-configurator";
import { resolvePhoneCasePreviewUrls } from "@/src/shared/lib/phoneCaseConfig";
import styles from "./CasePreview.module.css";

const CasePreview = observer(() => {
  const pc = appConfigStore.config.phoneCase;
  const { main, thumb1, thumb2 } = resolvePhoneCasePreviewUrls(
    pc,
    caseConfiguratorStore.effectiveFormTypeId,
    caseConfiguratorStore.outsideColorId,
    caseConfiguratorStore.insideColorId
  );

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.card}>
          {main ? (
            <div className={styles.layer}>
              <Image
                src={main}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
            </div>
          ) : null}
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.card}>
            {thumb1 ? (
              <div className={styles.layer}>
                <Image
                  src={thumb1}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 220px"
                />
              </div>
            ) : null}
          </div>
          <div className={styles.card}>
            {thumb2 ? (
              <div className={styles.layer}>
                <Image
                  src={thumb2}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="(max-width: 1024px) 100vw, 220px"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
});

export default CasePreview;
