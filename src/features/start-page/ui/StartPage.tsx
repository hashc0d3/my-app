"use client";

import styles from "./StartPage.module.css";

type StartPageProps = {
  onChooseWatch: () => void;
  /** Пока нет отдельного конфигуратора чехлов — можно заменить на реальный маршрут */
  onChooseIphone: () => void;
};

export function StartPage({ onChooseWatch, onChooseIphone }: StartPageProps) {
  return (
    <section className={`${styles.wrap} container-padding`} aria-label="Выбор категории">
      <h1 className={styles.hero}>
        <span className={styles.heroLine1}>Конструктор ремешков</span>
        <span className={styles.heroLine2}>
          и чехлов от <span className={styles.brand}>«Slava Larionov»</span>
        </span>
      </h1>

      <div className={styles.grid}>
        <button type="button" className={styles.card} onClick={onChooseWatch}>
          <div className={styles.cardInner}>
            <div className={styles.visual}>
              <div className={styles.bgLayer} aria-hidden>
                <img
                  className={styles.bgFill}
                  src="/startPageLeftBG.webp"
                  alt=""
                  width={560}
                  height={720}
                  decoding="async"
                />
              </div>
              <div className={styles.foreground}>
                <div className={styles.glass}>
                  <img
                    className={styles.foregroundImg}
                    src="/startPageLeftBG.png"
                    alt=""
                    width={560}
                    height={720}
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.caption}>
            Кастомизация ремешков
            <span className={styles.captionLine2}>для Apple Watch</span>
          </div>
        </button>

        <button type="button" className={styles.card} onClick={onChooseIphone}>
          <div className={styles.cardInner}>
            <div className={styles.visual}>
              <div className={styles.bgLayer} aria-hidden>
                <img
                  className={styles.bgFill}
                  src="/startPageRightBG.webp"
                  alt=""
                  width={560}
                  height={720}
                  decoding="async"
                />
              </div>
              <div className={styles.foreground}>
                <div className={styles.glass}>
                  <img
                    className={styles.foregroundImg}
                    src="/startPageRightBG.png"
                    alt=""
                    width={560}
                    height={720}
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.caption}>
            Кастомизация чехлов
            <span className={styles.captionLine2}>для iPhone 12–17</span>
          </div>
        </button>
      </div>
    </section>
  );
}
