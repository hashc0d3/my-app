"use client"

import React from 'react';
import watchModelStore from "@/app/store/WatchModelStore";
import { observer } from "mobx-react";

const FrameColors = observer(() => {
    const activeModel = watchModelStore.watchModels.find(m => m.id === watchModelStore.currentCard);

    if (!activeModel || !activeModel.colors) {
        return null;
    }

    return (
        <div className="container-padding w-fit flex justify-between mt-11 max-[1100px]:hidden">
            <div className="flex justify-center">
                <div className="flex justify-between">
                    {activeModel.colors.map((color, idx) => (
                        <div
                            key={idx}
                            className={`
                                flex items-center rounded-[56px] bg-[#f5f5f5]
                                py-2 pr-[26px] pl-4 border border-transparent
                                mr-4 last:mr-0 cursor-pointer transition-all duration-200
                                ${watchModelStore.selectedColor === color.hex ? 'bg-white !border-[#5078DF]' : ''}
                            `}
                            onClick={() => watchModelStore.setSelectedColor(color.hex)}
                        >
                            <div
                                className="min-w-[32px] max-w-[32px] min-h-[32px] rounded-full mr-4"
                                style={{ background: color.hex }}
                            />
                            <span className="text-base leading-5">
                                {color.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

export default FrameColors;
