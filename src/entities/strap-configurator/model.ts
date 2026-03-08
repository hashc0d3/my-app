import { action, computed, makeObservable, observable } from 'mobx';
import { strapConfig } from '@/src/shared/config/strapConfig';
import {
  BuckleVariant,
  StrapAdapterColorOption,
  StrapBuckleColorOption,
  StrapConfig,
  StrapEdgeTypeOption,
  StrapLeatherColorOption,
  StrapLeatherTypeOption,
  StrapStitchTypeOption,
  StrapTypeConfig,
  StrapView,
} from '@/src/shared/types/StrapConfigTypes';

const STORAGE_KEY = "my-app/strap-configurator";

/** Ключи фильтров шага 3 для подсветки незаполненного блока */
export type Step3FilterKey =
  | "leatherType"
  | "leatherColor"
  | "edge"
  | "stitch"
  | "buckle"
  | "adapter";

interface CurrentSelectionConfig {
  strapType: StrapTypeConfig;
  leatherType: StrapLeatherTypeOption;
  leatherColor: StrapLeatherColorOption;
  edgeType: StrapEdgeTypeOption;
  stitchType: StrapStitchTypeOption;
  buckleColor: StrapBuckleColorOption;
  adapterColor: StrapAdapterColorOption;
}

class StrapConfiguratorStore {
  @observable selectedStrapTypeId: string | null;
  @observable selectedLeatherTypeId: string | null;
  @observable selectedLeatherColorId: string | null;
  @observable selectedEdgeTypeId: string | null;
  @observable selectedStitchTypeId: string | null;
  @observable selectedBuckleColorId: string | null;
  @observable selectedBuckleVariant: BuckleVariant;
  @observable selectedAdapterColorId: string | null;
  @observable activeView: StrapView;
  @observable config: StrapConfig;
  @observable preferredDefaultColorHex: string | null;
  @observable highlightFilterKey: Step3FilterKey | null;

  constructor() {
    makeObservable(this);
    this.config = strapConfig;
    this.selectedStrapTypeId = null;
    this.selectedLeatherTypeId = null;
    this.selectedLeatherColorId = null;
    this.selectedEdgeTypeId = null;
    this.selectedStitchTypeId = null;
    this.selectedBuckleColorId = null;
    this.selectedBuckleVariant = 'standard';
    this.selectedAdapterColorId = null;
    this.activeView = 'front';
    this.preferredDefaultColorHex = null;
    this.highlightFilterKey = null;
    this.hydrateState();
  }

