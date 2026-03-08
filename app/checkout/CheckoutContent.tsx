"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react";
import toast from "react-hot-toast";
import { Header } from "@/src/widgets/header";
import { HeaderInfoModal } from "@/src/features/header-info-modal";
import { headerStore } from "@/src/entities/header";
import { Footer } from "@/src/widgets/footer";
import { cartStore } from "@/src/entities/cart";
import { checkoutStore } from "@/src/entities/checkout";
import { appConfigStore } from "@/src/entities/app-config";
import type { CDEKWidgetInstance } from "@/src/shared/types/cdek-widget";
import styles from "./CheckoutContent.module.css";

const CDEK_DELIVERY_IDS = ["cdek_pickup", "post_omni"] as const;
const CDEK_SCRIPT_URL = "https://cdn.jsdelivr.net/gh/cdek-it/widget@latest/dist/cdek-widget.umd.js";
const YANDEX_API_KEY = process.env.NEXT_PUBLIC_YANDEX_API_KEY ?? "";

const DEFAULT_CITY_NAME = "Санкт-Петербург";

function itemsLabel(count: number): string {
  if (count === 1) return "1 товар";
  if (count >= 2 && count <= 4) return `${count} товара`;
  return `${count} товаров`;
}

const deliveryOptions = [
  {
    id: "cdek_pickup",
    title: "СДЭК до пункта выдачи",
    subtitle: "от 1 дня, от 195 ₽",
    price: 195
  },
  {
    id: "cdek_courier",
    title: "СДЭК курьером до двери",
    subtitle: "от 1 дня, от 385 ₽",
    price: 385
  },
  {
    id: "post_omni",
    title: "Постамат OmniCDEK",
    subtitle: "от 1 дня, от 195 ₽",
    price: 195
  },
  {
    id: "post_ru",
    title: "Почта России 1 класс",
    subtitle: "4-6 дней",
    price: 0
  },
  {
    id: "spb_courier",
    title: "Доставка курьером по Спб",
    subtitle: "600 ₽",
    note: "Согласуем удобное место и время доставки",
    price: 600
  },
  {
    id: "pickup_spb",
    title: "Самовывоз с производства в Спб",
    subtitle: "0 ₽",
    note: "По готовности заказа согласуем удобное время",
    price: 0
  }
] as const;

type CitySuggestion = { value: string; city?: string; postal_code?: string };

