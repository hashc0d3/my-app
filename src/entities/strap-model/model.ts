import { action, computed, makeObservable, observable } from 'mobx';
import {StrapModelsProps} from "@/shared/types/StrapModelsTypes";
import { strapModel as staticStrapModels } from "@/shared/lib/strapModel";

const STORAGE_KEY = "my-app/strap-model";

class StrapModelStore {
    strapModels: StrapModelsProps[] = [];
    currentStrap: number | null;
    selectedStrapName: string | null;
    selectedStrapPrice: number | null;

    constructor() {
        this.currentStrap = null;
        this.selectedStrapName = null;
        this.selectedStrapPrice = null;
        makeObservable(this, {
            strapModels: observable,
            currentStrap: observable,
            selectedStrapName: observable,
            selectedStrapPrice: observable,
            isConfigurationComplete: computed,
            configurationMessage: computed,
            setCurrentStrap: action,
            setStrapModels: action,
            resetSelection: action
        });
        this.setStrapModels(staticStrapModels);
        this.scheduleHydrateFromStorage();
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

    private scheduleHydrateFromStorage = () => {
        queueMicrotask(() => {
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
        });
    };

    get isConfigurationComplete(): boolean {
        return (
            this.currentStrap !== null
        );
    }

    get configurationMessage(): string {
        if (this.currentStrap === null) {
            return 'Выберите модель';
        }
        return 'Все параметры выбраны';
    }

    setCurrentStrap = (currentStrap: number | null, strapName: string, strapPrice: number) => {
        this.currentStrap = currentStrap;
        this.selectedStrapName = strapName;
        this.selectedStrapPrice = strapPrice;
        this.saveState();
    }

    setStrapModels = (models: StrapModelsProps[]) => {
        this.strapModels = models;
    }

    resetSelection = () => {
        this.currentStrap = null;
        this.selectedStrapName = null;
        this.selectedStrapPrice = null;
        this.saveState();
    };
}

export default new StrapModelStore();