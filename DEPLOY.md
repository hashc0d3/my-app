# Развёртывание через Docker Compose

## Быстрый старт

1. Скопируйте пример переменных окружения и отредактируйте:
   ```bash
   cp .env.docker.example .env
   ```

2. Заполните в `.env` минимум:
   - `POSTGRES_PASSWORD` (надёжный пароль)
   - `ADMIN_TOKEN` (токен для админ-API)
   - Для продакшена: `PUBLIC_BASE_URL`, `WEB_ORIGIN`, `NEXT_PUBLIC_API_BASE_URL` (ваши домены)
   - При необходимости: ключи Точка Банк, RetailCRM, Telegram, Dadata, CDEK (см. `.env.docker.example`)

3. Соберите и запустите:
   ```bash
   docker compose up -d --build
   ```

4. Откройте в браузере:
   - Сайт: http://localhost:3000
   - API: http://localhost:4000

## Остановка

```bash
docker compose down
```

Данные БД и загрузки сохраняются в томах `db-data` и `uploads-data`. Чтобы удалить и их:

```bash
docker compose down -v
```

## Деплой на сервер с одним доменом

Если фронт и API отдаются с одного домена (например, через nginx):

- Сайт: `https://yourdomain.com`
- API: `https://yourdomain.com/api` (прокси на контейнер `api:4000`)

В `.env` укажите:

- `WEB_ORIGIN=https://yourdomain.com`
- `PUBLIC_BASE_URL=https://yourdomain.com`
- `NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com`

Пример конфига nginx (прокси `/api` на контейнер api):

```nginx
location /api {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Переменные окружения

Описание переменных — в `.env.docker.example`. Обязательные для работы чекаута и интеграций: см. `server/.env.example` и корневой `.env.example`.
