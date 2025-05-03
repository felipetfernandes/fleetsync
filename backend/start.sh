#!/bin/sh

echo "Gerando Prisma Client..."
npx prisma generate

echo "Iniciando servidor..."
npm run start:dev
