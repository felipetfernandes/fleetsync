# Stage 1: Base image with common dependencies
FROM node:18-slim AS base
WORKDIR /app

# Instala OpenSSL e outras dependências essenciais
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copia arquivos de dependências
COPY package.json package-lock.json* ./

# Stage 2: Development stage
FROM base AS development
ENV NODE_ENV=development

# Instala todas as dependências (incluindo devDependencies)
RUN npm install

# Copia o restante do código
COPY . .

EXPOSE 3001

# Comando padrão para desenvolvimento (pode ser sobrescrito no docker-compose)
# CMD ["npm", "run", "start:dev"]

# Stage 3: Builder stage for production
FROM base AS builder
ENV NODE_ENV=production

# Instala todas as dependências para gerar o build
RUN npm install

# Copia o restante do código
COPY . .

# Gera o build da aplicação Prisma (se necessário)
RUN npx prisma generate

# Gera o build da aplicação NestJS
RUN npm run build

# Remove devDependencies após o build
RUN npm prune --production

# Stage 4: Production stage
FROM node:18-slim AS production
WORKDIR /app
ENV NODE_ENV=production

# Copia dependências de produção do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia package.json e lockfile
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*

# Copia a build da aplicação do builder
COPY --from=builder /app/dist ./dist

# Copia o schema do Prisma (necessário em runtime se não usar migrations empacotadas)
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/src/main"] 
# Ou CMD ["./start.sh"] se o script for complexo

