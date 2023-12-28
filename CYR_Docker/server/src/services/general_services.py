from flask import jsonify
import uuid
import os
from datetime import datetime, timedelta, time
# from src.database.database_queries_reserva import agregar_30_dias_reservas
# from src.routes.consultas_tb_negocios_routes import obtener_todos_negocios
from src.database.database_queries_negocio import get_all_negocios

class MiErrorPersonalizado(Exception):
  def __init__(self, mensaje):
    super().__init__(mensaje)

def generar_id():
  unique_id = str(uuid.uuid4())  # Genera un UUID (Universally Unique Identifier) aleatorio
  return unique_id

# Funcion que recibe el codigo_usuario y una imagen y la guarda en el servidor
def guardar_imagen (codigo_usuario, nueva_imagen):

  # Obtener nombre de la imagen
  nombre_imagen = nueva_imagen.filename
  
  # Funcion que devuelve True si el fichero tiene una extension de imagen y False de lo contrario
  def es_imagen_valida(nombre_archivo):
    extensiones_permitidas = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg"}

    # Obtener la extensión del archivo
    _, extension = os.path.splitext(nombre_archivo)

    # Convierte la extensión a minúsculas (por si acaso)
    extension = extension.lower()

    # Comprueba si la extensión está en la lista de extensiones permitidas
    return extension in extensiones_permitidas
  
  # Funcion que devuelve la extension de un fichero
  def obtener_extension(nombre_archivo):
    # Obtener la extensión del archivo
    _, extension = os.path.splitext(nombre_archivo)
    # Eliminar el punto inicial (.) de la extensión
    return extension[1:]
  
  try:
    # Comprobar que el fichero es una imagen válida
    if not es_imagen_valida(nombre_imagen):
      raise MiErrorPersonalizado("Formato de la imagen no válido")
    
    # Obtener la fecha y hora actual
    ahora = datetime.now()

    # Crear una cadena de formato para la fecha y hora
    fecha_actual = "{:04d}{:02d}{:02d}{:02d}{:02d}{:02d}".format(
      ahora.year, ahora.month, ahora.day,
      ahora.hour, ahora.minute, ahora.second
    )
    
    # Nombre de la imagen con el formato (id_usuario - fecha_actual - extension imagen)
    nombre_imagen_servidor = "{}_{}.{}".format(codigo_usuario, fecha_actual, obtener_extension(nombre_imagen))
  
    # Carpeta donde se guardarán las imágenes en el servidor
    directorio_destino = 'src/uploads/images'

    # Verifica si la carpeta uploads existe, si no, créala
    if not os.path.exists(directorio_destino):
        os.makedirs(directorio_destino)

    # Ruta completa del archivo en el servidor
    ruta_completa = os.path.join(directorio_destino, nombre_imagen_servidor)
    
    # Guardar la nueva_imagen en la ruta especificada
    nueva_imagen.save(ruta_completa)
    
    return {"data": nombre_imagen_servidor}
    
  except MiErrorPersonalizado as error_personalizado:
    return  {"data": False, "error": error_personalizado}
  
  except Exception as error_generico:
    return {"data": False, "error": error_generico}
  
def eliminar_imagen(nombre_archivo):
    UPLOAD_FOLDER = 'src/uploads/images'  # Ruta donde se encuentra la imagen a eliminar
    ruta_archivo = UPLOAD_FOLDER + "/" + nombre_archivo

    print(f"Ruta de imagen a eliminar {ruta_archivo}")
    # # Reemplazar todas las barras invertidas '\' con barras diagonales '/'
    # ruta_archivo = ruta_archivo.replace("\\", "/")
    
    try:
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
            return True
        else:
            return False
    except Exception as e:
        return False
      
# def generar_fechas_con_horas(hora_inicio, hora_fin, intervalos):
  
