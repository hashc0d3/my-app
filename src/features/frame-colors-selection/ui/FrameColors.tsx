"use client"

import { observer } from "mobx-react";
import { watchModelStore } from "@/src/entities/watch-model";
import styles from "./FrameColors.module.css";

const FrameColors = observer(() => {
    const activeModel =
        watchModelStore.watchModels[watchModelStore.currentCardIndex] ??
        watchModelStore.watchModels.find((m) => m.id === watchModelStore.currentCard);
    const activeModelIdx = watchModelStore.currentCardIndex;

    if (!activeModel || !activeModel.colors) {
        return null;
    }

    return (
        <div className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.list}>
                    {activeModel.colors.map((color, index) => (
                        <div
                            key={`${activeModelIdx}-${color.hex}-${color.name}-${index}`}
                            role="button"
                            tabIndex={0}
                            className={`${styles.item} ${
                                watchModelStore.selectedColorKey === `${activeModelIdx}:${index}`
                                    ? styles.itemActive
                                    : ''
                            }`}
                            onClick={() => watchModelStore.setSelectedColor(color, `${activeModelIdx}:${index}`)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    watchModelStore.setSelectedColor(color, `${activeModelIdx}:${index}`);
                                }
                            }}
                        >
                            <div
                                className={styles.dot}
                                style={{ background: color.hex }}
                            />
                            <span className={styles.name}>{color.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default FrameColors;
