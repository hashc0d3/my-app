import type { AppConfig, Step4Config, Step4SectionConfig } from "@/src/shared/types/AppConfigTypes";
import type { PhoneCaseConfig } from "@/src/shared/types/PhoneCaseConfigTypes";
import { defaultConfig } from "@/src/entities/app-config";
import { normalizePhoneCaseConfig } from "@/src/shared/lib/phoneCaseConfig";

const createWristStep4Section = (): Step4SectionConfig => ({
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
});

const isWristStep4Section = (section: Step4SectionConfig): boolean =>
  section.id === "step4-card-wrist" ||
  section.id.startsWith("step4-card-wrist-") ||
  section.title?.trim()?.toLowerCase() === "обхват запястья";

const makeDefaultStep4Sections = (): Step4SectionConfig[] => [
  createWristStep4Section(),
  {
    id: `step4-card-initials-${Date.now()}`,
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
    id: `step4-card-engraving-${Date.now() + 1}`,
    title: "Гравировка",
    description: "",
    price: 990,
    ctaLabel: "Добавить к заказу",
    image: "",
    imageDescription: "",
    options: [],
    methodLabel: "",
    methodColorIds: [],
    placementLabel: "",
    placementOptions: [],
    inputLabel: "",
    inputInfoLabel: "",
    inputPlaceholder: ""
  },
  {
    id: `step4-card-package-${Date.now() + 2}`,
    title: "Подарочная упаковка",
    description: "",
    price: 290,
    ctaLabel: "Добавить к заказу",
    image: "",
    imageDescription: "",
    options: [],
    methodLabel: "",
    methodColorIds: [],
    placementLabel: "",
    placementOptions: [],
    inputLabel: "",
    inputInfoLabel: "",
    inputPlaceholder: ""
  }
];

const normalizeStep4Sections = (sections?: Step4SectionConfig[]): Step4SectionConfig[] => {
  const defaults = makeDefaultStep4Sections();
  const safeSections = Array.isArray(sections) ? sections : [];

  if (!safeSections.length) {
    return defaults;
  }

  const defaultWrist = createWristStep4Section();
  const currentWrist = safeSections.find(isWristStep4Section);
  const otherSections = safeSections.filter((section) => !isWristStep4Section(section));

  const wristSection: Step4SectionConfig = currentWrist
    ? {
        ...defaultWrist,
        ...currentWrist,
        id: "step4-card-wrist",
        options: Array.isArray(currentWrist.options) ? currentWrist.options : []
      }
    : defaultWrist;

  return [wristSection, ...otherSections];
};

/** Нормализация step4 для форм и превью (как во вкладках админки). */
export const resolveStep4 = (step4?: Step4Config): Required<Step4Config> => ({
  title: step4?.title ?? "",
  description: step4?.description ?? "",
  ctaLabel: step4?.ctaLabel ?? "",
  readyDate: step4?.readyDate ?? "",
  readyDateNote: step4?.readyDateNote ?? "",
  sections: normalizeStep4Sections(step4?.sections)
});

/**
 * Тот же merge, что при загрузке админки: phoneCase + colorLibrary + step4 из API.
 * Нужен и на витрине, чтобы данные вкладки «Чехлы» совпадали с сохранёнными в БД.
 */
export function mergeAppConfig(base: AppConfig, incoming: Partial<AppConfig>): AppConfig {
  const incomingStep4 = incoming.step4;
  const apiSections = incomingStep4?.sections;
  const baseSections = base.step4?.sections ?? [];
  const mergedSections = normalizeStep4Sections(
    Array.isArray(apiSections) ? apiSections : baseSections
  );
  return {
    ...base,
    ...incoming,
    colorLibrary: Array.isArray(incoming.colorLibrary) ? incoming.colorLibrary : base.colorLibrary ?? [],
    phoneCase: normalizePhoneCaseConfig(
      (incoming.phoneCase
        ? { ...(base.phoneCase ?? defaultConfig.phoneCase), ...incoming.phoneCase }
        : base.phoneCase ?? defaultConfig.phoneCase) as Partial<PhoneCaseConfig> & Record<string, unknown>
    ),
    titleStepSection: {
      ...base.titleStepSection,
      ...incoming.titleStepSection
    },
    step4: {
      ...base.step4,
      ...incoming.step4,
      sections: mergedSections
    }
  };
}
