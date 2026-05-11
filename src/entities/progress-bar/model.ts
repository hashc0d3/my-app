import { action, makeObservable, observable } from 'mobx';
import { watchModelStore } from '@/src/entities/watch-model';
import { strapModelStore } from '@/src/entities/strap-model';
import { strapConfiguratorStore } from '@/src/entities/strap-configurator';
import { isStepInRange, WATCH_CONFIG_STEPS } from '@/src/shared/config/steps';

function getMaxAllowedStep(): number {
    let allowed: number = WATCH_CONFIG_STEPS.initial;
    if (watchModelStore.isConfigurationComplete) allowed = 2;
    if (allowed === 2 && strapModelStore.isConfigurationComplete) allowed = 3;
    if (allowed === 3 && strapConfiguratorStore.isConfigurationComplete) allowed = WATCH_CONFIG_STEPS.max;
    return allowed;
}

class ProgressBarStore {
    currentStep: number;

    constructor() {
        this.currentStep = WATCH_CONFIG_STEPS.initial;
        makeObservable(this, {
            currentStep: observable,
            setCurrentStep: action,
            onSwitchStep: action,
            onNextStep: action,
            onPrevStep: action
        });
    }

    setCurrentStep = (step: number) => {
        if (isStepInRange(step, WATCH_CONFIG_STEPS.min, WATCH_CONFIG_STEPS.max)) {
            const maxAllowed = getMaxAllowedStep();
            this.currentStep = Math.min(step, maxAllowed);
        }
    }

    onSwitchStep = (currentStep: number) => {
        const maxAllowed = getMaxAllowedStep();
        this.currentStep = Math.min(currentStep, maxAllowed);
    }

    onNextStep = (currentStep: number) => {
        if (currentStep === WATCH_CONFIG_STEPS.max) return;
        this.currentStep = currentStep + 1;
    }

    onPrevStep = (currentStep: number) => {
        if (currentStep === WATCH_CONFIG_STEPS.min) return;
        this.currentStep = currentStep - 1;
    }
}

export default new ProgressBarStore();