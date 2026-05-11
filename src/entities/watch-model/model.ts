import { action, computed, makeObservable, observable } from 'mobx';
import {WatchModelCardColorProps, WatchModelCardProps} from "@/src/shared/types/WatchModelCardTypes";
import { watchModels as staticWatchModels } from "@/src/shared/lib/watchModel";

const STORAGE_KEY = "my-app/watch-model";

class WatchModelStore {
    currentCard: number;
    currentCardIndex: number;
    selectedColor: WatchModelCardColorProps | null;
    selectedColorKey: string | null;
    selectedSize: number | null;
    selectedModel: string | null;
    watchModels: WatchModelCardProps[] = [];

    constructor() {
        this.currentCard = 0;
        this.currentCardIndex = 0;
        this.selectedColor = null;
        this.selectedColorKey = null;
        this.selectedSize = null;
        this.selectedModel = null;
        makeObservable(this, {
            currentCard: observable,
            currentCardIndex: observable,
            selectedColor: observable,
            selectedColorKey: observable,
            selectedSize: observable,
            selectedModel: observable,
            watchModels: observable,
            isConfigurationComplete: computed,
            configurationMessage: computed,
            setCurrentCard: action,
            setSelectedColor: action,
            setSelectedSize: action,
            setWatchModels: action,
            resetSelection: action
        });
        this.setWatchModels(staticWatchModels);
        this.scheduleHydrateFromStorage();
    }

    private saveState = () => {
        if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                currentCard: this.currentCard,
                currentCardIndex: this.currentCardIndex,
                selectedColor: this.selectedColor,
                selectedColorKey: this.selectedColorKey,
                selectedSize: this.selectedSize,
                selectedModel: this.selectedModel
            })
        );
    };

    /** После первого согласованного SSR/гидрации: в dev подмешиваем localStorage (не ломаем дерево DOM). */
    private scheduleHydrateFromStorage = () => {
        queueMicrotask(() => {
            if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
            try {
                const raw = window.localStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const parsed = JSON.parse(raw) as {
                    currentCard?: number;
                    currentCardIndex?: number;
                    selectedColor?: WatchModelCardColorProps | null;
                    selectedColorKey?: string | null;
                    selectedSize?: number | null;
                    selectedModel?: string | null;
                };
                this.currentCard = Number(parsed.currentCard ?? 0);
                this.currentCardIndex = Number(parsed.currentCardIndex ?? 0);
                this.selectedColor = parsed.selectedColor ?? null;
                this.selectedColorKey = parsed.selectedColorKey ?? null;
                this.selectedSize = parsed.selectedSize ?? null;
                this.selectedModel = parsed.selectedModel ?? null;
            } catch {
                // ignore broken localStorage value
            }
        });
    };

    get isConfigurationComplete(): boolean {
        const activeModel =
            this.watchModels[this.currentCardIndex] ??
            this.watchModels.find((m) => m.id === this.currentCard);
        return (
            Boolean(activeModel) &&
            this.selectedColor !== null &&
            this.selectedSize !== null
        );
    }

    get configurationMessage(): string {
        const activeModel =
            this.watchModels[this.currentCardIndex] ??
            this.watchModels.find((m) => m.id === this.currentCard);
        if (!activeModel) {
            return 'Выберите модель часов';
        }
        if (this.selectedSize === null) {
            return 'Выберите размер';
        }
        if (this.selectedColor === null) {
            return 'Выберите цвет';
        }
        return 'Все параметры выбраны';
    }

    setCurrentCard = (currentCard: number, selectedModel: string, cardIndex?: number) => {
        // Не сбрасываем выбор, если пользователь кликает ту же карточку повторно.
        const nextCardIndex = cardIndex ?? this.watchModels.findIndex((m) => m.id === currentCard);
        const sameCard = this.currentCard === currentCard && this.currentCardIndex === nextCardIndex;
        const hasCompleteSelection = this.selectedModel === selectedModel && this.selectedSize !== null && this.selectedColor !== null;
        if (sameCard && hasCompleteSelection) {
            return;
        }
        this.currentCard = currentCard;
        this.currentCardIndex = nextCardIndex;
        this.selectedModel = selectedModel;
        const model =
            this.watchModels[this.currentCardIndex] ??
            this.watchModels.find((m) => m.id === currentCard);
        this.selectedSize = model?.sizes?.[0] ?? null;
        this.selectedColor = model?.colors?.[0] ?? null;
        this.selectedColorKey = model?.colors?.[0] ? `${this.currentCardIndex}:0` : null;
        this.saveState();
    }

    setSelectedColor = (color: WatchModelCardColorProps | null, colorKey?: string) => {
        this.selectedColor = color;
        this.selectedColorKey = color ? colorKey ?? null : null;
        this.saveState();
    }

    setSelectedSize = (size: number, currentCard: number, selectedModel: string, cardIndex?: number) => {
        this.currentCard = currentCard;
        this.currentCardIndex = cardIndex ?? this.watchModels.findIndex((m) => m.id === currentCard);
        this.selectedModel = selectedModel;
        this.selectedSize = size;
        const model =
            this.watchModels[this.currentCardIndex] ??
            this.watchModels.find((m) => m.id === currentCard);
        const hasSelectedColor = model?.colors?.some(
            (color) =>
                color.hex === this.selectedColor?.hex &&
                color.name === this.selectedColor?.name
        );
        if (!hasSelectedColor) {
            this.selectedColor = model?.colors?.[0] ?? null;
            this.selectedColorKey = model?.colors?.[0] ? `${this.currentCardIndex}:0` : null;
        }
        this.saveState();
    }

    setWatchModels = (models: WatchModelCardProps[]) => {
        this.watchModels = models;
        if (models.length === 0) return;
        const current = models.find((m) => m.id === this.currentCard);
        const sizeValid = current?.sizes?.includes(this.selectedSize ?? -1);
        const colorValid = current?.colors?.some((c) => c.hex === this.selectedColor?.hex && c.name === this.selectedColor?.name);
        if (!current || !sizeValid || !colorValid) {
            const first = models[0];
            this.currentCard = first.id;
            this.currentCardIndex = 0;
            this.selectedModel = first.model;
            this.selectedSize = first.sizes?.[0] ?? null;
            this.selectedColor = first.colors?.[0] ?? null;
            this.selectedColorKey = first.colors?.[0] ? "0:0" : null;
        }
        this.saveState();
    }

    resetSelection = () => {
        this.currentCard = 0;
        this.currentCardIndex = 0;
        this.selectedColor = null;
        this.selectedColorKey = null;
        this.selectedSize = null;
        this.selectedModel = null;
        this.saveState();
    };
}

export default new WatchModelStore();