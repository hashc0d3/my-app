# Feature-Sliced Design (FSD)

Структура `src/` организована по [FSD](https://feature-sliced.design/): слайсы, разделение логики и верстки, переиспользуемые компоненты по SOLID.

## Слои (снизу вверх)

| Слой | Путь | Назначение |
|------|------|------------|
| **shared** | `shared/` | Переиспользуемое без привязки к фичам: UI, типы, конфиг, утилиты |
| **entities** | `entities/` | Бизнес-сущности и сторы (MobX): cart, checkout, header, progress-bar, strap-*, watch-model |
| **features** | `features/` | Фичи пользователя: выбор модели/цвета/ремешка, превью, модалки |
| **widgets** | `widgets/` | Сборные блоки страницы: Header, Footer, ProgressBar, StrapConfigurator, CheckoutStep |

## Правила

- **Импорты**: только вниз по слоям (widgets → features → entities → shared). Не импортировать из `app/` в shared/entities.
- **Виджеты и фичи**: логика в `hooks/`, верстка в `ui/`, стили рядом с компонентом (`*.module.css`).
- **Shared UI**: один компонент — одна ответственность; пропсы описаны в интерфейсах и в JSDoc.
- **Адаптив**: медиа-запросы в CSS-модулях виджетов/фич; при необходимости общая сетка/брейкпоинты в `shared/config` или `shared/lib`.

## Структура слайса (виджет/фича)

```
widgets/header/
├── hooks/           # Логика (useHeader: корзина, бургер, скролл)
│   ├── useHeader.ts
│   └── index.ts
├── ui/              # Верстка
│   ├── Header.tsx
│   └── Header.module.css
└── index.ts         # Публичный API: export { Header }
```

## Публичный API

- **shared**: `@/src/shared/ui`, `@/src/shared/lib`, `@/src/shared/types`, `@/src/shared/config`
- **entities**: каждый слайс экспортирует стор и типы из `model.ts` и `index.ts`
- **features**: экспорт UI-компонента из `index.ts`
- **widgets**: экспорт виджета из `index.ts` (хуки остаются внутренними)

## Комментарии в коде

- Слайсы и компоненты: краткий JSDoc в начале файла.
- Хуки: описание, что делают и от чего зависят.
- Сложная логика: поясняющие комментарии рядом с кодом.
