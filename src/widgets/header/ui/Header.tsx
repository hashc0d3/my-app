"use client";

import React from 'react';
import { HeaderButtonCart, HeaderButtonInfo, HeaderButtonsMain } from "@/src/shared/lib/header";
import Image from "next/image";
import { HeaderButton } from "@/src/shared/types/HeaderTypes";
import { cartStore } from "@/src/entities/cart";
import { observer } from "mobx-react";
import { headerStore } from "@/src/entities/header";
import Link from "next/link";
import { useHeader } from "../hooks";
import styles from "./Header.module.css";
import { progressBarStore } from "@/src/entities/progress-bar";
import { caseProgressBarStore } from "@/src/entities/case-progress-bar";
import { buildCaseStepRoute, buildHomeStepRoute } from "@/src/shared/config/routes";

/**
 * Виджет Header (FSD: widgets/header).
 * Верстка: логотип, навигация, корзина, инфо-кнопка, бургер-меню.
 * Логика вынесена в useHeader (hooks/).
 */
const Header = observer(() => {
    const { isBurgerOpen, handleCartClick, toggleBurger } = useHeader();
    const headerButtons: HeaderButton[] = [
        { name: "Ремешки", link: buildHomeStepRoute(progressBarStore.currentStep) },
        { name: "Чехлы", link: buildCaseStepRoute(caseProgressBarStore.currentStep) }
    ];

    return (
        <header key="header" className={styles.header}>
            <nav className={styles.nav}>

                {/*
                    Левый блок кнопок
                */}
                <div className={styles.leftBlock}>
                    <Link href={HeaderButtonsMain.link}>{HeaderButtonsMain.name}</Link>
                    <ul className={styles.leftList}>
                        {headerButtons.map((button: HeaderButton) => (
                            <li key={button.name} className={styles.leftItem}>
                                <Link href={button.link}>{button.name}</Link>
                            </li>
                        ))
                        }
                    </ul>
                </div>

                {/*
                    Логотип
                */}
                <div className={styles.logoWrap}>
                    <Link href={HeaderButtonsMain.link} className={styles.logoLink} aria-label="На главную">
                        <Image
                            src="/logo.svg"
                            alt=""
                            width={136}
                            height={29}
                            className={styles.logo}
                        />
                    </Link>
                </div>

                {/*
                    Невидимая копия для сохранения высоты
                */}
                <div className={styles.logoSpacer}>
                    <Image src="/logo.svg" alt="" width={136} height={29}/>
                </div>

                {/*
                    Правый блок кнопок
                */}
                <ul className={styles.rightList}>
                    <li key={HeaderButtonCart.name} className={styles.cartItem}>
                        <Link
                            href={HeaderButtonCart.link}
                            className={styles.actionLink}
                            onClick={handleCartClick}
                        >
                            <Image src={HeaderButtonCart.icon} alt={HeaderButtonCart.name} width={15} height={16}/>
                            {cartStore.items}
                        </Link>
                    </li>
                    <li key={HeaderButtonInfo.name} className={styles.contactItem}>
                        <button
                            type="button"
                            className={styles.actionLink}
                            onClick={() => headerStore.openModal()}
                        >
                            <Image src={HeaderButtonInfo.icon} alt={HeaderButtonCart.name} width={18} height={20}/>
                            {HeaderButtonInfo.name}
                        </button>
                    </li>
                    <li className={styles.burgerItem}>
                        <button
                            type="button"
                            onClick={toggleBurger}
                            className={styles.burgerButton}
                            aria-label={isBurgerOpen ? "Закрыть меню" : "Открыть меню"}
                            aria-expanded={isBurgerOpen}
                        >
                            <span
                                className={`${styles.burgerLine} ${
                                    isBurgerOpen ? styles.burgerLineTopOpen : styles.burgerLineTopClosed
                                }`}
                                aria-hidden="true"
                            />
                            <span
                                className={`${styles.burgerLine} ${
                                    isBurgerOpen ? styles.burgerLineBottomOpen : styles.burgerLineBottomClosed
                                }`}
                                aria-hidden="true"
                            />
                        </button>
                    </li>
                </ul>
            </nav>

            <div className={`${styles.mobileMenu} ${isBurgerOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed}`}>
                <Link href={HeaderButtonsMain.link} className={styles.mobileMainLink}>{HeaderButtonsMain.name}</Link>
                <ul className={styles.mobileList}>
                    {headerButtons.map((button: HeaderButton) => (
                        <li key={button.name} className={styles.mobileListItem}>
                            <Link href={button.link}>{button.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
});

export default Header;