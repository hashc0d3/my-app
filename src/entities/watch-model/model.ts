import { action, computed, makeObservable, observable } from 'mobx';
import {WatchModelCardColorProps, WatchModelCardProps} from "@/src/shared/types/WatchModelCardTypes";

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
    }

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
        this.selectedColor = null;
        this.selectedSize = null;
        this.currentCard = currentCard;
        this.selectedModel = selectedModel;
    }

    @action setSelectedColor = (color: WatchModelCardColorProps | null) => {
        this.selectedColor = color;
    }

    @action setSelectedSize = (size: number, currentCard: number, selectedModel: string) => {
        this.selectedColor = null;
        this.currentCard = currentCard;
        this.selectedModel = selectedModel;
        this.selectedSize = size;
    }

    @action setWatchModels = (models: WatchModelCardProps[]) => {
        this.watchModels = models;
    }
}

export default new WatchModelStore();