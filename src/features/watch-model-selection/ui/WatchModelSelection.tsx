"use client"

import { observer } from "mobx-react";
import { Card } from "@/src/shared/ui";
import { watchModelStore } from "@/src/entities/watch-model";
import Image from "next/image";
import styles from "./WatchModelSelection.module.css";

const WatchModelSelection = observer(() => {
    const models = watchModelStore.watchModels || [];

    return (
        <section className={styles.section}>
            <div className={styles.cards}>
                {models.map((model) => {
                    const isActive = watchModelStore.currentCard === model.id;

                    return (
                        <Card
                            key={model.id}
                            isActive={isActive}
                            onClick={() => watchModelStore.setCurrentCard(model.id, model.model)}
                            className={styles.card}
                        >
                            <Image
                                src={model.image}
                                alt={model.name}
                                width={140}
                                height={252}
                                className={styles.image}
                            />

                            <div className={styles.content}>
                                <div className={styles.titleWrap}>
                                    <p className={styles.title}>{model.name}</p>
                                    {model.model ? (
                                        <p className={styles.series}>{model.model}</p>
                                    ) : null}
                                </div>

                                <div className={styles.sizes}>
                                    {model.sizes.map((size) => (
                                        <button
                                            type="button"
                                            key={size}
                                            className={`${styles.sizeButton} ${
                                                watchModelStore.selectedSize === size
                                                    ? styles.sizeActive
                                                    : styles.sizeInactive
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                watchModelStore.setSelectedSize(size, model.id, model.model);
                                            }}
                                        >
                                            {size}mm
                                        </button>
                                    ))}
                                </div>

                                {isActive && model.colors?.length ? (
                                    <div className={styles.cardColors}>
                                        {model.colors.map((color, colorIdx) => (
                                            <button
                                                key={`${model.id}-${colorIdx}`}
                                                type="button"
                                                className={`${styles.colorChip} ${
                                                    watchModelStore.selectedColor?.hex === color.hex ? styles.colorChipActive : ""
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    watchModelStore.setSelectedColor(color);
                                                }}
                                                aria-label={color.name}
                                                title={color.name}
                                            >
                                                <span className={styles.colorDot} style={{ background: color.hex }} />
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
});

export default WatchModelSelection;
