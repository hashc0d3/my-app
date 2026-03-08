"use client";

import Image from "next/image";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import type { ColorLibraryItem } from "@/src/shared/types/AppConfigTypes";
import type { Step4OptionConfig } from "@/src/shared/types/AppConfigTypes";
import type { Step4SectionConfig } from "@/src/shared/types/AppConfigTypes";
import paramStyles from "./EditParameterModal.module.css";

export type InitialsConfig = {
  methodId: string;
  placement: string;
  initials: string;
};

export type EngravingConfig = {
  fontOption: string;
  inscription: string;
};

export type PackageConfig = {
  methodId: string;
  cardText: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  section: Step4SectionConfig;
  /** Для обхвата запястья: список опций и выбранный id. */
  optionId?: string;
  options?: Step4OptionConfig[];
  onOptionChange?: (optionId: string) => void;
  /** Для аддона (Да/Нет), когда нет спец. режима (инициалы/гравировка/упаковка). */
  addonValue?: boolean;
  onAddonChange?: (value: boolean) => void;
  /** Для тиснения инициалов: способ, место, текст. */
  initialsConfig?: InitialsConfig;
  onInitialsChange?: (config: InitialsConfig) => void;
  /** Для гравировки: шрифт и текст надписи. */
  engravingConfig?: EngravingConfig;
  onEngravingChange?: (config: EngravingConfig) => void;
  /** Для подарочной упаковки: способ (цвет) и текст для открытки. */
  packageConfig?: PackageConfig;
  onPackageChange?: (config: PackageConfig) => void;
  colorLibrary?: ColorLibraryItem[];
  onFinish: () => void;
};

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

