#!/bin/sh
set -e

npm run prisma:migrate
node dist/main.js
