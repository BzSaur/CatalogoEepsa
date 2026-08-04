FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 80

# Comando para servir la app en modo desarrollo con auto-recarga
CMD ["npm", "run", "dev"]
