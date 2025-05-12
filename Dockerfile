# Establecer la imagen base
FROM node:20-alpine3.20

# Crear el directorio de trabajo
WORKDIR /gdh-api

# Copiar los archivos de la aplicación
COPY package*.json ./
COPY . .

# Instalar las dependencias de producción
RUN npm install --only=production

# Exponer el puerto 8080
EXPOSE 8080

ENV PORT=8080

# Iniciar la aplicación
CMD ["npm", "start"]
