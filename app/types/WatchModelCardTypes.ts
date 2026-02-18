export interface WatchModelCardColorProps {
    hex: string,
    name: string
}

export interface WatchModelCardProps {
    id: number,
    image: string,
    name: string,
    sizes: number[],
    colors?: WatchModelCardColorProps[]
}

export type WatchModelCardListProps = WatchModelCardProps[]