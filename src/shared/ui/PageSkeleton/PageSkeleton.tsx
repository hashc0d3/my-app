"use client";

import styles from "./PageSkeleton.module.css";

/** Скелетон страницы конфигуратора для Suspense fallback. */
export function PageSkeleton() {
  return (
    <div className={styles.skeleton} aria-label="Загрузка">
      <div className={styles.header}>
        <div className={styles.headerLine} />
        <div className={styles.headerLine} />
        <div className={styles.headerLine} />
      </div>
      <div className={styles.titleBlock}>
        <div className={styles.titleLine} />
        <div className={styles.subtitleLine} />
      </div>
      <div className={styles.progressBar}>
        <div className={styles.step} />
        <div className={styles.step} />
        <div className={styles.step} />
        <div className={styles.step} />
      </div>
      <div className={styles.cards}>
        <div className={styles.card} />
        <div className={styles.card} />
        <div className={styles.card} />
        <div className={styles.card} />
      </div>
    </div>
  );
}
