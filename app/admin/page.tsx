"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  AppConfig,
  ColorLibraryItem,
  PromoCodeConfig,
  Step4Config,
  Step4OptionConfig,
  Step4SectionConfig
} from "@/src/shared/types/AppConfigTypes";
import type {
  StrapAdapterColorOption,
  StrapBuckleColorOption,
  StrapConfig,
  StrapDefaultByWatchColor,
  StrapEdgeTypeOption,
  StrapLeatherColorOption,
  StrapLeatherTypeOption,
  StrapLayersByView,
  StrapStitchTypeOption,
  StrapTypeConfig
} from "@/src/shared/types/StrapConfigTypes";
import type { WatchModelCardProps } from "@/src/shared/types/WatchModelCardTypes";
import type { StrapModelsProps } from "@/src/shared/types/StrapModelsTypes";
import type { MediaDto } from "@/src/shared/types/content";
import { defaultConfig } from "@/src/entities/app-config";
import styles from "./page.module.css";

const tabItems = [
  { id: 1, label: "Шаг 1" },
  { id: 2, label: "Шаг 2" },
  { id: 3, label: "Шаг 3" },
  { id: 4, label: "Шаг 4" },
  { id: 5, label: "Цвета" },
  { id: 6, label: "Промокоды" }
];

const emptyLayers = (): StrapLayersByView => ({ front: "", side: "", back: "" });

const emptyWatchModel = (): WatchModelCardProps => ({
  id: Date.now(),
  image: "",
  name: "",
  model: "",
  sizes: [40, 44],
  colors: [{ hex: "#000000", name: "Black" }]
});

const emptyStrapModel = (): StrapModelsProps => ({
  id: Date.now(),
  image: "",
  name: "",
  price: 0,
  description: "",
  available: [0],
  step3Config: {
    strapTypes: [emptyStrapType()]
  }
});

const emptyLeatherColor = (): StrapLeatherColorOption => ({
  id: `color-${Date.now()}`,
  label: "",
  hex: "#000000",
  layers: emptyLayers()
});

const emptyColorLibraryItem = (): ColorLibraryItem => ({
  id: `palette-${Date.now()}`,
  name: "",
  hex: "#000000"
});

const emptyPromoCode = (): PromoCodeConfig => ({
  id: `promo-${Date.now()}`,
  code: "",
  type: "amount",
  value: 0,
  remainingUses: 0
});

const emptyEdgeType = (): StrapEdgeTypeOption => ({
  id: `edge-${Date.now()}`,
  label: "",
  hex: "#000000",
  layers: emptyLayers()
});

const emptyStitchType = (): StrapStitchTypeOption => ({
  id: `stitch-${Date.now()}`,
  label: "",
  hex: "#000000",
  layers: emptyLayers()
});

const emptyLeatherType = (): StrapLeatherTypeOption => ({
  id: `leather-${Date.now()}`,
  label: "",
  price: 0,
  leatherColors: [],
  edgeTypes: [emptyEdgeType()],
  stitchTypes: [emptyStitchType()]
});

const emptyBuckleColor = (): StrapBuckleColorOption => ({
  id: `buckle-${Date.now()}`,
  label: "",
  hex: "#000000",
  layers: {
    standard: emptyLayers(),
    butterfly: emptyLayers()
  },
  filterDisplay: emptyLayers()
});

const emptyAdapterColor = (): StrapAdapterColorOption => ({
  id: `adapter-${Date.now()}`,
  label: "",
  hex: "#000000",
  layers: emptyLayers(),
  filterDisplayImage: ""
});

const emptyStrapType = (): StrapTypeConfig => ({
  id: `type-${Date.now()}`,
  label: "",
  step3Description: "",
  defaultImages: emptyLayers(),
  defaultByWatchColor: [],
  leatherTypes: [emptyLeatherType()],
  buckleColors: {
    hasButterfly: true,
    options: []
  },
  adapterColors: []
});

const emptyStep4Option = (): Step4OptionConfig => ({
  id: `step4-option-${Date.now()}`,
  label: "",
  price: 0
});

const emptyStep4Section = (): Step4SectionConfig => ({
  id: `step4-section-${Date.now()}`,
  title: "",
  description: "",
  price: 0,
  ctaLabel: "",
  image: "",
  video: "",
  downloadLinkText: "",
  downloadLinkUrl: "",
  imageDescription: "",
  options: [],
  methodLabel: "",
  methodColorIds: [],
  placementLabel: "",
  placementOptions: [],
  inputLabel: "",
  inputInfoLabel: "",
  inputPlaceholder: ""
});

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
        // keep a stable id for predictable rendering/recognition
        id: "step4-card-wrist",
        // keep empty draft options so admin can add/edit rows
        options: Array.isArray(currentWrist.options) ? currentWrist.options : []
      }
    : defaultWrist;

  return [wristSection, ...otherSections];
};

const resolveStep4 = (step4?: Step4Config): Required<Step4Config> => ({
  title: step4?.title ?? "",
  description: step4?.description ?? "",
  ctaLabel: step4?.ctaLabel ?? "",
  readyDate: step4?.readyDate ?? "",
  readyDateNote: step4?.readyDateNote ?? "",
  sections: normalizeStep4Sections(step4?.sections)
});

const mergeConfig = (base: AppConfig, incoming: Partial<AppConfig>): AppConfig => {
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
};

const resolveModelStep3Config = (
  model: StrapModelsProps,
  legacyStrapConfig?: StrapConfig
): StrapConfig => {
  if (model.step3Config?.strapTypes?.length) {
    return model.step3Config;
  }
  if (legacyStrapConfig?.strapTypes?.length) {
    return JSON.parse(JSON.stringify(legacyStrapConfig)) as StrapConfig;
  }
  return { strapTypes: [emptyStrapType()] };
};

const normalizeStep3ConfigWithPalette = (
  step3Config: StrapConfig,
  palette: ColorLibraryItem[]
): StrapConfig => {
  if (!palette.length) return step3Config;

  const paletteById = new Map(palette.map((item) => [item.id, item]));
  const paletteByHexAndName = new Map(
    palette.map((item) => [`${item.hex.toLowerCase()}::${item.name.toLowerCase()}`, item])
  );
  const paletteByHex = new Map(palette.map((item) => [item.hex.toLowerCase(), item]));

  const resolvePaletteColor = (color: StrapLeatherColorOption): ColorLibraryItem | null => {
    const byId = paletteById.get(color.id);
    if (byId) return byId;

    const byHexAndName = paletteByHexAndName.get(
      `${(color.hex ?? "").toLowerCase()}::${(color.label ?? "").toLowerCase()}`
    );
    if (byHexAndName) return byHexAndName;

    return paletteByHex.get((color.hex ?? "").toLowerCase()) ?? null;
  };

  return {
    ...step3Config,
    strapTypes: step3Config.strapTypes.map((strapType) => ({
      ...strapType,
      leatherTypes: strapType.leatherTypes.map((leatherType) => ({
        ...leatherType,
        // В коже оставляем только варианты, выбранные из палитры.
        leatherColors: leatherType.leatherColors
          .map((color) => {
            const paletteColor = resolvePaletteColor(color);
            if (!paletteColor) return null;
            return {
              ...color,
              id: paletteColor.id,
              label: paletteColor.name,
              hex: paletteColor.hex
            };
          })
          .filter((item): item is StrapLeatherColorOption => item !== null)
      }))
    }))
  };
};

const moveItem = <T,>(items: T[], from: number, to: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const isExternalImageUrl = (value: string): boolean => /^https?:\/\//i.test(value.trim());

const blobToWebpFile = async (blob: Blob, fileNameBase: string): Promise<File | null> => {
  if (typeof window === "undefined") return null;

  const sourceUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Не удалось прочитать изображение"));
      img.src = sourceUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0);

    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/webp", 0.92);
    });
    if (!webpBlob) return null;

    return new File([webpBlob], `${fileNameBase}.webp`, { type: "image/webp" });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
};

const Collapsible = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => (
  <details className="border rounded p-3" open={defaultOpen}>
    <summary className="fw-semibold">{title}</summary>
    <div className="mt-3">{children}</div>
  </details>
);

const ColorLabel = ({ name, hex }: { name?: string; hex?: string }) => (
  <span className="d-inline-flex align-items-center gap-2">
    <span
      aria-hidden
      style={{
        width: 10,
        minWidth: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: hex ?? "transparent",
        border: "1px solid rgba(0, 0, 0, 0.25)"
      }}
    />
    <span>
      {name || "(без названия)"} ({hex || "#000000"})
    </span>
  </span>
);

const ImageField = ({
  label,
  value,
  onChange,
  onUpload
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) => {
  const [isImporting, setIsImporting] = useState(false);

  const importFromUrl = async (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed || !isExternalImageUrl(trimmed) || isImporting) {
      return;
    }

    setIsImporting(true);
    try {
      const response = await fetch("/api/admin/media/import-from-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });
      if (!response.ok) {
        return;
      }

      const sourceBlob = await response.blob();
      const webpFile = await blobToWebpFile(sourceBlob, `imported-${Date.now()}`);
      if (!webpFile) {
        return;
      }

      const uploadedUrl = await onUpload(webpFile);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="d-flex flex-column flex-md-row gap-2">
        <input
          className="form-control"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={(event) => {
            void importFromUrl(event.target.value);
          }}
          placeholder="URL"
        />
        <input
          className="form-control"
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const url = await onUpload(file);
            if (url) onChange(url);
          }}
        />
      </div>
      {isImporting ? <small className="text-muted">Импорт изображения по ссылке...</small> : null}
    </div>
  );
};

