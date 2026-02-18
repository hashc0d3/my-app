# Feature-Sliced Design Architecture

## Структура проекта

Проект реорганизован согласно методологии Feature-Sliced Design (FSD).

### Основные слои

```
src/
├── shared/          # Переиспользуемый код
│   ├── ui/         # UI компоненты
│   │   ├── Button/
│   │   ├── Card/
│   │   └── ColorButton/
│   ├── config/     # Константы и конфигурация
│   │   └── colors.ts
│   ├── lib/        # Вспомогательные функции
│   └── types/      # Общие типы
│
├── entities/        # Бизнес-сущности
│   ├── watch-model/ # Модель часов
│   │   ├── model.ts
│   │   └── index.ts
│   ├── progress-bar/
│   ├── header/
│   └── cart/
│
├── features/        # Функциональные возможности
│   ├── watch-model-selection/
│   │   ├── ui/
│   │   │   └── WatchModelSelection.tsx
│   │   └── index.ts
│   └── frame-colors-selection/
│       ├── ui/
│       │   └── FrameColors.tsx
│       └── index.ts
│
└── widgets/         # Композитные блоки
    ├── header/
    ├── footer/
    └── progress-bar/
```

## Правила импорта

### Path Aliases (tsconfig.json)
```json
{
  "@/src/*": ["./src/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/entities/*": ["./src/entities/*"],
  "@/features/*": ["./src/features/*"],
  "@/widgets/*": ["./src/widgets/*"]
}
```

### Примеры импортов

```typescript
// Импорт UI компонентов
import { Button, Card, ColorButton } from '@/src/shared/ui';

// Импорт сущностей
import { watchModelStore } from '@/src/entities/watch-model';
import { progressBarStore } from '@/src/entities/progress-bar';

// Импорт констант
import { colors } from '@/src/shared/config/colors';

// Импорт features
import { WatchModelSelection } from '@/features/watch-model-selection';
import { FrameColors } from '@/features/frame-colors-selection';
```

## Оптимизация

### Shared UI Components

#### Button
Универсальный компонент кнопки с вариантами:
- `primary` - основная кнопка (синий фон)
- `secondary` - вторичная кнопка (серый фон)
- `outline` - кнопка с обводкой

Размеры: `sm`, `md`, `lg`

```tsx
import { Button } from '@/src/shared/ui';

<Button variant="primary" size="md">
  Далее
</Button>
```

#### Card
Компонент карточки с поддержкой активного состояния:

```tsx
import { Card } from '@/src/shared/ui';

<Card isActive={true} onClick={handleClick}>
  {children}
</Card>
```

#### ColorButton
Кнопка выбора цвета:

```tsx
import { ColorButton } from '@/src/shared/ui';

<ColorButton
  color="#5078DF"
  isActive={true}
  size="md"
  onClick={handleClick}
/>
```

### Константы цветов

Все цвета проекта вынесены в `src/shared/config/colors.ts`:

```typescript
export const colors = {
  primary: '#5078DF',
  background: {
    default: '#ffffff',
    gray: '#f5f5f5',
    lightBlue: '#D4E0FF',
  },
  border: {
    default: '#b3b3b3',
    primary: '#5078DF',
    transparent: 'transparent',
  },
  button: {
    background: '#e9e9e9',
  }
};
```

## Преимущества новой структуры

1. **Изоляция**: Каждый слой имеет четкую ответственность
2. **Переиспользование**: Shared компоненты используются везде
3. **Масштабируемость**: Легко добавлять новые features
4. **Поддержка**: Понятная структура для команды
5. **Типизация**: Централизованные типы в shared/types
6. **DRY**: Нет дублирования кода

## Migration Guide

### Старая структура → Новая структура

```
app/store/WatchModelStore.ts → src/entities/watch-model/model.ts
app/components/Steps/WatchModelSelection.tsx → src/features/watch-model-selection/ui/
app/types/*.ts → src/shared/types/
app/lib/*.ts → src/shared/lib/
```

### Обновление импортов

Замените:
```typescript
// Старое
import watchModelStore from "@/app/store/WatchModelStore";

// Новое
import { watchModelStore } from "@/src/entities/watch-model";
```

## Best Practices

1. **Используйте index.ts** для публичного API модулей
2. **Импортируйте из слоев сверху вниз**: shared ← entities ← features ← widgets
3. **Не импортируйте между features**: features независимы друг от друга
4. **Выносите в shared**: если код используется в 2+ местах
5. **Типизируйте все**: используйте TypeScript полностью

## Следующие шаги

- [ ] Переместить все компоненты из app/components в соответствующие FSD слои
- [ ] Создать widgets для Header, Footer, ProgressBar
- [ ] Вынести повторяющуюся логику в shared/lib
- [ ] Документировать каждый feature
- [ ] Настроить ESLint rules для FSD
