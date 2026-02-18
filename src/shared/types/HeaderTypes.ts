// Тип для кнопок в header
export interface HeaderButton {
    name: string,
    link: string
}

// Тип для кнопок с иконкой
export interface HeaderButtonWithIconProps extends HeaderButton {
    icon: string;
}

// Тип для модального окна контактов
export interface HeaderModalContactsProps {
    name: string,
    phoneNumber: HeaderButton,
    email: HeaderButton,
    whatsapp: HeaderButtonWithIconProps,
    telegram: HeaderButtonWithIconProps
}