import { action, computed, makeObservable, observable } from 'mobx';
import {WatchModelCardColorProps, WatchModelCardProps} from "@/src/shared/types/WatchModelCardTypes";

const STORAGE_KEY = "my-app/watch-model";

class WatchModelStore {
    @observable currentCard: number;
    @observable selectedColor: WatchModelCardColorProps | null;
    @observable selectedSize: number | null;
    @observable selectedModel: string | null;
    @observable watchModels: WatchModelCardProps[];

    constructor() {
        makeObservable(this);
        this.currentCard = 0;
        this.selectedColor = null;
        this.selectedSize = null;
        this.selectedModel = null;
        this.watchModels = [];
        this.hydrateState();
    }

    private saveState = () => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                currentCard: this.currentCard,
                selectedColor: this.selectedColor,
                selectedSize: this.selectedSize,
                selectedModel: this.selectedModel
            })
        );
    };

    private hydrateState = () => {
        if (typeof window === "undefined") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as {
                currentCard?: number;
                selectedColor?: WatchModelCardColorProps | null;
                selectedSize?: number | null;
                selectedModel?: string | null;
            };
            this.currentCard = Number(parsed.currentCard ?? 0);
            this.selectedColor = parsed.selectedColor ?? null;
            this.selectedSize = parsed.selectedSize ?? null;
            this.selectedModel = parsed.selectedModel ?? null;
        } catch {
            // ignore broken localStorage value
        }
    };

    @computed get isConfigurationComplete(): boolean {
        return (
            this.selectedModel !== null &&
            this.selectedColor !== null &&
            this.selectedSize !== null &&
            this.watchModels.length > 0
        );
    }

    @computed get configurationMessage(): string {
        if (this.watchModels.length === 0) {
            return 'Выберите модель часов';
        }
        if (this.selectedSize === null) {
            return 'Выберите размер';
        }
        if (this.selectedColor === null) {
            return 'Выберите цвет';
        }
        return 'Все параметры выбраны';
    }

    @action setCurrentCard = (currentCard: number, selectedModel: string) => {
        this.currentCard = currentCard;
        this.selectedModel = selectedModel;
        const model = this.watchModels.find((m) => m.id === currentCard);
        this.selectedSize = model?.sizes?.[0] ?? null;
        this.selectedColor = model?.colors?.[0] ?? null;
        this.saveState();
    }

    @action setSelectedColor = (color: WatchModelCardColorProps | null) => {
        this.selectedColor = color;
        this.saveState();
    }

    @action setSelectedSize = (size: number, currentCard: number, selectedModel: string) => {
        this.selectedColor = null;
        this.currentCard = currentCard;
        this.selectedModel = selectedModel;
        this.selectedSize = size;
        this.saveState();
    }

    @action setWatchModels = (models: WatchModelCardProps[]) => {
        this.watchModels = models;
        if (models.length === 0) return;
        const current = models.find((m) => m.id === this.currentCard);
        const sizeValid = current?.sizes?.includes(this.selectedSize ?? -1);
        const colorValid = current?.colors?.some((c) => c.hex === this.selectedColor?.hex && c.name === this.selectedColor?.name);
        if (!current || !sizeValid || !colorValid) {
            const first = models[0];
            this.currentCard = first.id;
            this.selectedModel = first.model;
            this.selectedSize = first.sizes?.[0] ?? null;
            this.selectedColor = first.colors?.[0] ?? null;
        }
        this.saveState();
    }

    @action resetSelection = () => {
        this.currentCard = 0;
        this.selectedColor = null;
        this.selectedSize = null;
        this.selectedModel = null;
        this.saveState();
    };
}

export default new WatchModelStore();