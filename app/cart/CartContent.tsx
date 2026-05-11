"use client";

import { observer } from "mobx-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/src/widgets/header";
import { headerStore } from "@/src/entities/header";
import { cartStore } from "@/src/entities/cart";
import { showToaster } from "@/src/shared/lib/toaster";
import { appConfigStore } from "@/src/entities/app-config";
import { progressBarStore } from "@/src/entities/progress-bar";
import { watchModelStore } from "@/src/entities/watch-model";
import { strapModelStore } from "@/src/entities/strap-model";
import { strapConfiguratorStore } from "@/src/entities/strap-configurator";
import { Footer } from "@/src/widgets/footer";
import { buildHomeStepRoute, APP_ROUTES } from "@/src/shared/config/routes";
import { WATCH_CONFIG_STEPS } from "@/src/shared/config/steps";
import styles from "./CartContent.module.css";

const HeaderInfoModal = dynamic(
  () => import("@/src/features/header-info-modal/ui/HeaderInfoModal").then((m) => m.default)
);
const EditItemModal = dynamic(() => import("./EditItemModal").then((m) => m.default));

const EMPTY_CART_MESSAGE = "Корзина пустая, пожалуйста добавьте товар";

const CartContent = observer(() => {
  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    cartStore.hydrateState();
  }, []);

  useEffect(() => {
    if (!cartStore.hydrated) return;
    if (cartStore.itemsList.length === 0) {
      showToaster(EMPTY_CART_MESSAGE);
      router.replace(APP_ROUTES.home);
    }
  }, [cartStore.hydrated, cartStore.itemsList.length, router]);

  const subtotal = cartStore.subtotal;
  const total = cartStore.discountedSubtotal;
  const canApplyPromo = promoInput.trim().length > 0 && subtotal > 0;
  const readyDate = appConfigStore.config.step4?.readyDate?.trim() || "—";
  const readyDateNote = appConfigStore.config.step4?.readyDateNote?.trim() || "";

  const summaryRows = useMemo(
    () => [
      { label: "Стоимость изделий", value: subtotal },
      { label: "Скидка по промокоду", value: cartStore.promoDiscount }
    ],
    [subtotal, cartStore.promoDiscount]
  );

  const applyPromo = async () => {
    if (!canApplyPromo) return;
    setPromoError("");
    try {
      const response = await fetch("/api/public/promocodes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), subtotal })
      });
      const data = await response.json();
      if (!response.ok) {
        setPromoError(data?.message ?? "Не удалось применить промокод");
        return;
      }
      const discount = Math.max(0, Number(data?.discount ?? 0));
      cartStore.setPromo(String(data?.code ?? promoInput).trim(), discount);
    } catch {
      setPromoError("Не удалось применить промокод");
    }
  };

  useEffect(() => {
    if (!cartStore.promoCode || cartStore.itemsList.length === 0) return;
    let cancelled = false;
    const apply = async () => {
      try {
        const res = await fetch("/api/public/promocodes/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: cartStore.promoCode, subtotal: cartStore.subtotal })
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          cartStore.clearPromo();
          setPromoInput("");
          return;
        }
        const discount = Math.max(0, Number(data?.discount ?? 0));
        cartStore.setPromo(String(data?.code ?? cartStore.promoCode).trim(), discount);
      } catch {
        if (!cancelled) {
          cartStore.clearPromo();
          setPromoInput("");
        }
      }
    };
    apply();
    return () => { cancelled = true; };
  }, [cartStore.subtotal, cartStore.promoCode, cartStore.itemsList.length]);

  return (
    <div>
      <main className={`${headerStore.isOpenModal ? "blur-[15px]" : ""} w-full min-w-0 max-w-full overflow-x-hidden`}>
        <Header />
        <section className={styles.section}>
          <div className={styles.topBlock}>
            <h1 className={styles.title}>
              Корзина
              <sup className={styles.count}>({cartStore.items})</sup>
            </h1>
          </div>
          <div className={styles.layout}>
            <div className={styles.itemsColumn}>
              {cartStore.itemsList.length === 0 ? (
                <div className={styles.emptyState}>В корзине пока нет товаров.</div>
              ) : (
                <>
                  {cartStore.itemsList.map((item) => (
                    <article key={item.id} className={styles.cartItem}>
                    <div className={styles.itemHead}>
                      <div className={styles.itemMediaWrap}>
                        {item.imageLayers?.length ? (
                          item.imageLayers.map((layer, index) => (
                            <div key={`${item.id}-layer-${index}`} className={styles.itemMediaLayer}>
                              <Image
                                src={layer}
                                alt={`${item.title}-layer-${index}`}
                                fill
                                className={styles.itemMediaImage}
                                sizes="96px"
                              />
                            </div>
                          ))
                        ) : item.image ? (
                          <div className={styles.itemMediaLayer}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className={styles.itemMediaImage}
                              sizes="96px"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className={styles.itemContent}>
                        <div className={styles.itemTopRow}>
                          <h3 className={styles.itemTitle}>{item.title}</h3>
                          <div className={styles.qtyWrap}>
                            <div className={styles.qtyControls}>
                              <button type="button" onClick={() => cartStore.decreaseItem(item.id)} className={styles.qtyBtn}>−</button>
                              <span>{item.quantity}</span>
                              <button type="button" onClick={() => cartStore.increaseItem(item.id)} className={styles.qtyBtn}>+</button>
                            </div>
                            <button
                              type="button"
                              className={styles.removeIconBtn}
                              onClick={() => cartStore.removeItem(item.id)}
                              aria-label="Удалить товар"
                            >
                              <Image src="/closeIcon.svg" alt="" width={16} height={16} />
                            </button>
                          </div>
                        </div>
                        <p className={styles.itemPrice}>
                          {item.unitPrice.toLocaleString("ru-RU")} ₽
                          {item.quantity > 1 ? ` x${item.quantity}` : ""}
                        </p>

                        <details className={styles.paramsDetails} open>
                          <summary className={styles.paramsSummary}>
                            <span className={styles.paramsTitle}>Параметры заказа</span>
                            <span className={styles.paramsSummaryIcon}>
                              <Image src="/listOpenIcon.svg" className={styles.iconOpen} alt="" width={18} height={18} />
                              <Image src="/listCloseIcon.svg" className={styles.iconClose} alt="" width={18} height={18} />
                            </span>
                          </summary>
                          <ul className={styles.paramsList}>
                            {item.parameters.map((param, idx) => (
                              <li key={`${item.id}-${idx}`}>{param}</li>
                            ))}
                          </ul>
                        </details>

                        <div className={styles.itemActions}>
                          <button type="button" className={styles.editLink} onClick={() => setEditingItemId(item.id)}>
                            Редактировать изделие
                          </button>
                        </div>
                      </div>
                    </div>
                    </article>
                  ))}
                  <button
                    type="button"
                    className={styles.addAnotherBtn}
                    onClick={() => {
                      watchModelStore.resetSelection();
                      strapModelStore.resetSelection();
                      strapConfiguratorStore.resetSelection();
                      progressBarStore.setCurrentStep(WATCH_CONFIG_STEPS.initial);
                      router.push(buildHomeStepRoute(WATCH_CONFIG_STEPS.initial));
                    }}
                  >
                    Добавить еще изделие
                  </button>
                </>
              )}
            </div>

            <aside className={styles.summaryColumn}>
              <h2 className={styles.summaryTitle}>Сумма заказа</h2>
              <div className={styles.summaryRows}>
                {summaryRows.map((row) => (
                  <div key={row.label} className={styles.summaryRow}>
                    <span>{row.label}</span>
                    <span className={styles.summaryDots} aria-hidden />
                    <span>{row.value.toLocaleString("ru-RU")} ₽</span>
                  </div>
                ))}
              </div>
              <div className={styles.totalRow}>
                <span>Итого:</span>
                <span>{total.toLocaleString("ru-RU")} ₽</span>
              </div>

              <div className={styles.promoWrap}>
                {cartStore.promoCode ? (
                  <div className={styles.promoAppliedBar}>
                    <span className={styles.promoCodeValue}>{cartStore.promoCode}</span>
                    <span className={styles.promoAppliedText}>промокод применен</span>
                    <button
                      type="button"
                      className={styles.promoCloseBtn}
                      onClick={() => {
                        cartStore.clearPromo();
                        setPromoInput("");
                      }}
                      aria-label="Убрать промокод"
                    >
                      <Image src="/closeIcon.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.promoBar}>
                    <input
                      className={styles.promoInput}
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      placeholder="Промокод"
                    />
                    <button type="button" className={styles.promoApplyBtn} onClick={applyPromo} disabled={!canApplyPromo}>
                      Применить
                    </button>
                  </div>
                )}
              </div>
              {promoError ? <p className={styles.promoError}>{promoError}</p> : null}
              <button type="button" className={styles.summaryActionBtn} onClick={() => router.push("/checkout")}>
                Перейти на следующий шаг
              </button>
              <p className={styles.summaryNote}>Дата отправки вашего заказа: {readyDate}.</p>
              {readyDateNote ? <p className={styles.summaryNote}>{readyDateNote}</p> : null}
            </aside>
          </div>
        </section>
        <Footer />
      </main>
      <HeaderInfoModal />
      <EditItemModal item={cartStore.itemsList.find((entry) => entry.id === editingItemId) ?? null} onClose={() => setEditingItemId(null)} />
    </div>
  );
});

export default CartContent;
