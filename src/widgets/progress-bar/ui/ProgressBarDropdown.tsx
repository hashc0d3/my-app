"use client";

import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import { progressBarFilters } from "@/src/shared/lib/progressBar";
import Image from "next/image";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { watchModelStore } from "@/src/entities/watch-model";
import { progressBarStore } from "@/src/entities/progress-bar";
import { strapModelStore } from "@/src/entities/strap-model";
import { useStep3Params, STEP3_LABELS } from "../hooks";
import styles from "./ProgressBarDropdown.module.css";

/** Пропсы виджета: липкость и компактный режим (модалка вместо дропдауна на узких экранах) */
interface ProgressBarFiltersProps {
    isSticky: boolean;
    isCompact?: boolean;
}

/**
 * Внутренний компонент фильтров прогресс-бара.
 * Логика шага 3 вынесена в hooks/useStep3Params.
 */
function ProgressBarFiltersInner({ isSticky, isCompact = false }: ProgressBarFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const selectedColor = watchModelStore.selectedColor?.name;
    const selectedSize = watchModelStore.selectedSize;
    const selectedModel = watchModelStore.selectedModel;
    const selectedStrap = strapModelStore.selectedStrapName;
    const step3Params = useStep3Params();

    const handleGoToStep1 = () => {
        progressBarStore.setCurrentStep(1);
        setIsModalOpen(false);
        setIsOpen(false);
    };
    const handleGoToStep2 = () => {
        progressBarStore.setCurrentStep(2);
        setIsModalOpen(false);
        setIsOpen(false);
    };
    const handleGoToStep3 = () => {
        progressBarStore.setCurrentStep(3);
        setIsModalOpen(false);
        setIsOpen(false);
    };

    if (isCompact) {
        return (
            <>
                <button
                    type="button"
                    className={`${styles.toggle} ${isSticky ? styles.surfaceSticky : styles.surfaceNormal} ${styles.compactButton}`}
                    onClick={() => setIsModalOpen(true)}
                >
                    Параметры
                    <Image
                        src="/arrow.svg"
                        alt="toggle"
                        width={20}
                        height={22}
                    />
                </button>

                <Modal
                    show={isModalOpen}
                    onHide={() => setIsModalOpen(false)}
                    centered
                    dialogClassName={styles.modalDialog}
                    contentClassName={styles.modalContent}
                    backdropClassName={styles.modalBackdrop}
                >
                    <Modal.Header className={styles.modalHeader}>
                        <Modal.Title className={styles.modalTitle}>Выбранные параметры</Modal.Title>
                        <button
                            type="button"
                            className={styles.modalClose}
                            aria-label="Закрыть"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ×
                        </button>
                    </Modal.Header>
                    <Modal.Body className={styles.modalBody}>
                        <p className={styles.modalHint}>Нажмите на параметр, чтобы вернуться на нужный шаг для его изменения</p>
                        <div className={styles.separator} />
                        <button type="button" className={styles.modalItem} onClick={handleGoToStep1}>
                            Apple Watch: {selectedModel || "—"}
                        </button>
                        <button type="button" className={styles.modalItem} onClick={handleGoToStep1}>
                            Цвет часов: {selectedColor || "—"}
                        </button>
                        <button type="button" className={styles.modalItem} onClick={handleGoToStep1}>
                            Размер: {selectedSize ? `${selectedSize}mm` : "—"}
                        </button>
                        {progressBarStore.currentStep >= 3 && (
                            <button type="button" className={styles.modalItem} onClick={handleGoToStep2}>
                                Модель ремешка: {selectedStrap || "—"}
                            </button>
                        )}
                        {progressBarStore.currentStep === 4 && (
                            <>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.leatherType}: {step3Params.leatherType}
                                </button>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.leatherColor}: {step3Params.leatherColor}
                                </button>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.stitch}: {step3Params.stitch}
                                </button>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.edge}: {step3Params.edge}
                                </button>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.buckle}: {step3Params.buckle}
                                </button>
                                <button type="button" className={styles.modalItem} onClick={handleGoToStep3}>
                                    {STEP3_LABELS.adapter}: {step3Params.adapter}
                                </button>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    return (
        <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)}>
            <Dropdown.Toggle
                className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ""} ${isSticky ? styles.surfaceSticky : styles.surfaceNormal}`}
            >
                {isCompact ? "Параметры" : progressBarFilters.name}
                <Image
                    src={isOpen ? progressBarFilters.iconOpen : progressBarFilters.iconClose}
                    alt="toggle"
                    width={20}
                    height={22}
                />
            </Dropdown.Toggle>

            <Dropdown.Menu
                className={`${styles.menu} ${isSticky ? styles.surfaceSticky : styles.surfaceNormal}`}
            >
                <div className={styles.separator} />
                <Dropdown.Item onClick={handleGoToStep1}>
                    Apple Watch: {selectedModel ?? "—"}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleGoToStep1}>
                    Цвет часов: {selectedColor ?? "—"}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleGoToStep1}>
                    Размер: {selectedSize != null ? `${selectedSize}mm` : "—"}
                </Dropdown.Item>
                {progressBarStore.currentStep >= 3 && (
                    <Dropdown.Item onClick={handleGoToStep2}>
                        Модель ремешка: {selectedStrap ?? "—"}
                    </Dropdown.Item>
                )}
                {progressBarStore.currentStep === 4 && (
                    <>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.leatherType}: {step3Params.leatherType}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.leatherColor}: {step3Params.leatherColor}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.stitch}: {step3Params.stitch}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.edge}: {step3Params.edge}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.buckle}: {step3Params.buckle}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleGoToStep3}>
                            {STEP3_LABELS.adapter}: {step3Params.adapter}
                        </Dropdown.Item>
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export const ProgressBarFilters = observer(ProgressBarFiltersInner);
export default ProgressBarFilters;