"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react";
import { appConfigStore } from "@/src/entities/app-config";
import { cartStore, type CartItem } from "@/src/entities/cart";
import type { CartItemConfiguration, CartStrapItemConfiguration } from "@/src/shared/types/CartItemConfiguration";
import type { StrapTypeConfig } from "@/src/shared/types/StrapConfigTypes";
import type { Step4SectionConfig } from "@/src/shared/types/AppConfigTypes";
import { resolvePhoneCasePreviewUrls } from "@/src/shared/lib/phoneCaseConfig";
import EditParameterModal, {
  type EngravingConfig,
  type InitialsConfig,
  type PackageConfig
} from "./EditParameterModal";
import styles from "./EditItemModal.module.css";

const hasInitialsConfig = (s: Step4SectionConfig) =>
  Boolean(
    s.methodLabel &&
      (s.placementOptions ?? []).length > 0 &&
      s.inputLabel &&
      (s.methodColorIds ?? []).length > 0
  );

const isEngravingSection = (s: Step4SectionConfig) =>
  (s.id === "step4-card-engraving" ||
    String(s.title ?? "").trim().toLowerCase() === "гравировка") &&
  (s.placementOptions ?? []).length > 0 &&
  Boolean(s.inputLabel);

const isPackageSection = (s: Step4SectionConfig) =>
  (s.id === "step4-card-package" ||
    String(s.title ?? "").trim().toLowerCase() === "подарочная упаковка") &&
  ((s.methodColorIds ?? []).length > 0 || Boolean(s.inputLabel || s.inputPlaceholder != null));

const getDefaultInitials = (s: Step4SectionConfig): InitialsConfig => ({
  methodId: s.methodColorIds?.[0] ?? "",
  placement: (s.placementOptions ?? [])[0] ?? "",
  initials: ""
});

const getDefaultEngraving = (s: Step4SectionConfig): EngravingConfig => ({
  fontOption: (s.placementOptions ?? [])[0] ?? "",
  inscription: ""
});

const getDefaultPackage = (s: Step4SectionConfig): PackageConfig => ({
  methodId: s.methodColorIds?.[0] ?? "",
  cardText: ""
});

type Props = {
  item: CartItem | null;
  onClose: () => void;
};

const isWristSection = (id?: string, title?: string) =>
  id === "step4-card-wrist" || String(title ?? "").trim().toLowerCase() === "обхват запястья";

type PaletteColor = { id: string; name: string; hex: string };

