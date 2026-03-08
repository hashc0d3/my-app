export interface TitleStepSectionTypes {
    /** Первая строка заголовка (например: «Создайте уникальный») */
    title: string;
    /** Вторая строка перед подсветкой (например: «ремешок ») */
    titleLine2?: string;
    /** Подсвеченная часть (серый цвет, например: «для Apple Watch») */
    highlight: string;
    step?: number;
}