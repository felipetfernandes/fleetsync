#!/bin/sh

set -e

echo "⏳ Waiting for database..."

until npx prisma db execute \
  --schema ./prisma/schema.prisma \
  --stdin <<EOF
SELECT 1;
EOF
do
  sleep 2
done

echo "✅ Database is ready"

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🗄 Running migrations..."
npx prisma migrate deploy

echo "🌱 Running seed..."
npm run seed

echo "🚀 Starting NestJS..."
exec npm run start:dev