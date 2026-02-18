# 🔗 URL Navigation - Инструкция

## ✅ Что реализовано

### 1. URL параметры для шагов
```
http://localhost:3000/?step=1  # Шаг 1
http://localhost:3000/?step=2  # Шаг 2
http://localhost:3000/?step=3  # Шаг 3
http://localhost:3000/?step=4  # Шаг 4
```

### 2. Браузерная навигация
- ✅ **Кнопка "Назад"** - возврат на предыдущий шаг
- ✅ **Кнопка "Вперед"** - переход на следующий шаг
- ✅ **История** - все переходы сохраняются

### 3. Синхронизация
- ✅ URL ⟷ Store - двусторонняя синхронизация
- ✅ Автоматическое обновление URL при смене шага
- ✅ Автоматическая смена шага при изменении URL

## 🛠 Техническая реализация

### Файлы
```
app/
├── page.tsx          # Suspense wrapper
└── HomeContent.tsx   # Основной компонент с логикой

src/entities/progress-bar/
└── model.ts          # Store с методом setCurrentStep
```

### Ключевые моменты

#### 1. Suspense для useSearchParams
```tsx
<Suspense fallback={<div>Loading...</div>}>
    <HomeContent />
</Suspense>
```

#### 2. Синхронизация при монтировании
```tsx
useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl) {
        progressBarStore.setCurrentStep(parseInt(stepFromUrl, 10));
    }
}, []);
```

#### 3. Обновление URL при смене шага
```tsx
useEffect(() => {
    router.push(`/?step=${currentStep}`, { scroll: false });
}, [currentStep]);
```

#### 4. Обработка кнопки "Назад"
```tsx
useEffect(() => {
    const handlePopState = () => {
        const params = new URLSearchParams(window.location.search);
        const step = params.get('step');
        progressBarStore.setCurrentStep(parseInt(step, 10));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

## 🧪 Тестирование

### Проверка работы:
1. ✅ Открыть http://localhost:3000
2. ✅ В URL должно появиться `?step=1`
3. ✅ Нажать "Далее" → URL меняется на `?step=2`
4. ✅ Нажать "Назад" в браузере → возврат на `?step=1`
5. ✅ Открыть напрямую `?step=3` → открывается 3 шаг

### Проверка истории:
1. Пройти шаги 1 → 2 → 3 → 4
2. Нажать "Назад" 3 раза
3. Должны вернуться на шаг 1
4. Нажать "Вперед" 3 раза
5. Должны вернуться на шаг 4

## 📊 Результат

```bash
npm run build
```

```
✓ Compiled successfully
✓ Running TypeScript
✓ Generating static pages (4/4)

Route (app)
┌ ○ /
└ ○ /_not-found
```

---

**✅ URL навигация полностью работает!**
**✅ Поддержка кнопки "Назад" браузера!**
**✅ История навигации сохраняется!**
