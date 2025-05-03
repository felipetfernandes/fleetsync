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

# Copiar o restante do código, incluindo o start.sh
COPY . .

# Dá permissão de execução ao script
RUN chmod +x ./start.sh

# Expor a porta da aplicação
EXPOSE 3001

# Comando para iniciar
CMD ["./start.sh"]
