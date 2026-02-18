import { action, computed, makeObservable, observable } from 'mobx';
import {WatchModelCardColorProps, WatchModelCardProps} from "@/app/types/WatchModelCardTypes";

class WatchModelStore {
    @observable currentCard: number;
    @observable selectedColor: WatchModelCardColorProps | null;
    @observable selectedSize: number | null;
    @observable watchModels: WatchModelCardProps[];

    constructor() {
        makeObservable(this);
        this.currentCard = 0;
        this.selectedColor = null;
        this.selectedSize = null;
        this.watchModels = [];
    }

    @computed get isConfigurationComplete(): boolean {
        return (
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

    @action setCurrentCard = (currentCard: number) => {
        this.selectedColor = null;
        this.selectedSize = null;
        this.currentCard = currentCard;
    }

    @action setSelectedColor = (color: WatchModelCardColorProps | null) => {
        this.selectedColor = color;
    }

    @action setSelectedSize = (size: number, currentCard: number) => {
        this.selectedColor = null;
        this.currentCard = currentCard;
        this.selectedSize = size;
    }

    @action setWatchModels = (models: WatchModelCardProps[]) => {
        this.watchModels = models;
    }
}

export default new WatchModelStore();