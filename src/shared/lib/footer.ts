import {FooterTypes, FooterInfoProps} from "@/src/shared/types/FooterTypes";

// Блок карточек в footer
export const footerCards: FooterTypes[] = [
    {
        id: "payment-1",
        title: "Оплата на сайте",
        items: [
            {
                banners: [
                    {icon: "/Visa.svg", link: "#"},
                    {icon: "/MasterCard.svg", link: "#"},
                    {icon: "/Mir.svg", link: "#"}
                ],
                description: "выпущенные в РФ"
            },
            {
                banners: [
                    {icon: "/TPay.svg", link: "#"},
                    {icon: "/Half.svg", link: "#"},
                    {icon: "/SBP.svg", link: "#"}
                ],
                description: "другие способы оплаты"
            }
        ],
        description: "После оплаты вам придет чек\nна электронную почту"
    },
    {
        id: "payment-2",
        title: "Оплата на сайте",
        items: [{
            banners: [
                {icon: "/Visa.svg", link: "#"},
                {icon: "/MasterCard.svg", link: "#"},
                {icon: "/Mir.svg", link: "#"}
            ],
            description: "выпущенные в РФ"
        }],
        description: "После оплаты вам придет чек\nна электронную почту"
    },
    {
        id: "payment-3",
        title: "Оплата на сайте",
        items: [{
            banners: [
                {icon: "/Visa.svg", link: "#"},
                {icon: "/MasterCard.svg", link: "#"},
                {icon: "/Mir.svg", link: "#"}
            ],
            description: "выпущенные в РФ"
        }],
        description: "После оплаты вам придет чек\nна электронную почту"
    },
]

// Инормационны блок в footer
export const footerInfo: FooterInfoProps = {
    title: "Slava Larionov",
    leftSection: [
        {text: "©2026 ИП Ларионов Вячеслав Владимирович", href: "#"},
        {text: "ИНН: 550517616144", href: "#"},
        {text: "г. Санкт-Петербург", href: "#"}
    ],
    rightSection: [
        {text: "Оферта", href: "#"},
        {text: "Условия использования", href: "#"},
        {text: "Политика конфиденциальности", href: "#"}
    ]
}