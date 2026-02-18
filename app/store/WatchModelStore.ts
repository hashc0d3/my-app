import { action, makeObservable, observable } from 'mobx';
import {WatchModelCardColorProps, WatchModelCardProps} from "@/app/types/WatchModelCardTypes";

class WatchModelStore {
    @observable currentCard: number;
    @observable selectedColor: string | null;
    @observable selectedSize: number | null;
    @observable watchModels: WatchModelCardProps[];

    constructor() {
        makeObservable(this);
        this.currentCard = 0;
        this.selectedColor = null;
        this.selectedSize = null;
        this.watchModels = [];
    }

    @action setCurrentCard = (currentCard: number) => {
        this.selectedColor = null;
        this.selectedSize = null;
        this.currentCard = currentCard;
    }

    @action setSelectedColor = (color: string) => {
        this.selectedColor = color;
    }

    @action setSelectedSize = (size: number) => {
        this.selectedSize = size;
    }

    @action setWatchModels = (models: WatchModelCardProps[]) => {
        this.watchModels = models;
    }
}

export default new WatchModelStore();