"use client";

import { observer } from 'mobx-react';
import Image from 'next/image';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';
import { ColorTextPill } from '@/src/shared/ui';
import styles from './StrapHardwareSelection.module.css';

const StrapHardwareSelection = observer(() => {
  const currentConfig = strapConfiguratorStore.currentStrapType;

  if (!currentConfig) {
    return null;
  }

  const { buckleColors } = currentConfig;
  const visibleBuckleColors = buckleColors.options.filter((item) => !item.isHidden);
  const visibleAdapterColors = currentConfig.adapterColors.filter((item) => !item.isHidden);
  const highlight = strapConfiguratorStore.highlightFilterKey;

  return (
    <section className={styles.root}>
      <div
        className={`${styles.section} ${highlight === 'buckle' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          5/6 <span className={styles.titleLabel}>· Цвет пряжки</span>
        </h3>
        <div className={styles.pillRow}>
          {visibleBuckleColors.map((color) => (
            <ColorTextPill
              key={color.id}
              label={color.label}
              color={color.hex}
              isActive={strapConfiguratorStore.selectedBuckleColorId === color.id}
              onClick={() => strapConfiguratorStore.setBuckleColor(color.id)}
              className={styles.colorPill}
            />
          ))}
        </div>

        {buckleColors.hasButterfly && (
          <div className={styles.variantGrid}>
            <button
              type="button"
              className={`${styles.variantButton} ${
                strapConfiguratorStore.selectedBuckleVariant === 'butterfly'
                  ? styles.variantButtonActive
                  : ''
              }`}
              onClick={() =>
                strapConfiguratorStore.setBuckleVariant(
                  strapConfiguratorStore.selectedBuckleVariant === 'butterfly' ? 'standard' : 'butterfly'
                )
              }
            >
              <div className={styles.variantButtonContent}>
                <div className={styles.variantButtonImageWrap}>
                  <div className={styles.variantButtonImageInner}>
                    <Image
                      src="/butterfly.png"
                      alt="Бабочка"
                      fill
                      className={styles.variantButtonImage}
                      sizes="94px"
                    />
                  </div>
                </div>
                <div className={styles.variantButtonText}>
                  <div className={styles.variantTitle}>Бабочка</div>
                  <div className={styles.variantPrice}>+500 ₽</div>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <div
        className={`${styles.section} ${highlight === 'adapter' ? styles.sectionError : ''}`}
      >
        <h3 className={styles.title}>
          6/6 <span className={styles.titleLabel}>· Цвет адаптеров</span>
        </h3>
        <div className={styles.adapterGrid}>
          {visibleAdapterColors.map((adapter) => {
            const displayImage = adapter.filterDisplayImage || adapter.layers?.front;
            return (
              <button
                key={adapter.id}
                className={`${styles.adapterButton} ${
                  strapConfiguratorStore.selectedAdapterColorId === adapter.id
                    ? styles.adapterButtonActive
                    : ''
                }`}
                onClick={() => strapConfiguratorStore.setAdapterColor(adapter.id)}
              >
                {displayImage ? (
                  <div className={styles.adapterImageWrap}>
                    <Image
                      src={displayImage}
                      alt={adapter.label}
                      fill
                      className={styles.adapterImage}
                      sizes="(max-width: 639px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className={styles.adapterDotWrap}>
                    <div
                      className={styles.adapterDot}
                      style={{ backgroundColor: adapter.hex }}
                    />
                  </div>
                )}
                <span className={styles.adapterLabel}>{adapter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default StrapHardwareSelection;
