"use client";

import React from 'react';
import {HeaderButtonCart, HeaderButtonInfo, HeaderButtons, HeaderButtonsMain} from "@/src/shared/lib/header";
import Image from "next/image";
import {HeaderButton} from "@/src/shared/types/HeaderTypes";
import { cartStore } from "@/src/entities/cart";
import {observer} from "mobx-react";
import { headerStore } from "@/src/entities/header";
import Link from "next/link";

const Header = observer(() => {
    return (
        <header key="header" className="sticky top-0 z-50 bg-[#5078DF] text-white container-padding text-[14px] leading-[130%] font-normal">
            <nav className="flex justify-between items-center relative">

                {/*
                    Левый блок кнопок
                */}
                <div className="flex gap-9 items-center">
                    <a href={HeaderButtonsMain.link}>{HeaderButtonsMain.name}</a>
                    <ul className="flex gap-5 items-center m-0 p-0">
                        {HeaderButtons.map((button: HeaderButton) =>
                            <li key={button.name} className="list-disc marker:text-white"><a href={button.link}>{button.name}</a></li>)
                        }
                    </ul>
                </div>

                {/*
                    Логотип
                */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Image src="/logo.svg" alt="logo" width={136} height={29}/>
                </div>

                {/*
                    Невидимая копия для сохранения высоты
                */}
                <div className="invisible py-2.5">
                    <Image src="/logo.svg" alt="" width={136} height={29}/>
                </div>

                {/*
                    Правый блок кнопок
                */}
                <ul className="flex items-center gap-4 m-0 p-0">
                    <li key={HeaderButtonCart.name}>
                        <Link
                            href={HeaderButtonCart.link}
                            className="flex items-center gap-1.5 no-underline text-inherit hover:text-inherit"
                        >
                            <Image src={HeaderButtonCart.icon} alt={HeaderButtonCart.name} width={15} height={16}/>
                            {cartStore.items}
                        </Link>
                    </li>
                    <li key={HeaderButtonInfo.name}>
                        <Link
                            href={HeaderButtonInfo.link}
                            className="flex items-center gap-1.5 no-underline text-inherit hover:text-inherit"
                            onClick={() => headerStore.toggleModal()}
                        >
                            <Image src={HeaderButtonInfo.icon} alt={HeaderButtonCart.name} width={18} height={20}/>
                            {HeaderButtonInfo.name}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
});

export default Header;