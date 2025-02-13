# Etapa 1: Instalação e compilação dos pacotes no ambiente de construção
FROM node:20.17.0 AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração e de dependências para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-fonte
RUN ls
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Etapa 2: Configuração da imagem final com o código compilado
FROM node:20.17.0

# Define o diretório de trabalho para o contêiner final
WORKDIR /app
COPY prisma ./prisma
RUN ls -R /app
# Copia os arquivos de configuração e as dependências
COPY package*.json ./
RUN npm install --omit=dev

# Copia o código compilado da etapa de build
COPY --from=build /app/dist ./dist

RUN npx prisma generate --schema=prisma/schema.prisma
COPY src/grpc/price.proto /app/dist/grpc/
# Define a variável de ambiente para o modo de produção
ENV NODE_ENV=production

# Porta em que o servidor vai rodar (ajuste conforme necessário)
EXPOSE 3000

# Comando para rodar o servidor
CMD npx prisma migrate deploy && node dist/server.js

