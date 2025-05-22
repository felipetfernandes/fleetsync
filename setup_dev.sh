#!/bin/bash

# --- Script de Setup para Ambiente de Desenvolvimento Local (Host) ---
# Este script deve ser executado no seu terminal local (fora dos contêineres)
# APÓS os contêineres terem sido iniciados com `docker-compose up -d`.
# Ele garante que seu VS Code tenha as dependências e o cliente Prisma para autocompletar e verificação de tipos.

echo "--- Iniciando Setup do Ambiente de Desenvolvimento Local ---"

# 1. Instalar dependências do Frontend (Next.js) no Host
echo "Instalando dependências do Frontend (Next.js) no host..."
if [ -d "frontend" ]; then # Verifica se a pasta frontend existe
  cd frontend
  npm install
  if [ $? -eq 0 ]; then
    echo "Dependências do Frontend instaladas com sucesso."
  else
    echo "ERRO: Falha ao instalar dependências do Frontend."
    exit 1
  fi
  cd .. # Volta para a raiz do projeto
else
  echo "AVISO: Pasta 'frontend' não encontrada. Pulando instalação de dependências do Frontend."
fi

echo ""

# 2. Instalar dependências do Backend (NestJS/Prisma) no Host
echo "Instalando dependências do Backend (NestJS/Prisma) no host..."
if [ -d "backend" ]; then # Verifica se a pasta backend existe
  cd backend
  npm install
  if [ $? -eq 0 ]; then
    echo "Dependências do Backend instaladas com sucesso."
  else
    echo "ERRO: Falha ao instalar dependências do Backend."
    exit 1
  fi

  # 3. Gerar o Cliente Prisma no Host (para o VS Code e TypeScript)
  echo "Gerando Prisma Client no host (para VS Code/TypeScript)..."
  npx prisma generate
  if [ $? -eq 0 ]; then
    echo "Prisma Client gerado com sucesso no host."
  else
    echo "ERRO: Falha ao gerar Prisma Client no host. Verifique a conexão com o banco de dados e o schema.prisma."
    # Não vamos parar o script aqui, pois o Prisma pode depender de um DB rodando
    # e pode ser gerado depois ou depurado.
  fi

  cd .. # Volta para a raiz do projeto
else
  echo "AVISO: Pasta 'backend' não encontrada. Pulando instalação de dependências e geração do Prisma Client do Backend."
fi

echo ""
echo "--- Setup do Ambiente de Desenvolvimento Local Concluído ---"
echo "Recomendação: Se o VS Code não refletir as mudanças, feche e reabra-o."