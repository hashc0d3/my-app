"use client";

import Image from 'next/image';
import { observer } from 'mobx-react';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';
import { StrapView } from '@/src/shared/types/StrapConfigTypes';
import styles from './StrapPreview.module.css';

const PREVIEW_CARDS: StrapView[] = ['front', 'side', 'back'];

const StrapPreview = observer(() => {
  const previewByView = PREVIEW_CARDS.map((card) => ({
    id: card,
    layers: strapConfiguratorStore.getLayersByView(card).filter((layer) => Boolean(layer)),
  }));

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.card}>
          {previewByView[0].layers.map((layer, index) => (
            <div key={`front-${layer}-${index}`} className={styles.layer}>
              <Image
                src={layer}
                alt={`strap-front-layer-${index}`}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 420px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <div className={styles.rightColumn}>
          {[previewByView[1], previewByView[2]].map((viewCard) => (
            <div key={viewCard.id} className={styles.card}>
              {viewCard.layers.map((layer, index) => (
                <div
                  key={`${viewCard.id}-${layer}-${index}`}
                  className={styles.layer}
                >
                  <Image
                    src={layer}
                    alt={`strap-${viewCard.id}-layer-${index}`}
                    fill
                    className={styles.image}
                    sizes="(max-width: 1024px) 100vw, 220px"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default StrapPreview;
