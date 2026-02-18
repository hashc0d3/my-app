import { action, computed, makeObservable, observable } from 'mobx';
import {StrapModelsProps} from "@/shared/types/StrapModelsTypes";

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
    }

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
    }

    @action setStrapModels = (models: StrapModelsProps[]) => {
        this.strapModels = models;
    }
}

export default new StrapModelStore();