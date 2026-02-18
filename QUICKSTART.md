# 🚀 Quick Start

## Установка и запуск

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск dev сервера
npm run dev

# 3. Открыть в браузере
# http://localhost:3000
```

## Production сборка

```bash
# Сборка
npm run build

# Запуск production
npm start
```

## 📁 Где что находится

### Добавить новую фичу
```
src/features/my-feature/
├── ui/
│   └── MyFeature.tsx
└── index.ts
```

### Добавить новый виджет
```
src/widgets/my-widget/
├── ui/
│   └── MyWidget.tsx
└── index.ts
```

### Добавить UI компонент
```
src/shared/ui/MyComponent/
├── MyComponent.tsx
└── index.ts
```

### Добавить store
```
src/entities/my-entity/
├── model.ts
└── index.ts
```

## 📝 Импорты

```typescript
// UI компоненты
import { Button } from '@/src/shared/ui';

// Stores
import { watchModelStore } from '@/src/entities/watch-model';

// Features
import { WatchModelSelection } from '@/src/features/watch-model-selection';

// Widgets
import { Header } from '@/src/widgets/header';
```

## 🎯 Основные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Production сборка |
| `npm start` | Запуск production |
| `npm run lint` | Линтинг кода |

## 📚 Документация

- [README.md](./README.md) - Описание проекта
- [FSD_ARCHITECTURE.md](./FSD_ARCHITECTURE.md) - Архитектура
- [FINAL_STRUCTURE.md](./FINAL_STRUCTURE.md) - Структура проекта

## ✅ Проверка работы

После установки проверьте:
1. ✅ `npm run build` - сборка без ошибок
2. ✅ `npm run dev` - dev сервер запускается
3. ✅ Открывается http://localhost:3000

---

**Готово к работе! 🎉**