const EditParameterModal = ({
  open,
  onClose,
  section,
  optionId = "",
  options = [],
  onOptionChange,
  addonValue = false,
  onAddonChange,
  initialsConfig,
  onInitialsChange,
  engravingConfig,
  onEngravingChange,
  packageConfig,
  onPackageChange,
  colorLibrary = [],
  onFinish
}: Props) => {
  if (!open) return null;

  const isWrist = options.length > 0 && onOptionChange != null;
  const isInitials = hasInitialsConfig(section) && initialsConfig != null && onInitialsChange != null;
  const isEngraving =
    isEngravingSection(section) && engravingConfig != null && onEngravingChange != null;
  const isPackage =
    isPackageSection(section) && packageConfig != null && onPackageChange != null;
  const placementLabel = section.placementLabel ?? section.title;
  const mediaUrl = section.video ?? section.image;
  const hasMedia = Boolean(mediaUrl?.trim());
  const hasDownload = Boolean(section.downloadLinkText?.trim() && section.downloadLinkUrl?.trim());

  const allColors = colorLibrary.filter((c) => Boolean(c.name?.trim()) || Boolean(c.hex?.trim()));
  const methodColorIds = section.methodColorIds ?? [];
  const availableMethods = methodColorIds.length > 0
    ? allColors.filter((c) => methodColorIds.includes(c.id))
    : allColors;
  const placementOptions = (section.placementOptions ?? []).filter((p) => String(p).trim() !== "");
  const maxInitials = section.inputMaxLength ?? 3;
  const maxInscription = section.inputMaxLength ?? 20;
  const maxPackageText = section.inputMaxLength ?? 150;

  return (
    <div className={paramStyles.overlay} onClick={onClose}>
      <div className={paramStyles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={paramStyles.header}>
          <h2 className={paramStyles.title}>Редактирование параметра</h2>
          <button type="button" className={paramStyles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <Image src="/closeIcon.svg" alt="" width={40} height={40} />
          </button>
        </header>

        <div className={hasMedia ? paramStyles.layout : paramStyles.layoutNoMedia}>
          {hasMedia ? (
            <div className={paramStyles.mediaColumn}>
              <div className={paramStyles.mediaBox}>
                {section.video ? (
                  <div className={paramStyles.videoPlaceholder}>
                    <div className={paramStyles.playIcon} aria-hidden />
                    <Image
                      src={section.image || section.video}
                      alt=""
                      fill
                      className={paramStyles.mediaImage}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className={paramStyles.imageWrap}>
                    <Image
                      src={section.image}
                      alt=""
                      fill
                      className={paramStyles.mediaImage}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
              {section.imageDescription ? (
                <p className={paramStyles.mediaDescription}>{section.imageDescription}</p>
              ) : null}
              {hasDownload ? (
                <a
                  href={section.downloadLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={paramStyles.downloadLink}
                >
                  {section.downloadLinkText}
                  <span className={paramStyles.downloadChevron} aria-hidden>›</span>
                </a>
              ) : null}
            </div>
          ) : null}

          <div className={paramStyles.formColumn}>
            <div className={paramStyles.paramTitleRow}>
              <h3 className={paramStyles.paramTitle}>{section.title}</h3>
              {((isInitials || isEngraving || isPackage) && section.price != null && section.price > 0) ? (
                <span className={paramStyles.paramPrice}>+{section.price.toLocaleString("ru-RU")} ₽</span>
              ) : null}
            </div>
            {section.description ? (
              <p className={paramStyles.paramDescription}>{section.description}</p>
            ) : null}

            {isInitials ? (
              <>
                <div className={paramStyles.initialsSteps}>
                  <div className={paramStyles.configGroup}>
                    <h4 className={paramStyles.configTitle}>1/3 • {section.methodLabel ?? ""}</h4>
                    <div className={paramStyles.options}>
                      {availableMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          className={`${paramStyles.optionChip} ${
                            initialsConfig!.methodId === method.id ? paramStyles.optionChipActive : ""
                          }`}
                          onClick={() =>
                            onInitialsChange?.({
                              ...initialsConfig!,
                              methodId: method.id
                            })
                          }
                        >
                          <span
                            className={paramStyles.optionDot}
                            style={{ backgroundColor: method.hex || "#d0d0d0" }}
                          />
                          <span>{method.name || "(без названия)"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={paramStyles.configGroup}>
                    <h4 className={paramStyles.configTitle}>2/3 • {section.placementLabel ?? ""}</h4>
                    <div className={paramStyles.options}>
                      {placementOptions.map((placement) => (
                        <button
                          key={placement}
                          type="button"
                          className={`${paramStyles.optionChip} ${
                            initialsConfig!.placement === placement ? paramStyles.optionChipActive : ""
                          }`}
                          onClick={() =>
                            onInitialsChange?.({
                              ...initialsConfig!,
                              placement
                            })
                          }
                        >
                          <span>{placement}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={paramStyles.configGroup}>
                    <h4 className={paramStyles.configTitle}>
                      3/3 • {section.inputLabel ?? ""}
                      {section.inputInfoLabel ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`edit-param-initials-info-${section.id}`}>
                              {section.inputInfoLabel}
                            </Tooltip>
                          }
                        >
                          <span className={paramStyles.infoLabel}>i</span>
                        </OverlayTrigger>
                      ) : null}
                    </h4>
                    <div className={paramStyles.inputWithCounter}>
                      <input
                        className={paramStyles.input}
                        placeholder={section.inputPlaceholder ?? ""}
                        value={initialsConfig!.initials}
                        maxLength={maxInitials}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase().slice(0, maxInitials);
                          onInitialsChange?.({ ...initialsConfig!, initials: value });
                        }}
                        aria-label={section.inputLabel ?? "Текст инициалов"}
                      />
                      <span className={paramStyles.inputCounter} aria-hidden>
                        {initialsConfig!.initials.length}/{maxInitials}
                      </span>
                    </div>
                    {section.inputNote?.trim() ? (
                      <p className={paramStyles.inputNote}>{section.inputNote.trim()}</p>
                    ) : null}
                  </div>
                </div>
                <button type="button" className={paramStyles.submit} onClick={onFinish}>
                  Завершить редактирование
                </button>
              </>
            ) : isEngraving ? (
              <>
                <div className={paramStyles.engravingSteps}>
                  <div className={paramStyles.configGroup}>
                    <h4 className={paramStyles.configTitle}>
                      1/1 • {section.methodLabel || section.placementLabel || "Шрифт гравировки"}
                    </h4>
                    {(hasDownload || section.inputInfoLabel) ? (
                      <div className={paramStyles.titleExtra}>
                        {hasDownload ? (
                          <a
                            href={section.downloadLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={paramStyles.fontPreviewLink}
                          >
                            {section.downloadLinkText}
                            <span className={paramStyles.downloadChevron} aria-hidden>›</span>
                          </a>
                        ) : null}
                        {section.inputInfoLabel ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`edit-param-engraving-info-${section.id}`}>
                                {section.inputInfoLabel}
                              </Tooltip>
                            }
                          >
                            <span className={paramStyles.infoLabel}>i</span>
                          </OverlayTrigger>
                        ) : null}
                      </div>
                    ) : null}
                    <div className={paramStyles.options}>
                      {placementOptions.map((fontOption) => (
                        <button
                          key={fontOption}
                          type="button"
                          className={`${paramStyles.optionChip} ${
                            engravingConfig!.fontOption === fontOption
                              ? paramStyles.optionChipActive
                              : ""
                          }`}
                          onClick={() =>
                            onEngravingChange?.({
                              ...engravingConfig!,
                              fontOption
                            })
                          }
                        >
                          <span>{fontOption}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={paramStyles.configGroup}>
                    <h4 className={paramStyles.configTitle}>{section.inputLabel ?? "Текст надписи"}</h4>
                    <div className={paramStyles.inputWithCounter}>
                      <input
                        className={paramStyles.input}
                        placeholder={section.inputPlaceholder ?? ""}
                        value={engravingConfig!.inscription}
                        maxLength={maxInscription}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, maxInscription);
                          onEngravingChange?.({ ...engravingConfig!, inscription: value });
                        }}
                        aria-label={section.inputLabel ?? "Текст надписи"}
                      />
                      <span className={paramStyles.inputCounter} aria-hidden>
                        {engravingConfig!.inscription.length}/{maxInscription}
                      </span>
                    </div>
                    {section.inputNote?.trim() ? (
                      <p className={paramStyles.inputNote}>{section.inputNote.trim()}</p>
                    ) : null}
                  </div>
                </div>
                <button type="button" className={paramStyles.submit} onClick={onFinish}>
                  Завершить редактирование
                </button>
              </>
            ) : isPackage ? (
              <>
                <div className={paramStyles.engravingSteps}>
                  {section.methodLabel && availableMethods.length > 0 ? (
                    <div className={paramStyles.configGroup}>
                      <h4 className={paramStyles.configTitle}>
                        1/2 • {section.methodLabel}
                      </h4>
                      <div className={paramStyles.options}>
                        {availableMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            className={`${paramStyles.optionChip} ${
                              packageConfig!.methodId === method.id
                                ? paramStyles.optionChipActive
                                : ""
                            }`}
                            onClick={() =>
                              onPackageChange?.({
                                ...packageConfig!,
                                methodId: method.id
                              })
                            }
                          >
                            <span
                              className={paramStyles.optionDot}
                              style={{ backgroundColor: method.hex || "#d0d0d0" }}
                            />
                            <span>{method.name || "(без названия)"}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {(section.inputLabel || section.inputPlaceholder != null) ? (
                    <div className={paramStyles.configGroup}>
                      <h4 className={paramStyles.configTitle}>
                        2/2 • {section.inputLabel ?? "Текст для открытки"}
                        {section.inputInfoLabel ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`edit-param-package-info-${section.id}`}>
                                {section.inputInfoLabel}
                              </Tooltip>
                            }
                          >
                            <span className={paramStyles.infoLabel}>i</span>
                          </OverlayTrigger>
                        ) : null}
                      </h4>
                      <div className={paramStyles.textareaWithCounter}>
                        <textarea
                          className={paramStyles.textarea}
                          placeholder={section.inputPlaceholder ?? ""}
                          value={packageConfig!.cardText}
                          maxLength={maxPackageText}
                          rows={4}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, maxPackageText);
                            onPackageChange?.({ ...packageConfig!, cardText: value });
                          }}
                          aria-label={section.inputLabel ?? "Текст для открытки"}
                        />
                        <span className={paramStyles.inputCounterBottom} aria-hidden>
                          {packageConfig!.cardText.length}/{maxPackageText}
                        </span>
                      </div>
                      {section.inputNote?.trim() ? (
                        <p className={paramStyles.inputNote}>{section.inputNote.trim()}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <button type="button" className={paramStyles.submit} onClick={onFinish}>
                  Завершить редактирование
                </button>
              </>
            ) : (
              <>
                <p className={paramStyles.paramSubtitle}>
                  1/1 • {isWrist ? placementLabel : `Выберите значение для «${section.title}»`}
                </p>
                {isWrist ? (
                  <select
                    className={paramStyles.select}
                    value={optionId}
                    onChange={(e) => onOptionChange?.(e.target.value)}
                    aria-label={placementLabel}
                  >
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    className={paramStyles.select}
                    value={addonValue ? "yes" : "no"}
                    onChange={(e) => onAddonChange?.(e.target.value === "yes")}
                    aria-label={section.title}
                  >
                    <option value="yes">Да</option>
                    <option value="no">Нет</option>
                  </select>
                )}
                <button type="button" className={paramStyles.submit} onClick={onFinish}>
                  Завершить редактирование
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditParameterModal;
