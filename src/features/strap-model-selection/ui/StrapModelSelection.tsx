"use client"

import { observer } from "mobx-react";
import { useEffect } from "react";
import { Card } from "@/src/shared/ui";
import { strapModelStore } from "@/src/entities/strap-model";
import Image from "next/image";
import {watchModelStore} from "@/entities/watch-model";

const StrapModelSelection = observer(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const models = strapModelStore.strapModels || [];

    // Проверка совместимости текущего ремня с выбранной моделью часов
    useEffect(() => {
        if (strapModelStore.currentStrap) {
            const selectedStrap = models.find(model => model.id === strapModelStore.currentStrap);

            if (selectedStrap && !selectedStrap.available.includes(watchModelStore.currentCard)) {
                strapModelStore.setCurrentStrap(null, "", 0);
            }
        }
    }, [models]);

    return (
        <section className="container-padding">
            <div className="flex items-stretch gap-[10px]">
                {models.map((model) => {
                    const isActive = strapModelStore.currentStrap === model.id;

                    if (model.available.includes(watchModelStore.currentCard)) {
                        return (
                            <Card
                                key={model.id}
                                isActive={isActive}
                                onClick={() => strapModelStore.setCurrentStrap(model.id, model.name, model.price)}
                                className="grid grid-rows-[252px_auto] flex-1 py-[52px]"
                            >
                                <Image
                                    src={model.image}
                                    alt={model.name}
                                    width={170}
                                    height={210}
                                    className="w-[170px] max-h-[210px] object-contain justify-self-center pointer-events-none"
                                />

                                <div className="flex flex-col items-center px-[60px] mt-[20px] gap-[12px]">
                                    {/* Название */}
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-center text-[22px] font-medium leading-[100%] tracking-[-0.02em] font-[Onest]">
                                            {model.name}
                                        </p>
                                    </div>

                                    {/* Цена */}
                                    <div className="flex items-center justify-center">
                                        <p className="text-center text-[18px] font-medium leading-[100%] text-[#5078DF]">
                                            {model.price} ₽
                                        </p>
                                    </div>

                                    {/* Описание */}
                                    <div className="flex items-center justify-center">
                                        <p className="text-center text-[14px] font-normal leading-[130%] text-[#676682]">
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
