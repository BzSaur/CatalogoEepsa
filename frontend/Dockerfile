FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Instalar 'serve' globalmente para servir los archivos estáticos
RUN npm install -g serve

# Exponer el puerto
EXPOSE 80

# Comando para servir la app compilada
CMD ["serve", "-s", "dist", "-l", "80"]
