// Типы для разделов стартовой страницы
export interface StartPageSectionProps {
    backgroundImage: string;
    image: string;
    link: string;
    description: string;
}

// Типы для стартовой страници
export interface StartPageProps {
    title: string;
    highlight: string;
    sections: StartPageSectionProps[];
    urlParam: string;
}