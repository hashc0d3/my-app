import {HeaderButton, HeaderButtonWithIconProps, HeaderModalContactsProps} from "@/src/shared/types/HeaderTypes";
import { APP_ROUTES } from "@/src/shared/config/routes";

// Кнопки перехода на стартовую страницу (лендинг без ?step=)
export const HeaderButtonsMain: HeaderButton = {
    name: "Вернуться на главную",
    link: APP_ROUTES.home
};

// Кнопка перехода на страницу корзины
export const HeaderButtonCart: HeaderButtonWithIconProps = {
    name: "Корзина",
    link: APP_ROUTES.cart,
    icon: "/cart.svg"
};

// Кнопка открытия модального окна контактов
export const HeaderButtonInfo: HeaderButtonWithIconProps = {
    name: "Контакты",
    link: "#",
    icon: "/cross.svg"
};

// Модальное окно контактов
export const HeaderModalContacts: HeaderModalContactsProps = {
    name: "Контакты",
    phoneNumber: {
        link: "#",
        name: "+7 (995) 771-50-30"
    },
    email: {
        link: "#",
        name: "hello@slavalarionov.com"
    },
    whatsapp: {
        link: "#",
        icon: "/WhatsAppIcon.svg",
        name: "Написать в WhatsApp"
    },
    telegram: {
        link: "#",
        icon: "/TelegramIcon.svg",
        name: "Написать в Telegram"
    }
};