FROM node:20-alpine as builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar la aplicación para producción
COPY . .
RUN npm run build

# --- Etapa de Producción (Nginx) ---
FROM nginx:alpine

# Copiar la aplicación compilada
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
