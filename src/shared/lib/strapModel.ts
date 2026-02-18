import {StrapModelsProps} from "@/shared/types/StrapModelsTypes";

export const strapModel: StrapModelsProps[] = [
    {
        id: 1,
        image: "/StrapModels/StrapModel1.png",
        name: "Butterfly",
        price: 9490,
        description: "Пряжка-бабочка для исключительного комфорта",
        available: [1,2,3,4]
    },
    {
        id: 2,
        image: "/StrapModels/StrapModel2.png",
        name: "Classic",
        price: 8990,
        description: "Превосходный классический дизайн и ничего лишнего",
        available: [0,1]
    },
    {
        id: 3,
        image: "/StrapModels/StrapModel3.png",
        name: "Double Wrap",
        price: 9890,
        description: "С нестандартным двойным оборотом вокруг запястья",
        available: [0,1,2,3]
    },
    {
        id: 4,
        image: "/StrapModels/StrapModel4.png",
        name: "Brogue",
        price: 9490,
        description: "Декоративная перфорация в классическом стиле",
        available: [0,1,2,3]
    },
    {
        id: 5,
        image: "/StrapModels/StrapModel5.png",
        name: "Minimal",
        price: 7490,
        description: "Элегантная и стильная модель для минималистов",
        available: [0,1,2]
    },
]