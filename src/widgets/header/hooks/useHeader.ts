"use client";

import { useState, useEffect, useCallback } from 'react';
import { cartStore } from "@/src/entities/cart";
import { showToaster } from "@/src/shared/lib/toaster";

/** Сообщение при клике на корзину без товаров */
const EMPTY_CART_MESSAGE = "Корзина пустая, пожалуйста добавьте товар";

/**
 * Хук логики виджета Header.
 * Отвечает за: гидратацию корзины, клик по корзине, состояние бургер-меню и блокировку скролла тела.
 */
export function useHeader() {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    // Восстанавливаем состояние корзины из localStorage при монтировании
    useEffect(() => {
        cartStore.hydrateState();
    }, []);

    // Блокировка скролла тела при открытом мобильном меню (удобно для адаптива)
    useEffect(() => {
        if (!isBurgerOpen) {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            return;
        }
        const prevOverflow = document.body.style.overflow;
        const prevTouchAction = document.body.style.touchAction;
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.touchAction = prevTouchAction;
        };
    }, [isBurgerOpen]);

    const handleCartClick = useCallback((e: React.MouseEvent) => {
        if (cartStore.items === 0) {
            e.preventDefault();
            showToaster(EMPTY_CART_MESSAGE);
        }
    }, []);

    const toggleBurger = useCallback(() => {
        setIsBurgerOpen((prev) => !prev);
    }, []);

    return {
        isBurgerOpen,
        handleCartClick,
        toggleBurger,
    };
}
