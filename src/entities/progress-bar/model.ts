import { action, makeObservable, observable } from 'mobx';
import { watchModelStore } from '@/src/entities/watch-model';
import { strapModelStore } from '@/src/entities/strap-model';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';

function getMaxAllowedStep(): number {
    let allowed = 1;
    if (watchModelStore.isConfigurationComplete) allowed = 2;
    if (allowed === 2 && strapModelStore.isConfigurationComplete) allowed = 3;
    if (allowed === 3 && strapConfiguratorStore.isConfigurationComplete) allowed = 4;
    return allowed;
}

class ProgressBarStore {
    @observable currentStep: number;

    constructor() {
        makeObservable(this);
        this.currentStep = 1;
    }

    @action setCurrentStep = (step: number) => {
        if (step >= 1 && step <= 4) {
            const maxAllowed = getMaxAllowedStep();
            this.currentStep = Math.min(step, maxAllowed);
        }
    }

    @action onSwitchStep = (currentStep: number) => {
        const maxAllowed = getMaxAllowedStep();
        this.currentStep = Math.min(currentStep, maxAllowed);
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