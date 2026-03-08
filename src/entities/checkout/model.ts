import { action, makeObservable, observable } from "mobx";

export type CheckoutFormState = {
  fullName: string;
  phone: string;
  email: string;
  contactMethod: "telegram" | "whatsapp" | "phone" | "email";
  contactHandle: string;
  deliveryMethod:
    | "cdek_pickup"
    | "cdek_courier"
    | "post_omni"
    | "post_ru"
    | "spb_courier"
    | "pickup_spb";
  deliveryPoint: string;
  city: string;
  address: string;
  apartment: string;
  recipientName: string;
  recipientPhone: string;
  comment: string;
  agreePolicy: boolean;
  agreeTerms: boolean;
};

const initialState: CheckoutFormState = {
  fullName: "",
  phone: "",
  email: "",
  contactMethod: "telegram",
  contactHandle: "",
  deliveryMethod: "cdek_pickup",
  deliveryPoint: "",
  city: "",
  address: "",
  apartment: "",
  recipientName: "",
  recipientPhone: "",
  comment: "",
  agreePolicy: false,
  agreeTerms: false
};

const STORAGE_KEY = "my-app/checkout";

const validDeliveryMethods: CheckoutFormState["deliveryMethod"][] = [
  "cdek_pickup",
  "cdek_courier",
  "post_omni",
  "post_ru",
  "spb_courier",
  "pickup_spb"
];
const validContactMethods: CheckoutFormState["contactMethod"][] = [
  "telegram",
  "whatsapp",
  "phone",
  "email"
];

class CheckoutStore {
  @observable form: CheckoutFormState;
  @observable hydrated: boolean;
  private _hydrated = false;

  constructor() {
    makeObservable(this);
    this.form = { ...initialState };
    this.hydrated = false;
  }

  private saveState = () => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.form));
    } catch {
      // ignore
    }
  };

  @action hydrateState = () => {
    if (this._hydrated) return;
    if (typeof window === "undefined") return;
    this._hydrated = true;
    if (process.env.NODE_ENV === "production") {
      this.hydrated = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.hydrated = true;
        return;
      }
      const parsed = JSON.parse(raw) as Partial<CheckoutFormState>;
      if (!parsed || typeof parsed !== "object") {
        this.hydrated = true;
        return;
      }
      const next = { ...initialState };
      if (typeof parsed.deliveryMethod === "string" && validDeliveryMethods.includes(parsed.deliveryMethod)) {
        next.deliveryMethod = parsed.deliveryMethod;
      }
      if (typeof parsed.contactMethod === "string" && validContactMethods.includes(parsed.contactMethod)) {
        next.contactMethod = parsed.contactMethod;
      }
      const str = (v: unknown) => (typeof v === "string" ? v : "");
      next.fullName = str(parsed.fullName);
      next.phone = str(parsed.phone);
      next.email = str(parsed.email);
      next.contactHandle = str(parsed.contactHandle);
      next.deliveryPoint = str(parsed.deliveryPoint);
      next.city = str(parsed.city);
      next.address = str(parsed.address);
      next.apartment = str(parsed.apartment);
      next.recipientName = str(parsed.recipientName);
      next.recipientPhone = str(parsed.recipientPhone);
      next.comment = str(parsed.comment);
      next.agreePolicy = Boolean(parsed.agreePolicy);
      next.agreeTerms = Boolean(parsed.agreeTerms);
      this.form = next;
    } catch {
      // ignore broken localStorage
    } finally {
      this.hydrated = true;
    }
  };

  @action setField = <K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) => {
    this.form[key] = value;
    this.saveState();
  };
}

export default new CheckoutStore();
