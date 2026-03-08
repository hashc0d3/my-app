import {HeaderButton, HeaderButtonWithIconProps, HeaderModalContactsProps} from "@/src/shared/types/HeaderTypes";

// Кнопки перехода на главную страницу
export const HeaderButtonsMain: HeaderButton = {
    name: "Вернуться на главную",
    link: "#"
};

// Кнопки перехода на страницы с товарами
export const HeaderButtons: HeaderButton[] = [
    {name: "Ремешки", link: "#"},
    {name: "Чехлы", link: "#"}
];

// Кнопка перехода на страницу корзины
export const HeaderButtonCart: HeaderButtonWithIconProps = {
    name: "Корзина",
    link: "/cart",
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