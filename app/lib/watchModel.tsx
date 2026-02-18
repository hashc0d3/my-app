import {WatchModelCardListProps} from "@/app/types/WatchModelCardTypes";

export const watchModels: WatchModelCardListProps = [
    {
        id: 0,
        image: "/WatchModels/First.png",
        name: "Apple Watch 4-6 серия, SE",
        sizes: [40, 44],
        colors: [
            {hex: '#4F555C', name: 'Silver'},
            {hex: '#000', name: 'Black'}
        ]
    },
    {
        id: 1,
        image: "/WatchModels/Second.png",
        name: "Apple Watch 7-9 серия",
        sizes: [41, 45],
        colors: [
            {hex: '#4F555C', name: 'Silver'},
        ]
    },
    {
        id: 2,
        image: "/WatchModels/Three.png",
        name: "Apple Watch 10-11 серия",
        sizes: [42, 46],
        colors: [
            {hex: '#4F555C', name: 'Silver'},
            {hex: '#000', name: 'Black'}
        ]
    },
    {
        id: 3,
        image: "/WatchModels/Four.png",
        name: "Apple Watch Ultra 1-3",
        sizes: [49],
        colors: [
            {hex: '#4F555C', name: 'Silver'},
        ]
    }
]