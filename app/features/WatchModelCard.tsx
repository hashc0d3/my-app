import React from 'react';
import {WatchModelCardProps} from "@/app/types/WatchModelCardTypes";
import watchModelStore from "@/app/store/WatchModelStore";
import {observer} from "mobx-react";
import {auto} from "@popperjs/core";

const WatchModelCard = observer(({
    cardInfo,
}: {
    cardInfo: WatchModelCardProps,
}) => {

    return (
        <div
            className={`flex flex-col items-center justify-center text-center text-black rounded-[20px] gap-6 cursor-pointer border-1 ${watchModelStore.currentCard === cardInfo.id ? "bg-white !border-[#5078DF]" : "bg-[#6766821F] !border-[#6766821F]"}`}
            onClick={() => watchModelStore.setCurrentCard(cardInfo.id)}
        >
            <div className="px-4 sm:px-[90px] sm:py-[35px]">
                <img src={cardInfo.image} alt='IPhone'/>
            </div>
            <div className='flex flex-col px-[60px] py-[35px] gap-6 width-[200px]'>
                <div className="font-medium text-[22px] leading-[100%] tracking-[-0.02em] text-center">{cardInfo.name}</div>
                <div className='flex gap-3 items-center justify-center'>
                    {cardInfo.sizes.map((size: number, index) =>
                        <div key={index} className="font-normal text-[16px] leading-[130%] text-center text-[#676682] px-[20px] py-[10px] bg-[#67668226]">{size}mm</div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default WatchModelCard;