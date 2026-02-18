// Тип для способа оплаты в карточке
export interface FooterCardBannerProps {
    icon: string,
    link: string
}

// Тип для секции способов оплаты в карточке
export interface FooterCardItemProps {
    banners: FooterCardBannerProps[],
    description: string
}

// Тип для карточки в footer
export interface FooterTypes {
    title: string ,
    items: FooterCardItemProps[],
    description: string
}

// Тип для нижних секций под Slava Larionov
export interface FooterInfoSectionProps {
    href: string,
    text: string
}

// Тип для информации в footer
export interface FooterInfoProps {
    title: string,
    leftSection: FooterInfoSectionProps[],
    rightSection: FooterInfoSectionProps[]
}

