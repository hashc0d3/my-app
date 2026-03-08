"use client"

import { observer } from "mobx-react";
import { watchModelStore } from "@/src/entities/watch-model";
import styles from "./FrameColors.module.css";

const FrameColors = observer(() => {
    const activeModel = watchModelStore.watchModels.find(m => m.id === watchModelStore.currentCard);

    if (!activeModel || !activeModel.colors) {
        return null;
    }

    return (
        <div className={styles.section}>
            <div className={styles.inner}>
                <div className={styles.list}>
                    {activeModel.colors.map((color) => (
                        <div
                            key={color.hex}
                            role="button"
                            tabIndex={0}
                            className={`${styles.item} ${
                                watchModelStore.selectedColor?.hex === color.hex
                                    ? styles.itemActive
                                    : ''
                            }`}
                            onClick={() => watchModelStore.setSelectedColor(color)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    watchModelStore.setSelectedColor(color);
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