function resolveCaseColors(
  variants: { colorId: string }[],
  paletteById: Map<string, PaletteColor>
): PaletteColor[] {
  const result: PaletteColor[] = [];
  const seen = new Set<string>();
  for (const variant of variants) {
    const id = String(variant.colorId ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const fromPalette = paletteById.get(id);
    result.push(fromPalette ?? { id, name: id, hex: "#cccccc" });
  }
  return result;
}

const EditItemModal = observer(({ item, onClose }: Props) => {
  const initializedItemIdRef = useRef<string | null>(null);
  const watchModels = appConfigStore.config.watchModels ?? [];
  const strapModels = appConfigStore.config.strapModels ?? [];
  const step4Sections = appConfigStore.config.step4?.sections ?? [];
  const wristSection = step4Sections.find((s) => isWristSection(s.id, s.title));
  const addonSections = step4Sections.filter((s) => !isWristSection(s.id, s.title));
  const wristOptions = (wristSection?.options ?? []).filter((opt) => String(opt.label ?? "").trim() !== "");

  const strapConfiguration: CartStrapItemConfiguration | null =
    item?.configuration != null &&
    item.configuration.productType !== "case" &&
    "watch" in item.configuration
      ? (item.configuration as CartStrapItemConfiguration)
      : null;

  const initialWatchModelId = strapConfiguration?.watch.watchModelId ?? watchModels[0]?.id ?? 0;
  const [watchModelId, setWatchModelId] = useState<number>(initialWatchModelId);
  const selectedWatchModel = useMemo(
    () => watchModels.find((m) => m.id === watchModelId) ?? watchModels[0],
    [watchModels, watchModelId]
  );

  const [watchSize, setWatchSize] = useState<number>(
    strapConfiguration?.watch.watchSize ?? selectedWatchModel?.sizes?.[0] ?? 0
  );
  const [watchColorHex, setWatchColorHex] = useState<string>(
    strapConfiguration?.watch.watchColorHex ?? selectedWatchModel?.colors?.[0]?.hex ?? ""
  );

  const [strapModelId, setStrapModelId] = useState<number>(
    strapConfiguration?.strap.strapModelId ?? strapModels[0]?.id ?? 0
  );
  const selectedStrapModel = useMemo(
    () => strapModels.find((m) => m.id === strapModelId) ?? strapModels[0],
    [strapModels, strapModelId]
  );
  const strapTypes = selectedStrapModel?.step3Config?.strapTypes ?? [];

  const [strapTypeId, setStrapTypeId] = useState<string>(
    strapConfiguration?.step3.strapTypeId ?? strapTypes[0]?.id ?? ""
  );
  const selectedStrapType: StrapTypeConfig | undefined = useMemo(
    () => strapTypes.find((t) => t.id === strapTypeId) ?? strapTypes[0],
    [strapTypes, strapTypeId]
  );

  const leatherTypes = selectedStrapType?.leatherTypes ?? [];
  const [leatherTypeId, setLeatherTypeId] = useState<string>(
    strapConfiguration?.step3.leatherTypeId ?? leatherTypes[0]?.id ?? ""
  );
  const selectedLeatherType = useMemo(
    () => leatherTypes.find((t) => t.id === leatherTypeId) ?? leatherTypes[0],
    [leatherTypes, leatherTypeId]
  );

  const leatherColors = selectedLeatherType?.leatherColors ?? [];
  const edgeTypes = selectedLeatherType?.edgeTypes ?? [];
  const stitchTypes = selectedLeatherType?.stitchTypes ?? [];

  const [leatherColorId, setLeatherColorId] = useState<string>(
    strapConfiguration?.step3.leatherColorId ?? leatherColors[0]?.id ?? ""
  );
  const [edgeTypeId, setEdgeTypeId] = useState<string>(strapConfiguration?.step3.edgeTypeId ?? edgeTypes[0]?.id ?? "");
  const [stitchTypeId, setStitchTypeId] = useState<string>(
    strapConfiguration?.step3.stitchTypeId ?? stitchTypes[0]?.id ?? ""
  );

  const buckleColors = (selectedStrapType?.buckleColors.options ?? []).filter((x) => !x.isHidden);
  const adapterColors = (selectedStrapType?.adapterColors ?? []).filter((x) => !x.isHidden);
  const [buckleColorId, setBuckleColorId] = useState<string>(
    strapConfiguration?.step3.buckleColorId ?? buckleColors[0]?.id ?? ""
  );
  const [buckleVariant, setBuckleVariant] = useState<"standard" | "butterfly">(
    strapConfiguration?.step3.buckleVariant ?? "standard"
  );
  const [adapterColorId, setAdapterColorId] = useState<string>(
    strapConfiguration?.step3.adapterColorId ?? adapterColors[0]?.id ?? ""
  );
  const colorPalette = appConfigStore.config.colorLibrary ?? [];
  const paletteById = useMemo(
    () => new Map(colorPalette.map((color) => [color.id, color])),
    [colorPalette]
  );
  const caseConfig = appConfigStore.config.phoneCase;
  const caseModels = caseConfig?.iphoneModels ?? [];
  const caseFormTypes = caseConfig?.formTypes ?? [];
  const [caseIphoneModelId, setCaseIphoneModelId] = useState<string>(
    item?.configuration?.productType === "case" ? item.configuration.iphoneModelId : caseModels[0]?.id ?? ""
  );
  const [caseFormTypeId, setCaseFormTypeId] = useState<string>(
    item?.configuration?.productType === "case"
      ? item.configuration.caseFormTypeId ?? caseFormTypes[0]?.id ?? ""
      : caseFormTypes[0]?.id ?? ""
  );
  const selectedCaseFormType = useMemo(
    () => caseFormTypes.find((type) => type.id === caseFormTypeId) ?? caseFormTypes[0],
    [caseFormTypes, caseFormTypeId]
  );
  const caseOutsideColors = useMemo(
    () => resolveCaseColors(selectedCaseFormType?.outsideVariants ?? [], paletteById),
    [selectedCaseFormType, paletteById]
  );
  const caseInsideColors = useMemo(
    () => resolveCaseColors(selectedCaseFormType?.insideVariants ?? [], paletteById),
    [selectedCaseFormType, paletteById]
  );
  const [caseOutsideColorId, setCaseOutsideColorId] = useState<string>(
    item?.configuration?.productType === "case"
      ? item.configuration.outsideColorId
      : caseOutsideColors[0]?.id ?? ""
  );
  const [caseInsideColorId, setCaseInsideColorId] = useState<string>(
    item?.configuration?.productType === "case"
      ? item.configuration.insideColorId
      : caseInsideColors[0]?.id ?? ""
  );
  const [casePersonalizationNote, setCasePersonalizationNote] = useState<string>(
    item?.configuration?.productType === "case" ? item.configuration.personalizationNote ?? "" : ""
  );

  const [wristOptionId, setWristOptionId] = useState<string>(
    strapConfiguration?.step4.wristOptionId ?? wristOptions[0]?.id ?? ""
  );
  /** Открыто ли модальное окно редактирования параметра: null | 'wrist' | cardId аддона */
  const [editParamKey, setEditParamKey] = useState<null | "wrist" | string>(null);
  /** Для карточек с тиснением инициалов: способ, место, текст. */
  const [initialsByCardId, setInitialsByCardId] = useState<Record<string, InitialsConfig>>({});
  /** Для карточек с гравировкой: шрифт и текст надписи. */
  const [engravingByCardId, setEngravingByCardId] = useState<Record<string, EngravingConfig>>({});
  /** Для карточек подарочной упаковки: способ (цвет) и текст для открытки. */
  const [packageByCardId, setPackageByCardId] = useState<Record<string, PackageConfig>>({});
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>(() => {
    const next: Record<string, boolean> = {};
    (strapConfiguration?.step4.addonCardIds ?? []).forEach((id: string) => {
      next[id] = true;
    });
    return next;
  });

  useEffect(() => {
    if (!item) {
      initializedItemIdRef.current = null;
      return;
    }
    if (initializedItemIdRef.current === item.id) return;
    initializedItemIdRef.current = item.id;

    if (!item.configuration || item.configuration.productType === "case" || !("watch" in item.configuration)) {
      return;
    }
    const cfg = item.configuration as CartStrapItemConfiguration;
    const defaultWatchModel = watchModels.find((m) => m.id === (cfg.watch.watchModelId ?? -1)) ?? watchModels[0];
    const defaultStrapModel = strapModels.find((m) => m.id === (cfg.strap.strapModelId ?? -1)) ?? strapModels[0];
    const defaultStrapTypes = defaultStrapModel?.step3Config?.strapTypes ?? [];
    const defaultStrapType =
      defaultStrapTypes.find((t) => t.id === (cfg.step3.strapTypeId ?? "")) ?? defaultStrapTypes[0];
    const defaultLeatherType =
      defaultStrapType?.leatherTypes.find((t) => t.id === (cfg.step3.leatherTypeId ?? "")) ??
      defaultStrapType?.leatherTypes[0];
    setWatchModelId(defaultWatchModel?.id ?? 0);
    setWatchSize(cfg.watch.watchSize ?? defaultWatchModel?.sizes?.[0] ?? 0);
    setWatchColorHex(cfg.watch.watchColorHex ?? defaultWatchModel?.colors?.[0]?.hex ?? "");
    setStrapModelId(defaultStrapModel?.id ?? 0);
    setStrapTypeId(defaultStrapType?.id ?? "");
    setLeatherTypeId(defaultLeatherType?.id ?? "");
    setLeatherColorId(
      cfg.step3.leatherColorId ??
        defaultLeatherType?.leatherColors?.find((x) => !x.isHidden)?.id ??
        defaultLeatherType?.leatherColors?.[0]?.id ??
        ""
    );
    setEdgeTypeId(
      cfg.step3.edgeTypeId ??
        defaultLeatherType?.edgeTypes?.find((x) => !x.isHidden)?.id ??
        defaultLeatherType?.edgeTypes?.[0]?.id ??
        ""
    );
    setStitchTypeId(
      cfg.step3.stitchTypeId ??
        defaultLeatherType?.stitchTypes?.find((x) => !x.isHidden)?.id ??
        defaultLeatherType?.stitchTypes?.[0]?.id ??
        ""
    );
    setBuckleColorId(
      cfg.step3.buckleColorId ??
        defaultStrapType?.buckleColors.options?.find((x) => !x.isHidden)?.id ??
        defaultStrapType?.buckleColors.options?.[0]?.id ??
        ""
    );
    setAdapterColorId(
      cfg.step3.adapterColorId ??
        defaultStrapType?.adapterColors?.find((x) => !x.isHidden)?.id ??
        defaultStrapType?.adapterColors?.[0]?.id ??
        ""
    );
    setBuckleVariant(cfg.step3.buckleVariant ?? "standard");
    setWristOptionId(cfg.step4.wristOptionId ?? wristOptions[0]?.id ?? "");
    const next: Record<string, boolean> = {};
    (cfg.step4.addonCardIds ?? []).forEach((id: string) => {
      next[id] = true;
    });
    setSelectedAddons(next);
  }, [item?.id]);

  useEffect(() => {
    if (!item || item.configuration?.productType !== "case") return;
    const cfg = item.configuration;
    setCaseIphoneModelId(cfg.iphoneModelId ?? caseModels[0]?.id ?? "");
    setCaseFormTypeId(cfg.caseFormTypeId ?? caseFormTypes[0]?.id ?? "");
    setCaseOutsideColorId(cfg.outsideColorId ?? "");
    setCaseInsideColorId(cfg.insideColorId ?? "");
    setCasePersonalizationNote(cfg.personalizationNote ?? "");
  }, [item?.id, caseModels, caseFormTypes]);

  useEffect(() => {
    if (!selectedCaseFormType) return;
    if (!caseOutsideColors.some((color) => color.id === caseOutsideColorId)) {
      setCaseOutsideColorId(caseOutsideColors[0]?.id ?? "");
    }
    if (!caseInsideColors.some((color) => color.id === caseInsideColorId)) {
      setCaseInsideColorId(caseInsideColors[0]?.id ?? "");
    }
  }, [selectedCaseFormType, caseOutsideColors, caseInsideColors, caseOutsideColorId, caseInsideColorId]);

  useEffect(() => {
    if (!selectedWatchModel) return;
    if (!selectedWatchModel.sizes.includes(watchSize)) {
      setWatchSize(selectedWatchModel.sizes[0] ?? 0);
    }
    if (!(selectedWatchModel.colors ?? []).some((c) => c.hex === watchColorHex)) {
      setWatchColorHex(selectedWatchModel.colors?.[0]?.hex ?? "");
    }
  }, [selectedWatchModel, watchSize, watchColorHex]);

  useEffect(() => {
    if (!strapTypes.some((t) => t.id === strapTypeId)) {
      setStrapTypeId(strapTypes[0]?.id ?? "");
    }
  }, [strapTypes, strapTypeId]);

  useEffect(() => {
    if (!leatherTypes.some((t) => t.id === leatherTypeId)) setLeatherTypeId(leatherTypes[0]?.id ?? "");
  }, [leatherTypes, leatherTypeId]);

  useEffect(() => {
    if (!leatherColors.some((x) => x.id === leatherColorId)) setLeatherColorId(leatherColors[0]?.id ?? "");
    if (!edgeTypes.some((x) => x.id === edgeTypeId)) setEdgeTypeId(edgeTypes[0]?.id ?? "");
    if (!stitchTypes.some((x) => x.id === stitchTypeId)) setStitchTypeId(stitchTypes[0]?.id ?? "");
  }, [leatherColors, edgeTypes, stitchTypes, leatherColorId, edgeTypeId, stitchTypeId]);

  useEffect(() => {
    if (!buckleColors.some((x) => x.id === buckleColorId)) setBuckleColorId(buckleColors[0]?.id ?? "");
    if (!adapterColors.some((x) => x.id === adapterColorId)) setAdapterColorId(adapterColors[0]?.id ?? "");
    if (buckleVariant === "butterfly" && !selectedStrapType?.buckleColors.hasButterfly) {
      setBuckleVariant("standard");
    }
  }, [buckleColors, adapterColors, buckleColorId, adapterColorId, buckleVariant, selectedStrapType]);

  const selectedWatchColor = useMemo(
    () => selectedWatchModel?.colors?.find((c) => c.hex === watchColorHex) ?? selectedWatchModel?.colors?.[0],
    [selectedWatchModel, watchColorHex]
  );
  const selectedLeatherColor = leatherColors.find((x) => x.id === leatherColorId);
  const selectedEdgeType = edgeTypes.find((x) => x.id === edgeTypeId);
  const selectedStitchType = stitchTypes.find((x) => x.id === stitchTypeId);
  const selectedBuckleColor = buckleColors.find((x) => x.id === buckleColorId);
  const selectedAdapterColor = adapterColors.find((x) => x.id === adapterColorId);

  const step3Amount = selectedLeatherType?.price ?? selectedStrapModel?.price ?? 0;
  const addonsAmount = addonSections.reduce((acc, section, index) => {
    const cardId = section.id || `step4-card-${index}`;
    return selectedAddons[cardId] ? acc + (section.price || 0) : acc;
  }, 0);
  const butterflySurcharge =
    buckleVariant === "butterfly" && selectedStrapType?.buckleColors?.hasButterfly ? 500 : 0;
  const totalAmount = step3Amount + addonsAmount + butterflySurcharge;

  const previewLayers = useMemo(() => {
    if (!selectedStrapType) return item?.imageLayers ?? [];
    const defaultByWatch = selectedStrapType.defaultByWatchColor?.find(
      (entry) =>
        entry.watchColorHex.toLowerCase() === (selectedWatchColor?.hex ?? "").toLowerCase() ||
        entry.watchColorName === selectedWatchColor?.name
    );
    const base = defaultByWatch?.layers.front ?? selectedStrapType.defaultImages.front;
    const buckleLayers = selectedBuckleColor?.layers[buckleVariant];
    return [
      base,
      selectedLeatherColor?.layers.front ?? "",
      selectedEdgeType?.layers.front ?? "",
      selectedStitchType?.layers.front ?? "",
      buckleLayers?.front ?? "",
      selectedAdapterColor?.layers.front ?? ""
    ].filter(Boolean);
  }, [
    selectedStrapType,
    selectedWatchColor?.hex,
    selectedWatchColor?.name,
    selectedLeatherColor?.layers.front,
    selectedEdgeType?.layers.front,
    selectedStitchType?.layers.front,
    selectedBuckleColor?.layers,
    buckleVariant,
    selectedAdapterColor?.layers.front,
    item?.imageLayers
  ]);

  const save = () => {
    if (!item) return;
    const wristLabel = wristOptions.find((opt) => opt.id === wristOptionId)?.label ?? "";
    const parameters: string[] = [];
    if (selectedWatchModel?.model) parameters.push(`Apple Watch: ${selectedWatchModel.model}`);
    if (watchSize) parameters.push(`Размер: ${watchSize} мм`);
    if (selectedWatchColor?.name) parameters.push(`Цвет часов: ${selectedWatchColor.name}`);
    if (selectedStrapModel?.name) parameters.push(`Модель ремешка: ${selectedStrapModel.name}`);
    if (selectedLeatherType?.label) parameters.push(`Тип кожи: ${selectedLeatherType.label}`);
    if (selectedLeatherColor?.label) parameters.push(`Цвет кожи: ${selectedLeatherColor.label}`);
    if (selectedStitchType?.label) parameters.push(`Цвет строчки: ${selectedStitchType.label}`);
    if (selectedEdgeType?.label) parameters.push(`Цвет края: ${selectedEdgeType.label}`);
    if (selectedBuckleColor?.label) parameters.push(`Цвет пряжки: ${selectedBuckleColor.label}`);
    if (selectedAdapterColor?.label) parameters.push(`Цвет адаптеров: ${selectedAdapterColor.label}`);
    if (wristLabel) parameters.push(`Обхват запястья: ${wristLabel}`);
    const colorLibrary = appConfigStore.config.colorLibrary ?? [];
    addonSections.forEach((section, index) => {
      const cardId = section.id || `step4-card-${index}`;
      if (!selectedAddons[cardId]) return;
      const initials = initialsByCardId[cardId];
      const engraving = engravingByCardId[cardId];
      const pkg = packageByCardId[cardId];
      if (hasInitialsConfig(section) && initials?.methodId && initials?.placement) {
        const methodName = colorLibrary.find((c) => c.id === initials.methodId)?.name ?? initials.methodId;
        const detail = [methodName, initials.placement, initials.initials].filter(Boolean).join(", ");
        parameters.push(`${section.title}: Да${detail ? ` (${detail})` : ""}`);
      } else if (isEngravingSection(section) && engraving?.fontOption) {
        const detail = [engraving.fontOption, engraving.inscription].filter(Boolean).join(", ");
        parameters.push(`${section.title}: Да${detail ? ` (${detail})` : ""}`);
      } else if (isPackageSection(section) && pkg) {
        const methodName = colorLibrary.find((c) => c.id === pkg.methodId)?.name ?? pkg.methodId;
        const detail = [methodName, pkg.cardText].filter(Boolean).join(", ");
        parameters.push(`${section.title}: Да${detail ? ` (${detail})` : ""}`);
      } else {
        parameters.push(`${section.title}: Да`);
      }
    });

    const configuration: CartItemConfiguration = {
      productType: "strap",
      watch: {
        watchModelId: selectedWatchModel?.id ?? 0,
        watchModelName: selectedWatchModel?.model ?? "",
        watchSize,
        watchColorHex: selectedWatchColor?.hex ?? "",
        watchColorName: selectedWatchColor?.name ?? ""
      },
      strap: {
        strapModelId: selectedStrapModel?.id ?? 0,
        strapModelName: selectedStrapModel?.name ?? "",
        strapModelPrice: selectedStrapModel?.price ?? 0
      },
      step3: {
        strapTypeId: selectedStrapType?.id ?? "",
        leatherTypeId: selectedLeatherType?.id ?? "",
        leatherColorId,
        edgeTypeId,
        stitchTypeId,
        buckleColorId,
        buckleVariant,
        adapterColorId
      },
      step4: {
        wristOptionId,
        addonCardIds: addonSections
          .map((section, index) => section.id || `step4-card-${index}`)
          .filter((cardId) => Boolean(selectedAddons[cardId]))
      }
    };

    cartStore.updateItem(item.id, {
      title: selectedStrapModel?.name || item.title,
      image: selectedStrapModel?.image || item.image,
      imageLayers: previewLayers.length ? previewLayers : item.imageLayers,
      unitPrice: totalAmount,
      parameters,
      configuration
    });
    onClose();
  };

  const editParamSection: Step4SectionConfig | undefined =
    editParamKey === null
      ? undefined
      : editParamKey === "wrist"
        ? wristSection
        : addonSections.find((s, i) => (s.id || `step4-card-${i}`) === editParamKey);

  if (!item) return null;

  if (item.configuration?.productType === "case") {
    const cc = item.configuration;
    const selectedCaseModel = caseModels.find((model) => model.id === caseIphoneModelId) ?? caseModels[0];
    const selectedOutsideColor = caseOutsideColors.find((color) => color.id === caseOutsideColorId) ?? caseOutsideColors[0];
    const selectedInsideColor = caseInsideColors.find((color) => color.id === caseInsideColorId) ?? caseInsideColors[0];
    const caseUnitPrice = selectedCaseFormType?.price ?? 0;
    const casePreview = resolvePhoneCasePreviewUrls(
      caseConfig,
      selectedCaseFormType?.id ?? null,
      selectedOutsideColor?.id ?? null,
      selectedInsideColor?.id ?? null
    );
    const caseSave = () => {
      if (!selectedCaseModel || !selectedCaseFormType || !selectedOutsideColor || !selectedInsideColor) return;
      const parameters = [
        `Модель: ${selectedCaseModel.label}`,
        `Тип формы: ${selectedCaseFormType.label?.trim() || selectedCaseFormType.id}`,
        `Цвет снаружи: ${selectedOutsideColor.name}`,
        `Цвет внутри: ${selectedInsideColor.name}`
      ];
      const normalizedNote = casePersonalizationNote.trim();
      if (normalizedNote) {
        parameters.push(`Комментарий: ${normalizedNote}`);
      }
      const configuration: CartItemConfiguration = {
        productType: "case",
        iphoneModelId: selectedCaseModel.id,
        iphoneModelLabel: selectedCaseModel.label,
        caseFormTypeId: selectedCaseFormType.id,
        caseFormTypeLabel: selectedCaseFormType.label?.trim() || selectedCaseFormType.id,
        outsideColorId: selectedOutsideColor.id,
        outsideColorName: selectedOutsideColor.name,
        outsideHex: selectedOutsideColor.hex,
        insideColorId: selectedInsideColor.id,
        insideColorName: selectedInsideColor.name,
        insideHex: selectedInsideColor.hex,
        personalizationNote: normalizedNote || undefined
      };
      cartStore.updateItem(item.id, {
        title: `Чехол iPhone — ${selectedCaseModel.label}`,
        image: casePreview.main || item.image,
        unitPrice: caseUnitPrice,
        parameters,
        configuration
      });
      onClose();
    };
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <header className={styles.header}>
            <h2 className={styles.title}>Редактирование чехла</h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
              <Image src="/closeIcon.svg" alt="" width={40} height={40} />
            </button>
          </header>
          <div className={styles.layout}>
            <div className={styles.previewColumn}>
              <div className={styles.media}>
                {casePreview.main ? (
                  <div className={styles.mediaLayer}>
                    <Image src={casePreview.main} alt="" fill className={styles.mediaImage} sizes="(max-width: 960px) 100vw, 44vw" />
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.right}>
              <h3 className={styles.strapTitle}>Чехол iPhone — {selectedCaseModel?.label ?? cc.iphoneModelLabel}</h3>
              <details className={styles.section} open>
                <summary className={styles.summary}>
                  <span className={styles.summaryLabel}>1/3 • Модель iPhone</span>
                  <span className={styles.summaryIconWrap}>
                    <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                    <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                  </span>
                </summary>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <span className={styles.label}>Модель iPhone</span>
                    <select className={styles.select} value={caseIphoneModelId} onChange={(e) => setCaseIphoneModelId(e.target.value)}>
                      {caseModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </details>
              <details className={styles.section} open>
                <summary className={styles.summary}>
                  <span className={styles.summaryLabel}>2/3 • Дизайн чехла</span>
                  <span className={styles.summaryIconWrap}>
                    <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                    <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                  </span>
                </summary>
                <div className={styles.content}>
                  <div className={styles.row}>
                    <span className={styles.label}>Тип формы</span>
                    <select className={styles.select} value={caseFormTypeId} onChange={(e) => setCaseFormTypeId(e.target.value)}>
                      {caseFormTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Цвет снаружи</span>
                    <select className={styles.select} value={caseOutsideColorId} onChange={(e) => setCaseOutsideColorId(e.target.value)}>
                      {caseOutsideColors.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Цвет внутри</span>
                    <select className={styles.select} value={caseInsideColorId} onChange={(e) => setCaseInsideColorId(e.target.value)}>
                      {caseInsideColors.map((color) => (
                        <option key={color.id} value={color.id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </details>
              <details className={styles.section} open>
                <summary className={styles.summary}>
                  <span className={styles.summaryLabel}>3/3 • Персонализация чехла</span>
                  <span className={styles.summaryIconWrap}>
                    <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                    <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                  </span>
                </summary>
                <div className={styles.content}>
                  <div className={styles.paramBlock}>
                    <span className={styles.label}>Комментарий</span>
                    <textarea
                      className={styles.textarea}
                      value={casePersonalizationNote}
                      onChange={(e) => setCasePersonalizationNote(e.target.value.slice(0, 500))}
                      placeholder="Пожелания по персонализации (необязательно)"
                      rows={4}
                    />
                  </div>
                </div>
              </details>
              <div className={styles.footer}>
                <div className={styles.total}>
                  <span>Итого</span>
                  <span className={styles.dots} />
                  <span>{caseUnitPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <button type="button" className={styles.submit} onClick={caseSave}>
                  Завершить редактирование
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Редактирование изделия</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <Image src="/closeIcon.svg" alt="" width={40} height={40} />
          </button>
        </header>

        <div className={styles.layout}>
          <div className={styles.previewColumn}>
            <div className={styles.media}>
              {(previewLayers.length ? previewLayers : item.imageLayers ?? []).map((layer: string, idx: number) => (
                <div key={idx} className={styles.mediaLayer}>
                  <Image src={layer} alt="" fill className={styles.mediaImage} sizes="(max-width: 960px) 100vw, 44vw" />
                </div>
              ))}
              {!previewLayers.length && !item.imageLayers?.length && item.image ? (
                <div className={styles.mediaLayer}>
                  <Image src={item.image} alt={item.title} fill className={styles.mediaImage} sizes="(max-width: 960px) 100vw, 44vw" />
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.right}>
            <h3 className={styles.strapTitle}>Ремешок {selectedStrapModel?.name ?? item.title}</h3>

            <details className={styles.section} open>
              <summary className={styles.summary}>
                <span className={styles.summaryLabel}>1/3 • Модель часов</span>
                <span className={styles.summaryIconWrap}>
                  <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                  <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                </span>
              </summary>
              <div className={styles.content}>
                <div className={styles.row}>
                  <span className={styles.label}>Apple Watch</span>
                  <select
                    className={styles.select}
                    value={watchModelId}
                    onChange={(e) => setWatchModelId(Number(e.target.value))}
                  >
                    {watchModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Размер</span>
                  <select className={styles.select} value={watchSize} onChange={(e) => setWatchSize(Number(e.target.value))}>
                    {(selectedWatchModel?.sizes ?? []).map((size) => (
                      <option key={size} value={size}>
                        {size}mm
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Цвет часов</span>
                  <select className={styles.select} value={watchColorHex} onChange={(e) => setWatchColorHex(e.target.value)}>
                    {(selectedWatchModel?.colors ?? []).map((color) => (
                      <option key={color.hex} value={color.hex}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details className={styles.section} open>
              <summary className={styles.summary}>
                <span className={styles.summaryLabel}>2/3 • Дизайн ремешка</span>
                <span className={styles.summaryIconWrap}>
                  <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                  <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                </span>
              </summary>
              <div className={styles.content}>
                <div className={styles.row}>
                  <span className={styles.label}>Модель ремешка</span>
                  <select className={styles.select} value={strapModelId} onChange={(e) => setStrapModelId(Number(e.target.value))}>
                    {strapModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
                {strapTypes.length > 1 ? (
                  <div className={styles.row}>
                    <span className={styles.label}>Тип ремешка</span>
                    <select className={styles.select} value={strapTypeId} onChange={(e) => setStrapTypeId(e.target.value)}>
                      {strapTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div className={styles.row}>
                  <span className={styles.label}>Тип кожи</span>
                  <select className={styles.select} value={leatherTypeId} onChange={(e) => setLeatherTypeId(e.target.value)}>
                    {leatherTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Цвет кожи</span>
                  <select className={styles.select} value={leatherColorId} onChange={(e) => setLeatherColorId(e.target.value)}>
                    {leatherColors.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Цвет строчки</span>
                  <select className={styles.select} value={stitchTypeId} onChange={(e) => setStitchTypeId(e.target.value)}>
                    {stitchTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Цвет края</span>
                  <select className={styles.select} value={edgeTypeId} onChange={(e) => setEdgeTypeId(e.target.value)}>
                    {edgeTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}>Цвет пряжки</span>
                  <select className={styles.select} value={buckleColorId} onChange={(e) => setBuckleColorId(e.target.value)}>
                    {buckleColors.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {(selectedStrapType?.buckleColors.hasButterfly ?? false) ? (
                  <div className={styles.row}>
                    <span className={styles.label}>Пряжка-бабочка</span>
                    <select
                      className={styles.select}
                      value={buckleVariant}
                      onChange={(e) => setBuckleVariant(e.target.value as "standard" | "butterfly")}
                    >
                      <option value="standard">Нет</option>
                      <option value="butterfly">Да</option>
                    </select>
                  </div>
                ) : null}
                <div className={styles.row}>
                  <span className={styles.label}>Цвет адаптеров</span>
                  <select className={styles.select} value={adapterColorId} onChange={(e) => setAdapterColorId(e.target.value)}>
                    {adapterColors.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details className={styles.section} open>
              <summary className={styles.summary}>
                <span className={styles.summaryLabel}>3/3 • Персонализация ремешка</span>
                <span className={styles.summaryIconWrap}>
                  <Image src="/listOpenIcon.svg" alt="" width={20} height={20} className={styles.summaryIconOpen} />
                  <Image src="/listCloseIcon.svg" alt="" width={20} height={20} className={styles.summaryIconClose} />
                </span>
              </summary>
              <div className={styles.content}>
                {wristOptions.length > 0 && wristSection ? (
                  <div className={styles.paramBlock}>
                    <div className={styles.row}>
                      <span className={styles.label}>Обхват запястья</span>
                      <select className={styles.select} value={wristOptionId} onChange={(e) => setWristOptionId(e.target.value)}>
                        {wristOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className={styles.editParamLink}
                      onClick={() => setEditParamKey("wrist")}
                    >
                      Редактировать параметр
                      <span className={styles.editParamArrow} aria-hidden>›</span>
                    </button>
                  </div>
                ) : null}
                {addonSections.map((section, index) => {
                  const cardId = section.id || `step4-card-${index}`;
                  const value = selectedAddons[cardId] ? "yes" : "no";
                  return (
                    <div className={styles.paramBlock} key={cardId}>
                      <div className={styles.row}>
                        <span className={styles.label}>{section.title}</span>
                        <select
                          className={styles.select}
                          value={value}
                          onChange={(e) =>
                            setSelectedAddons((prev) => ({ ...prev, [cardId]: e.target.value === "yes" }))
                          }
                        >
                          <option value="yes">Да</option>
                          <option value="no">Нет</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        className={styles.editParamLink}
                        onClick={() => setEditParamKey(cardId)}
                      >
                        Редактировать параметр
                        <span className={styles.editParamArrow} aria-hidden>›</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </details>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Итого</span>
                <span className={styles.dots} />
                <span>{totalAmount.toLocaleString("ru-RU")} ₽</span>
              </div>
              <button type="button" className={styles.submit} onClick={save}>
                Завершить редактирование
              </button>
            </div>
          </div>
        </div>
      </div>

      {editParamSection ? (
        <EditParameterModal
          open={Boolean(editParamSection)}
          onClose={() => setEditParamKey(null)}
          section={editParamSection}
          optionId={editParamKey === "wrist" ? wristOptionId : undefined}
          options={editParamKey === "wrist" ? wristOptions : undefined}
          onOptionChange={editParamKey === "wrist" ? setWristOptionId : undefined}
          addonValue={
            editParamKey !== null &&
            editParamKey !== "wrist" &&
            !hasInitialsConfig(editParamSection) &&
            !isEngravingSection(editParamSection) &&
            !isPackageSection(editParamSection)
              ? selectedAddons[editParamKey]
              : undefined
          }
          onAddonChange={
            editParamKey !== null &&
            editParamKey !== "wrist" &&
            !hasInitialsConfig(editParamSection) &&
            !isEngravingSection(editParamSection) &&
            !isPackageSection(editParamSection)
              ? (value) => setSelectedAddons((prev) => ({ ...prev, [editParamKey]: value }))
              : undefined
          }
          colorLibrary={appConfigStore.config.colorLibrary ?? []}
          initialsConfig={
            editParamSection && hasInitialsConfig(editParamSection) && editParamKey !== null && editParamKey !== "wrist"
              ? (initialsByCardId[editParamKey] ?? getDefaultInitials(editParamSection))
              : undefined
          }
          onInitialsChange={
            editParamKey !== null && editParamKey !== "wrist"
              ? (config) => setInitialsByCardId((prev) => ({ ...prev, [editParamKey]: config }))
              : undefined
          }
          engravingConfig={
            editParamSection && isEngravingSection(editParamSection) && editParamKey !== null && editParamKey !== "wrist"
              ? (engravingByCardId[editParamKey] ?? getDefaultEngraving(editParamSection))
              : undefined
          }
          onEngravingChange={
            editParamKey !== null && editParamKey !== "wrist"
              ? (config) => setEngravingByCardId((prev) => ({ ...prev, [editParamKey]: config }))
              : undefined
          }
          packageConfig={
            editParamSection && isPackageSection(editParamSection) && editParamKey !== null && editParamKey !== "wrist"
              ? (packageByCardId[editParamKey] ?? getDefaultPackage(editParamSection))
              : undefined
          }
          onPackageChange={
            editParamKey !== null && editParamKey !== "wrist"
              ? (config) => setPackageByCardId((prev) => ({ ...prev, [editParamKey]: config }))
              : undefined
          }
          onFinish={() => setEditParamKey(null)}
        />
      ) : null}
    </div>
  );
});

export default EditItemModal;
