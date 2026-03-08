import { action, makeObservable, observable } from "mobx";
import type { AppConfig } from "@/src/shared/types/AppConfigTypes";

const defaultConfig: AppConfig = {
  titleStepSection: {
    title: "",
    highlight: ""
  },
  watchModels: [],
  strapModels: [],
  strapConfig: {
    strapTypes: []
  },
  colorLibrary: [],
  promoCodes: [],
  step4: {
    title: "Итого",
    description: "",
    ctaLabel: "Добавить в корзину",
    readyDate: "",
    readyDateNote: "",
    sections: [
      {
        id: "step4-card-wrist",
        title: "Обхват запястья",
        description: "",
        price: 0,
        ctaLabel: "",
        image: "",
        video: "",
        downloadLinkText: "",
        downloadLinkUrl: "",
        options: [],
        placementLabel: "Выберите обхват запястья"
      },
      {
        id: "step4-card-initials",
        title: "Тиснение инициалов",
        description: "Они наносятся специальными литерами и создают изящный рельеф на коже.",
        price: 390,
        ctaLabel: "Добавить к заказу",
        image: "",
        imageDescription: "Пример тиснения внутри ремешка",
        options: [],
        methodLabel: "Как нанести инициалы?",
        methodColorIds: [],
        placementLabel: "Где нанести инициалы?",
        placementOptions: ["Снаружи", "Внутри"],
        inputLabel: "Текст инициалов",
        inputInfoLabel: "До 3 символов, только верхний регистр",
        inputPlaceholder: "В.Л"
      },
      {
        id: "step4-card-engraving",
        title: "Гравировка",
        description: "",
        price: 990,
        ctaLabel: "Добавить к заказу",
        image: "",
        options: [],
        methodLabel: "Шрифт гравировки",
        methodColorIds: [],
        placementLabel: "Шрифт гравировки",
        placementOptions: ["Calligro", "Harmonia", "Proxima"],
        inputLabel: "Текст надписи",
        inputInfoLabel: "",
        inputPlaceholder: "Верь в себя",
        inputMaxLength: 20,
        inputNote:
          "После оплаты заказа мы свяжемся с вами для уточнения деталей и согласования внешнего вида гравировки в виде предварительного рендера."
      },
      {
        id: "step4-card-package",
        title: "Подарочная упаковка",
        description: "Стильная коробочка из бархатистой бумаги с репсовой лентой и небольшой открыткой.",
        price: 390,
        ctaLabel: "Добавить к заказу",
        image: "",
        imageDescription: "",
        options: [],
        methodLabel: "Цвет ленточки",
        methodColorIds: [],
        placementLabel: "",
        placementOptions: [],
        inputLabel: "Текст для открытки",
        inputInfoLabel: "",
        inputPlaceholder:
          "Поздравляю с днем рождения! Желаю всего самого светлого. Мы тебя любим и ценим",
        inputMaxLength: 150
      }
    ]
  }
};

class AppConfigStore {
  @observable config: AppConfig;

  constructor() {
    makeObservable(this);
    this.config = defaultConfig;
  }

  @action setConfig = (partial: Partial<AppConfig>) => {
    this.config = {
      ...this.config,
      ...partial,
      titleStepSection: {
        ...this.config.titleStepSection,
        ...partial.titleStepSection
      },
      step4: {
        ...this.config.step4,
        ...partial.step4
      }
    };
  };
}

const appConfigStore = new AppConfigStore();

export { defaultConfig };
export default appConfigStore;
