# Usa la imagen base de MySQL
FROM mysql:8.0.34

# Declarar variables de entorno
ENV MYSQL_ROOT_PASSWORD: 'password_1'
ENV MYSQL_DATABASE: 'db_pide_tu_cita'
ENV MYSQL_USER: 'user_1'
ENV MYSQL_PASSWORD: 'password_1'

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /docker-entrypoint-initdb.d

# Copia el archivo CYR_DB.sql al directorio de inicialización de la base de datos
COPY cyr_db.sql .