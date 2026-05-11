#!/usr/bin/env bash
# Бэкап Postgres + uploads тома. Запускать из /opt/my-app.
# Хранит 14 последних дней.

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/my-app}"
STACK_DIR="${STACK_DIR:-/opt/my-app}"
COMPOSE="docker compose -f ${STACK_DIR}/docker-compose.prod.yml --env-file ${STACK_DIR}/.env.production"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DATE="$(date +%F-%H%M)"

mkdir -p "${BACKUP_DIR}"

echo "[backup] dump postgres → ${BACKUP_DIR}/db-${DATE}.sql.gz"
${COMPOSE} exec -T db pg_dump -U postgres postgres | gzip > "${BACKUP_DIR}/db-${DATE}.sql.gz"

echo "[backup] tar uploads → ${BACKUP_DIR}/uploads-${DATE}.tar.gz"
# Том uploads_prod монтируется в api по пути /data/uploads.
${COMPOSE} exec -T api tar -C /data -czf - uploads > "${BACKUP_DIR}/uploads-${DATE}.tar.gz"

echo "[backup] prune older than ${RETENTION_DAYS} days"
find "${BACKUP_DIR}" -type f -name 'db-*.sql.gz'      -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -type f -name 'uploads-*.tar.gz' -mtime +${RETENTION_DAYS} -delete

echo "[backup] done."
