# Pasos para Configurar y Ejecutar el Proyecto con Docker

## 1. Navegar a la Ruta Raíz del Proyecto CYR_DOCKER
Asegúrate de estar en la ruta raíz de la carpeta CYR_Docker antes de realizar cualquier acción.

## 2. Construir y lanzar servicios definidos en el fichero docker-compose.yml
En la terminal de comandos ejecuta el siguiente comando para construir y luego levantar los servicios definidos en tu archivo docker-compose.yml. Tenga paciencia que este proceso puede tomar unos minutos.

```bash
docker-compose up --build
```

## 3. Una vez se estén ejecutando todos los contenedores, podrás acceder al proyecto a través del nevegador web en la ruta http://localhost:5173/

## 4.  Detener y eliminar los servicios y contenedores definidos en tu fichero docker-compose.yml
Detener los servicios que se están ejecutando actualmente como contenedores Docker según la configuración definida en tu archivo docker-compose.yml

```bash
docker-compose down
```
