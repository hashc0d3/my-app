"use client"

import React from 'react';
import {footerCards} from "@/src/shared/lib/footer";
import {FooterCardBannerProps, FooterCardItemProps, FooterTypes} from "@/src/shared/types/FooterTypes";

const FooterCards = () => {
    return (
        <section key="footerCards" className="flex gap-3">
            {/*
                Формируем блок карточек в footer
            */}
            {footerCards.map((card: FooterTypes, index: number) =>
                <div
                    key={index}
                    className="bg-[#E1E9FE] rounded-2xl pl-9 pr-9 pt-8 pb-8 flex flex-col gap-5"
                >
                    {/*
                        Наименование карточки
                    */}
                    <p className="mb-4 text-[22px] leading-[100%] tracking-[-0.02em] font-medium">
                        {card.title}
                    </p>
                    {/*
                        Баннеры для карточки
                    */}
                    <div className="grow flex flex-col gap-5">
                        {card.items.map((item: FooterCardItemProps, itemIndex: number) => {
                            return (
                                /*
                                * Для каждого элемента карточки отображаем баннеры и описание.
                                * Баннеры отображаются в виде иконок, а описание - в виде списка с маркерами.
                                * */
                                <div key={item.description + itemIndex} className="flex flex-col gap-2">
                                    <div className="flex gap-2 flex-wrap items-center">
                                        {item.banners.map((banner: FooterCardBannerProps, bannerIndex: number) => (
                                            <React.Fragment key={banner.icon}>
                                                <a href={banner.link}>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={banner.icon} alt={banner.icon} className="pr-4"/>
                                                </a>
                                                {/* Вертикальная линия между иконками */}
                                                {bannerIndex < item.banners.length - 1 && (
                                                    <div className="w-px h-6 bg-[#6766824D] mr-4"></div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <ul>
                                        <li className="list-disc marker:text-[#676682] text-[14px] leading-[130%] font-normal text-[#67668299] whitespace-pre-line">
                                            {item.description}
                                        </li>
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                    {/*
                        Описание для карточки
                    */}
                    <p className="mt-4 text-[16px] leading-[130%] font-normal text-[#676682]">
                        {card.description}
                    </p>
                </div>
            )}
        </section>
    );
};

export default FooterCards;