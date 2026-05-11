import type {
  PhoneCaseColorVariant,
  PhoneCaseConfig,
  PhoneCaseFormType
} from "@/src/shared/types/PhoneCaseConfigTypes";

function normalizeVariant(raw: Partial<PhoneCaseColorVariant> | undefined): PhoneCaseColorVariant {
  return {
    colorId: String(raw?.colorId ?? ""),
    image1: String(raw?.image1 ?? ""),
    image2: String(raw?.image2 ?? ""),
    image3: String(raw?.image3 ?? "")
  };
}

function normalizeFormType(raw: Partial<PhoneCaseFormType> | undefined): PhoneCaseFormType {
  const bp = raw?.basePreview;
  return {
    id: String(raw?.id ?? ""),
    label: String(raw?.label ?? ""),
    price: Number(raw?.price) || 0,
    basePreview: {
      previewMain: String(bp?.previewMain ?? ""),
      previewThumb1: String(bp?.previewThumb1 ?? ""),
      previewThumb2: String(bp?.previewThumb2 ?? "")
    },
    outsideVariants: Array.isArray(raw?.outsideVariants)
      ? raw.outsideVariants.map((v) => normalizeVariant(v))
      : [],
    insideVariants: Array.isArray(raw?.insideVariants)
      ? raw.insideVariants.map((v) => normalizeVariant(v))
      : []
  };
}

/** Приводит сохранённый JSON к актуальной схеме; поднимает legacy basePrice / preview* в один тип формы */
export function normalizePhoneCaseConfig(
  raw: Partial<PhoneCaseConfig> & Record<string, unknown> | undefined
): PhoneCaseConfig {
  const merged = raw ?? {};
  const iphoneModels = Array.isArray(merged.iphoneModels)
    ? merged.iphoneModels.map((m: { id?: string; label?: string }) => ({
        id: String(m?.id ?? ""),
        label: String(m?.label ?? "")
      }))
    : [];

  if (Array.isArray(merged.formTypes) && merged.formTypes.length > 0) {
    return {
      iphoneModels,
      formTypes: merged.formTypes.map((ft: Partial<PhoneCaseFormType>) => normalizeFormType(ft))
    };
  }

  const legacyPrice = merged.basePrice;
  const legacyMain = merged.previewMain;
  const legacyT1 = merged.previewThumb1;
  const legacyT2 = merged.previewThumb2;

  const hasLegacyPrice = legacyPrice !== undefined && legacyPrice !== null;
  const hasLegacyImages =
    [legacyMain, legacyT1, legacyT2].some((x) => typeof x === "string" && x.trim().length > 0);

  if (hasLegacyPrice || hasLegacyImages) {
    return {
      iphoneModels,
      formTypes: [
        normalizeFormType({
          id: "legacy-default",
          label: "Тип формы (из старой версии)",
          price: Number(legacyPrice) || 4990,
          basePreview: {
            previewMain: String(legacyMain ?? ""),
            previewThumb1: String(legacyT1 ?? ""),
            previewThumb2: String(legacyT2 ?? "")
          },
          outsideVariants: [],
          insideVariants: []
        })
      ]
    };
  }

  return { iphoneModels, formTypes: [] };
}

export type ResolvedPhoneCasePreview = {
  main: string;
  thumb1: string;
  thumb2: string;
};

/** Главная и миниатюры: снаружи — image1–2, внизу справа — подкладка (inside.image1) */
export function resolvePhoneCasePreviewUrls(
  pc: PhoneCaseConfig | undefined,
  formTypeId: string | null,
  outsideColorId: string | null,
  insideColorId: string | null
): ResolvedPhoneCasePreview {
  const empty: ResolvedPhoneCasePreview = { main: "", thumb1: "", thumb2: "" };
  if (!pc?.formTypes?.length || !formTypeId) return empty;
  const ft = pc.formTypes.find((f) => f.id === formTypeId);
  if (!ft) return empty;

  const base = ft.basePreview;
  const out = outsideColorId
    ? ft.outsideVariants.find((v) => v.colorId === outsideColorId)
    : undefined;
  const inn = insideColorId ? ft.insideVariants.find((v) => v.colorId === insideColorId) : undefined;

  const main = (out?.image1?.trim() || base.previewMain?.trim() || "").trim();
  const thumb1 = (out?.image2?.trim() || base.previewThumb1?.trim() || "").trim();
  const thumb2 = (
    inn?.image1?.trim() ||
    out?.image3?.trim() ||
    base.previewThumb2?.trim() ||
    ""
  ).trim();

  return { main, thumb1, thumb2 };
}
