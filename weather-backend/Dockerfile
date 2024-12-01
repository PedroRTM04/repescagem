# Usar a imagem oficial do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./

# Instalar as dependências do Node.js
RUN npm install

# Copiar o restante dos arquivos do backend
COPY . .

# Expor a porta que o backend irá rodar
EXPOSE 3001

# Comando para rodar o servidor do backend
CMD ["node", "index.js"]
