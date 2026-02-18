"use client"

import { observer } from "mobx-react";
import { Card } from "@/src/shared/ui";
import { watchModelStore } from "@/src/entities/watch-model";
import Image from "next/image";

const WatchModelSelection = observer(() => {
    const models = watchModelStore.watchModels || [];

    return (
        <section className="container-padding">
            <div className="flex items-stretch gap-[10px]">
                {models.map((model) => {
                    const isActive = watchModelStore.currentCard === model.id;

                    return (
                        <Card
                            key={model.id}
                            isActive={isActive}
                            onClick={() => watchModelStore.setCurrentCard(model.id, model.model)}
                            className="grid grid-rows-[252px_130px] flex-1 py-[52px]"
                        >
                            <Image
                                src={model.image}
                                alt={model.name}
                                width={140}
                                height={252}
                                className="w-[140px] max-h-[252px] object-contain justify-self-center pointer-events-none"
                            />

                            <div className="flex flex-col items-center px-[60px] mt-[20px]">
                                <div className="flex flex-col items-center justify-center h-10">
                                    <p className="text-center text-[22px] font-medium leading-[100%] tracking-[-0.02em] font-[Onest]">
                                        {model.name}
                                    </p>
                                </div>

                                <div className="flex gap-2.5 mt-[20px]">
                                    {model.sizes.map((size, id) => (
                                        <div
                                            key={id}
                                            className={`flex items-center justify-center flex-1 max-w-[85px] min-h-[44px] px-5 py-3 rounded-full border text-base cursor-pointer transition-all ${
                                                watchModelStore.selectedSize === size
                                                    ? 'bg-white border-[#5078DF]'
                                                    : 'bg-[#e9e9e9] border-transparent hover:border-[#b3b3b3]'
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                watchModelStore.setSelectedSize(size, model.id, model.model);
                                            }}
                                        >
                                            {size}mm
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
});

export default WatchModelSelection;
