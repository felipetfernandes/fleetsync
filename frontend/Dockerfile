# Stage 1: Base image
FROM node:18-alpine AS base
WORKDIR /app

# Copia arquivos de dependências
COPY package.json package-lock.json* ./

# Stage 2: Development stage
FROM base AS development
ENV NODE_ENV=development

# Instala todas as dependências (incluindo devDependencies)
RUN npm install

# Copia o restante do código
COPY . .

EXPOSE 3000

# Comando padrão para desenvolvimento (definido no docker-compose)
# CMD ["npm", "run", "dev"]

# Stage 3: Builder stage for production
FROM base AS builder
ENV NODE_ENV=production

# Instala dependências de produção e build
RUN npm install

# Copia o restante do código
COPY . .

# Define a URL da API para o build (será lida do .env.prod no compose)
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# Nota: Variáveis de build time (ARG) para variáveis de runtime (ENV) no Next.js
# podem ser complexas. É mais seguro definir NEXT_PUBLIC_ no .env.prod
# e garantir que o Next.js o leia corretamente em produção.

# Gera o build da aplicação Next.js
RUN npm run build

# Remove devDependencies se necessário (Next.js pode precisar de algumas em runtime)
# RUN npm prune --production 
# Verifique a necessidade disso para Next.js

# Stage 4: Production stage
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copia dependências de produção do builder
# O Next.js precisa do node_modules completo em produção geralmente
COPY --from=builder /app/node_modules ./node_modules

# Copia package.json e lockfile
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*

# Copia a build da aplicação (.next standalone ou normal)
COPY --from=builder /app/.next ./.next
# Copia assets públicos
COPY --from=builder /app/public ./public 

EXPOSE 3000

# Comando para iniciar a aplicação em produção
# Comando padrão do Next.js para produção
CMD ["npm", "run", "start"] 

