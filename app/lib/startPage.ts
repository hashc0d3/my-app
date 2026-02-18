import {StartPageProps} from "@/app/types/StartPageTypes";

export const startPage: StartPageProps = {
    title: 'Конструктор ремешков и чехлов ',
    highlight: 'от «Slava Larionov»',
    urlParam: '',
    sections: [
        {
            backgroundImage: '/startPageLeftBG.webp',
            image: '/startPageLeftBG.png',
            link: '/remeshki',
            description: 'Кастомизация ремешков для Apple Watch'
        },
        {
            backgroundImage: '/startPageRightBG.webp',
            image: '/startPageRightBG.png',
            link: '/remeshki',
            description: 'Кастомизация чехлов для iPhone 12-17'
        }
    ]
}