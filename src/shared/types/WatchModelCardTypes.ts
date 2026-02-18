export interface WatchModelCardColorProps {
    hex: string,
    name: string
}

export interface WatchModelCardProps {
    id: number,
    image: string,
    name: string,
    model: string,
    sizes: number[],
    colors?: WatchModelCardColorProps[]
}

export type WatchModelCardListProps = WatchModelCardProps[]