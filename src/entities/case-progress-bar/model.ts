import { action, computed, makeObservable, observable } from "mobx";
import { caseConfiguratorStore } from "@/src/entities/case-configurator";
import { CASE_CONFIG_STEPS, isStepInRange } from "@/src/shared/config/steps";

function maxAllowedStep(): number {
  return caseConfiguratorStore.isBasisComplete ? CASE_CONFIG_STEPS.max : CASE_CONFIG_STEPS.initial;
}

class CaseProgressBarStore {
  @observable currentStep = CASE_CONFIG_STEPS.initial;

  constructor() {
    makeObservable(this);
  }

  @computed get maxStep(): number {
    return maxAllowedStep();
  }

  @action setCurrentStep = (step: number) => {
    if (isStepInRange(step, CASE_CONFIG_STEPS.min, CASE_CONFIG_STEPS.max)) {
      const allowed = maxAllowedStep();
      this.currentStep = Math.min(step, allowed);
    }
  };

  @action onSwitchStep = (step: number) => {
    const allowed = maxAllowedStep();
    this.currentStep = Math.min(step, allowed);
  };

  @action onNextStep = (step: number) => {
    if (step === CASE_CONFIG_STEPS.max) return;
    this.currentStep = step + 1;
  };

  @action onPrevStep = (step: number) => {
    if (step === CASE_CONFIG_STEPS.min) return;
    this.currentStep = step - 1;
  };
}

export default new CaseProgressBarStore();
