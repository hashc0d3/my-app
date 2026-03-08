"use client";

import { strapConfiguratorStore } from "@/src/entities/strap-configurator";

/** Подписи параметров шага 3 для отображения в дропдауне/модалке */
export const STEP3_LABELS = {
    leatherType: "Тип кожи",
    leatherColor: "Цвет кожи",
    stitch: "Цвет строчки",
    edge: "Цвет края",
    buckle: "Цвет пряжки",
    adapter: "Цвет адаптера",
} as const;

export type Step3Params = {
    leatherType: string;
    leatherColor: string;
    stitch: string;
    edge: string;
    buckle: string;
    adapter: string;
};

/**
 * Хук: текущие выбранные параметры конфигуратора ремешка (шаг 3).
 * Используется в виджете ProgressBar для отображения в дропдауне/модалке.
 */
export function useStep3Params(): Step3Params {
    const config = strapConfiguratorStore.getCurrentConfig();
    const ct = strapConfiguratorStore.currentStrapType;
    const lt = strapConfiguratorStore.currentLeatherType;
    if (config) {
        return {
            leatherType: config.leatherType.label,
            leatherColor: config.leatherColor.label,
            stitch: config.stitchType.label,
            edge: config.edgeType.label,
            buckle: config.buckleColor.label,
            adapter: config.adapterColor.label,
        };
    }
    const leatherType = lt?.label ?? "—";
    const leatherColor = lt?.leatherColors.find((c) => c.id === strapConfiguratorStore.selectedLeatherColorId)?.label ?? "—";
    const stitch = lt?.stitchTypes.find((s) => s.id === strapConfiguratorStore.selectedStitchTypeId)?.label ?? "—";
    const edge = lt?.edgeTypes.find((e) => e.id === strapConfiguratorStore.selectedEdgeTypeId)?.label ?? "—";
    const buckle = ct?.buckleColors.options.find((b) => b.id === strapConfiguratorStore.selectedBuckleColorId)?.label ?? "—";
    const adapter = ct?.adapterColors.find((a) => a.id === strapConfiguratorStore.selectedAdapterColorId)?.label ?? "—";
    return { leatherType, leatherColor, stitch, edge, buckle, adapter };
}
