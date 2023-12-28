# Pasos para Configurar y Ejecutar el Servidor con Python Flask

## 1. Navegar a la Ruta Raíz del Proyecto Server
Asegúrate de estar en la ruta ./CYR/server antes de realizar cualquier acción.

## 2. Configurar la Ejecución de Scripts
En la terminal de comandos ejecuta el siguiente comando para asegurarte de que la ejecución de scripts esté permitida:

```bash
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 3. Configuración del Entorno Virtual y Librerías
### 3.1. Ejecutar script el cual realiza todos los pasos automáticamente

```bash
.\setup.ps1
```
### 3.2 En vez de ejecutar el script puede ejecutar los pasos manualmente
Puede realizar la misma operación de forma manual ejecutando los siguientes comandos. Primero crear un entorno virtual, luego activarlo y por último instalar las librerias

```bash
py -3 -m venv .venv_citas_desarrollo
.venv_citas_desarrollo\Scripts\activate
pip install -r requirements.txt
```

## 4. Crear el Archivo de Variables de Entorno
Crea un archivo llamado .env para almacenar las variables de entorno:

Fichero .env
### Variables Base de datos
DB_HOST =  
DB_PORT =  
DB_USER =  
DB_PASSWORD =  
DB_DATABASE = 

### JWT
SECRET_KEY = 

## 5. Ejecutar el Proyecto del Servidor
Finalmente, ejecuta el siguiente comando para iniciar el servidor Flask:

```bash
flask --app app --debug run
```