  private saveState = () => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedStrapTypeId: this.selectedStrapTypeId,
        selectedLeatherTypeId: this.selectedLeatherTypeId,
        selectedLeatherColorId: this.selectedLeatherColorId,
        selectedEdgeTypeId: this.selectedEdgeTypeId,
        selectedStitchTypeId: this.selectedStitchTypeId,
        selectedBuckleColorId: this.selectedBuckleColorId,
        selectedBuckleVariant: this.selectedBuckleVariant,
        selectedAdapterColorId: this.selectedAdapterColorId,
        activeView: this.activeView
      })
    );
  };

  private hydrateState = () => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        selectedStrapTypeId?: string | null;
        selectedLeatherTypeId?: string | null;
        selectedLeatherColorId?: string | null;
        selectedEdgeTypeId?: string | null;
        selectedStitchTypeId?: string | null;
        selectedBuckleColorId?: string | null;
        selectedBuckleVariant?: BuckleVariant;
        selectedAdapterColorId?: string | null;
        activeView?: StrapView;
      };
      this.selectedStrapTypeId = parsed.selectedStrapTypeId ?? null;
      this.selectedLeatherTypeId = parsed.selectedLeatherTypeId ?? null;
      this.selectedLeatherColorId = parsed.selectedLeatherColorId ?? null;
      this.selectedEdgeTypeId = parsed.selectedEdgeTypeId ?? null;
      this.selectedStitchTypeId = parsed.selectedStitchTypeId ?? null;
      this.selectedBuckleColorId = parsed.selectedBuckleColorId ?? null;
      this.selectedBuckleVariant = parsed.selectedBuckleVariant ?? 'standard';
      this.selectedAdapterColorId = parsed.selectedAdapterColorId ?? null;
      this.activeView = parsed.activeView ?? 'front';
    } catch {
      // ignore broken localStorage value
    }
  };

  @action resetSelection = () => {
    this.selectedStrapTypeId = null;
    this.selectedLeatherTypeId = null;
    this.selectedLeatherColorId = null;
    this.selectedEdgeTypeId = null;
    this.selectedStitchTypeId = null;
    this.selectedBuckleColorId = null;
    this.selectedBuckleVariant = 'standard';
    this.selectedAdapterColorId = null;
    this.activeView = 'front';
    this.preferredDefaultColorHex = null;
    this.saveState();
  };

  @computed get strapTypes(): StrapTypeConfig[] {
    return this.config.strapTypes;
  }

  @computed get currentStrapType(): StrapTypeConfig | null {
    if (!this.selectedStrapTypeId) {
      return null;
    }

    return this.strapTypes.find((type) => type.id === this.selectedStrapTypeId) ?? null;
  }

  @computed get currentLeatherType(): StrapLeatherTypeOption | null {
    if (!this.currentStrapType || !this.selectedLeatherTypeId) {
      return null;
    }

    return (
      this.currentStrapType.leatherTypes.find((type) => type.id === this.selectedLeatherTypeId) ?? null
    );
  }

  @computed get isConfigurationComplete(): boolean {
    return Boolean(
      this.selectedStrapTypeId &&
        this.selectedLeatherTypeId &&
        this.selectedLeatherColorId &&
        this.selectedEdgeTypeId &&
        this.selectedStitchTypeId &&
        this.selectedBuckleColorId &&
        this.selectedAdapterColorId
    );
  }

  @computed get configurationMessage(): string {
    if (!this.selectedLeatherTypeId) {
      return 'Выберите тип кожи';
    }
    if (!this.selectedLeatherColorId) {
      return 'Выберите цвет кожи';
    }
    if (!this.selectedEdgeTypeId) {
      return 'Выберите тип края';
    }
    if (!this.selectedStitchTypeId) {
      return 'Выберите тип строчки';
    }
    if (!this.selectedBuckleColorId) {
      return 'Выберите цвет пряжки';
    }
    if (!this.selectedAdapterColorId) {
      return 'Выберите цвет адаптера';
    }

    return 'Все параметры ремешка выбраны';
  }

  @computed get missingFilterKey(): Step3FilterKey | null {
    if (!this.selectedLeatherTypeId) return 'leatherType';
    if (!this.selectedLeatherColorId) return 'leatherColor';
    if (!this.selectedEdgeTypeId) return 'edge';
    if (!this.selectedStitchTypeId) return 'stitch';
    if (!this.selectedBuckleColorId) return 'buckle';
    if (!this.selectedAdapterColorId) return 'adapter';
    return null;
  }

  @action setHighlightFilterKey = (key: Step3FilterKey | null) => {
    this.highlightFilterKey = key;
  };

  @action initializeFromStrapType = (strapTypeId: string) => {
    const nextStrapType =
      this.strapTypes.find((type) => type.id === strapTypeId) ??
      this.strapTypes[0] ??
      null;

    if (!nextStrapType) {
      return;
    }

    const firstVisibleLeatherType =
      nextStrapType.leatherTypes.find((item) => !item.isHidden) ??
      nextStrapType.leatherTypes[0] ??
      null;

    // На шаге 3 изначально применяется только тип кожи; остальные фильтры пользователь выбирает сам.
    this.selectedStrapTypeId = nextStrapType.id;
    this.selectedLeatherTypeId = firstVisibleLeatherType?.id ?? null;
    this.selectedLeatherColorId = null;
    this.selectedEdgeTypeId = null;
    this.selectedStitchTypeId = null;
    this.selectedBuckleColorId = null;
    this.selectedBuckleVariant = 'standard';
    this.selectedAdapterColorId = null;
    this.activeView = 'front';
    this.highlightFilterKey = null;
    this.saveState();
  };

  @action setConfig = (config: StrapConfig) => {
    this.config = config;
    const type = this.strapTypes.find((item) => item.id === this.selectedStrapTypeId) ?? null;
    if (!type) {
      this.selectedStrapTypeId = null;
      this.selectedLeatherTypeId = null;
      this.selectedLeatherColorId = null;
      this.selectedEdgeTypeId = null;
      this.selectedStitchTypeId = null;
      this.selectedBuckleColorId = null;
      this.selectedAdapterColorId = null;
      this.selectedBuckleVariant = 'standard';
      this.activeView = 'front';
      this.saveState();
      return;
    }

    const leatherType = type.leatherTypes.find((item) => item.id === this.selectedLeatherTypeId) ?? null;
    if (!leatherType) {
      this.selectedLeatherTypeId = null;
      this.selectedLeatherColorId = null;
      this.selectedEdgeTypeId = null;
      this.selectedStitchTypeId = null;
    } else {
      if (!leatherType.leatherColors.some((item) => item.id === this.selectedLeatherColorId)) {
        this.selectedLeatherColorId = null;
      }
      if (!leatherType.edgeTypes.some((item) => item.id === this.selectedEdgeTypeId)) {
        this.selectedEdgeTypeId = null;
      }
      if (!leatherType.stitchTypes.some((item) => item.id === this.selectedStitchTypeId)) {
        this.selectedStitchTypeId = null;
      }
    }

    if (!type.buckleColors.options.some((item) => item.id === this.selectedBuckleColorId)) {
      this.selectedBuckleColorId = null;
    }
    if (!type.adapterColors.some((item) => item.id === this.selectedAdapterColorId)) {
      this.selectedAdapterColorId = null;
    }
    if (this.selectedBuckleVariant === 'butterfly' && !type.buckleColors.hasButterfly) {
      this.selectedBuckleVariant = 'standard';
    }
    this.saveState();
  };

  @action setPreferredDefaultColorHex = (hex: string | null) => {
    this.preferredDefaultColorHex = hex;
  };

  @action setActiveView = (view: StrapView) => {
    this.activeView = view;
    this.saveState();
  };

  @action setLeatherType = (leatherTypeId: string) => {
    if (!this.currentStrapType) {
      return;
    }

    const nextLeatherType =
      this.currentStrapType.leatherTypes.find((type) => type.id === leatherTypeId) ?? null;
    if (!nextLeatherType) {
      return;
    }

    if (this.highlightFilterKey === 'leatherType') this.highlightFilterKey = null;
    this.selectedLeatherTypeId = nextLeatherType.id;
    const firstVisibleEdgeType =
      nextLeatherType.edgeTypes.find((item) => !item.isHidden) ??
      nextLeatherType.edgeTypes[0] ??
      null;
    const firstVisibleStitchType =
      nextLeatherType.stitchTypes.find((item) => !item.isHidden) ??
      nextLeatherType.stitchTypes[0] ??
      null;

    // Цвет кожи выбирается пользователем вручную.
    this.selectedLeatherColorId = null;
    this.selectedEdgeTypeId = firstVisibleEdgeType?.id ?? null;
    this.selectedStitchTypeId = firstVisibleStitchType?.id ?? null;
    this.saveState();
  };

  @action setLeatherColor = (leatherColorId: string) => {
    if (this.highlightFilterKey === 'leatherColor') this.highlightFilterKey = null;
    this.selectedLeatherColorId = leatherColorId;
    this.saveState();
  };

  @action setEdgeType = (edgeTypeId: string) => {
    if (this.highlightFilterKey === 'edge') this.highlightFilterKey = null;
    this.selectedEdgeTypeId = edgeTypeId;
    this.saveState();
  };

  @action setStitchType = (stitchTypeId: string) => {
    if (this.highlightFilterKey === 'stitch') this.highlightFilterKey = null;
    this.selectedStitchTypeId = stitchTypeId;
    this.saveState();
  };

  @action setBuckleColor = (buckleColorId: string) => {
    if (this.highlightFilterKey === 'buckle') this.highlightFilterKey = null;
    this.selectedBuckleColorId = buckleColorId;
    this.saveState();
  };

  @action setBuckleVariant = (variant: BuckleVariant) => {
    if (variant === 'butterfly' && !this.currentStrapType?.buckleColors.hasButterfly) {
      this.selectedBuckleVariant = 'standard';
      this.saveState();
      return;
    }

    this.selectedBuckleVariant = variant;
    this.saveState();
  };

  @action setAdapterColor = (adapterColorId: string) => {
    if (this.highlightFilterKey === 'adapter') this.highlightFilterKey = null;
    this.selectedAdapterColorId = adapterColorId;
    this.saveState();
  };

  getCurrentConfig = (): CurrentSelectionConfig | null => {
    const strapType = this.currentStrapType;
    const leatherType = this.currentLeatherType;

    if (!strapType || !leatherType) {
      return null;
    }

    const leatherColor =
      leatherType.leatherColors.find((color) => color.id === this.selectedLeatherColorId) ?? null;
    const edgeType = leatherType.edgeTypes.find((edge) => edge.id === this.selectedEdgeTypeId) ?? null;
    const stitchType =
      leatherType.stitchTypes.find((stitch) => stitch.id === this.selectedStitchTypeId) ?? null;
    const buckleColor =
      strapType.buckleColors.options.find((color) => color.id === this.selectedBuckleColorId) ?? null;
    const adapterColor =
      strapType.adapterColors.find((color) => color.id === this.selectedAdapterColorId) ?? null;

    if (!leatherColor || !edgeType || !stitchType || !buckleColor || !adapterColor) {
      return null;
    }

    return {
      strapType,
      leatherType,
      leatherColor,
      edgeType,
      stitchType,
      buckleColor,
      adapterColor,
    };
  };

  getLayersByView = (view: StrapView): string[] => {
    const strapType = this.currentStrapType;
    if (!strapType) {
      return [];
    }

    // Базовый слой — fallback default; остальные слои только если фильтр выбран.
    const leatherType = this.currentLeatherType;
    const leatherColor =
      leatherType?.leatherColors.find((c) => c.id === this.selectedLeatherColorId) ?? null;
    const edgeType = leatherType?.edgeTypes.find((e) => e.id === this.selectedEdgeTypeId) ?? null;
    const stitchType =
      leatherType?.stitchTypes.find((s) => s.id === this.selectedStitchTypeId) ?? null;
    const buckleColor =
      strapType.buckleColors.options.find((b) => b.id === this.selectedBuckleColorId) ?? null;
    const adapterColor =
      strapType.adapterColors.find((a) => a.id === this.selectedAdapterColorId) ?? null;

    const layers = [strapType.defaultImages[view]];
    if (leatherColor?.layers?.[view]) layers.push(leatherColor.layers[view]);
    if (edgeType?.layers?.[view]) layers.push(edgeType.layers[view]);
    if (stitchType?.layers?.[view]) layers.push(stitchType.layers[view]);
    if (buckleColor?.layers?.[this.selectedBuckleVariant]?.[view]) {
      layers.push(buckleColor.layers[this.selectedBuckleVariant][view]);
    }
    if (adapterColor?.layers?.[view]) layers.push(adapterColor.layers[view]);
    return layers;
  };

  getActiveLayers = (): string[] => {
    return this.getLayersByView(this.activeView);
  };
}

const strapConfiguratorStore = new StrapConfiguratorStore();

export default strapConfiguratorStore;