const CheckoutContent = observer(() => {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [citySuggestionsLoading, setCitySuggestionsLoading] = useState(false);
  const [cdekScriptLoaded, setCdekScriptLoaded] = useState(false);
  const cdekWidgetRef = useRef<CDEKWidgetInstance | null>(null);
  const defaultCityAppliedRef = useRef(false);

  const isCdekDelivery = CDEK_DELIVERY_IDS.includes(
    checkoutStore.form.deliveryMethod as (typeof CDEK_DELIVERY_IDS)[number]
  );

  useEffect(() => {
    checkoutStore.hydrateState();
  }, []);

  // Загрузка списка городов при доставке СДЭК: один запрос по дефолтному городу, options из ответа API
  useEffect(() => {
    if (!isCdekDelivery) {
      defaultCityAppliedRef.current = false;
      setCitySuggestions([]);
      return;
    }
    if (citySuggestions.length > 0) return;

    let cancelled = false;
    setCitySuggestionsLoading(true);
    const load = async () => {
      try {
        const res = await fetch("/api/public/delivery/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: DEFAULT_CITY_NAME })
        });
        const data = (await res.json()) as CitySuggestion[];
        if (cancelled) return;
        const loaded = Array.isArray(data) ? data.filter((c) => (c.value ?? "").trim()) : [];
        if (!cancelled) {
          setCitySuggestions(loaded);
          const currentCity = (checkoutStore.form.city ?? "").trim();
          if (!currentCity && !defaultCityAppliedRef.current && loaded.length > 0) {
            const spb =
              loaded.find(
                (c) =>
                  (c.value ?? "").toLowerCase().includes("санкт") ||
                  (c.value ?? "").toLowerCase().includes("петербург") ||
                  (c.city ?? "").toLowerCase().includes("санкт") ||
                  (c.city ?? "").toLowerCase().includes("петербург")
              ) ?? loaded[0];
            const value = spb?.value ?? DEFAULT_CITY_NAME;
            checkoutStore.setField("city", value);
            defaultCityAppliedRef.current = true;
          }
        }
      } catch {
        if (!cancelled) setCitySuggestions([]);
      } finally {
        if (!cancelled) setCitySuggestionsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isCdekDelivery]);

  const subtotal = cartStore.subtotal;
  const canApplyPromo = promoInput.trim().length > 0 && subtotal > 0;
  const delivery =
    deliveryOptions.find((item) => item.id === checkoutStore.form.deliveryMethod) ?? deliveryOptions[0];
  const deliveryPrice = delivery.price;
  const discountedItemsTotal = Math.max(0, subtotal - cartStore.promoDiscount);
  const finalTotal = discountedItemsTotal + deliveryPrice;

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
    if (typeof window === "undefined" || document.querySelector('script[src="' + CDEK_SCRIPT_URL + '"]'))
      return;
    const script = document.createElement("script");
    script.src = CDEK_SCRIPT_URL;
    script.async = true;
    script.onload = () => setCdekScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isCdekDelivery || !checkoutStore.form.city.trim() || !cdekScriptLoaded) return;
    if (!YANDEX_API_KEY) return;
    if (typeof window.CDEKWidget !== "function") return;
    const rootId = "cdek-delivery-map";
    const root = document.getElementById(rootId);
    if (!root) return;
    const city = checkoutStore.form.city.trim();
    try {
      if (cdekWidgetRef.current?.destroy) {
        cdekWidgetRef.current.destroy();
        cdekWidgetRef.current = null;
      }
      root.innerHTML = "";
      const instance = new window.CDEKWidget!({
        from: city,
        root: rootId,
        apiKey: YANDEX_API_KEY,
        servicePath: "/api/public/delivery/cdek",
        defaultLocation: city,
        onChoose: (_mode, _tarif, address) => {
          checkoutStore.setField("deliveryPoint", [address.name, address.address].filter(Boolean).join(", "));
        }
      });
      cdekWidgetRef.current = instance;
    } catch (e) {
      console.error("CDEK widget init error:", e);
    }
    return () => {
      if (cdekWidgetRef.current?.destroy) {
        cdekWidgetRef.current.destroy();
        cdekWidgetRef.current = null;
      }
    };
  }, [isCdekDelivery, checkoutStore.form.city, cdekScriptLoaded]);

  const validatePayForm = (): boolean => {
    if (!checkoutStore.form.agreeTerms) {
      toast.error("Примите согласие на обработку данных и оферту");
      return false;
    }
    const email = checkoutStore.form.email.trim();
    if (!email) {
      toast.error("Укажите email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Укажите корректный email");
      return false;
    }
    const phone = checkoutStore.form.phone.trim().replace(/\D/g, "");
    if (phone.length < 10) {
      toast.error("Укажите корректный номер телефона");
      return false;
    }
    if (!checkoutStore.form.recipientName.trim()) {
      toast.error("Укажите ФИО получателя");
      return false;
    }
    if (cartStore.itemsList.length === 0) {
      toast.error("Корзина пуста");
      return false;
    }
    if (isCdekDelivery) {
      if (!checkoutStore.form.city.trim()) {
        toast.error("Укажите город для доставки СДЭК");
        return false;
      }
      if (!checkoutStore.form.deliveryPoint.trim()) {
        toast.error("Выберите пункт выдачи на карте");
        return false;
      }
    }
    return true;
  };

  const handlePayOrder = async () => {
    if (!validatePayForm() || payLoading) return;

    setPayLoading(true);
    const orderNumber = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");

    try {
      const retailCrmPayload = {
        orderNumber,
        items: cartStore.itemsList.map((item) => ({
          productName: item.title,
          quantity: item.quantity,
          initialPrice: item.unitPrice,
          properties:
            item.parameters?.length > 0
              ? [{ name: "Параметры", value: item.parameters.join(", ") }]
              : []
        })),
        firstName: checkoutStore.form.recipientName.trim(),
        email: checkoutStore.form.email.trim(),
        phone: checkoutStore.form.phone.trim(),
        deliveryMethod: checkoutStore.form.deliveryMethod,
        deliveryPoint: checkoutStore.form.deliveryPoint || undefined,
        comment: checkoutStore.form.comment || undefined,
        deliveryPrice,
        promoCode: cartStore.promoCode || undefined,
        totalPrice: finalTotal
      };

      const orderRes = await fetch("/api/public/retailcrm/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(retailCrmPayload)
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        toast.error(errData?.data?.errorMsg ?? errData?.message ?? "Не удалось создать заказ");
        setPayLoading(false);
        return;
      }

      const amountRub = Math.max(0, Math.round(finalTotal));
      if (amountRub <= 0) {
        toast.success("Заказ оформлен");
        setPayLoading(false);
        window.location.href = `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/success`;
        return;
      }

      const paymentRes = await fetch("/api/public/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountRub,
          purpose: `Заказ №${orderNumber}`,
          paymentMode: ["card", "sbp"],
          redirectUrl:
            typeof window !== "undefined" ? `${window.location.origin}/checkout/success` : undefined,
          orderId: orderNumber
        })
      });

      const paymentData = await paymentRes.json();
      const paymentLink = paymentData?.data?.Data?.paymentLink;

      if (paymentData?.success && paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      toast.error(
        paymentData?.data?.Message ?? paymentData?.message ?? "Не удалось перейти к оплате. Попробуйте позже."
      );
    } catch (e) {
      console.error(e);
      toast.error("Ошибка при оформлении заказа. Попробуйте позже.");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div>
      <main className={headerStore.isOpenModal ? "blur-[15px]" : ""}>
        <Header />
        <section className={styles.section}>
          <div className={styles.topBlock}>
            <Link href="/cart" className={styles.backLink}>
              <Image src="/goBack.svg" alt="" width={20} height={20} />
              В Корзину
            </Link>
            <h1 className={styles.title}>Оформление заказа</h1>
          </div>
          <div className={styles.layout}>
            <div className={styles.leftColumn}>
              <div className={styles.contactCard}>
                <h3 className={styles.contactTitle}>1/2 • Контакты</h3>
                <div className={styles.contactDivider} />

                <div className={styles.contactGrid}>
                  <div className={styles.contactField}>
                    <label className={styles.contactLabel}>Эл. почта</label>
                    <input
                      type="email"
                      className={styles.contactInput}
                      value={checkoutStore.form.email}
                      onChange={(event) => checkoutStore.setField("email", event.target.value)}
                      placeholder="hello@slavalarionov.com"
                    />
                  </div>
                  <div className={styles.contactField}>
                    <label className={styles.contactLabel}>Телефон</label>
                    <input
                      type="tel"
                      className={styles.contactInput}
                      value={checkoutStore.form.phone}
                      onChange={(event) => checkoutStore.setField("phone", event.target.value)}
                      placeholder="+7 (995) 771-50-30"
                    />
                  </div>

                  <div className={styles.contactField}>
                    <label className={styles.contactLabel}>Как с вами связаться</label>
                    <select
                      className={styles.contactSelect}
                      value={checkoutStore.form.contactMethod}
                      onChange={(event) =>
                        checkoutStore.setField(
                          "contactMethod",
                          (event.target.value as "telegram" | "whatsapp" | "phone" | "email")
                        )
                      }
                    >
                      <option value="telegram">Телеграм</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Телефон</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div className={styles.contactField}>
                    <label className={styles.contactLabel}>Контакт для связи</label>
                    <input
                      type="text"
                      className={styles.contactInput}
                      value={checkoutStore.form.contactHandle}
                      onChange={(event) => checkoutStore.setField("contactHandle", event.target.value)}
                      placeholder="@slava_larionov"
                    />
                  </div>
                </div>

                <div className={styles.contactDivider} />
                <p className={styles.contactHint}>
                  Если вы выбрали мессенджер для связи, проверьте, чтобы сообщения там не были закрыты, и мы смогли
                  написать.
                </p>
              </div>

              <div className={styles.deliveryCard}>
                <h3 className={styles.contactTitle}>2/2 • Доставка</h3>
                <div className={styles.contactDivider} />

                <div className={styles.deliveryGrid}>
                  {deliveryOptions.map((option) => {
                    const checked = checkoutStore.form.deliveryMethod === option.id;
                    return (
                      <label key={option.id} className={styles.deliveryOption}>
                        <span className={styles.deliveryRadioIcon}>
                          <Image
                            src={checked ? "/checkboxTrue.svg" : "/checkbox.svg"}
                            alt=""
                            width={20}
                            height={21}
                          />
                        </span>
                        <input
                          type="radio"
                          name="delivery-method"
                          checked={checked}
                          onChange={() => checkoutStore.setField("deliveryMethod", option.id)}
                          className={styles.deliveryRadioInput}
                        />
                        <span className={styles.deliveryTextWrap}>
                          <span className={styles.deliveryTitle}>{option.title}</span>
                          <span className={styles.deliverySubtitle}>{option.subtitle}</span>
                          {"note" in option && option.note ? <span className={styles.deliveryNote}>{option.note}</span> : null}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className={styles.deliveryMetaGrid}>
                  <div className={styles.contactField}>
                    <label className={styles.contactLabel}>Получатель (ФИО полностью)</label>
                    <input
                      type="text"
                      className={styles.contactInput}
                      value={checkoutStore.form.recipientName}
                      onChange={(event) => checkoutStore.setField("recipientName", event.target.value)}
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>
                  {isCdekDelivery ? (
                    <div className={styles.contactField}>
                      <label className={styles.contactLabel}>Город</label>
                      <select
                        className={styles.contactSelect}
                        value={
                          citySuggestions.length > 0 && checkoutStore.form.city
                            ? citySuggestions.some((c) => (c.value ?? "") === checkoutStore.form.city)
                              ? checkoutStore.form.city
                              : citySuggestions[0]?.value ?? ""
                            : citySuggestions.length > 0
                              ? citySuggestions[0].value ?? ""
                              : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) checkoutStore.setField("city", value);
                        }}
                        disabled={citySuggestionsLoading}
                      >
                        {citySuggestionsLoading ? (
                          <option value="">Загрузка...</option>
                        ) : citySuggestions.length === 0 ? (
                          <option value="">Нет данных</option>
                        ) : (
                          citySuggestions.map((s, i) => (
                            <option key={`${s.value}-${i}`} value={s.value ?? ""}>
                              {s.value}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  ) : (
                    <div className={styles.contactField}>
                      <label className={styles.contactLabel}>Пункт выдачи / Адрес</label>
                      <input
                        type="text"
                        className={styles.contactInput}
                        value={checkoutStore.form.deliveryPoint}
                        onChange={(e) => checkoutStore.setField("deliveryPoint", e.target.value)}
                        placeholder="Укажите адрес или пункт выдачи"
                      />
                    </div>
                  )}
                </div>

                {isCdekDelivery && checkoutStore.form.city.trim() ? (
                  <div className={styles.cdekMapBlock}>
                    <label className={styles.contactLabel}>Пункт выдачи СДЭК</label>
                    {checkoutStore.form.deliveryPoint ? (
                      <p className={styles.cdekSelectedPoint}>{checkoutStore.form.deliveryPoint}</p>
                    ) : null}
                    {YANDEX_API_KEY ? (
                      <div id="cdek-delivery-map" className={styles.cdekMapRoot} />
                    ) : (
                      <div className={styles.mapPlaceholder}>
                        Для отображения карты укажите NEXT_PUBLIC_YANDEX_API_KEY в .env.local. Пункт выдачи можно
                        указать вручную ниже.
                      </div>
                    )}
                    {!YANDEX_API_KEY ? (
                      <div className={styles.contactField} style={{ marginTop: 8 }}>
                        <input
                          type="text"
                          className={styles.contactInput}
                          value={checkoutStore.form.deliveryPoint}
                          onChange={(e) => checkoutStore.setField("deliveryPoint", e.target.value)}
                          placeholder="Адрес пункта выдачи СДЭК"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : isCdekDelivery ? (
                  <div className={styles.mapPlaceholder}>
                    Выберите город выше, чтобы загрузить карту пунктов выдачи СДЭК
                  </div>
                ) : null}

                <div className={styles.contactField}>
                  <label className={styles.contactLabel}>Комментарий к заказу</label>
                  <input
                    type="text"
                    className={styles.contactInput}
                    value={checkoutStore.form.comment}
                    onChange={(event) => checkoutStore.setField("comment", event.target.value)}
                    placeholder="Например, обхват запястья или пожелания к заказу"
                  />
                </div>

                <label className={styles.saveCheck}>
                  <span className={styles.deliveryRadioIcon}>
                    <Image
                      src={checkoutStore.form.agreePolicy ? "/checkboxTrue.svg" : "/checkbox.svg"}
                      alt=""
                      width={20}
                      height={21}
                    />
                  </span>
                  <input
                    type="checkbox"
                    checked={checkoutStore.form.agreePolicy}
                    onChange={(event) => checkoutStore.setField("agreePolicy", event.target.checked)}
                    className={styles.deliveryRadioInput}
                  />
                  Запомнить эти контакты в браузере для повторной покупки
                </label>
              </div>
            </div>

            <aside className={styles.rightColumn}>
              <h2 className={styles.orderTitle}>Ваш заказ</h2>

              <div className={styles.photosRow}>
                {cartStore.itemsList.map((item) => (
                  <div key={item.id} className={styles.photoCard}>
                    {item.imageLayers?.length ? (
                      item.imageLayers.map((layer, index) => (
                        <div key={`${item.id}-checkout-layer-${index}`} className={styles.photoLayer}>
                          <Image
                            src={layer}
                            alt={`${item.title}-layer-${index}`}
                            fill
                            className={styles.photoImage}
                            sizes="120px"
                          />
                        </div>
                      ))
                    ) : item.image ? (
                      <div className={styles.photoLayer}>
                        <Image src={item.image} alt={item.title} fill className={styles.photoImage} sizes="120px" />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span>{itemsLabel(cartStore.itemsList.length)}</span>
                  <span className={styles.summaryDots} aria-hidden />
                  <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Скидка по промокоду</span>
                  <span className={styles.summaryDots} aria-hidden />
                  <span>{cartStore.promoDiscount.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Доставка</span>
                  <span className={styles.summaryDots} aria-hidden />
                  <span>{deliveryPrice.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Итого:</span>
                  <span>{finalTotal.toLocaleString("ru-RU")} ₽</span>
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
                        type="text"
                        className={styles.promoInput}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Промокод"
                      />
                      <button
                        type="button"
                        className={styles.promoApplyBtn}
                        onClick={applyPromo}
                        disabled={!canApplyPromo}
                      >
                        Применить
                      </button>
                    </div>
                  )}
                </div>
                {promoError ? <p className={styles.promoError}>{promoError}</p> : null}

                <label className={styles.termsCheck}>
                  <span className={styles.deliveryRadioIcon}>
                    <Image
                      src={checkoutStore.form.agreeTerms ? "/checkboxTrue.svg" : "/checkbox.svg"}
                      alt=""
                      width={20}
                      height={21}
                    />
                  </span>
                  <input
                    type="checkbox"
                    checked={checkoutStore.form.agreeTerms}
                    onChange={(e) => checkoutStore.setField("agreeTerms", e.target.checked)}
                    className={styles.deliveryRadioInput}
                  />
                  <span className={styles.termsText}>
                    Нажимая «Оплатить заказ», я даю{" "}
                    <a href="#" className={styles.termsLink}>
                      согласие на обработку персональных данных
                    </a>
                    , а также принимаю{" "}
                    <a href="#" className={styles.termsLink}>
                      политику конфиденциальности
                    </a>{" "}
                    и{" "}
                    <a href="#" className={styles.termsLink}>
                      публичную оферту
                    </a>
                  </span>
                </label>

                <button
                  type="button"
                  className={styles.payBtn}
                  onClick={handlePayOrder}
                  disabled={payLoading}
                >
                  {payLoading ? "Отправка…" : "Оплатить заказ"}
                </button>

                <p className={styles.summaryNote}>
                  Дата отправки вашего заказа: {appConfigStore.config.step4?.readyDate?.trim() || "—"}.
                </p>
                <p className={styles.summaryNote}>
                  {appConfigStore.config.step4?.readyDateNote?.trim() ||
                    "Перед этим пришлем вам подробный видеообзор изделия."}
                </p>
              </div>
            </aside>
          </div>
        </section>
        <Footer />
      </main>
      <HeaderInfoModal />
    </div>
  );
});

export default CheckoutContent;
