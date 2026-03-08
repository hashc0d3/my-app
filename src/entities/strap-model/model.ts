import { action, computed, makeObservable, observable } from 'mobx';
import {StrapModelsProps} from "@/shared/types/StrapModelsTypes";

const STORAGE_KEY = "my-app/strap-model";

class StrapModelStore {
    @observable strapModels: StrapModelsProps[];
    @observable currentStrap: number | null;
    @observable selectedStrapName: string | null;
    @observable selectedStrapPrice: number | null;

    constructor() {
        makeObservable(this);
        this.strapModels = [];
        this.currentStrap = null;
        this.selectedStrapName = null;
        this.selectedStrapPrice = null;
        this.hydrateState();
    }

    private saveState = () => {
        if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                currentStrap: this.currentStrap,
                selectedStrapName: this.selectedStrapName,
                selectedStrapPrice: this.selectedStrapPrice
            })
        );
    };

    private hydrateState = () => {
        if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as {
                currentStrap?: number | null;
                selectedStrapName?: string | null;
                selectedStrapPrice?: number | null;
            };
            this.currentStrap = parsed.currentStrap ?? null;
            this.selectedStrapName = parsed.selectedStrapName ?? null;
            this.selectedStrapPrice = parsed.selectedStrapPrice ?? null;
        } catch {
            // ignore broken localStorage value
        }
    };

    @computed get isConfigurationComplete(): boolean {
        return (
            this.currentStrap !== null
        );
    }

    @computed get configurationMessage(): string {
        if (this.currentStrap === null) {
            return 'Выберите модель';
        }
        return 'Все параметры выбраны';
    }

    @action setCurrentStrap = (currentStrap: number | null, strapName: string, strapPrice: number) => {
        this.currentStrap = currentStrap;
        this.selectedStrapName = strapName;
        this.selectedStrapPrice = strapPrice;
        this.saveState();
    }

    @action setStrapModels = (models: StrapModelsProps[]) => {
        this.strapModels = models;
    }

    @action resetSelection = () => {
        this.currentStrap = null;
        this.selectedStrapName = null;
        this.selectedStrapPrice = null;
        this.saveState();
    };
}

export default new StrapModelStore();