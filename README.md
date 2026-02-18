# Apple Watch Configurator

Профессиональное веб-приложение для конфигурации ремешков и чехлов Apple Watch, построенное по методологии Feature-Sliced Design.

## 🚀 Технологии

- **Next.js 16** - React фреймворк с Turbopack
- **TypeScript** - Статическая типизация
- **Tailwind CSS 4** - Утилитарные стили
- **MobX** - Управление состоянием
- **React Bootstrap** - UI компоненты
- **Feature-Sliced Design** - Архитектура проекта

## 📁 Структура проекта (FSD)

```
my-app/
├── src/                          # FSD архитектура
│   ├── shared/                  # Переиспользуемый код
│   │   ├── ui/                 # UI компоненты
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── ColorButton/
│   │   ├── config/             # Константы (colors)
│   │   ├── lib/                # Утилиты и функции
│   │   └── types/              # TypeScript типы
│   │
│   ├── entities/                # Бизнес-сущности
│   │   ├── watch-model/        # Store модели часов
│   │   ├── progress-bar/       # Store прогресс-бара
│   │   ├── header/             # Store хедера
│   │   └── cart/               # Store корзины
│   │
│   ├── features/                # Функциональные возможности
│   │   ├── watch-model-selection/
│   │   ├── frame-colors-selection/
│   │   ├── title-section/
│   │   └── header-info-modal/
│   │
│   └── widgets/                 # Композитные блоки
│       ├── header/
│       ├── footer/
│       └── progress-bar/
│
├── app/                         # Next.js App Router (только роутинг)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
└── public/                      # Статические файлы
```

## 🛠 Команды

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev

# Production сборка
npm run build

# Запуск production сборки
npm start

# Линтинг
npm run lint
```

## 🎯 Импорты (Path Aliases)

```typescript
// Shared UI компоненты
import { Button, Card, ColorButton } from '@/src/shared/ui';

// Entities (stores)
import { watchModelStore } from '@/src/entities/watch-model';
import { progressBarStore } from '@/src/entities/progress-bar';
import { headerStore } from '@/src/entities/header';
import { cartStore } from '@/src/entities/cart';

// Features
import { WatchModelSelection } from '@/src/features/watch-model-selection';
import { FrameColors } from '@/src/features/frame-colors-selection';
import { TitleStepsSection } from '@/src/features/title-section';
import { HeaderInfoModal } from '@/src/features/header-info-modal';

// Widgets
import { Header } from '@/src/widgets/header';
import { Footer } from '@/src/widgets/footer';
import { ProgressBar } from '@/src/widgets/progress-bar';
```

## 🎨 Shared UI Components

### Button
```tsx
<Button variant="primary" size="md">Далее</Button>
<Button variant="secondary" size="lg">Назад</Button>
<Button variant="outline" size="sm">Отмена</Button>
```

### Card
```tsx
<Card isActive={true} onClick={handleClick}>
  {children}
</Card>
```

### ColorButton
```tsx
<ColorButton 
  color="#5078DF" 
  isActive={true}
  size="md"
  onClick={handleClick}
/>
```

## 📊 Production Build

```
Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```

**Оптимизации:**
- ✅ Static Generation
- ✅ TypeScript проверка
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Image optimization
- ✅ Turbopack для мгновенных HMR

## 🏗 Принципы FSD

1. **shared** → **entities** → **features** → **widgets** → **pages**
2. Слои могут импортировать только из нижележащих слоёв
3. Features независимы друг от друга
4. Всё переиспользуемое выносится в shared
5. Каждый модуль имеет публичный API через index.ts

## 📝 Документация

- [FSD Architecture](./FSD_ARCHITECTURE.md) - Подробное описание архитектуры

## 🚀 Deploy

```bash
npm run build
npm start
```

---

**© 2026 ИП Ларионов Вячеслав Владимирович**

Made with ❤️ using Next.js & TypeScript

## 🔗 URL Navigation

Приложение поддерживает навигацию по шагам через URL:

### Формат URL
```
/?step=1  # Шаг 1: Серия часов
/?step=2  # Шаг 2: Модель ремешка
/?step=3  # Шаг 3: Уникальный дизайн
/?step=4  # Шаг 4: Персонализация
```

### Возможности
- ✅ **Кнопка "Назад" браузера** - возврат на предыдущий шаг
- ✅ **Кнопка "Вперед" браузера** - переход на следующий шаг
- ✅ **Прямые ссылки** - можно открыть любой шаг напрямую
- ✅ **История навигации** - все переходы сохраняются в истории браузера

### Как это работает
1. При изменении шага URL автоматически обновляется
2. При клике "Назад" в браузере происходит переход на предыдущий шаг
3. URL синхронизирован с состоянием приложения
4. Поддержка Suspense для оптимизации загрузки
