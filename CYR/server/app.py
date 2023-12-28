# app.py
from flask import Flask
from flask_cors import CORS
from src.routes import init_routes
from src.database.db_connector import init_db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
import schedule
import time
from src.database.database_queries_reserva import (agregar_30_dias_reservas)

from datetime import datetime
import threading

app = Flask(__name__)

# Configura la aplicación y la base de datos
init_routes(app)
init_db(app)

# Configura CORS para permitir solicitudes desde cualquier origen (*)
CORS(app)

# Uso de Bcrypt en toda la aplicacion
bcrypt = Bcrypt(app)

# Configura la secret_key desde la variable de entorno
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY')

# Inicializa el JWTManager
jwt = JWTManager(app)

# Funcion programada para añadir reservas los proximos 30 dias
def agregar_tarea_programada():
  with app.app_context():
    
    # Importar el cliente de prueba de Flask
    from flask import Flask
    from flask.testing import FlaskClient

    # Crear el cliente de prueba
    client = FlaskClient(app, response_wrapper=None)

    # Simular una solicitud GET a la ruta '/all'
    response = client.get('/api/negocios/all')

    # Obtener la respuesta en formato JSON
    respuesta_json = response.get_json()
    lista_negocios = respuesta_json.get('data', [])

    print(lista_negocios)
    
    # Recorremos la lista de negocios
    for negocio in lista_negocios:
      # Obtener los parámetros necesarios
      id_negocio = negocio['id']  
      hora_inicio = datetime.strptime(negocio['hora_inicio'], "%H:%M").time()
      hora_fin = datetime.strptime(negocio['hora_fin'], "%H:%M").time()
      intervalo = datetime.strptime(negocio['intervalo'], "%H:%M").time()

      # Llamar a la función
      agregar_30_dias_reservas(id_negocio, hora_inicio, hora_fin, intervalo)

# Programa la tarea para ejecutar la solicitud una hora específica todos los días
schedule.every().day.at("12:19").do(agregar_tarea_programada)

# Función para ejecutar tareas programadas en segundo plano
def ejecutar_tareas_programadas():
    while True:
        schedule.run_pending()
        time.sleep(1)

# Iniciar todas las tareas
if __name__ == "__main__":
    # Iniciar la tarea programada en un hilo separado como hilo demonio
    tarea_programada_thread = threading.Thread(target=ejecutar_tareas_programadas, daemon=True)
    tarea_programada_thread.start()

    # Iniciar aplicación Flask
    app.run(debug=True)
