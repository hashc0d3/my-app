"use client"

import React from "react";
import Image from "next/image";
import { footerCards } from "@/src/shared/lib/footer";
import type { FooterCardBannerProps, FooterCardItemProps, FooterTypes } from "@/src/shared/types/FooterTypes";
import styles from "./FooterCards.module.css";

const FooterCards = () => {
    return (
        <section key="footerCards" className={styles.section}>
            {/*
                Формируем блок карточек в footer
            */}
            {footerCards.map((card: FooterTypes) =>
                <div
                    key={card.id}
                    className={styles.card}
                >
                    {/*
                        Наименование карточки
                    */}
                    <p className={styles.cardTitle}>
                        {card.title}
                    </p>
                    {/*
                        Баннеры для карточки
                    */}
                    <div className={styles.items}>
                        {card.items.map((item: FooterCardItemProps, itemIndex: number) => {
                            return (
                                /*
                                * Для каждого элемента карточки отображаем баннеры и описание.
                                * Баннеры отображаются в виде иконок, а описание - в виде списка с маркерами.
                                * */
                                <div key={`${item.description}-${itemIndex}`} className={styles.itemBlock}>
                                    <div className={styles.banners}>
                                        {item.banners.map((banner: FooterCardBannerProps, bannerIndex: number) => (
                                            <React.Fragment key={banner.icon}>
                                                <a href={banner.link}>
                                                    <Image src={banner.icon} alt="" width={32} height={32} className={styles.bannerIcon} />
                                                </a>
                                                {/* Вертикальная линия между иконками */}
                                                {bannerIndex < item.banners.length - 1 && (
                                                    <div className={styles.separator}></div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <ul className={styles.descriptionList}>
                                        <li className={styles.descriptionItem}>
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
                    <p className={styles.cardDescription}>
                        {card.description}
                    </p>
                </div>
            )}
        </section>
    );
};

export default FooterCards;