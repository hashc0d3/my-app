"use client"

import React from 'react';
import watchModelStore from "@/app/store/WatchModelStore";
import { observer } from "mobx-react";

const WatchModelSelection = observer(() => {
    const models = watchModelStore.watchModels || [];

    return (
        <section className="container-padding">
            <div className="w-full flex items-stretch justify-between flex-wrap max-w-[800px] lg:max-w-none mx-auto lg:flex-nowrap">
                {models.map((model, idx) => {
                    const isActive = watchModelStore.currentCard === model.id;

                    return (
                        <div
                            key={model.id}
                            className={`
                                relative flex flex-col lg:grid lg:grid-rows-[252px_130px_auto] lg:grid-cols-1
                                items-center justify-center lg:justify-items-center lg:self-start
                                flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-30px)]
                                p-5 sm:p-[27px] lg:p-[30px] xl:p-[52px]
                                rounded-[42px] lg:rounded-[56px]
                                bg-[#f5f5f5] border border-transparent
                                cursor-pointer transition-all duration-200
                                overflow-visible
                                ${isActive ? 'bg-white !border-[#5078DF]' : 'hover:border-[#b3b3b3]'}
                                ${idx >= 2 ? 'mt-4 lg:mt-0' : ''}
                                max-[650px]:flex-[0_0_100%]
                                max-[650px]:flex-row max-[650px]:flex-wrap
                                max-[650px]:items-start max-[650px]:justify-between
                                ${isActive ? 'max-[650px]:mb-[83px]' : ''}
                            `}
                            onClick={() => watchModelStore.setCurrentCard(model.id)}
                        >
                            {/* Картинка */}
                            <img
                                src={model.image}
                                alt={model.name}
                                className="
                                    lg:row-start-1
                                    pointer-events-none w-[38%] sm:w-[108px] lg:w-[120px] xl:w-[140px]
                                    h-auto min-h-[200px] lg:min-h-0 lg:max-h-[234px] xl:max-h-[252px]
                                    object-contain object-top
                                    mb-0 lg:justify-self-center
                                    max-[650px]:flex-[0_0_40%] max-[650px]:min-h-[45vw] max-[650px]:order-1
                                "
                            />

                            {/* Инфо блок */}
                            <div className="
                                lg:row-start-2
                                w-full lg:w-[180px] flex flex-col items-center justify-center
                                ml-3 lg:ml-0 flex-[0_0_55%] lg:flex-none
                                min-h-[200px] lg:min-h-0
                                max-[750px]:flex-[0_0_100%]
                                max-[650px]:flex-[0_0_55%] max-[650px]:max-w-[220px] max-[650px]:w-fit
                                max-[650px]:ml-3 max-[650px]:min-h-[45vw] max-[650px]:order-2
                                max-[400px]:w-[40%]
                            ">
                                {/* Название */}
                                <div className="text-center text-base font-light leading-6 h-10 flex flex-col justify-center items-center m-0">
                                    <p className="block m-0 mb-0.5 last:mb-0">Apple</p>
                                    <p className="block m-0 mb-0.5 last:mb-0">{model.name}</p>
                                </div>

                                {/* Размеры */}
                                <div className="w-full max-w-[170px] lg:max-w-[180px] flex gap-2.5 justify-center mt-3.5 flex-shrink-0 h-11 min-h-[44px] items-center">
                                    {model.sizes.map((size, id) => (
                                        <button
                                            key={id}
                                            type="button"
                                            className={`
                                                flex items-center justify-center max-w-[80px] lg:max-w-[85px] flex-1
                                                h-auto min-h-[44px] px-4 lg:px-5 py-2.5 lg:py-3
                                                rounded-[50px] bg-[#e9e9e9] border border-transparent
                                                cursor-pointer transition-all duration-200
                                                text-sm lg:text-base leading-[18px]
                                                hover:border-[#b3b3b3]
                                                ${watchModelStore.selectedSize === size ? 'bg-white !border-[#5078DF]' : ''}
                                                max-[370px]:text-xs max-[370px]:leading-4 max-[370px]:px-3 max-[370px]:py-2
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                watchModelStore.setSelectedSize(size);
                                            }}
                                        >
                                            {size}mm
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Цвета - показываются в карточке на < 1100px */}
                            {isActive && model.colors && (
                                <div className="
                                    lg:row-start-3
                                    w-full hidden lg:hidden flex-wrap flex-[0_0_100%] mt-2.5 gap-2.5
                                    justify-start p-0 box-border
                                    max-[1100px]:flex
                                    max-[650px]:order-3
                                ">
                                    {model.colors.map((color, colorIdx) => (
                                        <button
                                            key={colorIdx}
                                            className={`
                                                flex items-center justify-center min-w-[38px] min-h-[38px]
                                                sm:min-w-[46px] sm:min-h-[46px]
                                                rounded-full bg-[#f5f5f5] border border-transparent
                                                p-2.5 sm:p-3 transition-all duration-200
                                                ${watchModelStore.selectedColor === color.hex ? '!border-[#5078DF]' : ''}
                                                max-[370px]:min-w-[38px] max-[370px]:min-h-[38px] max-[370px]:p-2.5
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                watchModelStore.setSelectedColor(color.hex);
                                            }}
                                        >
                                            <span
                                                className="w-full h-full rounded-full"
                                                style={{ background: color.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Кнопка "Далее" - показывается на < 650px */}
                            {isActive && (
                                <button
                                    className="
                                        absolute bottom-[-16px] left-1/2 -translate-x-1/2 translate-y-full
                                        w-3/5 max-w-[160px] hidden
                                        px-5 py-3 rounded-[50px] border border-transparent
                                        bg-[#5078DF] text-white text-sm font-normal leading-[18px]
                                        cursor-pointer transition-all duration-200
                                        hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed
                                        max-[650px]:block
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Здесь логика перехода на следующий шаг
                                        console.log('Next step');
                                    }}
                                >
                                    Далее 1/4
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
});

export default WatchModelSelection;
