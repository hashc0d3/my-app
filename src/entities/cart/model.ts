import { action, computed, makeObservable, observable } from "mobx";
import type { CartItemConfiguration } from "@/src/shared/types/CartItemConfiguration";

export type CartItem = {
  id: string;
  title: string;
  image: string;
  imageLayers?: string[];
  unitPrice: number;
  quantity: number;
  parameters: string[];
  configuration?: CartItemConfiguration;
};

class CartStore {
  itemsList: CartItem[];
  promoCode: string;
  promoDiscount: number;
  private readonly storageKey = "my-app/cart";
  hydrated: boolean;

  constructor() {
    this.itemsList = [];
    this.promoCode = "";
    this.promoDiscount = 0;
    this.hydrated = false;
    makeObservable(this, {
      itemsList: observable,
      promoCode: observable,
      promoDiscount: observable,
      hydrated: observable,
      items: computed,
      subtotal: computed,
      discountedSubtotal: computed,
      hydrateState: action,
      addConfiguredItem: action,
      increaseItem: action,
      decreaseItem: action,
      removeItem: action,
      updateItem: action,
      setPromo: action,
      clearPromo: action
    });
  }

  private saveState = () => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    window.localStorage.setItem(
      this.storageKey,
      JSON.stringify({
        itemsList: this.itemsList,
        promoCode: this.promoCode,
        promoDiscount: this.promoDiscount
      })
    );
  };

  hydrateState = () => {
    if (this.hydrated) return;
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "production") {
      this.hydrated = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as
        | CartItem[]
        | {
            itemsList?: CartItem[];
            promoCode?: string;
            promoDiscount?: number;
          };
      if (Array.isArray(parsed)) {
        this.itemsList = parsed;
      } else {
        this.itemsList = Array.isArray(parsed.itemsList) ? parsed.itemsList : [];
        this.promoCode = String(parsed.promoCode ?? "");
        this.promoDiscount = Math.max(0, Number(parsed.promoDiscount ?? 0));
      }
    } catch {
      // ignore broken localStorage value
    } finally {
      this.hydrated = true;
    }
  };

  get items(): number {
    return this.itemsList.reduce((acc, item) => acc + item.quantity, 0);
  }

  get subtotal(): number {
    return this.itemsList.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }

  get discountedSubtotal(): number {
    return Math.max(0, this.subtotal - this.promoDiscount);
  }

  addConfiguredItem = (item: Omit<CartItem, "id" | "quantity">) => {
    this.itemsList.push({
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      quantity: 1
    });
    this.saveState();
  };

  increaseItem = (id: string) => {
    const target = this.itemsList.find((item) => item.id === id);
    if (!target) return;
    target.quantity += 1;
    this.saveState();
  };

  decreaseItem = (id: string) => {
    const target = this.itemsList.find((item) => item.id === id);
    if (!target) return;
    if (target.quantity > 1) {
      target.quantity -= 1;
      this.saveState();
      return;
    }
    this.itemsList = this.itemsList.filter((item) => item.id !== id);
    this.saveState();
  };

  removeItem = (id: string) => {
    this.itemsList = this.itemsList.filter((item) => item.id !== id);
    this.saveState();
  };

  updateItem = (id: string, payload: Partial<Omit<CartItem, "id" | "quantity">>) => {
    const item = this.itemsList.find((entry) => entry.id === id);
    if (!item) return;
    Object.assign(item, payload);
    this.saveState();
  };

  setPromo = (code: string, discount: number) => {
    this.promoCode = code.trim();
    this.promoDiscount = Math.max(0, Math.round(discount));
    this.saveState();
  };

  clearPromo = () => {
    this.promoCode = "";
    this.promoDiscount = 0;
    this.saveState();
  };
}

export default new CartStore();