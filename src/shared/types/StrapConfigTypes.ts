export type StrapView = 'front' | 'side' | 'back';

export type BuckleVariant = 'standard' | 'butterfly';

export interface StrapLayersByView {
  front: string;
  side: string;
  back: string;
}

export interface StrapDefaultImages {
  front: string;
  side: string;
  back: string;
}

export interface StrapDefaultByWatchColor {
  watchColorName: string;
  watchColorHex: string;
  layers: StrapDefaultImages;
}

export interface StrapLeatherColorOption {
  id: string;
  label: string;
  hex: string;
  isHidden?: boolean;
  layers: StrapLayersByView;
}

export interface StrapEdgeTypeOption {
  id: string;
  label: string;
  hex?: string;
  isHidden?: boolean;
  layers: StrapLayersByView;
}

export interface StrapStitchTypeOption {
  id: string;
  label: string;
  hex?: string;
  isHidden?: boolean;
  layers: StrapLayersByView;
}

export interface StrapLeatherTypeOption {
  id: string;
  label: string;
  price?: number;
  isHidden?: boolean;
  leatherColors: StrapLeatherColorOption[];
  edgeTypes: StrapEdgeTypeOption[];
  stitchTypes: StrapStitchTypeOption[];
}

export interface StrapBuckleColorLayers {
  standard: StrapLayersByView;
  butterfly: StrapLayersByView;
}

export interface StrapBuckleColorOption {
  id: string;
  label: string;
  hex: string;
  isHidden?: boolean;
  layers: StrapBuckleColorLayers;
  /** Три фото для отображения при выборе в фильтрах (front, side, back) */
  filterDisplay?: StrapLayersByView;
}

export interface StrapBuckleColorsConfig {
  hasButterfly: boolean;
  options: StrapBuckleColorOption[];
}

export interface StrapAdapterColorOption {
  id: string;
  label: string;
  hex: string;
  isHidden?: boolean;
  layers: StrapLayersByView;
  /** Изображение для отображения в фильтрах (как выглядит адаптер) */
  filterDisplayImage?: string;
}

export interface StrapTypeConfig {
  id: string;
  label: string;
  step3Description: string;
  defaultImages: StrapDefaultImages;
  defaultByWatchColor?: StrapDefaultByWatchColor[];
  leatherTypes: StrapLeatherTypeOption[];
  buckleColors: StrapBuckleColorsConfig;
  adapterColors: StrapAdapterColorOption[];
}

export interface StrapConfig {
  strapTypes: StrapTypeConfig[];
}
