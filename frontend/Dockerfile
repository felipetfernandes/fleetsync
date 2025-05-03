FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm i

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar em desenvolvimento
CMD ["npm", "run", "dev"]
