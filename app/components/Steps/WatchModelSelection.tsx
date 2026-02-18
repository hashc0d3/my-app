"use client"

import watchModelStore from "@/app/store/WatchModelStore";
import { observer } from "mobx-react";

const WatchModelSelection = observer(() => {
    const models = watchModelStore.watchModels || [];

    return (
        <section className="container-padding">
            <div className="flex items-stretch gap-[10px]">
                {models.map((model) => {
                    const isActive = watchModelStore.currentCard === model.id;

                    return (
                        <div
                            key={model.id}
                            className={`grid grid-rows-[252px_130px] flex-1 py-[52px] rounded-[20px] border cursor-pointer transition-all ${
                                isActive ? 'bg-white border-[#5078DF]' : 'bg-[#f5f5f5] border-transparent hover:border-[#b3b3b3]'
                            }`}
                            onClick={() => watchModelStore.setCurrentCard(model.id)}
                        >
                            <img
                                src={model.image}
                                alt={model.name}
                                className="w-[140px] max-h-[252px] object-contain justify-self-center pointer-events-none"
                            />

                            <div className="flex flex-col items-center px-[60px] mt-[20px]">
                                <div className="flex flex-col items-center justify-center h-10">
                                    <p className="text-center text-[22px] font-medium leading-[100%] tracking-[-0.02em] font-[Onest]">{model.name}</p>
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
                                                watchModelStore.setSelectedSize(size, model.id);
                                            }}
                                        >
                                            {size}mm
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
});

export default WatchModelSelection;
