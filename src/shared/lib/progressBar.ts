import {ProgressBarFiltersProps, ProgressBarMoveProps, ProgressBarProps} from "@/src/shared/types/ProgressBarTypes";

// Шаги для ProgressBar
export const progressBar: ProgressBarProps[] = [
    {
        name: 'Серия часов',
        step: 1,
        icon: '/ProgressBarFirstIcon.svg'
    },
    {
        name: 'Модель ремешка',
        step: 2,
        icon: '/ProgressBarSecondIcon.svg'
    },
    {
        name: 'Уникальный дизайн',
        step: 3,
        icon: '/ProgressBarThreeIcon.svg'
    },
    {
        name: 'Персонализация ремешка',
        step: 4,
        icon: '/ProgressBarFourIcon.svg'
    }
]

// Переход Назад/Далее в ProgressBar
export const progressBarMove: ProgressBarMoveProps = {
    next: "Далее",
    back: "Назад",
    offer: "Добавить в корзину",
    offerShort: "В корзину"
}

// Переход Назад/Далее в ProgressBar
export const progressBarFilters: ProgressBarFiltersProps = {
    name: "Выбранные параметры",
    iconOpen: "/listOpenIcon.svg",
    iconClose: "/listCloseIcon.svg"
}
