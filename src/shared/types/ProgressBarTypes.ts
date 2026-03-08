// Тип для ProgressBar
export interface ProgressBarProps {
    name: string,
    step: number,
    icon?: string
}

// Тип для ProgressBar Filters
export interface ProgressBarFiltersProps {
    name: string,
    iconOpen: string,
    iconClose: string
}

// Тип для ProgressBar Назад/Вперед
export interface ProgressBarMoveProps {
    next: string,
    back: string,
    offer: string,
    offerShort: string
}