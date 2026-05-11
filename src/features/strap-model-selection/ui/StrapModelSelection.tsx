"use client"

import { observer } from "mobx-react";
import { useEffect } from "react";
import { Card } from "@/src/shared/ui";
import { strapModelStore } from "@/src/entities/strap-model";
import Image from "next/image";
import {watchModelStore} from "@/entities/watch-model";
import styles from "./StrapModelSelection.module.css";

const StrapModelSelection = observer(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const models = strapModelStore.strapModels || [];

    // Проверка совместимости текущего ремня с выбранной моделью часов
    useEffect(() => {
        if (strapModelStore.currentStrap !== null) {
            const selectedStrap = models.find(model => model.id === strapModelStore.currentStrap);

            if (selectedStrap && !selectedStrap.available.includes(watchModelStore.currentCard)) {
                strapModelStore.setCurrentStrap(null, "", 0);
            }
        }
    }, [models, watchModelStore.currentCard, strapModelStore.currentStrap]);

    return (
        <section className={styles.section}>
            <div className={styles.cards}>
                {models.map((model) => {
                    const isActive = strapModelStore.currentStrap === model.id;

                    if (model.available.includes(watchModelStore.currentCard)) {
                        return (
                            <Card
                                key={model.id}
                                isActive={isActive}
                                onClick={() => strapModelStore.setCurrentStrap(model.id, model.name, model.price)}
                                className={styles.card}
                            >
                                <Image
                                    src={model.image}
                                    alt={model.name}
                                    width={167}
                                    height={207}
                                    className={styles.image}
                                />

                                <div className={styles.content}>
                                    {/* Название */}
                                    <div className={styles.titleWrap}>
                                        <p className={styles.title}>
                                            {model.name}
                                        </p>
                                    </div>

                                    {/* Цена */}
                                    <div className={styles.priceWrap}>
                                        <p className={styles.price}>
                                            {model.price} ₽
                                        </p>
                                    </div>

                                    {/* Описание */}
                                    <div className={styles.descriptionWrap}>
                                        <p className={styles.description}>
                                            {model.description}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </section>
    );
});

export default StrapModelSelection;
