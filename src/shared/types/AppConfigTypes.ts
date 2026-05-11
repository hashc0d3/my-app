import type { StrapConfig } from "@/src/shared/types/StrapConfigTypes";
import type { StrapModelsProps } from "@/shared/types/StrapModelsTypes";
import type { TitleStepSectionTypes } from "@/src/shared/types/TitleStepSectionTypes";
import type { WatchModelCardProps } from "@/src/shared/types/WatchModelCardTypes";
import type { PhoneCaseConfig } from "@/src/shared/types/PhoneCaseConfigTypes";

export type ColorLibraryItem = {
  id: string;
  name: string;
  hex: string;
};

export type Step4OptionConfig = {
  id: string;
  label: string;
  price: number;
};

export type PromoCodeConfig = {
  id: string;
  code: string;
  type: "amount" | "percent";
  value: number;
  remainingUses: number;
};

export type Step4SectionConfig = {
  id: string;
  title: string;
  description: string;
  price: number;
  ctaLabel: string;
  image: string;
  video?: string;
  imageDescription?: string;
  downloadLinkText?: string;
  downloadLinkUrl?: string;
  options: Step4OptionConfig[];
  methodLabel?: string;
  methodColorIds?: string[];
  placementLabel?: string;
  placementOptions?: string[];
  inputLabel?: string;
  inputInfoLabel?: string;
  inputPlaceholder?: string;
  inputMaxLength?: number;
  inputNote?: string;
};

export type Step4Config = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  readyDate?: string;
  readyDateNote?: string;
  sections?: Step4SectionConfig[];
};

export type AppConfig = {
  titleStepSection: TitleStepSectionTypes;
  watchModels: WatchModelCardProps[];
  strapModels: StrapModelsProps[];
  strapConfig: StrapConfig;
  colorLibrary?: ColorLibraryItem[];
  promoCodes?: PromoCodeConfig[];
  step4?: Step4Config;
  /** Конструктор чехлов iPhone (модели и превью); цвета — colorLibrary */
  phoneCase?: PhoneCaseConfig;
};
