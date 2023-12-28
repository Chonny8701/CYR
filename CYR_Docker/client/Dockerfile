# Usa una imagen base de Node.js
FROM node

# Establece el directorio de trabajo
WORKDIR /app

# # Copia los archivos necesarios al contenedor
COPY . .

# Instala todas las dependencias (incluyendo Vite de forma global)
RUN npm install
RUN npm install -g vite

# Expone el puerto en el que se ejecutará la aplicación (si es necesario)
EXPOSE 5173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
