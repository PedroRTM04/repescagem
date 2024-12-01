# Usar a imagem oficial do Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY ./frontend/package*.json ./

# Instalar as dependências
RUN npm install

# Copiar os arquivos do frontend para dentro do contêiner
COPY ./frontend/ .

# Expor a porta 3000
EXPOSE 3000

# Rodar o servidor Node.js (ajuste o comando conforme necessário)
CMD ["npm", "start"]
