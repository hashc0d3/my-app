"use client";

import { observer } from 'mobx-react';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';
import { ColorTextPill } from '@/src/shared/ui';
import styles from './StrapLeatherSelection.module.css';

const StrapLeatherSelection = observer(() => {
  const currentStrapType = strapConfiguratorStore.currentStrapType;
  const currentLeatherType = strapConfiguratorStore.currentLeatherType;

  if (!currentStrapType || !currentLeatherType) {
    return null;
  }

  const visibleLeatherTypes = currentStrapType.leatherTypes.filter((item) => !item.isHidden);
  const visibleLeatherColors = currentLeatherType.leatherColors.filter((item) => !item.isHidden);
  const visibleEdgeTypes = currentLeatherType.edgeTypes.filter((item) => !item.isHidden);
  const visibleStitchTypes = currentLeatherType.stitchTypes.filter((item) => !item.isHidden);
  const highlight = strapConfiguratorStore.highlightFilterKey;

  return (
    <section className={styles.root}>
      <div
        className={`${styles.section} ${highlight === 'leatherType' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          1/6 <span className={styles.titleLabel}>· Тип кожи</span>
        </h3>
        <div className={styles.pillRow}>
          {visibleLeatherTypes.map((leatherType) => (
            <button
              key={leatherType.id}
              onClick={() => strapConfiguratorStore.setLeatherType(leatherType.id)}
              className={`${styles.pillButton} ${
                strapConfiguratorStore.selectedLeatherTypeId === leatherType.id ? styles.pillButtonActive : ""
              }`}
            >
              {leatherType.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`${styles.section} ${highlight === 'leatherColor' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          2/6 <span className={styles.titleLabel}>· Цвет кожи</span>
        </h3>
        <div className={styles.pillRow}>
          {visibleLeatherColors.map((color) => (
            <ColorTextPill
              key={color.id}
              label={color.label}
              color={color.hex}
              isActive={strapConfiguratorStore.selectedLeatherColorId === color.id}
              onClick={() => strapConfiguratorStore.setLeatherColor(color.id)}
              className={styles.colorPill}
            />
          ))}
        </div>
      </div>

      <div
        className={`${styles.section} ${highlight === 'stitch' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          3/6 <span className={styles.titleLabel}>· Цвет строчки</span>
        </h3>
        <div className={styles.pillRow}>
          {visibleStitchTypes.map((stitchType) => (
            <ColorTextPill
              key={stitchType.id}
              label={stitchType.label}
              color={stitchType.hex}
              isActive={strapConfiguratorStore.selectedStitchTypeId === stitchType.id}
              onClick={() => strapConfiguratorStore.setStitchType(stitchType.id)}
              className={styles.colorPill}
            />
          ))}
        </div>
      </div>

      <div
        className={`${styles.section} ${highlight === 'edge' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          4/6 <span className={styles.titleLabel}>· Цвет края</span>
        </h3>
        <div className={styles.pillRow}>
          {visibleEdgeTypes.map((edgeType) => (
            <ColorTextPill
              key={edgeType.id}
              label={edgeType.label}
              color={edgeType.hex}
              isActive={strapConfiguratorStore.selectedEdgeTypeId === edgeType.id}
              onClick={() => strapConfiguratorStore.setEdgeType(edgeType.id)}
              className={styles.colorPill}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default StrapLeatherSelection;
