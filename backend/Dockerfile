FROM node:18-slim

WORKDIR /app

# Instala OpenSSL e outras dependências essenciais
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm i

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Comando para iniciar em desenvolvimento
CMD ["npm", "run", "start:dev"]
