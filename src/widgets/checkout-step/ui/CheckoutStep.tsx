"use client";

import { observer } from "mobx-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { appConfigStore } from "@/src/entities/app-config";
import { cartStore } from "@/src/entities/cart";
import { strapConfiguratorStore } from "@/src/entities/strap-configurator";
import { strapModelStore } from "@/src/entities/strap-model";
import { watchModelStore } from "@/src/entities/watch-model";
import type { CartItemConfiguration } from "@/src/shared/types/CartItemConfiguration";
import { StrapPreview } from "@/src/features/strap-preview";
import styles from "./CheckoutStep.module.css";

const CheckoutStep = observer(() => {
  const router = useRouter();
  const { step4 } = appConfigStore.config;
  const selectedStrapModel = strapModelStore.strapModels.find(
    (model) => model.id === strapModelStore.currentStrap
  );
  const modelStep3Type = selectedStrapModel?.step3Config?.strapTypes?.[0] ?? null;
  const currentLeatherType = strapConfiguratorStore.currentLeatherType;
  const step3Amount =
    currentLeatherType?.price ??
    modelStep3Type?.leatherTypes?.[0]?.price ??
    strapModelStore.selectedStrapPrice ??
    0;
  const sections = step4?.sections ?? [];
  const isWristSection = (s: (typeof sections)[0]) =>
    s?.id === "step4-card-wrist" || String(s?.title ?? "").trim().toLowerCase() === "обхват запястья";
  const wristSection = sections.find(isWristSection) ?? null;
  const otherSections = sections.filter((s) => !isWristSection(s));
  const wristOptionsList = (wristSection?.options ?? []).filter(
    (o) => o?.label != null && String(o.label).trim() !== ""
  );
  const wristCardId = wristSection?.id || "step4-card-wrist";
  const colorLibrary = appConfigStore.config.colorLibrary ?? [];
  const readyDate = step4?.readyDate?.trim();
  const readyDateNote = step4?.readyDateNote?.trim();
  const [addedByCardId, setAddedByCardId] = useState<Record<string, boolean>>({});
  const [selectedMethodByCardId, setSelectedMethodByCardId] = useState<Record<string, string>>({});
  const [selectedPlacementByCardId, setSelectedPlacementByCardId] = useState<Record<string, string>>({});
  const [initialsByCardId, setInitialsByCardId] = useState<Record<string, string>>({});
  const [selectedWristByCardId, setSelectedWristByCardId] = useState<Record<string, string>>({});
  const [isWristVideoPlaying, setIsWristVideoPlaying] = useState(false);
  const wristVideoRef = useRef<HTMLVideoElement | null>(null);
  const selectedWristIdStandalone =
    selectedWristByCardId[wristCardId] ?? wristOptionsList[0]?.id ?? "";
  const wristVideo = wristSection?.video?.trim() ?? "";
  const hasWristVideo = Boolean(wristVideo);
  const wristDownloadLinkText = wristSection?.downloadLinkText?.trim() ?? "";
  const wristDownloadLinkUrl = wristSection?.downloadLinkUrl?.trim() ?? "";
  const hasWristDownloadLink = Boolean(wristDownloadLinkText && wristDownloadLinkUrl);
  const wristSelectedLabel =
    wristOptionsList.find((opt) => opt.id === selectedWristIdStandalone)?.label ?? "";

  const allColors = useMemo(
    () => colorLibrary.filter((item) => Boolean(item.name?.trim()) || Boolean(item.hex?.trim())),
    [colorLibrary]
  );
  const selectedAddonTotal = useMemo(
    () =>
      otherSections.reduce((acc, section, index) => {
        const cardId = section.id || `step4-card-${index}`;
        return addedByCardId[cardId] ? acc + (section.price || 0) : acc;
      }, 0),
    [otherSections, addedByCardId]
  );
  const butterflySurcharge =
    strapConfiguratorStore.selectedBuckleVariant === "butterfly" &&
    strapConfiguratorStore.currentStrapType?.buckleColors?.hasButterfly
      ? 500
      : 0;
  const totalAmount = step3Amount + selectedAddonTotal + butterflySurcharge;

  const handleAddToCart = useCallback(() => {
    const currentConfig = strapConfiguratorStore.getCurrentConfig();
    const selectedAddons = otherSections
      .map((section, index) => {
        const cardId = section.id || `step4-card-${index}`;
        return { section, cardId };
      })
      .filter(({ cardId }) => Boolean(addedByCardId[cardId]));

    const parameters: string[] = [];

    if (watchModelStore.selectedModel) parameters.push(`Apple Watch: ${watchModelStore.selectedModel}`);
    if (watchModelStore.selectedSize) parameters.push(`Размер: ${watchModelStore.selectedSize} мм`);
    if (watchModelStore.selectedColor?.name) parameters.push(`Цвет часов: ${watchModelStore.selectedColor.name}`);
    if (strapModelStore.selectedStrapName) parameters.push(`Модель ремешка: ${strapModelStore.selectedStrapName}`);
    if (currentConfig?.leatherType?.label) parameters.push(`Тип кожи: ${currentConfig.leatherType.label}`);
    if (currentConfig?.leatherColor?.label) parameters.push(`Цвет кожи: ${currentConfig.leatherColor.label}`);
    if (currentConfig?.stitchType?.label) parameters.push(`Цвет строчки: ${currentConfig.stitchType.label}`);
    if (currentConfig?.edgeType?.label) parameters.push(`Цвет края: ${currentConfig.edgeType.label}`);
    if (currentConfig?.buckleColor?.label) parameters.push(`Цвет пряжки: ${currentConfig.buckleColor.label}`);
    if (currentConfig?.adapterColor?.label) parameters.push(`Цвет адаптеров: ${currentConfig.adapterColor.label}`);
    if (wristSelectedLabel) parameters.push(`Обхват запястья: ${wristSelectedLabel}`);

    selectedAddons.forEach(({ section, cardId }) => {
      parameters.push(`${section.title}: Да`);
    });

    const selectedModelData = strapModelStore.strapModels.find((m) => m.id === strapModelStore.currentStrap);
    const frontPreviewLayers = strapConfiguratorStore.getLayersByView("front").filter((layer) => Boolean(layer));
    const selectedWatchModel = watchModelStore.watchModels.find((m) => m.id === watchModelStore.currentCard);

    const configuration: CartItemConfiguration = {
      watch: {
        watchModelId: watchModelStore.currentCard,
        watchModelName: watchModelStore.selectedModel ?? selectedWatchModel?.model ?? "",
        watchSize: watchModelStore.selectedSize ?? selectedWatchModel?.sizes?.[0] ?? 0,
        watchColorHex: watchModelStore.selectedColor?.hex ?? selectedWatchModel?.colors?.[0]?.hex ?? "",
        watchColorName: watchModelStore.selectedColor?.name ?? selectedWatchModel?.colors?.[0]?.name ?? ""
      },
      strap: {
        strapModelId: strapModelStore.currentStrap ?? 0,
        strapModelName: strapModelStore.selectedStrapName ?? selectedModelData?.name ?? "",
        strapModelPrice: strapModelStore.selectedStrapPrice ?? selectedModelData?.price ?? 0
      },
      step3: {
        strapTypeId: strapConfiguratorStore.selectedStrapTypeId ?? "",
        leatherTypeId: strapConfiguratorStore.selectedLeatherTypeId ?? "",
        leatherColorId: strapConfiguratorStore.selectedLeatherColorId ?? "",
        edgeTypeId: strapConfiguratorStore.selectedEdgeTypeId ?? "",
        stitchTypeId: strapConfiguratorStore.selectedStitchTypeId ?? "",
        buckleColorId: strapConfiguratorStore.selectedBuckleColorId ?? "",
        buckleVariant: strapConfiguratorStore.selectedBuckleVariant,
        adapterColorId: strapConfiguratorStore.selectedAdapterColorId ?? ""
      },
      step4: {
        wristOptionId: selectedWristIdStandalone,
        addonCardIds: otherSections
          .map((section, index) => section.id || `step4-card-${index}`)
          .filter((cardId) => Boolean(addedByCardId[cardId]))
      }
    };

    cartStore.addConfiguredItem({
      title: strapModelStore.selectedStrapName || "Ремешок",
      image: selectedModelData?.image || "",
      imageLayers: frontPreviewLayers,
      unitPrice: totalAmount,
      parameters,
      configuration
    });

    router.push("/cart");
  }, [
    otherSections,
    addedByCardId,
    wristSelectedLabel,
    selectedWristIdStandalone,
    totalAmount,
    router
  ]);

  useEffect(() => {
    const onAddToCart = () => {
      handleAddToCart();
    };
    window.addEventListener("checkout:add-to-cart", onAddToCart as EventListener);
    return () => window.removeEventListener("checkout:add-to-cart", onAddToCart as EventListener);
  }, [handleAddToCart]);

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.previewColumn}>
          <StrapPreview />
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.headerBlock}>
            <h2 className={styles.title}>
              <span className={styles.titleDesktop}>{step4?.title ?? ""}</span>
              <span className={styles.titleMobile}>
                Ремешок {strapModelStore.selectedStrapName ?? selectedStrapModel?.name ?? ""}
              </span>
            </h2>
            <p className={styles.description}>{step4?.description ?? ""}</p>
          </div>

          <div className={styles.paramsCards}>
          {wristSection ? (
            <article className={styles.card}>
              <details className={styles.cardDetails}>
                <summary className={styles.cardSummary}>
                  <h3 className={styles.cardTitle}>{wristSection.title}</h3>
                  <span className={styles.cardSummaryIcon}>
                    <Image
                      src="/listOpenIcon.svg"
                      className={styles.iconOpen}
                      width={20}
                      height={20}
                      alt=""
                      aria-hidden
                    />
                    <Image
                      src="/listCloseIcon.svg"
                      className={styles.iconClose}
                      width={20}
                      height={20}
                      alt=""
                      aria-hidden
                    />
                  </span>
                </summary>
                <div className={styles.cardDetailsContent}>
                  {wristSection.image || hasWristVideo ? (
                    <div className={styles.wristMediaWrap}>
                      {hasWristVideo ? (
                        <video
                          ref={wristVideoRef}
                          className={styles.wristVideo}
                          src={wristVideo}
                          controls={isWristVideoPlaying || !wristSection.image}
                          playsInline
                          preload="metadata"
                          onEnded={() => setIsWristVideoPlaying(false)}
                        />
                      ) : null}
                      {wristSection.image ? (
                        hasWristVideo ? (
                          !isWristVideoPlaying ? (
                            <button
                              type="button"
                              className={styles.wristPosterButton}
                              onClick={() => {
                                if (wristVideoRef.current) {
                                  wristVideoRef.current.currentTime = 0;
                                }
                                setIsWristVideoPlaying(true);
                                void wristVideoRef.current?.play();
                              }}
                              aria-label="Воспроизвести видео"
                            >
                              <Image
                                src={wristSection.image}
                                alt={wristSection.title || "wrist-image"}
                                fill
                                className={styles.cardImage}
                                sizes="(max-width: 960px) 100vw, 540px"
                              />
                              <span className={styles.wristPlayButton} aria-hidden>
                                ▶
                              </span>
                            </button>
                          ) : null
                        ) : (
                          <div className={styles.wristPosterStatic}>
                            <Image
                              src={wristSection.image}
                              alt={wristSection.title || "wrist-image"}
                              fill
                              className={styles.cardImage}
                              sizes="(max-width: 960px) 100vw, 540px"
                            />
                          </div>
                        )
                      ) : null}
                    </div>
                  ) : null}
                  {wristSection.imageDescription ? (
                    <p className={styles.imageDescription}>{wristSection.imageDescription}</p>
                  ) : null}
                  {hasWristDownloadLink ? (
                    <a
                      className={styles.wristDownloadLink}
                      href={wristDownloadLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {wristDownloadLinkText}
                    </a>
                  ) : null}
                  {wristOptionsList.length > 0 ? (
                    <div className={styles.initialsConfig}>
                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>
                          1/1 • {wristSection.placementLabel ?? "Выберите обхват запястья"}
                        </h4>
                        <select
                          className={styles.select}
                          value={selectedWristIdStandalone}
                          onChange={(e) =>
                            setSelectedWristByCardId((prev) => ({ ...prev, [wristCardId]: e.target.value }))
                          }
                          aria-label={wristSection.placementLabel ?? "Выберите обхват запястья"}
                        >
                          {wristOptionsList.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}
                </div>
              </details>
            </article>
          ) : null}

          {otherSections.length ? (
            <div className={styles.cards}>
              {otherSections.map((section, sectionIndex) => {
                const cardId = section.id || `step4-card-${sectionIndex}`;
                const isEngravingCard =
                  section.id === "step4-card-engraving" ||
                  section.title?.trim()?.toLowerCase() === "гравировка";
                const isPackageCard =
                  section.id === "step4-card-package" ||
                  section.title?.trim()?.toLowerCase() === "подарочная упаковка";
                const isWristCard =
                  section.id === "step4-card-wrist" ||
                  section.title?.trim()?.toLowerCase() === "обхват запястья";
                const wristOptions = (section.options ?? []).filter((o) => o?.label != null && String(o.label).trim() !== "");
                const selectedWristId = selectedWristByCardId[cardId] ?? wristOptions[0]?.id ?? "";
                const hasInitialsConfig = Boolean(
                  !isEngravingCard &&
                    !isPackageCard &&
                    section.methodLabel &&
                    (section.placementOptions ?? []).length > 0 &&
                    section.inputLabel
                );
                const isAdded = Boolean(addedByCardId[cardId]);
                const placementOptions = (section.placementOptions ?? []).filter((item) => item.trim().length > 0);
                const selectedPlacement = selectedPlacementByCardId[cardId] ?? placementOptions[0] ?? "";
                const methodColorIds = section.methodColorIds ?? [];
                const availableMethods =
                  methodColorIds.length > 0
                    ? allColors.filter((c) => methodColorIds.includes(c.id))
                    : allColors;
                const selectedMethod = selectedMethodByCardId[cardId] ?? availableMethods[0]?.id ?? "";
                const initialsValue = initialsByCardId[cardId] ?? "";

                return (
                <article key={cardId} className={styles.card}>
                  <details className={styles.cardDetails}>
                    <summary className={styles.cardSummary}>
                      <h3 className={styles.cardTitle}>{section.title}</h3>
                      <span className={styles.cardSummaryIcon}>
                        <Image
                          src="/listOpenIcon.svg"
                          className={styles.iconOpen}
                          width={20}
                          height={20}
                          alt=""
                          aria-hidden
                        />
                        <Image
                          src="/listCloseIcon.svg"
                          className={styles.iconClose}
                          width={20}
                          height={20}
                          alt=""
                          aria-hidden
                        />
                      </span>
                    </summary>
                    <div className={styles.cardDetailsContent}>
                    {section.ctaLabel && !isWristCard ? (
                    <div
                      className={
                        isAdded
                          ? `${styles.cardAddonRow} ${styles.cardAddonRowHasAdded}`
                          : styles.cardAddonRow
                      }
                    >
                      <div className={styles.cardDescriptionBlock}>
                        {section.description ? (
                          <p className={styles.cardDescription}>{section.description}</p>
                        ) : null}
                      </div>
                      <span
                        className={
                          isAdded ? `${styles.cardPrice} ${styles.cardPriceAdded}` : styles.cardPrice
                        }
                      >
                        + {section.price || 0} ₽
                      </span>
                      <div className={styles.cardActions}>
                        {isAdded ? (
                          <>
                            <button className={styles.cardButtonMuted} type="button">
                              В корзине
                            </button>
                            <button
                              className={styles.cardButtonRemove}
                              type="button"
                              onClick={() =>
                                setAddedByCardId((prev) => ({ ...prev, [cardId]: false }))
                              }
                            >
                              Убрать из заказа
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.cardButton}
                            type="button"
                            onClick={() =>
                              setAddedByCardId((prev) => ({ ...prev, [cardId]: true }))
                            }
                          >
                            {section.ctaLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                    <div className={styles.cardDescriptionRow}>
                      {section.description ? (
                        <p className={styles.cardDescription}>{section.description}</p>
                      ) : null}
                    </div>

                  {isWristCard && wristOptions.length > 0 ? (
                    <div className={styles.initialsConfig}>
                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>
                          1/1 • {section.placementLabel ?? "Выберите обхват запястья"}
                        </h4>
                        <select
                          className={styles.select}
                          value={selectedWristId}
                          onChange={(e) =>
                            setSelectedWristByCardId((prev) => ({ ...prev, [cardId]: e.target.value }))
                          }
                          aria-label={section.placementLabel ?? "Выберите обхват запястья"}
                        >
                          {wristOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : null}
                  </>
                  )}

                  {section.image ? (
                    <div className={styles.cardImageWrap}>
                      <Image
                        src={section.image}
                        alt={section.title || "step-4-image"}
                        fill
                        className={styles.cardImage}
                        sizes="(max-width: 960px) 100vw, 540px"
                      />
                    </div>
                  ) : null}

                  {section.imageDescription ? (
                    <p className={styles.imageDescription}>{section.imageDescription}</p>
                  ) : null}

                  {isEngravingCard && (placementOptions.length > 0 || section.placementLabel || section.methodLabel) ? (
                    <div className={styles.initialsConfig}>
                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>
                          1/1 • {section.methodLabel || section.placementLabel || "Шрифт гравировки"}
                        </h4>
                        <div className={styles.options}>
                          {placementOptions.map((placement) => (
                            <button
                              key={placement}
                              type="button"
                              className={`${styles.optionChip} ${
                                selectedPlacement === placement ? styles.optionChipActive : ""
                              }`}
                              onClick={() =>
                                setSelectedPlacementByCardId((prev) => ({ ...prev, [cardId]: placement }))
                              }
                            >
                              <span>{placement}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {(section.inputLabel || section.inputPlaceholder != null) ? (
                        <div className={styles.inputBlock}>
                          {section.inputLabel ? (
                            <label className={styles.inputLabel}>{section.inputLabel}</label>
                          ) : null}
                          <div className={styles.inputWithCounter}>
                            <input
                              className={styles.input}
                              placeholder={section.inputPlaceholder ?? ""}
                              value={initialsValue}
                              maxLength={section.inputMaxLength ?? 20}
                              onChange={(event) => {
                                const maxLen = section.inputMaxLength ?? 20;
                                const value = event.target.value.slice(0, maxLen);
                                setInitialsByCardId((prev) => ({ ...prev, [cardId]: value }));
                              }}
                            />
                            <span className={styles.inputCounter} aria-hidden>
                              {initialsValue.length}/{section.inputMaxLength ?? 20}
                            </span>
                          </div>
                          {section.inputNote?.trim() ? (
                            <p className={styles.inputNote}>{section.inputNote.trim()}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {isPackageCard &&
                  (section.methodLabel ||
                    section.inputLabel ||
                    section.inputPlaceholder != null ||
                    (section.methodColorIds ?? []).length > 0) ? (
                    <div className={styles.initialsConfig}>
                      {section.methodLabel && availableMethods.length > 0 ? (
                        <div className={styles.configGroup}>
                          <h4 className={styles.configTitle}>
                            1/2 • {section.methodLabel}
                          </h4>
                          <div className={styles.options}>
                            {availableMethods.map((method) => (
                              <button
                                key={method.id}
                                type="button"
                                className={`${styles.optionChip} ${
                                  selectedMethod === method.id ? styles.optionChipActive : ""
                                }`}
                                onClick={() =>
                                  setSelectedMethodByCardId((prev) => ({ ...prev, [cardId]: method.id }))
                                }
                              >
                                <span
                                  className={styles.optionDot}
                                  style={{ backgroundColor: method.hex || "#d0d0d0" }}
                                />
                                <span>{method.name || "(без названия)"}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {(section.inputLabel || section.inputPlaceholder != null) ? (
                        <div className={styles.configGroup}>
                          <h4 className={styles.configTitle}>
                            2/2 • {section.inputLabel ?? "Текст для открытки"}
                            {section.inputInfoLabel ? (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`${cardId}-input-info`}>{section.inputInfoLabel}</Tooltip>}
                              >
                                <span className={styles.infoLabel}>i</span>
                              </OverlayTrigger>
                            ) : null}
                          </h4>
                          <div className={styles.inputBlock}>
                            <div className={styles.inputWithCounter}>
                              <input
                                className={styles.input}
                                placeholder={section.inputPlaceholder ?? ""}
                                value={initialsValue}
                                maxLength={section.inputMaxLength ?? 150}
                                onChange={(event) => {
                                  const maxLen = section.inputMaxLength ?? 150;
                                  const value = event.target.value.slice(0, maxLen);
                                  setInitialsByCardId((prev) => ({ ...prev, [cardId]: value }));
                                }}
                              />
                              <span className={styles.inputCounter} aria-hidden>
                                {initialsValue.length}/{section.inputMaxLength ?? 150}
                              </span>
                            </div>
                            {section.inputNote?.trim() ? (
                              <p className={styles.inputNote}>{section.inputNote.trim()}</p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {hasInitialsConfig ? (
                    <div className={styles.initialsConfig}>
                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>1/3 • {section.methodLabel ?? ""}</h4>
                        <div className={styles.options}>
                          {availableMethods.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              className={`${styles.optionChip} ${
                                selectedMethod === method.id ? styles.optionChipActive : ""
                              }`}
                              onClick={() =>
                                setSelectedMethodByCardId((prev) => ({ ...prev, [cardId]: method.id }))
                              }
                            >
                              <span
                                className={styles.optionDot}
                                style={{ backgroundColor: method.hex || "#d0d0d0" }}
                              />
                              <span>{method.name || "(без названия)"}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>2/3 • {section.placementLabel ?? ""}</h4>
                        <div className={styles.options}>
                          {placementOptions.map((placement) => (
                            <button
                              key={placement}
                              type="button"
                              className={`${styles.optionChip} ${
                                selectedPlacement === placement ? styles.optionChipActive : ""
                              }`}
                              onClick={() =>
                                setSelectedPlacementByCardId((prev) => ({ ...prev, [cardId]: placement }))
                              }
                            >
                              <span>{placement}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={styles.configGroup}>
                        <h4 className={styles.configTitle}>
                          3/3 • {section.inputLabel ?? ""}
                          {section.inputInfoLabel ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id={`${cardId}-initials-info`}>{section.inputInfoLabel}</Tooltip>}
                            >
                              <span className={styles.infoLabel}>i</span>
                            </OverlayTrigger>
                          ) : null}
                        </h4>
                        <div className={styles.configInputWrap}>
                          <input
                            className={styles.input}
                            placeholder={section.inputPlaceholder || ""}
                            value={initialsValue}
                            onChange={(event) => {
                              const value = event.target.value.toUpperCase().slice(0, 3);
                              setInitialsByCardId((prev) => ({ ...prev, [cardId]: value }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                    </div>
                  </details>
                </article>
                );
              })}
            </div>
          ) : !wristSection ? (
            <div className={styles.emptyState}>Добавьте карточки в админке, чтобы заполнить 4-й шаг.</div>
          ) : null}
          </div>

          <div className={styles.summaryBlock}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Итого</span>
              <span className={styles.summaryDots} aria-hidden />
              <span className={styles.summaryValue}>{totalAmount.toLocaleString("ru-RU")} ₽</span>
            </div>
            <button type="button" className={styles.checkoutButton} onClick={handleAddToCart}>
              {step4?.ctaLabel ?? ""}
            </button>
            <div className={styles.summaryDescription}>
              <p className={styles.readyDate}>
                Дата отправки вашего заказа: {readyDate || "—"}.
              </p>
              {readyDateNote ? <p className={styles.readyDateNote}>{readyDateNote}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CheckoutStep;
