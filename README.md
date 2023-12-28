# Proyecto de Gestión de Citas

Este proyecto consiste en una aplicación web desarrollada con Vite y React para clientes, diseñada para facilitar la gestión de reservas de citas en diversos negocios. Los usuarios tienen la capacidad de realizar tanto el registro como el inicio de sesión, permitiéndoles configurar y gestionar sus propios negocios, así como manejar las reservas correspondientes.

## Ejecución del proyecto:

  Existen dos vias para lanzar el proyecto, la primera es a través de Docker y la segunda es usando Node.js y Python

  - **Lanzar aplicación utilizando Docker**
    -Tenga en cuenta que para lanzar el proyecto deberá tener instalado Docker en su ordenador
    -Acceda a la carpeta CYR_Docker y sigua las instrucciones descritas en el fichero README.md

  - **Lanzar aplicación utilizando Node.js y Python**
    -Tenga en cuenta que para lanzar el proyecto deberá tener instalado Node.js para la ejecución de la aplicacion cliente y Python para la ejecución de la aplicación servidor
    -Acceda a la carpeta CYR. Para lanzar los proyectos cliente / servidor / database siga las instrucciones de los ficheros README.md dentro de las respectivas carpetas

## Funcionalidades Principales:

- **Registro y Login de Usuarios:**
  - Posibilidad para que los usuarios creen cuentas y accedan a la plataforma de gestión de citas.

- **Configuración de Negocios:**
  - Herramientas que permiten a los propietarios de negocios registrar y gestionar la información relevante de su empresa.

- **Gestión de Reservas:**
  - Los usuarios pueden buscar negocios disponibles y realizar reservas en horarios convenientes.

- **Generación Automática de Citas:**
  - El servidor, basado en Flask y Python, ejecuta una tarea diaria a las 12:00 para crear nuevas citas para todos los negocios en la base de datos. Las reservas solo pueden realizarse hasta 30 días posteriores a la fecha actual.

**Tecnologías Utilizadas:**

- Cliente: Vite, React
- Servidor: Flask, Python
- Base de Datos: MySQL

**Notas Adicionales:**

- Asegúrate de revisar regularmente las actualizaciones y mejoras del proyecto.

**Contribuciones:**

- ¡Las contribuciones y sugerencias son bienvenidas! Siéntete libre de enviar solicitudes de extracción.
