"use client";

import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { strapModelStore } from '@/src/entities/strap-model';
import { watchModelStore } from '@/src/entities/watch-model';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';
import { StrapPreview } from '@/src/features/strap-preview';
import { StrapLeatherSelection } from '@/src/features/strap-leather-selection';
import { StrapHardwareSelection } from '@/src/features/strap-hardware-selection';
import styles from './StrapConfigurator.module.css';

const STRAP_NAME_TO_TYPE: Record<string, 'classic' | 'butterfly'> = {
  classic: 'classic',
  butterfly: 'butterfly',
};

const resolveStrapTypeId = (value: string | null): 'classic' | 'butterfly' => {
  if (!value) {
    return 'classic';
  }

  const normalized = value.toLowerCase();
  return STRAP_NAME_TO_TYPE[normalized] ?? 'classic';
};

const resolvePreferredTypeId = (
  typeIds: string[],
  selectedStrapName: string | null,
  selectedWatchModel: string | null
): string | null => {
  if (!typeIds.length) return null;

  const normalizedTypeIds = typeIds.map((id) => id.toLowerCase());

  if (selectedStrapName) {
    const byStrap = resolveStrapTypeId(selectedStrapName);
    const idx = normalizedTypeIds.indexOf(byStrap);
    if (idx >= 0) return typeIds[idx];
  }

  if (selectedWatchModel) {
    const byWatch = resolveStrapTypeId(selectedWatchModel);
    const idx = normalizedTypeIds.indexOf(byWatch);
    if (idx >= 0) return typeIds[idx];
  }

  return typeIds[0];
};

const StrapConfigurator = observer(() => {
  const selectedStrapModel = strapModelStore.strapModels.find(
    (model) => model.id === strapModelStore.currentStrap
  );
  const selectedStep3Config = selectedStrapModel?.step3Config;
  const modelStep3Type = selectedStep3Config?.strapTypes?.[0] ?? null;
  const currentStrapType = strapConfiguratorStore.currentStrapType;
  const currentLeatherType = strapConfiguratorStore.currentLeatherType;
  const strapTitle = strapModelStore.selectedStrapName ?? currentStrapType?.label ?? 'Ремешок';
  const strapPrice = currentLeatherType?.price ?? modelStep3Type?.leatherTypes?.[0]?.price ?? strapModelStore.selectedStrapPrice;
  const step3Description =
    modelStep3Type?.step3Description ??
    currentStrapType?.step3Description ??
    'Выберите материал и фурнитуру, чтобы собрать финальный внешний вид ремешка.';

  useEffect(() => {
    if (selectedStep3Config?.strapTypes?.length) {
      strapConfiguratorStore.setConfig(selectedStep3Config);
      const preferredTypeId = resolvePreferredTypeId(
        selectedStep3Config.strapTypes.map((type) => type.id),
        strapModelStore.selectedStrapName,
        watchModelStore.selectedModel
      );
      if (preferredTypeId && !strapConfiguratorStore.currentStrapType) {
        strapConfiguratorStore.initializeFromStrapType(preferredTypeId);
      }
      return;
    }

    const fallbackTypeId = resolvePreferredTypeId(
      strapConfiguratorStore.strapTypes.map((type) => type.id),
      strapModelStore.selectedStrapName,
      watchModelStore.selectedModel
    );
    if (fallbackTypeId) {
      strapConfiguratorStore.initializeFromStrapType(fallbackTypeId);
    }
  }, [selectedStep3Config, watchModelStore.selectedModel, strapModelStore.selectedStrapName]);

  useEffect(() => {
    strapConfiguratorStore.setPreferredDefaultColorHex(watchModelStore.selectedColor?.hex ?? null);
  }, [watchModelStore.selectedColor?.hex]);

  return (
    <section className={styles.section}>
      <div className={styles.previewColumn}>
        <StrapPreview />
      </div>
      <div className={styles.controlsPanel}>
        <div className={styles.summary}>
          <h2 className={styles.title}>{strapTitle}</h2>
          {strapPrice !== null ? (
            <p className={styles.price}>{strapPrice} ₽</p>
          ) : null}
          <p className={styles.description}>{step3Description}</p>
        </div>
        <StrapLeatherSelection />
        <StrapHardwareSelection />
      </div>
    </section>
  );
});

export default StrapConfigurator;
