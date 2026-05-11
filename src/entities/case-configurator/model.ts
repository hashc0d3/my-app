import { action, computed, makeObservable, observable } from "mobx";
import { appConfigStore } from "@/src/entities/app-config";
import type { PhoneCaseFormType } from "@/src/shared/types/PhoneCaseConfigTypes";

class CaseConfiguratorStore {
  @observable iphoneModelId: string | null = null;
  @observable formTypeId: string | null = null;
  @observable outsideColorId: string | null = null;
  @observable insideColorId: string | null = null;
  @observable personalizationNote = "";

  constructor() {
    makeObservable(this);
  }

  @computed get phoneCaseConfig() {
    return appConfigStore.config.phoneCase;
  }

  @computed get effectiveFormTypeId(): string | null {
    const types = this.phoneCaseConfig?.formTypes ?? [];
    if (!types.length) return null;
    if (this.formTypeId && types.some((t) => t.id === this.formTypeId)) {
      return this.formTypeId;
    }
    return types[0]?.id ?? null;
  }

  @computed get selectedFormType(): PhoneCaseFormType | null {
    const id = this.effectiveFormTypeId;
    if (!id) return null;
    return this.phoneCaseConfig?.formTypes?.find((t) => t.id === id) ?? null;
  }

  @computed get caseUnitPrice(): number {
    return this.selectedFormType?.price ?? 0;
  }

  @computed get selectedModelLabel(): string | null {
    const models = this.phoneCaseConfig?.iphoneModels ?? [];
    const m = models.find((x) => x.id === this.iphoneModelId);
    return m?.label ?? null;
  }

  @computed get isBasisComplete(): boolean {
    const ft = this.selectedFormType;
    if (!this.iphoneModelId || !ft || !this.outsideColorId || !this.insideColorId) {
      return false;
    }
    if (!ft.outsideVariants.length || !ft.insideVariants.length) {
      return false;
    }
    return (
      ft.outsideVariants.some((v) => v.colorId === this.outsideColorId) &&
      ft.insideVariants.some((v) => v.colorId === this.insideColorId)
    );
  }

  @computed get configurationMessage(): string {
    if (!this.selectedFormType) return "Добавьте тип формы чехла в админке";
    if (!this.iphoneModelId) return "Выберите модель iPhone";
    const ft = this.selectedFormType;
    if (ft.outsideVariants.length === 0) return "Для этого типа формы не заданы цвета снаружи в админке";
    if (!this.outsideColorId) return "Выберите цвет снаружи";
    if (ft.insideVariants.length === 0) return "Для этого типа формы не заданы цвета внутри в админке";
    if (!this.insideColorId) return "Выберите цвет внутри";
    return "";
  }

  @action setIphoneModelId = (id: string | null) => {
    this.iphoneModelId = id;
  };

  @action setFormTypeId = (id: string | null) => {
    this.formTypeId = id;
    this.outsideColorId = null;
    this.insideColorId = null;
  };

  @action setOutsideColorId = (id: string | null) => {
    this.outsideColorId = id;
  };

  @action setInsideColorId = (id: string | null) => {
    this.insideColorId = id;
  };

  @action setPersonalizationNote = (value: string) => {
    this.personalizationNote = value;
  };

  @action reset = () => {
    this.iphoneModelId = null;
    this.formTypeId = null;
    this.outsideColorId = null;
    this.insideColorId = null;
    this.personalizationNote = "";
  };
}

export default new CaseConfiguratorStore();
