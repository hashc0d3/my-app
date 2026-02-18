import { action, makeObservable, observable } from 'mobx';

class ProgressBarStore {
    @observable currentStep: number;

    constructor() {
        makeObservable(this);
        this.currentStep = 1;
    }

    @action onSwitchStep = (currentStep: number) => {
        this.currentStep = currentStep;
    }

    @action onNextStep = (currentStep: number) => {
        if (currentStep === 4) return;
        this.currentStep = currentStep + 1;
    }

    @action onPrevStep = (currentStep: number) => {
        if (currentStep === 1) return;
        this.currentStep = currentStep - 1;
    }
}

export default new ProgressBarStore();