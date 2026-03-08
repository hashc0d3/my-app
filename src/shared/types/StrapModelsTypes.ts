import type { StrapConfig } from "@/src/shared/types/StrapConfigTypes";

export interface StrapModelsProps {
    id: number;
    image: string;
    name: string;
    price: number;
    description: string;
    available: number[];
    step3Config?: StrapConfig;
}