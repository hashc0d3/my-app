"use client";

import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { caseConfiguratorStore } from "@/src/entities/case-configurator";
import { appConfigStore } from "@/src/entities/app-config";
import type { ColorLibraryItem } from "@/src/shared/types/AppConfigTypes";
import { CasePreview } from "@/src/features/case-preview";
import styles from "./CaseBasisStep.module.css";

/** Если variant ссылается на colorId, но вкладка «Цвета» не синхронна — всё равно показываем кнопку */
function resolveColorsForVariants(
  variants: { colorId: string }[],
  paletteById: Map<string, ColorLibraryItem>
): ColorLibraryItem[] {
  const seen = new Set<string>();
  const out: ColorLibraryItem[] = [];
  for (const v of variants) {
    const id = String(v.colorId ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const fromPalette = paletteById.get(id);
    out.push(
      fromPalette ?? {
        id,
        name: id,
        hex: "#cccccc"
      }
    );
  }
  return out;
}

const CaseBasisStep = observer(() => {
  const pc = appConfigStore.config.phoneCase;
  const palette = appConfigStore.config.colorLibrary ?? [];
  const models = pc?.iphoneModels ?? [];
  const formTypes = pc?.formTypes ?? [];
  const selectedFt = caseConfiguratorStore.selectedFormType;
  const paletteById = new Map(palette.map((c) => [c.id, c]));
  const outsideColors = resolveColorsForVariants(selectedFt?.outsideVariants ?? [], paletteById);
  const insideColors = resolveColorsForVariants(selectedFt?.insideVariants ?? [], paletteById);

  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const selectWrapRef = useRef<HTMLDivElement>(null);

  const selectedModelLabel =
    models.find((m) => m.id === caseConfiguratorStore.iphoneModelId)?.label?.trim() ?? "";

  const closeModelMenu = useCallback(() => setModelMenuOpen(false), []);

  useEffect(() => {
    if (!modelMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (selectWrapRef.current && !selectWrapRef.current.contains(e.target as Node)) {
        closeModelMenu();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModelMenu();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [modelMenuOpen, closeModelMenu]);

  return (
    <section className={styles.section}>
      <div className={styles.previewColumn}>
        <CasePreview />
      </div>

      <div className={styles.controlsPanel}>
        <article className={styles.paramCard}>
          <span className={styles.stepBadge}>1/4</span>
          <h3 className={styles.cardTitle}>Модель iPhone</h3>
          {models.length === 0 ? (
            <p className={styles.empty}>Добавьте модели в админке (вкладка «Чехлы»).</p>
          ) : (
            <div className={styles.selectWrap} ref={selectWrapRef}>
              <button
                type="button"
                className={styles.selectTrigger}
                aria-expanded={modelMenuOpen}
                aria-haspopup="listbox"
                onClick={() => setModelMenuOpen((o) => !o)}
              >
                <span>{selectedModelLabel || "Выберите модель"}</span>
                <span className={styles.selectTriggerIcon} aria-hidden>
                  <Image
                    src={modelMenuOpen ? "/listOpenIcon.svg" : "/listCloseIcon.svg"}
                    alt=""
                    width={20}
                    height={22}
                  />
                </span>
              </button>
              {modelMenuOpen ? (
                <ul className={styles.selectMenu} role="listbox">
                  {models.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={caseConfiguratorStore.iphoneModelId === m.id}
                        className={`${styles.selectOption} ${
                          caseConfiguratorStore.iphoneModelId === m.id ? styles.selectOptionActive : ""
                        }`}
                        onClick={() => {
                          caseConfiguratorStore.setIphoneModelId(m.id);
                          closeModelMenu();
                        }}
                      >
                        {m.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </article>

        <article className={styles.paramCard}>
          <span className={styles.stepBadge}>2/4</span>
          <h3 className={styles.cardTitle}>Тип формы</h3>
          {formTypes.length === 0 ? (
            <p className={styles.empty}>Добавьте типы формы во вкладке «Чехлы» в админке.</p>
          ) : (
            <div className={styles.colorGrid}>
              {formTypes.map((ft) => {
                const active = caseConfiguratorStore.effectiveFormTypeId === ft.id;
                return (
                  <button
                    key={ft.id}
                    type="button"
                    className={`${styles.colorChip} ${active ? styles.colorChipActive : ""}`}
                    onClick={() => caseConfiguratorStore.setFormTypeId(ft.id)}
                  >
                    <span
                      className={styles.dot}
                      style={{ background: active ? "#111111" : "#d8dae5" }}
                    />
                    <span className={styles.colorName}>{ft.label?.trim() || ft.id}</span>
                  </button>
                );
              })}
            </div>
          )}
        </article>

        <article className={styles.paramCard}>
          <span className={styles.stepBadge}>3/4</span>
          <h3 className={styles.cardTitle}>Цвет снаружи</h3>
          {!selectedFt ? (
            <p className={styles.empty}>Сначала выберите тип формы.</p>
          ) : outsideColors.length === 0 ? (
            <p className={styles.empty}>
              Для этого типа формы не добавлены цвета снаружи (вкладка «Чехлы» → блок «Цвет снаружи»).
            </p>
          ) : (
            <div className={styles.colorGrid}>
              {outsideColors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.colorChip} ${
                    caseConfiguratorStore.outsideColorId === c.id ? styles.colorChipActive : ""
                  }`}
                  onClick={() => caseConfiguratorStore.setOutsideColorId(c.id)}
                >
                  <span className={styles.dot} style={{ background: c.hex }} />
                  <span className={styles.colorName}>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </article>

        <article className={styles.paramCard}>
          <span className={styles.stepBadge}>4/4</span>
          <h3 className={styles.cardTitle}>Цвет внутри</h3>
          {!selectedFt ? (
            <p className={styles.empty}>Сначала выберите тип формы.</p>
          ) : insideColors.length === 0 ? (
            <p className={styles.empty}>
              Для этого типа формы не добавлены цвета внутри (вкладка «Чехлы» → блок «Цвет внутри»).
            </p>
          ) : (
            <div className={styles.colorGrid}>
              {insideColors.map((c) => (
                <button
                  key={`in-${c.id}`}
                  type="button"
                  className={`${styles.colorChip} ${
                    caseConfiguratorStore.insideColorId === c.id ? styles.colorChipActive : ""
                  }`}
                  onClick={() => caseConfiguratorStore.setInsideColorId(c.id)}
                >
                  <span className={styles.dot} style={{ background: c.hex }} />
                  <span className={styles.colorName}>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
});

export default CaseBasisStep;