const VideoField = ({
  label,
  value,
  onChange,
  onUpload
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) => (
  <div>
    <label className="form-label">{label}</label>
    <div className="d-flex flex-column flex-md-row gap-2">
      <input
        className="form-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="URL .webm"
      />
      <input
        className="form-control"
        type="file"
        accept=".webm,video/webm"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const isWebm = file.type === "video/webm" || file.name.toLowerCase().endsWith(".webm");
          if (!isWebm) return;
          const url = await onUpload(file);
          if (url) onChange(url);
        }}
      />
    </div>
    <small className="text-muted">Только видео формата .webm</small>
  </div>
);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [config, setConfig] = useState<AppConfig>({ ...defaultConfig });
  const [status, setStatus] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<MediaDto | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editingLeather, setEditingLeather] = useState<{
    strapModelIndex: number;
    strapTypeIndex: number;
    leatherIndex: number;
  } | null>(null);

  const strapConfig = useMemo(() => config.strapConfig, [config]);
  const colorLibrary = config.colorLibrary ?? [];
  const step4Config = useMemo(() => resolveStep4(config.step4), [config.step4]);

  useEffect(() => {
    const load = async () => {
      setStatus(null);
      try {
        const res = await fetch("/api/public/config", { cache: "no-store" });
        const data = res.ok ? await res.json() : {};
        const merged = mergeConfig(defaultConfig, data ?? {});
        const palette = merged.colorLibrary ?? [];
        merged.strapModels = (merged.strapModels ?? []).map((model) => ({
          ...model,
          step3Config: normalizeStep3ConfigWithPalette(
            resolveModelStep3Config(model, merged.strapConfig),
            palette
          )
        }));
        setConfig(merged);
      } catch (err) {
        setStatus("Не удалось загрузить конфигурацию");
      }
    };

    load();
  }, []);

  const saveConfig = async () => {
    setStatus(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });

      if (!res.ok) {
        setStatus("Ошибка сохранения");
        return;
      }

      setStatus("Сохранено");
    } catch (err) {
      setStatus("Ошибка сохранения");
    }
  };

  const uploadImage = async (file: File) => {
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.message ?? "Ошибка загрузки");
        return null;
      }
      setUploadInfo(data);
      return data?.url ?? null;
    } catch (err) {
      setStatus("Ошибка загрузки");
      return null;
    }
  };

  const onDragStart = (key: string, index: number) => {
    setDragKey(key);
    setDragIndex(index);
  };

  const onDrop = (key: string, index: number, updater: (from: number, to: number) => void) => {
    if (dragKey !== key || dragIndex === null) return;
    updater(dragIndex, index);
    setDragKey(null);
    setDragIndex(null);
  };

  const updateModelStep3Config = (
    strapModelIndex: number,
    updater: (current: StrapConfig) => StrapConfig
  ) => {
    setConfig((prev) => {
      const strapModels = [...prev.strapModels];
      const currentModel = strapModels[strapModelIndex];
      if (!currentModel) return prev;
      const currentConfig = resolveModelStep3Config(currentModel, prev.strapConfig);
      strapModels[strapModelIndex] = {
        ...currentModel,
        step3Config: updater(currentConfig)
      };
      return { ...prev, strapModels };
    });
  };

  const editingContext = useMemo(() => {
    if (!editingLeather) return null;
    const model = config.strapModels[editingLeather.strapModelIndex];
    if (!model) return null;
    const step3Config = resolveModelStep3Config(model, config.strapConfig);
    const strapType = step3Config.strapTypes[editingLeather.strapTypeIndex];
    if (!strapType) return null;
    const leatherType = strapType.leatherTypes[editingLeather.leatherIndex];
    if (!leatherType) return null;
    return { model, step3Config, strapType, leatherType };
  }, [config.strapModels, config.strapConfig, editingLeather]);

  const defaultByWatchColorEntries = useMemo<StrapDefaultByWatchColor[]>(() => {
    if (!editingContext) return [];

    const normalize = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();
    const availableModelIds = new Set(editingContext.model.available ?? []);
    const watchColors = config.watchModels
      .filter((watchModel) => availableModelIds.has(watchModel.id))
      .flatMap((watchModel) => watchModel.colors ?? []);

    const uniqueWatchColors = watchColors.filter((color, index, arr) => {
      const key = `${normalize(color.name)}::${normalize(color.hex)}`;
      return (
        arr.findIndex(
          (candidate) => `${normalize(candidate.name)}::${normalize(candidate.hex)}` === key
        ) === index
      );
    });

    return uniqueWatchColors.map((watchColor) => {
      const existing =
        editingContext.strapType.defaultByWatchColor?.find(
          (item) =>
            normalize(item.watchColorName) === normalize(watchColor.name) &&
            normalize(item.watchColorHex) === normalize(watchColor.hex)
        ) ?? null;

      return {
        watchColorName: watchColor.name,
        watchColorHex: watchColor.hex,
        layers: existing?.layers ?? emptyLayers()
      };
    });
  }, [config.watchModels, editingContext]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
      <div className={styles.toolbar}>
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div className="ms-auto">
          <button className={styles.saveButton} onClick={saveConfig}>
            Сохранить всё
          </button>
        </div>
      </div>

      {status && <div className={styles.status}>{status}</div>}

      {activeTab === 1 && (
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Шаг 1: Заголовок и модели часов</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Заголовок</label>
              <input
                className="form-control"
                value={config.titleStepSection.title}
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    titleStepSection: { ...prev.titleStepSection, title: event.target.value }
                  }))
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Подсветка</label>
              <input
                className="form-control"
                value={config.titleStepSection.highlight}
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    titleStepSection: { ...prev.titleStepSection, highlight: event.target.value }
                  }))
                }
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h6 className="mb-0">Модели часов</h6>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  watchModels: [...prev.watchModels, emptyWatchModel()]
                }))
              }
            >
              Добавить модель
            </button>
          </div>

          <div className="mt-3 d-flex flex-column gap-3">
            {config.watchModels.map((model, index) => (
              <Collapsible key={model.id} title={`Модель ${index + 1}`}>
                <div
                  draggable
                  onDragStart={() => onDragStart("watchModels", index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    onDrop("watchModels", index, (from, to) =>
                      setConfig((prev) => ({
                        ...prev,
                        watchModels: moveItem(prev.watchModels, from, to)
                      }))
                    )
                  }
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <strong>{model.name || "Без названия"}</strong>
                      <div className="text-muted small">ID: {model.id}</div>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          watchModels: prev.watchModels.filter((_, idx) => idx !== index)
                        }))
                      }
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Название</label>
                      <input
                        className="form-control"
                        value={model.name}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.watchModels];
                            next[index] = { ...next[index], name: value };
                            return { ...prev, watchModels: next };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Серия (отображается под названием)</label>
                      <input
                        className="form-control"
                        value={model.model}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.watchModels];
                            next[index] = { ...next[index], model: value };
                            return { ...prev, watchModels: next };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <ImageField
                        label="Изображение"
                        value={model.image}
                        onChange={(value) => {
                          setConfig((prev) => {
                            const next = [...prev.watchModels];
                            next[index] = { ...next[index], image: value };
                            return { ...prev, watchModels: next };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <label className="form-label">Размеры (через запятую)</label>
                      <input
                        className="form-control"
                        value={model.sizes.join(", ")}
                        onChange={(event) => {
                          const value = event.target.value
                            .split(",")
                            .map((item) => Number(item.trim()))
                            .filter((num) => !Number.isNaN(num));
                          setConfig((prev) => {
                            const next = [...prev.watchModels];
                            next[index] = { ...next[index], sizes: value };
                            return { ...prev, watchModels: next };
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Цвета корпуса</span>
                    </div>
                    <details className="border rounded p-2 mt-2">
                      <summary className="fw-semibold">Выбрать цвета (мультиселект)</summary>
                      <div className="d-flex flex-column gap-2 mt-2">
                        {colorLibrary.length === 0 ? (
                          <span className="text-muted">Палитра пустая</span>
                        ) : (
                          colorLibrary.map((paletteColor) => {
                            const checked = (model.colors ?? []).some(
                              (item) => item.name === paletteColor.name && item.hex === paletteColor.hex
                            );
                            return (
                              <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    setConfig((prev) => {
                                      const next = [...prev.watchModels];
                                      const current = [...(next[index].colors ?? [])];
                                      const exists = current.some(
                                        (item) => item.name === paletteColor.name && item.hex === paletteColor.hex
                                      );
                                      const colors = isChecked
                                        ? exists
                                          ? current
                                          : [...current, { name: paletteColor.name, hex: paletteColor.hex }]
                                        : current.filter(
                                            (item) => !(item.name === paletteColor.name && item.hex === paletteColor.hex)
                                          );
                                      next[index] = { ...next[index], colors };
                                      return { ...prev, watchModels: next };
                                    });
                                  }}
                                />
                                <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                              </label>
                            );
                          })
                        )}
                      </div>
                    </details>
                    <div className="d-flex flex-column gap-2 mt-2">
                      {(model.colors ?? []).map((color, colorIndex) => (
                        <Collapsible key={`${model.id}-color-${colorIndex}`} title={`Цвет ${colorIndex + 1}`} defaultOpen={false}>
                          <div className="row g-2 align-items-center">
                            <div className="col-5">
                              <input
                                className="form-control"
                                value={color.name}
                                placeholder="Название"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.watchModels];
                                    const colors = [...(next[index].colors ?? [])];
                                    colors[colorIndex] = { ...colors[colorIndex], name: value };
                                    next[index] = { ...next[index], colors };
                                    return { ...prev, watchModels: next };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-5">
                              <input
                                className="form-control"
                                value={color.hex}
                                placeholder="#000000"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.watchModels];
                                    const colors = [...(next[index].colors ?? [])];
                                    colors[colorIndex] = { ...colors[colorIndex], hex: value };
                                    next[index] = { ...next[index], colors };
                                    return { ...prev, watchModels: next };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-2 text-end">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  setConfig((prev) => {
                                    const next = [...prev.watchModels];
                                    const colors = (next[index].colors ?? []).filter((_, idx) => idx !== colorIndex);
                                    next[index] = { ...next[index], colors };
                                    return { ...prev, watchModels: next };
                                  });
                                }}
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="card p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Шаг 2: Модели ремешков</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  strapModels: [...prev.strapModels, emptyStrapModel()]
                }))
              }
            >
              Добавить ремешок
            </button>
          </div>
          <div className="d-flex flex-column gap-3">
            {config.strapModels.map((model, index) => (
              <Collapsible key={model.id} title={`Ремешок ${index + 1}`}>
                <div
                  draggable
                  onDragStart={() => onDragStart("strapModels", index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    onDrop("strapModels", index, (from, to) =>
                      setConfig((prev) => ({
                        ...prev,
                        strapModels: moveItem(prev.strapModels, from, to)
                      }))
                    )
                  }
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{model.name || "Без названия"}</strong>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          strapModels: prev.strapModels.filter((_, idx) => idx !== index)
                        }))
                      }
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Название</label>
                      <input
                        className="form-control"
                        value={model.name}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.strapModels];
                            next[index] = { ...next[index], name: value };
                            return { ...prev, strapModels: next };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Цена</label>
                      <input
                        type="number"
                        className="form-control"
                        value={model.price}
                        onChange={(event) => {
                          const value = Number(event.target.value || 0);
                          setConfig((prev) => {
                            const next = [...prev.strapModels];
                            next[index] = { ...next[index], price: value };
                            return { ...prev, strapModels: next };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <ImageField
                        label="Изображение"
                        value={model.image}
                        onChange={(value) => {
                          setConfig((prev) => {
                            const next = [...prev.strapModels];
                            next[index] = { ...next[index], image: value };
                            return { ...prev, strapModels: next };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Доступно для моделей часов</label>
                      <details className="border rounded p-2">
                        <summary className="fw-semibold">Выбрать модели (мультиселект)</summary>
                        <div className="d-flex flex-column gap-2 mt-2">
                          {config.watchModels.length === 0 ? (
                            <span className="text-muted">Нет моделей часов</span>
                          ) : (
                            config.watchModels.map((watchModel) => {
                              const checked = model.available.includes(watchModel.id);
                              return (
                                <label key={watchModel.id} className="form-check d-flex align-items-center gap-2">
                                  <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                      const isChecked = event.target.checked;
                                      setConfig((prev) => {
                                        const next = [...prev.strapModels];
                                        const current = [...next[index].available];
                                        const available = isChecked
                                          ? current.includes(watchModel.id)
                                            ? current
                                            : [...current, watchModel.id]
                                          : current.filter((id) => id !== watchModel.id);
                                        next[index] = { ...next[index], available };
                                        return { ...prev, strapModels: next };
                                      });
                                    }}
                                  />
                                  <span>
                                    {watchModel.name || "Без названия"} ({watchModel.model || "без серии"})
                                  </span>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </details>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="form-label">Описание</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={model.description}
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...prev.strapModels];
                          next[index] = { ...next[index], description: value };
                          return { ...prev, strapModels: next };
                        });
                      }}
                    />
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Шаг 3: Конфигуратор ремешка</h5>

          <div className="d-flex flex-column gap-3">
            {config.watchModels.length === 0 ? (
              <div className="text-muted">Модели часов не добавлены</div>
            ) : (
              config.watchModels.map((watchModel, watchModelIndex) => {
                const availableStraps = config.strapModels
                  .map((strapModel, strapModelIndex) => ({ strapModel, strapModelIndex }))
                  .filter(({ strapModel }) => strapModel.available.includes(watchModel.id));

                return (
                  <Collapsible
                    key={`watch-${watchModel.id}-${watchModelIndex}`}
                    title={`${watchModel.name || `Часы ${watchModelIndex + 1}`} (${watchModel.model || "без серии"})`}
                    defaultOpen={false}
                  >
                    {availableStraps.length === 0 ? (
                      <div className="text-muted">Для этой модели часов нет доступных ремешков</div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {availableStraps.map(({ strapModel, strapModelIndex }) => {
                          const step3Config = resolveModelStep3Config(strapModel, config.strapConfig);
                          const strapType = step3Config.strapTypes[0] ?? emptyStrapType();
                          const leatherTypes = strapType.leatherTypes ?? [];

                          return (
                            <Collapsible
                              key={`watch-${watchModel.id}-strap-${strapModel.id}-${strapModelIndex}`}
                              title={strapModel.name || `Ремешок ${strapModelIndex + 1}`}
                              defaultOpen={false}
                            >
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Название ремешка</label>
                                  <input className="form-control" value={strapModel.name} disabled />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label">Описание {strapModel.name || "ремешка"}</label>
                                  <input
                                    className="form-control"
                                    value={strapType.step3Description}
                                    onChange={(event) => {
                                      const value = event.target.value;
                                      updateModelStep3Config(strapModelIndex, (current) => {
                                        const next = [...current.strapTypes];
                                        next[0] = { ...next[0], step3Description: value };
                                        return { ...current, strapTypes: next };
                                      });
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <h6 className="mb-0">Типы кожи</h6>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => {
                                    updateModelStep3Config(strapModelIndex, (current) => {
                                      const next = [...current.strapTypes];
                                      const primary = next[0] ?? emptyStrapType();
                                      next[0] = {
                                        ...primary,
                                        leatherTypes: [...primary.leatherTypes, emptyLeatherType()]
                                      };
                                      return { ...current, strapTypes: next };
                                    });
                                  }}
                                >
                                  Добавить тип кожи
                                </button>
                              </div>

                              <div className="d-flex flex-column gap-2 mt-2">
                                {leatherTypes.length === 0 ? (
                                  <div className="text-muted">Типы кожи не добавлены</div>
                                ) : (
                                  leatherTypes.map((leatherType, leatherIndex) => (
                                    <div key={leatherType.id} className="border rounded p-2 d-flex justify-content-between align-items-center">
                                      <div>
                                        <strong>{leatherType.label || `Тип кожи ${leatherIndex + 1}`}</strong>
                                        <div className="text-muted small">Цена: {Number(leatherType.price ?? 0)} ₽</div>
                                        {leatherType.isHidden ? <div className="text-muted small">Скрыт на клиенте</div> : null}
                                      </div>
                                      <div className="d-flex gap-2">
                                        <button
                                          className={`btn btn-sm ${leatherType.isHidden ? "btn-warning" : "btn-outline-secondary"}`}
                                          onClick={() => {
                                            updateModelStep3Config(strapModelIndex, (current) => {
                                              const next = [...current.strapTypes];
                                              const primary = next[0] ?? emptyStrapType();
                                              const leatherTypes = [...primary.leatherTypes];
                                              leatherTypes[leatherIndex] = {
                                                ...leatherTypes[leatherIndex],
                                                isHidden: !Boolean(leatherTypes[leatherIndex].isHidden)
                                              };
                                              next[0] = { ...primary, leatherTypes };
                                              return { ...current, strapTypes: next };
                                            });
                                          }}
                                        >
                                          {leatherType.isHidden ? "Показать" : "Скрыть"}
                                        </button>
                                        <button
                                          className="btn btn-outline-primary btn-sm"
                                          onClick={() =>
                                            setEditingLeather({
                                              strapModelIndex,
                                              strapTypeIndex: 0,
                                              leatherIndex
                                            })
                                          }
                                        >
                                          Настроить
                                        </button>
                                        <button
                                          className="btn btn-outline-danger btn-sm"
                                          onClick={() => {
                                            updateModelStep3Config(strapModelIndex, (current) => {
                                              const next = [...current.strapTypes];
                                              const primary = next[0] ?? emptyStrapType();
                                              next[0] = {
                                                ...primary,
                                                leatherTypes: primary.leatherTypes.filter((_, idx) => idx !== leatherIndex)
                                              };
                                              return { ...current, strapTypes: next };
                                            });
                                          }}
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </Collapsible>
                          );
                        })}
                      </div>
                    )}
                  </Collapsible>
                );
              })
            )}
          </div>
        </div>
      )}

      {false && activeTab === 3 && (
        <div className="card p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Шаг 3: Конфигуратор ремешка</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  strapConfig: {
                    ...prev.strapConfig,
                    strapTypes: [...prev.strapConfig.strapTypes, emptyStrapType()]
                  }
                }))
              }
            >
              Добавить тип ремешка
            </button>
          </div>

          <div className="d-flex flex-column gap-4">
            {strapConfig.strapTypes.map((strapType, strapIndex) => (
              <Collapsible key={strapType.id} title={`Тип ремешка ${strapIndex + 1}`}
              >
                <div
                  draggable
                  onDragStart={() => onDragStart("strapTypes", strapIndex)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() =>
                    onDrop("strapTypes", strapIndex, (from, to) =>
                      setConfig((prev) => ({
                        ...prev,
                        strapConfig: {
                          ...prev.strapConfig,
                          strapTypes: moveItem(prev.strapConfig.strapTypes, from, to)
                        }
                      }))
                    )
                  }
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{strapType.label || "Без названия"}</strong>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          strapConfig: {
                            ...prev.strapConfig,
                            strapTypes: prev.strapConfig.strapTypes.filter((_, idx) => idx !== strapIndex)
                          }
                        }))
                      }
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">ID</label>
                      <input
                        className="form-control"
                        value={strapType.id}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = { ...next[strapIndex], id: value };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Название</label>
                      <input
                        className="form-control"
                        value={strapType.label}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = { ...next[strapIndex], label: value };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                              <label className="form-label">Описание модели</label>
                      <input
                        className="form-control"
                        value={strapType.step3Description}
                        onChange={(event) => {
                          const value = event.target.value;
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = { ...next[strapIndex], step3Description: value };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-1">
                    <div className="col-md-4">
                      <ImageField
                        label="Default Front"
                        value={strapType.defaultImages.front}
                        onChange={(value) => {
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = {
                              ...next[strapIndex],
                              defaultImages: { ...next[strapIndex].defaultImages, front: value }
                            };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                    <div className="col-md-4">
                      <ImageField
                        label="Default Side"
                        value={strapType.defaultImages.side}
                        onChange={(value) => {
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = {
                              ...next[strapIndex],
                              defaultImages: { ...next[strapIndex].defaultImages, side: value }
                            };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                    <div className="col-md-4">
                      <ImageField
                        label="Default Back"
                        value={strapType.defaultImages.back}
                        onChange={(value) => {
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = {
                              ...next[strapIndex],
                              defaultImages: { ...next[strapIndex].defaultImages, back: value }
                            };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Типы кожи</h6>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            const leatherTypes = [...next[strapIndex].leatherTypes, emptyLeatherType()];
                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                      >
                        Добавить тип кожи
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-3 mt-2">
                      {strapType.leatherTypes.map((leatherType, leatherIndex) => (
                        <Collapsible key={leatherType.id} title={`Тип кожи ${leatherIndex + 1}`} defaultOpen={false}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{leatherType.label || "Тип кожи"}</strong>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setConfig((prev) => {
                                  const next = [...prev.strapConfig.strapTypes];
                                  const leatherTypes = next[strapIndex].leatherTypes.filter((_, idx) => idx !== leatherIndex);
                                  next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                  return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                });
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <label className="form-label">ID</label>
                              <input
                                className="form-control"
                                value={leatherType.id}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const leatherTypes = [...next[strapIndex].leatherTypes];
                                    leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], id: value };
                                    next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">Название</label>
                              <input
                                className="form-control"
                                value={leatherType.label}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const leatherTypes = [...next[strapIndex].leatherTypes];
                                    leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], label: value };
                                    next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Цвета кожи</span>
                            </div>
                            <details className="border rounded p-2 mt-2">
                              <summary className="fw-semibold">Выбрать цвета (мультиселект)</summary>
                              <div className="d-flex flex-column gap-2 mt-2">
                                {colorLibrary.length === 0 ? (
                                  <span className="text-muted">Палитра пустая</span>
                                ) : (
                                  colorLibrary.map((paletteColor) => {
                                    const checked = leatherType.leatherColors.some((item) => item.id === paletteColor.id);
                                    return (
                                      <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                        <input
                                          className="form-check-input mt-0"
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(event) => {
                                            const isChecked = event.target.checked;
                                            setConfig((prev) => {
                                              const next = [...prev.strapConfig.strapTypes];
                                              const leatherTypes = [...next[strapIndex].leatherTypes];
                                              const current = [...leatherTypes[leatherIndex].leatherColors];
                                              const exists = current.some((item) => item.id === paletteColor.id);
                                              const colors = isChecked
                                                ? exists
                                                  ? current
                                                  : [
                                                      ...current,
                                                      {
                                                        ...emptyLeatherColor(),
                                                        id: paletteColor.id,
                                                        label: paletteColor.name,
                                                        hex: paletteColor.hex
                                                      }
                                                    ]
                                                : current.filter((item) => item.id !== paletteColor.id);
                                              leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                              next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                              return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                            });
                                          }}
                                        />
                                        <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                                      </label>
                                    );
                                  })
                                )}
                              </div>
                            </details>
                            <div className="d-flex flex-column gap-2 mt-2">
                              {leatherType.leatherColors.map((color, colorIndex) => (
                                <Collapsible key={color.id} title={`Цвет ${colorIndex + 1}`} defaultOpen={false}>
                                  <div className="row g-2">
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={color.id}
                                        placeholder="ID"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = { ...colors[colorIndex], id: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={color.label}
                                        placeholder="Название"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = { ...colors[colorIndex], label: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={color.hex}
                                        placeholder="#000000"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = { ...colors[colorIndex], hex: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row g-2 mt-2">
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Front слой"
                                        value={color.layers.front}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = {
                                              ...colors[colorIndex],
                                              layers: { ...colors[colorIndex].layers, front: value }
                                            };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Side слой"
                                        value={color.layers.side}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = {
                                              ...colors[colorIndex],
                                              layers: { ...colors[colorIndex].layers, side: value }
                                            };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Back слой"
                                        value={color.layers.back}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const colors = [...leatherTypes[leatherIndex].leatherColors];
                                            colors[colorIndex] = {
                                              ...colors[colorIndex],
                                              layers: { ...colors[colorIndex].layers, back: value }
                                            };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-end mt-2">
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        setConfig((prev) => {
                                          const next = [...prev.strapConfig.strapTypes];
                                          const leatherTypes = [...next[strapIndex].leatherTypes];
                                          const colors = leatherTypes[leatherIndex].leatherColors.filter((_, idx) => idx !== colorIndex);
                                          leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], leatherColors: colors };
                                          next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                          return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                        });
                                      }}
                                    >
                                      Удалить
                                    </button>
                                  </div>
                                </Collapsible>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Типы края</span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const leatherTypes = [...next[strapIndex].leatherTypes];
                                    const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes, emptyEdgeType()];
                                    leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                    next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              >
                                Добавить край
                              </button>
                            </div>
                            <div className="d-flex flex-column gap-2 mt-2">
                              {leatherType.edgeTypes.map((edge, edgeIndex) => (
                                <Collapsible key={edge.id} title={`Край ${edgeIndex + 1}`} defaultOpen={false}>
                                  <div className="row g-2">
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={edge.id}
                                        placeholder="ID"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes];
                                            edgeTypes[edgeIndex] = { ...edgeTypes[edgeIndex], id: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={edge.label}
                                        placeholder="Название"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes];
                                            edgeTypes[edgeIndex] = { ...edgeTypes[edgeIndex], label: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row g-2 mt-2">
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Front слой"
                                        value={edge.layers.front}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes];
                                            edgeTypes[edgeIndex] = { ...edgeTypes[edgeIndex], layers: { ...edgeTypes[edgeIndex].layers, front: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Side слой"
                                        value={edge.layers.side}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes];
                                            edgeTypes[edgeIndex] = { ...edgeTypes[edgeIndex], layers: { ...edgeTypes[edgeIndex].layers, side: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Back слой"
                                        value={edge.layers.back}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const edgeTypes = [...leatherTypes[leatherIndex].edgeTypes];
                                            edgeTypes[edgeIndex] = { ...edgeTypes[edgeIndex], layers: { ...edgeTypes[edgeIndex].layers, back: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-end mt-2">
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        setConfig((prev) => {
                                          const next = [...prev.strapConfig.strapTypes];
                                          const leatherTypes = [...next[strapIndex].leatherTypes];
                                          const edgeTypes = leatherTypes[leatherIndex].edgeTypes.filter((_, idx) => idx !== edgeIndex);
                                          leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], edgeTypes };
                                          next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                          return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                        });
                                      }}
                                    >
                                      Удалить
                                    </button>
                                  </div>
                                </Collapsible>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Типы строчки</span>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const leatherTypes = [...next[strapIndex].leatherTypes];
                                    const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes, emptyStitchType()];
                                    leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                    next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              >
                                Добавить строчку
                              </button>
                            </div>
                            <div className="d-flex flex-column gap-2 mt-2">
                              {leatherType.stitchTypes.map((stitch, stitchIndex) => (
                                <Collapsible key={stitch.id} title={`Строчка ${stitchIndex + 1}`} defaultOpen={false}>
                                  <div className="row g-2">
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={stitch.id}
                                        placeholder="ID"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes];
                                            stitchTypes[stitchIndex] = { ...stitchTypes[stitchIndex], id: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <input
                                        className="form-control"
                                        value={stitch.label}
                                        placeholder="Название"
                                        onChange={(event) => {
                                          const value = event.target.value;
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes];
                                            stitchTypes[stitchIndex] = { ...stitchTypes[stitchIndex], label: value };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="row g-2 mt-2">
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Front слой"
                                        value={stitch.layers.front}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes];
                                            stitchTypes[stitchIndex] = { ...stitchTypes[stitchIndex], layers: { ...stitchTypes[stitchIndex].layers, front: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Side слой"
                                        value={stitch.layers.side}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes];
                                            stitchTypes[stitchIndex] = { ...stitchTypes[stitchIndex], layers: { ...stitchTypes[stitchIndex].layers, side: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                    <div className="col-md-4">
                                      <ImageField
                                        label="Back слой"
                                        value={stitch.layers.back}
                                        onChange={(value) => {
                                          setConfig((prev) => {
                                            const next = [...prev.strapConfig.strapTypes];
                                            const leatherTypes = [...next[strapIndex].leatherTypes];
                                            const stitchTypes = [...leatherTypes[leatherIndex].stitchTypes];
                                            stitchTypes[stitchIndex] = { ...stitchTypes[stitchIndex], layers: { ...stitchTypes[stitchIndex].layers, back: value } };
                                            leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                            next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                          });
                                        }}
                                        onUpload={uploadImage}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-end mt-2">
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        setConfig((prev) => {
                                          const next = [...prev.strapConfig.strapTypes];
                                          const leatherTypes = [...next[strapIndex].leatherTypes];
                                          const stitchTypes = leatherTypes[leatherIndex].stitchTypes.filter((_, idx) => idx !== stitchIndex);
                                          leatherTypes[leatherIndex] = { ...leatherTypes[leatherIndex], stitchTypes };
                                          next[strapIndex] = { ...next[strapIndex], leatherTypes };
                                          return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                        });
                                      }}
                                    >
                                      Удалить
                                    </button>
                                  </div>
                                </Collapsible>
                              ))}
                            </div>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>

                  <Collapsible title="Цвета пряжки" defaultOpen={false}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="form-label mb-0">Есть бабочка</span>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={strapType.buckleColors.hasButterfly}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setConfig((prev) => {
                            const next = [...prev.strapConfig.strapTypes];
                            next[strapIndex] = {
                              ...next[strapIndex],
                              buckleColors: { ...next[strapIndex].buckleColors, hasButterfly: checked }
                            };
                            return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                          });
                        }}
                      />
                    </div>
                    <details className="border rounded p-2 mt-2">
                      <summary className="fw-semibold">Выбрать цвета (мультиселект)</summary>
                      <div className="d-flex flex-column gap-2 mt-2">
                        {colorLibrary.length === 0 ? (
                          <span className="text-muted">Палитра пустая</span>
                        ) : (
                          colorLibrary.map((paletteColor) => {
                            const checked = strapType.buckleColors.options.some((item) => item.id === paletteColor.id);
                            return (
                              <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    setConfig((prev) => {
                                      const next = [...prev.strapConfig.strapTypes];
                                      const current = [...next[strapIndex].buckleColors.options];
                                      const exists = current.some((item) => item.id === paletteColor.id);
                                      const options = isChecked
                                        ? exists
                                          ? current
                                          : [
                                              ...current,
                                              {
                                                ...emptyBuckleColor(),
                                                id: paletteColor.id,
                                                label: paletteColor.name,
                                                hex: paletteColor.hex
                                              }
                                            ]
                                        : current.filter((item) => item.id !== paletteColor.id);
                                      next[strapIndex] = {
                                        ...next[strapIndex],
                                        buckleColors: { ...next[strapIndex].buckleColors, options }
                                      };
                                      return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                    });
                                  }}
                                />
                                <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                              </label>
                            );
                          })
                        )}
                      </div>
                    </details>

                    <div className="d-flex flex-column gap-2 mt-2">
                      {strapType.buckleColors.options.map((color, colorIndex) => (
                        <Collapsible key={color.id} title={`Пряжка ${colorIndex + 1}`} defaultOpen={false}>
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.id}
                                placeholder="ID"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = { ...options[colorIndex], id: value };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.label}
                                placeholder="Название"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = { ...options[colorIndex], label: value };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.hex}
                                placeholder="#000000"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = { ...options[colorIndex], hex: value };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-md-4">
                              <ImageField
                                label="Standard front"
                                value={color.layers.standard.front}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        standard: { ...options[colorIndex].layers.standard, front: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Standard side"
                                value={color.layers.standard.side}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        standard: { ...options[colorIndex].layers.standard, side: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Standard back"
                                value={color.layers.standard.back}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        standard: { ...options[colorIndex].layers.standard, back: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-md-4">
                              <ImageField
                                label="Butterfly front"
                                value={color.layers.butterfly.front}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        butterfly: { ...options[colorIndex].layers.butterfly, front: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Butterfly side"
                                value={color.layers.butterfly.side}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        butterfly: { ...options[colorIndex].layers.butterfly, side: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Butterfly back"
                                value={color.layers.butterfly.back}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const options = [...next[strapIndex].buckleColors.options];
                                    options[colorIndex] = {
                                      ...options[colorIndex],
                                      layers: {
                                        ...options[colorIndex].layers,
                                        butterfly: { ...options[colorIndex].layers.butterfly, back: value }
                                      }
                                    };
                                    next[strapIndex] = {
                                      ...next[strapIndex],
                                      buckleColors: { ...next[strapIndex].buckleColors, options }
                                    };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                          </div>
                          <div className="mt-3">
                            <h6 className="mb-2">Отображение в фильтрах (3 фото)</h6>
                            <div className="row g-2">
                              <div className="col-md-4">
                                <ImageField
                                  label="Фото 1"
                                  value={color.filterDisplay?.front ?? ""}
                                  onChange={(value) => {
                                    setConfig((prev) => {
                                      const next = [...prev.strapConfig.strapTypes];
                                      const options = [...next[strapIndex].buckleColors.options];
                                      const fd = options[colorIndex].filterDisplay ?? emptyLayers();
                                      options[colorIndex] = {
                                        ...options[colorIndex],
                                        filterDisplay: { ...fd, front: value }
                                      };
                                      next[strapIndex] = {
                                        ...next[strapIndex],
                                        buckleColors: { ...next[strapIndex].buckleColors, options }
                                      };
                                      return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                    });
                                  }}
                                  onUpload={uploadImage}
                                />
                              </div>
                              <div className="col-md-4">
                                <ImageField
                                  label="Фото 2"
                                  value={color.filterDisplay?.side ?? ""}
                                  onChange={(value) => {
                                    setConfig((prev) => {
                                      const next = [...prev.strapConfig.strapTypes];
                                      const options = [...next[strapIndex].buckleColors.options];
                                      const fd = options[colorIndex].filterDisplay ?? emptyLayers();
                                      options[colorIndex] = {
                                        ...options[colorIndex],
                                        filterDisplay: { ...fd, side: value }
                                      };
                                      next[strapIndex] = {
                                        ...next[strapIndex],
                                        buckleColors: { ...next[strapIndex].buckleColors, options }
                                      };
                                      return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                    });
                                  }}
                                  onUpload={uploadImage}
                                />
                              </div>
                              <div className="col-md-4">
                                <ImageField
                                  label="Фото 3"
                                  value={color.filterDisplay?.back ?? ""}
                                  onChange={(value) => {
                                    setConfig((prev) => {
                                      const next = [...prev.strapConfig.strapTypes];
                                      const options = [...next[strapIndex].buckleColors.options];
                                      const fd = options[colorIndex].filterDisplay ?? emptyLayers();
                                      options[colorIndex] = {
                                        ...options[colorIndex],
                                        filterDisplay: { ...fd, back: value }
                                      };
                                      next[strapIndex] = {
                                        ...next[strapIndex],
                                        buckleColors: { ...next[strapIndex].buckleColors, options }
                                      };
                                      return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                    });
                                  }}
                                  onUpload={uploadImage}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="text-end mt-2">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setConfig((prev) => {
                                  const next = [...prev.strapConfig.strapTypes];
                                  const options = next[strapIndex].buckleColors.options.filter((_, idx) => idx !== colorIndex);
                                  next[strapIndex] = {
                                    ...next[strapIndex],
                                    buckleColors: { ...next[strapIndex].buckleColors, options }
                                  };
                                  return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                });
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </Collapsible>

                  <Collapsible title="Цвета адаптера" defaultOpen={false}>
                    <details className="border rounded p-2 mt-2">
                      <summary className="fw-semibold">Выбрать цвета (мультиселект)</summary>
                      <div className="d-flex flex-column gap-2 mt-2">
                        {colorLibrary.length === 0 ? (
                          <span className="text-muted">Палитра пустая</span>
                        ) : (
                          colorLibrary.map((paletteColor) => {
                            const checked = strapType.adapterColors.some((item) => item.id === paletteColor.id);
                            return (
                              <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(event) => {
                                    const isChecked = event.target.checked;
                                    setConfig((prev) => {
                                      const next = [...prev.strapConfig.strapTypes];
                                      const current = [...next[strapIndex].adapterColors];
                                      const exists = current.some((item) => item.id === paletteColor.id);
                                      const adapterColors = isChecked
                                        ? exists
                                          ? current
                                          : [
                                              ...current,
                                              {
                                                ...emptyAdapterColor(),
                                                id: paletteColor.id,
                                                label: paletteColor.name,
                                                hex: paletteColor.hex
                                              }
                                            ]
                                        : current.filter((item) => item.id !== paletteColor.id);
                                      next[strapIndex] = { ...next[strapIndex], adapterColors };
                                      return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                    });
                                  }}
                                />
                                <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                              </label>
                            );
                          })
                        )}
                      </div>
                    </details>
                    <div className="d-flex flex-column gap-2 mt-2">
                      {strapType.adapterColors.map((color, colorIndex) => (
                        <Collapsible key={color.id} title={`Адаптер ${colorIndex + 1}`} defaultOpen={false}>
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.id}
                                placeholder="ID"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = { ...adapterColors[colorIndex], id: value };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.label}
                                placeholder="Название"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = { ...adapterColors[colorIndex], label: value };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <input
                                className="form-control"
                                value={color.hex}
                                placeholder="#000000"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = { ...adapterColors[colorIndex], hex: value };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                              />
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-md-4">
                              <ImageField
                                label="Front слой"
                                value={color.layers.front}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = {
                                      ...adapterColors[colorIndex],
                                      layers: { ...adapterColors[colorIndex].layers, front: value }
                                    };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Side слой"
                                value={color.layers.side}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = {
                                      ...adapterColors[colorIndex],
                                      layers: { ...adapterColors[colorIndex].layers, side: value }
                                    };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-4">
                              <ImageField
                                label="Back слой"
                                value={color.layers.back}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const next = [...prev.strapConfig.strapTypes];
                                    const adapterColors = [...next[strapIndex].adapterColors];
                                    adapterColors[colorIndex] = {
                                      ...adapterColors[colorIndex],
                                      layers: { ...adapterColors[colorIndex].layers, back: value }
                                    };
                                    next[strapIndex] = { ...next[strapIndex], adapterColors };
                                    return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                          </div>
                          <div className="mt-3">
                            <h6 className="mb-2">Отображение в фильтрах</h6>
                            <p className="text-muted small mb-2">Изображение адаптера для отображения в выборе цвета (как выглядит адаптер)</p>
                            <ImageField
                              label="Изображение для фильтра"
                              value={color.filterDisplayImage ?? ""}
                              onChange={(value) => {
                                setConfig((prev) => {
                                  const next = [...prev.strapConfig.strapTypes];
                                  const adapterColors = [...next[strapIndex].adapterColors];
                                  adapterColors[colorIndex] = {
                                    ...adapterColors[colorIndex],
                                    filterDisplayImage: value
                                  };
                                  next[strapIndex] = { ...next[strapIndex], adapterColors };
                                  return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="text-end mt-2">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setConfig((prev) => {
                                  const next = [...prev.strapConfig.strapTypes];
                                  const adapterColors = next[strapIndex].adapterColors.filter((_, idx) => idx !== colorIndex);
                                  next[strapIndex] = { ...next[strapIndex], adapterColors };
                                  return { ...prev, strapConfig: { ...prev.strapConfig, strapTypes: next } };
                                });
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </Collapsible>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {editingLeather && editingContext && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0, 0, 0, 0.45)", zIndex: 1000 }}
        >
          <div className="card p-3 shadow-sm" style={{ width: "min(1100px, 95vw)", maxHeight: "90vh", overflow: "auto" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {editingContext.model.name || "Модель"} / {editingContext.leatherType.label || "Тип кожи"}
              </h5>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditingLeather(null)}>
                Закрыть
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Название типа кожи</label>
                <input
                  className="form-control"
                  value={editingContext.leatherType.label}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      const leatherTypes = [...primary.leatherTypes];
                      leatherTypes[editingLeather.leatherIndex] = { ...leatherTypes[editingLeather.leatherIndex], label: value };
                      next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                      return { ...current, strapTypes: next };
                    });
                  }}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Цена типа кожи (₽)</label>
                <input
                  type="number"
                  className="form-control"
                  value={Number(editingContext.leatherType.price ?? 0)}
                  onChange={(event) => {
                    const value = Number(event.target.value || 0);
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      const leatherTypes = [...primary.leatherTypes];
                      leatherTypes[editingLeather.leatherIndex] = {
                        ...leatherTypes[editingLeather.leatherIndex],
                        price: value
                      };
                      next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                      return { ...current, strapTypes: next };
                    });
                  }}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Описание {editingContext.model.name || "модели"}</label>
                <input
                  className="form-control"
                  value={editingContext.strapType.step3Description}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      next[editingLeather.strapTypeIndex] = { ...primary, step3Description: value };
                      return { ...current, strapTypes: next };
                    });
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <h6>Default слои</h6>
              {defaultByWatchColorEntries.length === 0 ? (
                <div className="text-muted small mt-2">
                  Для этого ремешка нет доступных цветов модели часов. Добавьте цвета на шаге 1 и привяжите модель часов на шаге 2.
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 mt-2">
                  {defaultByWatchColorEntries.map((entry, entryIndex) => (
                    <div key={`${entry.watchColorName}-${entry.watchColorHex}-${entryIndex}`} className="border rounded p-2">
                      <div className="fw-semibold mb-2">
                        <ColorLabel name={entry.watchColorName} hex={entry.watchColorHex} />
                      </div>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <ImageField
                            label="Default Front"
                            value={entry.layers.front}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const currentDefaults = primary.defaultByWatchColor ?? [];
                                const defaults = [...defaultByWatchColorEntries];
                                defaults[entryIndex] = {
                                  ...defaults[entryIndex],
                                  layers: { ...defaults[entryIndex].layers, front: value }
                                };
                                next[editingLeather.strapTypeIndex] = {
                                  ...primary,
                                  defaultByWatchColor: defaults.length ? defaults : currentDefaults
                                };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Default Side"
                            value={entry.layers.side}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const currentDefaults = primary.defaultByWatchColor ?? [];
                                const defaults = [...defaultByWatchColorEntries];
                                defaults[entryIndex] = {
                                  ...defaults[entryIndex],
                                  layers: { ...defaults[entryIndex].layers, side: value }
                                };
                                next[editingLeather.strapTypeIndex] = {
                                  ...primary,
                                  defaultByWatchColor: defaults.length ? defaults : currentDefaults
                                };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Default Back"
                            value={entry.layers.back}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const currentDefaults = primary.defaultByWatchColor ?? [];
                                const defaults = [...defaultByWatchColorEntries];
                                defaults[entryIndex] = {
                                  ...defaults[entryIndex],
                                  layers: { ...defaults[entryIndex].layers, back: value }
                                };
                                next[editingLeather.strapTypeIndex] = {
                                  ...primary,
                                  defaultByWatchColor: defaults.length ? defaults : currentDefaults
                                };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <details className="border rounded p-2 mt-3">
                <summary className="fw-semibold">Общий fallback default (если цвет часов не совпал)</summary>
                <div className="row g-2 mt-1">
                  <div className="col-md-4">
                    <ImageField
                      label="Fallback Front"
                      value={editingContext.strapType.defaultImages.front}
                      onChange={(value) => {
                        updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                          const next = [...current.strapTypes];
                          const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                          next[editingLeather.strapTypeIndex] = {
                            ...primary,
                            defaultImages: { ...primary.defaultImages, front: value }
                          };
                          return { ...current, strapTypes: next };
                        });
                      }}
                      onUpload={uploadImage}
                    />
                  </div>
                  <div className="col-md-4">
                    <ImageField
                      label="Fallback Side"
                      value={editingContext.strapType.defaultImages.side}
                      onChange={(value) => {
                        updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                          const next = [...current.strapTypes];
                          const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                          next[editingLeather.strapTypeIndex] = {
                            ...primary,
                            defaultImages: { ...primary.defaultImages, side: value }
                          };
                          return { ...current, strapTypes: next };
                        });
                      }}
                      onUpload={uploadImage}
                    />
                  </div>
                  <div className="col-md-4">
                    <ImageField
                      label="Fallback Back"
                      value={editingContext.strapType.defaultImages.back}
                      onChange={(value) => {
                        updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                          const next = [...current.strapTypes];
                          const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                          next[editingLeather.strapTypeIndex] = {
                            ...primary,
                            defaultImages: { ...primary.defaultImages, back: value }
                          };
                          return { ...current, strapTypes: next };
                        });
                      }}
                      onUpload={uploadImage}
                    />
                  </div>
                </div>
              </details>
            </div>

            <div className="mt-4">
              <details className="border rounded p-2">
                <summary className="fw-semibold">Цвет кожи</summary>
                <details className="border rounded p-2 mt-2">
                <summary className="fw-semibold">Выбрать цвета (мультиселект)</summary>
                <div className="d-flex flex-column gap-2 mt-2">
                  {colorLibrary.length === 0 ? (
                    <span className="text-muted">Палитра пустая</span>
                  ) : (
                    colorLibrary.map((paletteColor) => {
                      const checked = editingContext.leatherType.leatherColors.some((item) => item.id === paletteColor.id);
                      return (
                        <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                          <input
                            className="form-check-input mt-0"
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              const isChecked = event.target.checked;
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const leatherTypes = [...primary.leatherTypes];
                                const targetLeather = leatherTypes[editingLeather.leatherIndex];
                                const currentColors = [...targetLeather.leatherColors];
                                const exists = currentColors.some((item) => item.id === paletteColor.id);
                                const leatherColors = isChecked
                                  ? exists
                                    ? currentColors
                                    : [...currentColors, { ...emptyLeatherColor(), id: paletteColor.id, label: paletteColor.name, hex: paletteColor.hex }]
                                  : currentColors.filter((item) => item.id !== paletteColor.id);
                                leatherTypes[editingLeather.leatherIndex] = { ...targetLeather, leatherColors };
                                next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                return { ...current, strapTypes: next };
                              });
                            }}
                          />
                          <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                        </label>
                      );
                    })
                  )}
                </div>
                </details>
                <div className="d-flex flex-column gap-3 mt-2">
                {editingContext.leatherType.leatherColors.map((color, colorIndex) => (
                  <div key={color.id} className="border rounded p-2">
                    <div className="d-flex justify-content-end mb-2">
                      <button
                        className={`btn btn-sm ${color.isHidden ? "btn-warning" : "btn-outline-secondary"}`}
                        onClick={() => {
                          updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                            const next = [...current.strapTypes];
                            const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                            const leatherTypes = [...primary.leatherTypes];
                            const target = leatherTypes[editingLeather.leatherIndex];
                            const leatherColors = [...target.leatherColors];
                            leatherColors[colorIndex] = {
                              ...leatherColors[colorIndex],
                              isHidden: !Boolean(leatherColors[colorIndex].isHidden)
                            };
                            leatherTypes[editingLeather.leatherIndex] = { ...target, leatherColors };
                            next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                            return { ...current, strapTypes: next };
                          });
                        }}
                      >
                        {color.isHidden ? "Показать вариант" : "Скрыть вариант"}
                      </button>
                    </div>
                    <div className="row g-2">
                      <div className="col-md-12">
                        <select
                          className="form-select"
                          value={
                            colorLibrary.find((item) => item.hex === color.hex && item.name === color.label)?.id ?? ""
                          }
                          onChange={(event) => {
                            const selected = colorLibrary.find((item) => item.id === event.target.value);
                            if (!selected) return;
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const leatherTypes = [...primary.leatherTypes];
                              const target = leatherTypes[editingLeather.leatherIndex];
                              const leatherColors = [...target.leatherColors];
                              leatherColors[colorIndex] = {
                                ...leatherColors[colorIndex],
                                label: selected.name,
                                hex: selected.hex
                              };
                              leatherTypes[editingLeather.leatherIndex] = { ...target, leatherColors };
                              next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                              return { ...current, strapTypes: next };
                            });
                          }}
                        >
                          <option value="">Цвет из палитры</option>
                          {colorLibrary.map((paletteColor) => (
                            <option key={paletteColor.id} value={paletteColor.id}>
                              {paletteColor.name || "(без названия)"} ({paletteColor.hex})
                            </option>
                          ))}
                        </select>
                        <input className="form-control mt-2" value={color.hex} readOnly />
                      </div>
                    </div>
                    <div className="row g-2 mt-1">
                      <div className="col-md-4">
                        <ImageField
                          label="Front слой"
                          value={color.layers.front}
                          onChange={(value) => {
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const leatherTypes = [...primary.leatherTypes];
                              const target = leatherTypes[editingLeather.leatherIndex];
                              const leatherColors = [...target.leatherColors];
                              leatherColors[colorIndex] = {
                                ...leatherColors[colorIndex],
                                layers: { ...leatherColors[colorIndex].layers, front: value }
                              };
                              leatherTypes[editingLeather.leatherIndex] = { ...target, leatherColors };
                              next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                              return { ...current, strapTypes: next };
                            });
                          }}
                          onUpload={uploadImage}
                        />
                      </div>
                      <div className="col-md-4">
                        <ImageField
                          label="Side слой"
                          value={color.layers.side}
                          onChange={(value) => {
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const leatherTypes = [...primary.leatherTypes];
                              const target = leatherTypes[editingLeather.leatherIndex];
                              const leatherColors = [...target.leatherColors];
                              leatherColors[colorIndex] = {
                                ...leatherColors[colorIndex],
                                layers: { ...leatherColors[colorIndex].layers, side: value }
                              };
                              leatherTypes[editingLeather.leatherIndex] = { ...target, leatherColors };
                              next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                              return { ...current, strapTypes: next };
                            });
                          }}
                          onUpload={uploadImage}
                        />
                      </div>
                      <div className="col-md-4">
                        <ImageField
                          label="Back слой"
                          value={color.layers.back}
                          onChange={(value) => {
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const leatherTypes = [...primary.leatherTypes];
                              const target = leatherTypes[editingLeather.leatherIndex];
                              const leatherColors = [...target.leatherColors];
                              leatherColors[colorIndex] = {
                                ...leatherColors[colorIndex],
                                layers: { ...leatherColors[colorIndex].layers, back: value }
                              };
                              leatherTypes[editingLeather.leatherIndex] = { ...target, leatherColors };
                              next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                              return { ...current, strapTypes: next };
                            });
                          }}
                          onUpload={uploadImage}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </details>
              </div>

            <div className="mt-4">
              <h6>Типы края и строчки</h6>
              <div className="d-flex gap-2 mb-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      const leatherTypes = [...primary.leatherTypes];
                      const target = leatherTypes[editingLeather.leatherIndex];
                      leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes: [...target.edgeTypes, emptyEdgeType()] };
                      next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                      return { ...current, strapTypes: next };
                    });
                  }}
                >
                  Добавить край
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      const leatherTypes = [...primary.leatherTypes];
                      const target = leatherTypes[editingLeather.leatherIndex];
                      leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes: [...target.stitchTypes, emptyStitchType()] };
                      next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                      return { ...current, strapTypes: next };
                    });
                  }}
                >
                  Добавить строчку
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <details className="border rounded p-2">
                    <summary className="fw-semibold">Цвет края</summary>
                    <div className="d-flex flex-column gap-2 mt-2">
                    {editingContext.leatherType.edgeTypes.map((edge, edgeIndex) => (
                      <div key={edge.id} className="border rounded p-2">
                        <div className="d-flex justify-content-end mb-2">
                          <button
                            className={`btn btn-sm ${edge.isHidden ? "btn-warning" : "btn-outline-secondary"}`}
                            onClick={() => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const leatherTypes = [...primary.leatherTypes];
                                const target = leatherTypes[editingLeather.leatherIndex];
                                const edgeTypes = [...target.edgeTypes];
                                edgeTypes[edgeIndex] = {
                                  ...edgeTypes[edgeIndex],
                                  isHidden: !Boolean(edgeTypes[edgeIndex].isHidden)
                                };
                                leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes };
                                next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                return { ...current, strapTypes: next };
                              });
                            }}
                          >
                            {edge.isHidden ? "Показать вариант" : "Скрыть вариант"}
                          </button>
                        </div>
                        <div className="row g-2">
                          <div className="col-md-12">
                            <select
                              className="form-select"
                              value={
                                colorLibrary.find((item) => item.hex === (edge.hex ?? "") && item.name === (edge.label ?? ""))?.id ??
                                ""
                              }
                              onChange={(event) => {
                                const selected = colorLibrary.find((item) => item.id === event.target.value);
                                if (!selected) return;
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const edgeTypes = [...target.edgeTypes];
                                  edgeTypes[edgeIndex] = {
                                    ...edgeTypes[edgeIndex],
                                    label: selected.name,
                                    hex: selected.hex
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                            >
                              <option value="">Цвет из палитры</option>
                              {colorLibrary.map((paletteColor) => (
                                <option key={paletteColor.id} value={paletteColor.id}>
                                  {paletteColor.name || "(без названия)"} ({paletteColor.hex})
                                </option>
                              ))}
                            </select>
                            <input className="form-control mt-2" value={edge.hex ?? ""} readOnly />
                          </div>
                        </div>
                        <div className="row g-2 mt-1">
                          <div className="col-md-4">
                            <ImageField
                              label="Front"
                              value={edge.layers.front}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const edgeTypes = [...target.edgeTypes];
                                  edgeTypes[edgeIndex] = {
                                    ...edgeTypes[edgeIndex],
                                    layers: { ...edgeTypes[edgeIndex].layers, front: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="col-md-4">
                            <ImageField
                              label="Side"
                              value={edge.layers.side}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const edgeTypes = [...target.edgeTypes];
                                  edgeTypes[edgeIndex] = {
                                    ...edgeTypes[edgeIndex],
                                    layers: { ...edgeTypes[edgeIndex].layers, side: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="col-md-4">
                            <ImageField
                              label="Back"
                              value={edge.layers.back}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const edgeTypes = [...target.edgeTypes];
                                  edgeTypes[edgeIndex] = {
                                    ...edgeTypes[edgeIndex],
                                    layers: { ...edgeTypes[edgeIndex].layers, back: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, edgeTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                        </div>
                        <div className="text-end mt-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const leatherTypes = [...primary.leatherTypes];
                                const target = leatherTypes[editingLeather.leatherIndex];
                                leatherTypes[editingLeather.leatherIndex] = {
                                  ...target,
                                  edgeTypes: target.edgeTypes.filter((_, idx) => idx !== edgeIndex)
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                return { ...current, strapTypes: next };
                              });
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                    </div>
                  </details>
                </div>

                <div className="col-md-6">
                  <details className="border rounded p-2">
                    <summary className="fw-semibold">Цвет строчки</summary>
                    <div className="d-flex flex-column gap-2 mt-2">
                    {editingContext.leatherType.stitchTypes.map((stitch, stitchIndex) => (
                      <div key={stitch.id} className="border rounded p-2">
                        <div className="d-flex justify-content-end mb-2">
                          <button
                            className={`btn btn-sm ${stitch.isHidden ? "btn-warning" : "btn-outline-secondary"}`}
                            onClick={() => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const leatherTypes = [...primary.leatherTypes];
                                const target = leatherTypes[editingLeather.leatherIndex];
                                const stitchTypes = [...target.stitchTypes];
                                stitchTypes[stitchIndex] = {
                                  ...stitchTypes[stitchIndex],
                                  isHidden: !Boolean(stitchTypes[stitchIndex].isHidden)
                                };
                                leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes };
                                next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                return { ...current, strapTypes: next };
                              });
                            }}
                          >
                            {stitch.isHidden ? "Показать вариант" : "Скрыть вариант"}
                          </button>
                        </div>
                        <div className="row g-2">
                          <div className="col-md-12">
                            <select
                              className="form-select"
                              value={
                                colorLibrary.find((item) => item.hex === (stitch.hex ?? "") && item.name === (stitch.label ?? ""))?.id ??
                                ""
                              }
                              onChange={(event) => {
                                const selected = colorLibrary.find((item) => item.id === event.target.value);
                                if (!selected) return;
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const stitchTypes = [...target.stitchTypes];
                                  stitchTypes[stitchIndex] = {
                                    ...stitchTypes[stitchIndex],
                                    label: selected.name,
                                    hex: selected.hex
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                            >
                              <option value="">Цвет из палитры</option>
                              {colorLibrary.map((paletteColor) => (
                                <option key={paletteColor.id} value={paletteColor.id}>
                                  {paletteColor.name || "(без названия)"} ({paletteColor.hex})
                                </option>
                              ))}
                            </select>
                            <input className="form-control mt-2" value={stitch.hex ?? ""} readOnly />
                          </div>
                        </div>
                        <div className="row g-2 mt-1">
                          <div className="col-md-4">
                            <ImageField
                              label="Front"
                              value={stitch.layers.front}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const stitchTypes = [...target.stitchTypes];
                                  stitchTypes[stitchIndex] = {
                                    ...stitchTypes[stitchIndex],
                                    layers: { ...stitchTypes[stitchIndex].layers, front: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="col-md-4">
                            <ImageField
                              label="Side"
                              value={stitch.layers.side}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const stitchTypes = [...target.stitchTypes];
                                  stitchTypes[stitchIndex] = {
                                    ...stitchTypes[stitchIndex],
                                    layers: { ...stitchTypes[stitchIndex].layers, side: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                          <div className="col-md-4">
                            <ImageField
                              label="Back"
                              value={stitch.layers.back}
                              onChange={(value) => {
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const leatherTypes = [...primary.leatherTypes];
                                  const target = leatherTypes[editingLeather.leatherIndex];
                                  const stitchTypes = [...target.stitchTypes];
                                  stitchTypes[stitchIndex] = {
                                    ...stitchTypes[stitchIndex],
                                    layers: { ...stitchTypes[stitchIndex].layers, back: value }
                                  };
                                  leatherTypes[editingLeather.leatherIndex] = { ...target, stitchTypes };
                                  next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                              onUpload={uploadImage}
                            />
                          </div>
                        </div>
                        <div className="text-end mt-2">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const leatherTypes = [...primary.leatherTypes];
                                const target = leatherTypes[editingLeather.leatherIndex];
                                leatherTypes[editingLeather.leatherIndex] = {
                                  ...target,
                                  stitchTypes: target.stitchTypes.filter((_, idx) => idx !== stitchIndex)
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, leatherTypes };
                                return { ...current, strapTypes: next };
                              });
                            }}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h6>Цвета пряжки и адаптера</h6>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="form-label mb-0">Есть бабочка</span>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={editingContext.strapType.buckleColors.hasButterfly}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                      const next = [...current.strapTypes];
                      const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                      next[editingLeather.strapTypeIndex] = {
                        ...primary,
                        buckleColors: { ...primary.buckleColors, hasButterfly: checked }
                      };
                      return { ...current, strapTypes: next };
                    });
                  }}
                />
              </div>
              <Collapsible title="Цвета пряжки" defaultOpen={false}>
                <details className="border rounded p-2 mt-2">
                  <summary className="fw-semibold">Выбрать из палитры</summary>
                  <div className="d-flex flex-column gap-2 mt-2">
                    {colorLibrary.length === 0 ? (
                      <span className="text-muted small">Добавьте цвета во вкладке «Цвета».</span>
                    ) : (
                      colorLibrary.map((paletteColor) => {
                        const checked = editingContext.strapType.buckleColors.options.some((item) => item.id === paletteColor.id);
                        return (
                          <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const currentOpts = [...primary.buckleColors.options];
                                  const exists = currentOpts.some((item) => item.id === paletteColor.id);
                                  const options = isChecked
                                    ? exists
                                      ? currentOpts
                                      : [...currentOpts, { ...emptyBuckleColor(), id: paletteColor.id, label: paletteColor.name, hex: paletteColor.hex }]
                                    : currentOpts.filter((item) => item.id !== paletteColor.id);
                                  next[editingLeather.strapTypeIndex] = {
                                    ...primary,
                                    buckleColors: { ...primary.buckleColors, options }
                                  };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                            />
                            <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                          </label>
                        );
                      })
                    )}
                  </div>
                </details>
                <div className="d-flex flex-column gap-2 mt-2">
                  {editingContext.strapType.buckleColors.options.map((color, colorIndex) => (
                    <Collapsible key={color.id} title={`Пряжка: ${color.label || color.id}`} defaultOpen={false}>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input className="form-control form-control-sm" value={color.id} placeholder="ID" readOnly />
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control form-control-sm"
                          value={color.label}
                          placeholder="Название"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const options = [...primary.buckleColors.options];
                              options[colorIndex] = { ...options[colorIndex], label: value };
                              next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                              return { ...current, strapTypes: next };
                            });
                          }}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control form-control-sm"
                          value={color.hex}
                          placeholder="#hex"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const options = [...primary.buckleColors.options];
                              options[colorIndex] = { ...options[colorIndex], hex: value };
                              next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                              return { ...current, strapTypes: next };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="small fw-semibold mb-2">Три ракурса (отображаются на картинках как цвет кожи / край / строчка)</p>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <ImageField
                            label="Фронт"
                            value={color.layers.standard.front}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const options = [...primary.buckleColors.options];
                                const layers = options[colorIndex].layers.standard;
                                options[colorIndex] = {
                                  ...options[colorIndex],
                                  layers: {
                                    ...options[colorIndex].layers,
                                    standard: { ...layers, front: value }
                                  }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Сбоку"
                            value={color.layers.standard.side}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const options = [...primary.buckleColors.options];
                                const layers = options[colorIndex].layers.standard;
                                options[colorIndex] = {
                                  ...options[colorIndex],
                                  layers: {
                                    ...options[colorIndex].layers,
                                    standard: { ...layers, side: value }
                                  }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Сзади"
                            value={color.layers.standard.back}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const options = [...primary.buckleColors.options];
                                const layers = options[colorIndex].layers.standard;
                                options[colorIndex] = {
                                  ...options[colorIndex],
                                  layers: {
                                    ...options[colorIndex].layers,
                                    standard: { ...layers, back: value }
                                  }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="small text-muted mt-2">Butterfly-слои и «Отображение в фильтрах (3 фото)» — в блоке «Тип ремешка» на вкладке Шаг 3.</div>
                    <div className="text-end mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                            const next = [...current.strapTypes];
                            const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                            const options = primary.buckleColors.options.filter((_, idx) => idx !== colorIndex);
                            next[editingLeather.strapTypeIndex] = { ...primary, buckleColors: { ...primary.buckleColors, options } };
                            return { ...current, strapTypes: next };
                          });
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </Collapsible>
                ))}
                </div>
              </Collapsible>
              <Collapsible title="Цвета адаптера" defaultOpen={false}>
                <details className="border rounded p-2 mt-2">
                  <summary className="fw-semibold">Выбрать из палитры</summary>
                  <div className="d-flex flex-column gap-2 mt-2">
                    {colorLibrary.length === 0 ? (
                      <span className="text-muted small">Добавьте цвета во вкладке «Цвета».</span>
                    ) : (
                      colorLibrary.map((paletteColor) => {
                        const checked = editingContext.strapType.adapterColors.some((item) => item.id === paletteColor.id);
                        return (
                          <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              checked={checked}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                  const next = [...current.strapTypes];
                                  const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                  const currentList = [...primary.adapterColors];
                                  const exists = currentList.some((item) => item.id === paletteColor.id);
                                  const adapterColors = isChecked
                                    ? exists
                                      ? currentList
                                      : [...currentList, { ...emptyAdapterColor(), id: paletteColor.id, label: paletteColor.name, hex: paletteColor.hex }]
                                    : currentList.filter((item) => item.id !== paletteColor.id);
                                  next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                                  return { ...current, strapTypes: next };
                                });
                              }}
                            />
                            <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                          </label>
                        );
                      })
                    )}
                  </div>
                </details>
                <div className="d-flex flex-column gap-2 mt-2">
                  {editingContext.strapType.adapterColors.map((color, colorIndex) => (
                  <Collapsible key={color.id} title={`Адаптер: ${color.label || color.id}`} defaultOpen={false}>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <input className="form-control form-control-sm" value={color.id} placeholder="ID" readOnly />
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control form-control-sm"
                          value={color.label}
                          placeholder="Название"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const adapterColors = [...primary.adapterColors];
                              adapterColors[colorIndex] = { ...adapterColors[colorIndex], label: value };
                              next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                              return { ...current, strapTypes: next };
                            });
                          }}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          className="form-control form-control-sm"
                          value={color.hex}
                          placeholder="#hex"
                          onChange={(e) => {
                            const value = e.target.value;
                            updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                              const next = [...current.strapTypes];
                              const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                              const adapterColors = [...primary.adapterColors];
                              adapterColors[colorIndex] = { ...adapterColors[colorIndex], hex: value };
                              next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                              return { ...current, strapTypes: next };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="small fw-semibold mb-2">Три ракурса (отображаются на картинках как цвет кожи / край / строчка)</p>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <ImageField
                            label="Фронт"
                            value={color.layers.front}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const adapterColors = [...primary.adapterColors];
                                adapterColors[colorIndex] = {
                                  ...adapterColors[colorIndex],
                                  layers: { ...adapterColors[colorIndex].layers, front: value }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Сбоку"
                            value={color.layers.side}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const adapterColors = [...primary.adapterColors];
                                adapterColors[colorIndex] = {
                                  ...adapterColors[colorIndex],
                                  layers: { ...adapterColors[colorIndex].layers, side: value }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                        <div className="col-md-4">
                          <ImageField
                            label="Сзади"
                            value={color.layers.back}
                            onChange={(value) => {
                              updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                                const next = [...current.strapTypes];
                                const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                                const adapterColors = [...primary.adapterColors];
                                adapterColors[colorIndex] = {
                                  ...adapterColors[colorIndex],
                                  layers: { ...adapterColors[colorIndex].layers, back: value }
                                };
                                next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                                return { ...current, strapTypes: next };
                              });
                            }}
                            onUpload={uploadImage}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="small fw-semibold mb-2">Фото в фильтрах (справа вместо кружка цвета)</p>
                      <ImageField
                        label="Изображение"
                        value={color.filterDisplayImage ?? ""}
                        onChange={(value) => {
                          updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                            const next = [...current.strapTypes];
                            const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                            const adapterColors = [...primary.adapterColors];
                            adapterColors[colorIndex] = { ...adapterColors[colorIndex], filterDisplayImage: value };
                            next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                            return { ...current, strapTypes: next };
                          });
                        }}
                        onUpload={uploadImage}
                      />
                    </div>
                    <div className="text-end mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          updateModelStep3Config(editingLeather.strapModelIndex, (current) => {
                            const next = [...current.strapTypes];
                            const primary = next[editingLeather.strapTypeIndex] ?? emptyStrapType();
                            const adapterColors = primary.adapterColors.filter((_, idx) => idx !== colorIndex);
                            next[editingLeather.strapTypeIndex] = { ...primary, adapterColors };
                            return { ...current, strapTypes: next };
                          });
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </Collapsible>
                ))}
              </div>
              </Collapsible>
            </div>
          </div>
        </div>
      )}

      {activeTab === 4 && (
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">Шаг 4: Оформление</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Заголовок</label>
              <input
                className="form-control"
                value={step4Config.title}
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    step4: { ...prev.step4, title: event.target.value }
                  }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Описание</label>
              <input
                className="form-control"
                value={step4Config.description}
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    step4: { ...prev.step4, description: event.target.value }
                  }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Текст кнопки</label>
              <input
                className="form-control"
                value={step4Config.ctaLabel}
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    step4: { ...prev.step4, ctaLabel: event.target.value }
                  }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Дата готовности</label>
              <input
                className="form-control"
                value={step4Config.readyDate}
                placeholder="10 февраля"
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    step4: { ...prev.step4, readyDate: event.target.value }
                  }))
                }
              />
            </div>
          </div>

          <div className="row g-3 mt-1">
            <div className="col-md-12">
              <label className="form-label">Текст под датой (опционально)</label>
              <input
                className="form-control"
                value={step4Config.readyDateNote}
                placeholder="Перед этим пришлем вам подробный видеообзор изделия."
                onChange={(event) =>
                  setConfig((prev) => ({
                    ...prev,
                    step4: { ...prev.step4, readyDateNote: event.target.value }
                  }))
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Карточки контента шага 4</h6>
            </div>

            <div className="d-flex flex-column gap-3">
              {step4Config.sections.length === 0 ? (
                <div className="text-muted small">Карточек пока нет.</div>
              ) : (
                step4Config.sections.map((section, sectionIndex) => {
                  const isInitialsCard = sectionIndex === 0;
                  const isEngravingCard =
                    section.id === "step4-card-engraving" ||
                    section.title?.trim()?.toLowerCase() === "гравировка";
                  const isPackageCard =
                    section.id === "step4-card-package" ||
                    section.title?.trim()?.toLowerCase() === "подарочная упаковка";
                  const isWristCard =
                    section.id === "step4-card-wrist" ||
                    section.title?.trim()?.toLowerCase() === "обхват запястья";
                  const cardSubtitle = section.title?.trim() ? ` · ${section.title}` : (sectionIndex === 0 ? (isWristCard ? " · Обхват запястья" : " · Инициалы") : "");
                  return (
                  <Collapsible key={section.id || `step4-section-${sectionIndex}`} title={`Карточка ${sectionIndex + 1}${cardSubtitle}`} defaultOpen={sectionIndex === 0}>
                    <div className="row g-2">
                      <div className={isWristCard ? "col-md-12" : "col-md-4"}>
                        <label className="form-label">Заголовок карточки</label>
                        <input
                          className="form-control"
                          value={section.title}
                          onChange={(event) => {
                            const value = event.target.value;
                            setConfig((prev) => {
                              const current = resolveStep4(prev.step4);
                              const nextSections = [...current.sections];
                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], title: value };
                              return { ...prev, step4: { ...current, sections: nextSections } };
                            });
                          }}
                        />
                      </div>
                      {!isWristCard ? (
                        <>
                          <div className="col-md-4">
                            <label className="form-label">Описание карточки</label>
                            <input
                              className="form-control"
                              value={section.description}
                              onChange={(event) => {
                                const value = event.target.value;
                                setConfig((prev) => {
                                  const current = resolveStep4(prev.step4);
                                  const nextSections = [...current.sections];
                                  nextSections[sectionIndex] = { ...nextSections[sectionIndex], description: value };
                                  return { ...prev, step4: { ...current, sections: nextSections } };
                                });
                              }}
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Цена</label>
                            <input
                              type="number"
                              className="form-control"
                              value={Number(section.price ?? 0)}
                              onChange={(event) => {
                                const value = Number(event.target.value || 0);
                                setConfig((prev) => {
                                  const current = resolveStep4(prev.step4);
                                  const nextSections = [...current.sections];
                                  nextSections[sectionIndex] = { ...nextSections[sectionIndex], price: value };
                                  return { ...prev, step4: { ...current, sections: nextSections } };
                                });
                              }}
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Текст CTA</label>
                            <input
                              className="form-control"
                              value={section.ctaLabel}
                              onChange={(event) => {
                                const value = event.target.value;
                                setConfig((prev) => {
                                  const current = resolveStep4(prev.step4);
                                  const nextSections = [...current.sections];
                                  nextSections[sectionIndex] = { ...nextSections[sectionIndex], ctaLabel: value };
                                  return { ...prev, step4: { ...current, sections: nextSections } };
                                });
                              }}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="row g-2 mt-1">
                      <div className="col-md-6">
                        <ImageField
                          label="Изображение карточки"
                          value={section.image}
                          onChange={(value) => {
                            setConfig((prev) => {
                              const current = resolveStep4(prev.step4);
                              const nextSections = [...current.sections];
                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], image: value };
                              return { ...prev, step4: { ...current, sections: nextSections } };
                            });
                          }}
                          onUpload={uploadImage}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Подпись под изображением</label>
                        <input
                          className="form-control"
                          value={section.imageDescription ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            setConfig((prev) => {
                              const current = resolveStep4(prev.step4);
                              const nextSections = [...current.sections];
                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], imageDescription: value };
                              return { ...prev, step4: { ...current, sections: nextSections } };
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 d-flex flex-column gap-2">
                      {isWristCard ? (
                        <Collapsible title="1/1 · Размеры (обхват запястья)" defaultOpen={true}>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label">Заголовок блока (на сайте: «1/1 • …»)</label>
                              <input
                                className="form-control"
                                value={section.placementLabel ?? ""}
                                placeholder="Выберите обхват запястья"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementLabel: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <VideoField
                                label="Видео для карточки (.webm)"
                                value={section.video ?? ""}
                                onChange={(value) => {
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], video: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                                onUpload={uploadImage}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Текст ссылки на скачивание</label>
                              <input
                                className="form-control"
                                value={section.downloadLinkText ?? ""}
                                placeholder="Напр.: Файл с линейкой для измерения"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], downloadLinkText: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Ссылка на скачивание (URL)</label>
                              <input
                                className="form-control"
                                value={section.downloadLinkUrl ?? ""}
                                placeholder="https://..."
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], downloadLinkUrl: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label mb-0">Размеры (варианты в селекторе)</label>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  type="button"
                                  onClick={() => {
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      const options = [...(nextSections[sectionIndex].options ?? []), { id: `step4-wrist-opt-${Date.now()}`, label: "", price: 0 }];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], options };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                >
                                  Добавить размер
                                </button>
                              </div>
                              <div className="d-flex flex-column gap-2">
                                {(section.options ?? []).length === 0 ? (
                                  <div className="text-muted small">Размеров пока нет. Добавьте варианты (например: Скажу позже, 14 см, 15 см).</div>
                                ) : (
                                  (section.options ?? []).map((opt, optIndex) => (
                                    <div key={opt.id || `wrist-opt-${optIndex}`} className="row g-2 align-items-center">
                                      <div className="col-md-10">
                                        <input
                                          className="form-control"
                                          value={opt.label}
                                          placeholder="Напр.: Скажу позже или 16 см"
                                          onChange={(event) => {
                                            const value = event.target.value;
                                            setConfig((prev) => {
                                              const current = resolveStep4(prev.step4);
                                              const nextSections = [...current.sections];
                                              const options = [...(nextSections[sectionIndex].options ?? [])];
                                              options[optIndex] = { ...options[optIndex], label: value };
                                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], options };
                                              return { ...prev, step4: { ...current, sections: nextSections } };
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="col-md-2 text-end">
                                        <button
                                          className="btn btn-outline-danger btn-sm"
                                          type="button"
                                          onClick={() => {
                                            setConfig((prev) => {
                                              const current = resolveStep4(prev.step4);
                                              const nextSections = [...current.sections];
                                              const options = (nextSections[sectionIndex].options ?? []).filter((_, idx) => idx !== optIndex);
                                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], options };
                                              return { ...prev, step4: { ...current, sections: nextSections } };
                                            });
                                          }}
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </Collapsible>
                      ) : isEngravingCard ? (
                        <Collapsible title="1/1 · Шрифт гравировки" defaultOpen={true}>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label">Заголовок блока (на сайте: «1/1 • …»)</label>
                              <input
                                className="form-control"
                                value={section.methodLabel ?? ""}
                                placeholder="Напр.: Шрифт гравировки"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], methodLabel: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="form-label mb-0">Кнопки (названия шрифтов)</label>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => {
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      const placementOptions = [...(nextSections[sectionIndex].placementOptions ?? []), ""];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                >
                                  Добавить кнопку
                                </button>
                              </div>
                              <div className="d-flex flex-column gap-2">
                                {(section.placementOptions ?? []).length === 0 ? (
                                  <div className="text-muted small">Кнопок пока нет.</div>
                                ) : (
                                  (section.placementOptions ?? []).map((placement, placementIndex) => (
                                    <div key={`${section.id}-placement-${placementIndex}`} className="row g-2 align-items-center">
                                      <div className="col-md-10">
                                        <input
                                          className="form-control"
                                          value={placement}
                                          placeholder="Текст кнопки (напр. Calligro, Harmonia)"
                                          onChange={(event) => {
                                            const value = event.target.value;
                                            setConfig((prev) => {
                                              const current = resolveStep4(prev.step4);
                                              const nextSections = [...current.sections];
                                              const placementOptions = [...(nextSections[sectionIndex].placementOptions ?? [])];
                                              placementOptions[placementIndex] = value;
                                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                              return { ...prev, step4: { ...current, sections: nextSections } };
                                            });
                                          }}
                                        />
                                      </div>
                                      <div className="col-md-2 text-end">
                                        <button
                                          className="btn btn-outline-danger btn-sm"
                                          onClick={() => {
                                            setConfig((prev) => {
                                              const current = resolveStep4(prev.step4);
                                              const nextSections = [...current.sections];
                                              const placementOptions = (nextSections[sectionIndex].placementOptions ?? []).filter((_, idx) => idx !== placementIndex);
                                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                              return { ...prev, step4: { ...current, sections: nextSections } };
                                            });
                                          }}
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                            <div className="row g-2 mt-2">
                              <div className="col-12">
                                <label className="form-label">Текст надписи — лейбл поля</label>
                                <input
                                  className="form-control"
                                  value={section.inputLabel ?? ""}
                                  placeholder="Напр.: Текст надписи"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputLabel: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Placeholder поля</label>
                                <input
                                  className="form-control"
                                  value={section.inputPlaceholder ?? ""}
                                  placeholder="Напр.: Верь в себя"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputPlaceholder: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Макс. символов (счётчик)</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={500}
                                  className="form-control"
                                  value={section.inputMaxLength ?? 20}
                                  onChange={(event) => {
                                    const value = Math.max(1, Math.min(500, Number(event.target.value) || 20));
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputMaxLength: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="row g-2 mt-2">
                              <div className="col-12">
                                <label className="form-label">Текст под полем (подсказка / дисклеймер)</label>
                                <textarea
                                  className="form-control"
                                  rows={3}
                                  value={section.inputNote ?? ""}
                                  placeholder="Напр.: После оплаты заказа мы свяжемся с вами..."
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputNote: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Collapsible>
                      ) : isPackageCard ? (
                        <Collapsible title="Подарочная упаковка — 1/2 и 2/2" defaultOpen={true}>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label">1/2 · Заголовок (напр. Цвет ленточки)</label>
                              <input
                                className="form-control"
                                value={section.methodLabel ?? ""}
                                placeholder="Напр.: Цвет ленточки"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], methodLabel: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Цвета в селекторе (выберите из палитры)</label>
                              <div className="d-flex flex-column gap-2 border rounded p-2 bg-light">
                                {colorLibrary.length === 0 ? (
                                  <span className="text-muted small">Добавьте цвета на вкладке «Цвета».</span>
                                ) : (
                                  colorLibrary.map((paletteColor) => {
                                    const ids = section.methodColorIds ?? [];
                                    const checked = ids.includes(paletteColor.id);
                                    return (
                                      <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                        <input
                                          className="form-check-input mt-0"
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(event) => {
                                            const isChecked = event.target.checked;
                                            setConfig((prev) => {
                                              const current = resolveStep4(prev.step4);
                                              const nextSections = [...current.sections];
                                              const currentIds = nextSections[sectionIndex].methodColorIds ?? [];
                                              const methodColorIds = isChecked
                                                ? currentIds.includes(paletteColor.id)
                                                  ? currentIds
                                                  : [...currentIds, paletteColor.id]
                                                : currentIds.filter((id) => id !== paletteColor.id);
                                              nextSections[sectionIndex] = { ...nextSections[sectionIndex], methodColorIds };
                                              return { ...prev, step4: { ...current, sections: nextSections } };
                                            });
                                          }}
                                        />
                                        <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                                      </label>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row g-2 mt-3">
                            <div className="col-12">
                              <label className="form-label">2/2 · Лейбл поля (напр. Текст для открытки)</label>
                              <input
                                className="form-control"
                                value={section.inputLabel ?? ""}
                                placeholder="Напр.: Текст для открытки"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputLabel: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Placeholder поля</label>
                              <input
                                className="form-control"
                                value={section.inputPlaceholder ?? ""}
                                placeholder="Напр.: Поздравляю с днем рождения!..."
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputPlaceholder: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Макс. символов</label>
                              <input
                                type="number"
                                min={1}
                                max={500}
                                className="form-control"
                                value={section.inputMaxLength ?? 150}
                                onChange={(event) => {
                                  const value = Math.max(1, Math.min(500, Number(event.target.value) || 150));
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputMaxLength: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Подсказка у иконки i</label>
                              <input
                                className="form-control"
                                value={section.inputInfoLabel ?? ""}
                                placeholder="Опционально"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputInfoLabel: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Текст под полем (опционально)</label>
                              <textarea
                                className="form-control"
                                rows={2}
                                value={section.inputNote ?? ""}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  setConfig((prev) => {
                                    const current = resolveStep4(prev.step4);
                                    const nextSections = [...current.sections];
                                    nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputNote: value };
                                    return { ...prev, step4: { ...current, sections: nextSections } };
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </Collapsible>
                      ) : (
                        <>
                          <Collapsible title="1/3 · Селектор цвета (мультиселект из вкладки Цвета)" defaultOpen={true}>
                            <div className="row g-2">
                              <div className="col-12">
                                <label className="form-label">Заголовок секции</label>
                                <input
                                  className="form-control"
                                  value={section.methodLabel ?? ""}
                                  placeholder="Напр.: Как нанести инициалы?"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], methodLabel: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label">Цвета в селекторе (выберите из палитры)</label>
                                <div className="d-flex flex-column gap-2 border rounded p-2 bg-light">
                                  {colorLibrary.length === 0 ? (
                                    <span className="text-muted small">Добавьте цвета на вкладке «Цвета».</span>
                                  ) : (
                                    colorLibrary.map((paletteColor) => {
                                      const ids = section.methodColorIds ?? [];
                                      const checked = ids.includes(paletteColor.id);
                                      return (
                                        <label key={paletteColor.id} className="form-check d-flex align-items-center gap-2">
                                          <input
                                            className="form-check-input mt-0"
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(event) => {
                                              const isChecked = event.target.checked;
                                              setConfig((prev) => {
                                                const current = resolveStep4(prev.step4);
                                                const nextSections = [...current.sections];
                                                const currentIds = nextSections[sectionIndex].methodColorIds ?? [];
                                                const methodColorIds = isChecked
                                                  ? currentIds.includes(paletteColor.id)
                                                    ? currentIds
                                                    : [...currentIds, paletteColor.id]
                                                  : currentIds.filter((id) => id !== paletteColor.id);
                                                nextSections[sectionIndex] = { ...nextSections[sectionIndex], methodColorIds };
                                                return { ...prev, step4: { ...current, sections: nextSections } };
                                              });
                                            }}
                                          />
                                          <ColorLabel name={paletteColor.name} hex={paletteColor.hex} />
                                        </label>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            </div>
                          </Collapsible>

                          <Collapsible title="2/3 · Кнопки с текстом" defaultOpen={true}>
                            <div className="row g-2">
                              <div className="col-12">
                                <label className="form-label">Заголовок секции</label>
                                <input
                                  className="form-control"
                                  value={section.placementLabel ?? ""}
                                  placeholder="Напр.: Где нанести инициалы?"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementLabel: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <label className="form-label mb-0">Кнопки</label>
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                      setConfig((prev) => {
                                        const current = resolveStep4(prev.step4);
                                        const nextSections = [...current.sections];
                                        const placementOptions = [...(nextSections[sectionIndex].placementOptions ?? []), ""];
                                        nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                        return { ...prev, step4: { ...current, sections: nextSections } };
                                      });
                                    }}
                                  >
                                    Добавить кнопку
                                  </button>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                  {(section.placementOptions ?? []).length === 0 ? (
                                    <div className="text-muted small">Кнопок пока нет.</div>
                                  ) : (
                                    (section.placementOptions ?? []).map((placement, placementIndex) => (
                                      <div key={`${section.id}-placement-${placementIndex}`} className="row g-2 align-items-center">
                                        <div className="col-md-10">
                                          <input
                                            className="form-control"
                                            value={placement}
                                            placeholder="Текст кнопки"
                                            onChange={(event) => {
                                              const value = event.target.value;
                                              setConfig((prev) => {
                                                const current = resolveStep4(prev.step4);
                                                const nextSections = [...current.sections];
                                                const placementOptions = [...(nextSections[sectionIndex].placementOptions ?? [])];
                                                placementOptions[placementIndex] = value;
                                                nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                                return { ...prev, step4: { ...current, sections: nextSections } };
                                              });
                                            }}
                                          />
                                        </div>
                                        <div className="col-md-2 text-end">
                                          <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => {
                                              setConfig((prev) => {
                                                const current = resolveStep4(prev.step4);
                                                const nextSections = [...current.sections];
                                                const placementOptions = (nextSections[sectionIndex].placementOptions ?? []).filter((_, idx) => idx !== placementIndex);
                                                nextSections[sectionIndex] = { ...nextSections[sectionIndex], placementOptions };
                                                return { ...prev, step4: { ...current, sections: nextSections } };
                                              });
                                            }}
                                          >
                                            Удалить
                                          </button>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          </Collapsible>

                          <Collapsible title="3/3 · Поле ввода и info label" defaultOpen={true}>
                            <div className="row g-2">
                              <div className="col-md-6">
                                <label className="form-label">Лейбл поля ввода</label>
                                <input
                                  className="form-control"
                                  value={section.inputLabel ?? ""}
                                  placeholder="Напр.: Текст инициалов"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputLabel: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Placeholder</label>
                                <input
                                  className="form-control"
                                  value={section.inputPlaceholder ?? ""}
                                  placeholder="Напр.: В.Л"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputPlaceholder: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label">Текст для info label (подсказка у иконки i)</label>
                                <input
                                  className="form-control"
                                  value={section.inputInfoLabel ?? ""}
                                  placeholder="Напр.: До 3 символов, только верхний регистр"
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setConfig((prev) => {
                                      const current = resolveStep4(prev.step4);
                                      const nextSections = [...current.sections];
                                      nextSections[sectionIndex] = { ...nextSections[sectionIndex], inputInfoLabel: value };
                                      return { ...prev, step4: { ...current, sections: nextSections } };
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </Collapsible>
                        </>
                      )}
                    </div>

                  </Collapsible>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 5 && (
        <div className="card p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Палитра цветов</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  colorLibrary: [...(prev.colorLibrary ?? []), emptyColorLibraryItem()]
                }))
              }
            >
              Добавить цвет
            </button>
          </div>

          <div className="d-flex flex-column gap-2">
            {colorLibrary.length === 0 ? (
              <div className="text-muted">Палитра пустая. Добавьте цвет, чтобы использовать его в селекторах.</div>
            ) : (
              colorLibrary.map((color, index) => (
                <div key={color.id} className="row g-2 align-items-center border rounded p-2">
                  <div className="col-md-1">
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9999,
                        border: "1px solid #dcdcdc",
                        backgroundColor: color.hex || "#000000"
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      className="form-control"
                      value={color.name}
                      placeholder="Название"
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...(prev.colorLibrary ?? [])];
                          next[index] = { ...next[index], name: value };
                          return { ...prev, colorLibrary: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      value={color.hex}
                      placeholder="#000000"
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...(prev.colorLibrary ?? [])];
                          next[index] = { ...next[index], hex: value };
                          return { ...prev, colorLibrary: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      className="form-control"
                      value={color.id}
                      placeholder="ID"
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...(prev.colorLibrary ?? [])];
                          next[index] = { ...next[index], id: value };
                          return { ...prev, colorLibrary: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-1 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          colorLibrary: (prev.colorLibrary ?? []).filter((item) => item.id !== color.id)
                        }))
                      }
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 6 && (
        <div className="card p-3 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Промокоды</h5>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  promoCodes: [...(prev.promoCodes ?? []), emptyPromoCode()]
                }))
              }
            >
              Добавить промокод
            </button>
          </div>

          <div className="d-flex flex-column gap-2">
            {(config.promoCodes ?? []).length === 0 ? (
              <div className="text-muted">Список промокодов пуст.</div>
            ) : (
              (config.promoCodes ?? []).map((promo, index) => (
                <div key={promo.id || `promo-${index}`} className="row g-2 align-items-end border rounded p-2">
                  <div className="col-md-3">
                    <label className="form-label">Код</label>
                    <input
                      className="form-control"
                      value={promo.code}
                      placeholder="SALE10"
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...(prev.promoCodes ?? [])];
                          next[index] = { ...next[index], code: value };
                          return { ...prev, promoCodes: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Тип</label>
                    <select
                      className="form-select"
                      value={promo.type}
                      onChange={(event) => {
                        const value = event.target.value === "percent" ? "percent" : "amount";
                        setConfig((prev) => {
                          const next = [...(prev.promoCodes ?? [])];
                          next[index] = { ...next[index], type: value };
                          return { ...prev, promoCodes: next };
                        });
                      }}
                    >
                      <option value="amount">Рубли</option>
                      <option value="percent">Проценты</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">{promo.type === "percent" ? "Значение, %" : "Значение, ₽"}</label>
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      value={Number(promo.value ?? 0)}
                      onChange={(event) => {
                        const value = Math.max(0, Number(event.target.value || 0));
                        setConfig((prev) => {
                          const next = [...(prev.promoCodes ?? [])];
                          next[index] = { ...next[index], value };
                          return { ...prev, promoCodes: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Кол-во использований</label>
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      value={Number(promo.remainingUses ?? 0)}
                      onChange={(event) => {
                        const value = Math.max(0, Number(event.target.value || 0));
                        setConfig((prev) => {
                          const next = [...(prev.promoCodes ?? [])];
                          next[index] = { ...next[index], remainingUses: value };
                          return { ...prev, promoCodes: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">ID</label>
                    <input
                      className="form-control"
                      value={promo.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfig((prev) => {
                          const next = [...(prev.promoCodes ?? [])];
                          next[index] = { ...next[index], id: value };
                          return { ...prev, promoCodes: next };
                        });
                      }}
                    />
                  </div>
                  <div className="col-md-1 text-end">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          promoCodes: (prev.promoCodes ?? []).filter((_, idx) => idx !== index)
                        }))
                      }
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