#     # Función para comprobar que las horas tiene formato de datetime.time
#     def asegurar_formato_time(hora):
#       # Verificar si es de tipo datetime.time, si no, intentar convertirlo
#       if not isinstance(hora, time):
#           try:
#               # Intentar convertir a datetime.time
#               hora = datetime.strptime(str(hora), "%H:%M:%S").time()
#           except ValueError:
#               # Manejar el error si la conversión no es posible
#               raise ValueError(f"No se pudo convertir {hora} a formato time")

#       return hora
    
#     hora_inicio_time = asegurar_formato_time (hora_inicio)
#     hora_fin_time = asegurar_formato_time (hora_fin)
#     intervalos_time = asegurar_formato_time (intervalos)
  
#     # Obtén la fecha actual
#     fecha_time = datetime.now().date()

#     # Crea una lista para almacenar las fechas y horas
#     lista_fechas_hora_time = []

#     # Genera 30 días consecutivos
#     for _ in range(30):
#         # Para cada día, genera horas a intervalos
#         hora_reserva_time = hora_inicio_time
#         while hora_reserva_time <= hora_fin_time:
#             # Combina fecha y hora
#             fecha_hora_date_time = datetime.combine(fecha_time, hora_reserva_time)
#             lista_fechas_hora_time.append(fecha_hora_date_time.strftime('%Y-%m-%d %H:%M'))
            
#             # Crea una variable de tipo timedelta para que se pueda sumar a una DateTime
#             intervalo_td = timedelta(hours=intervalos.hour, minutes=intervalos.minute)
#             fecha_actual_fecha_hora_actualizada = fecha_con_hora + intervalo_td
            
#             # Actualiza la hora actual
#             fecha_hora_actual = fecha_actual_fecha_hora_actualizada.time()

#         fecha_actual += timedelta(days=1)

#     return fechas_con_horas
  
def generar_lista_reservas(fecha, hora_inicio, hora_fin, intervalo, cantidad_dias):
  lista_reservas = []
  # Obtener la fecha y hora de inicio y fin (combinando date y time)
  fecha_hora_inicio = datetime.combine(fecha, hora_inicio)

  # Bucle para recorrer los días
  for i in range(cantidad_dias):
    # Resetear fecha para que sea (fecha_hora_inicio + incremento) 
    fecha_hora_actual = fecha_hora_inicio + timedelta (days=i)
    
    # Bucle para recorrer las horas dentro de cada día añadiendo solo las que se encuentran entre hora_inicio y hora_fin
    while fecha_hora_actual.time() <= hora_fin and fecha_hora_actual.time() >= hora_inicio:
      # Añadir la fecha actual a la lista
      lista_reservas.append(fecha_hora_actual)

      # Incrementar la hora actual por el intervalo
      fecha_hora_actual += timedelta(hours=intervalo.hour, minutes=intervalo.minute)

  return lista_reservas
  
def generar_citas_all_negocios ():
  try:
    negocios_serializados = []
    
    # Hacer consulta a la base de datos
    negocios = get_all_negocios()
      
    # Convertir informacion de una lista de objetos SQLAlchemy a una lista de diccionarios
    for negocio in negocios:
        negocio_dict = {
            'id': negocio.id,
            'nombre': negocio.nombre,
            'telefono': negocio.telefono,
            'email': negocio.email,
            'ubicacion': negocio.ubicacion,
            'hora_inicio': negocio.hora_inicio.strftime('%H:%M'),  # Convertir a cadena en formato HH:MM
            'hora_fin': negocio.hora_fin.strftime('%H:%M'),        # Convertir a cadena en formato HH:MM
            'intervalo': negocio.intervalo.strftime('%H:%M'),      # Convertir a cadena en formato HH:MM
            'url_imagen': negocio.url_imagen,
            'categoria': negocio.categoria,
            'id_usuario': negocio.id_usuario,
        }
        negocios_serializados.append(negocio_dict)
    print(negocios_serializados)    
    # return jsonify({"data": negocios_serializados})
  
  except Exception as e:
    # Manejo de errores si es necesario
    print ({str(e)})
    # return jsonify({"error": f"Error en la ruta privada: {str(e)}"})
  
  