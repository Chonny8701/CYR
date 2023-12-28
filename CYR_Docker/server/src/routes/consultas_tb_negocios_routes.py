from flask import Blueprint, jsonify, request, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.services.general_services import guardar_imagen,eliminar_imagen, MiErrorPersonalizado, generar_lista_reservas
from datetime import datetime, time
from src.database.database_queries_negocio import (
    get_all_negocios,
    get_negocio_by_id,
    get_user_negocio,
    add_new_negocio,
    edit_negocio,
    delete_negocio,
)
from src.database.database_queries_reserva import (
  agregar_30_dias_reservas,
  delete_reservas_from_negocio,
)

consultasTBNegocios_blueprint = Blueprint('consultasTBNegocios', __name__)

# Devolver todos los negocios de la base de datos
@consultasTBNegocios_blueprint.route('/all', methods=['GET'])
def obtener_todos_negocios():
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
        
    return jsonify({"data": negocios_serializados}), 200
  
  except Exception as e:
    # Manejo de errores si es necesario
    print ({str(e)})
    return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500
    
# Devolver todos los negocio de un usuario especifico
@consultasTBNegocios_blueprint.route('/usuario', methods=['GET'])
@jwt_required()
def obtener_negocios_usuario():
  try:
    negocios_serializados = []
    id_usuario = get_jwt_identity()

    # Hacer consulta a la base de datos filtrando por id_usuario
    negocios = get_user_negocio(id_usuario)

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
    
    
    return jsonify({"data": negocios_serializados}), 200
  
  except Exception as e:
    print (e)
    return jsonify({'error': 'Error accediendo a los negocios'}), 500

# Añadir un nuevo negocio
@consultasTBNegocios_blueprint.route('/add', methods=['POST'])
@jwt_required()
def agregar_negocio():
  try:
    # Obtener datos enviados por el cliente
    data = request.form
    nombre = data.get('nombre')
    telefono = data.get('telefono')
    email = data.get('email')
    ubicacion = data.get('ubicacion')
    imagen = request.files.get('imagen')
    hora_inicio = data.get('hora_inicio')
    hora_fin = data.get('hora_fin')
    intervalo = data.get('intervalo')
    categoria = data.get('categoria')
    id_usuario = get_jwt_identity()
    
    nombre_imagen_servidor = ""
    
    print (f"Nombre: {nombre}\nTelefono: {telefono}\nEmail: {email}\nUbicacion: {ubicacion}\nHora Inicio: {hora_inicio}\nHora Fin: {hora_fin}\n Intervalo: {intervalo}\nCategoria: {categoria}\nId Usuario: {id_usuario}")
    # Convertir las horas del formato str a formato datetime.time
    hora_inicio = datetime.strptime(hora_inicio, "%H:%M").time()
    hora_fin = datetime.strptime(hora_fin, "%H:%M").time()
    intervalo = datetime.strptime(intervalo, "%H:%M").time()
    
    print(imagen)
    
    if imagen is not None:
      # Guardando imagen en el servidor, devuelve el nombre de la imagen guardada
      resultado = guardar_imagen(id_usuario, imagen)

      # En caso de error al guardar imagen lanzar una excepcion
      if not resultado["data"]:
        raise MiErrorPersonalizado(resultado["error"])
      
      # En caso de guardar la imagen correctamente se obtiene el nombre generado para guardar en DB
      nombre_imagen_servidor = resultado["data"]
          
    # Guardar negocio en la base de datos
    negocio = add_new_negocio(nombre, telefono, email, ubicacion, nombre_imagen_servidor, hora_inicio, hora_fin, intervalo, categoria, id_usuario)

    nuevo_negocio_id = negocio.id
    print("En routes las horas son: " + str(type(hora_inicio)))
    
    # Crear 30 dias de reserva para este negocio
    agregar_30_dias_reservas(nuevo_negocio_id, hora_inicio, hora_fin, intervalo)

    return jsonify({"message": "Negocio agregado correctamente"}), 200
  
  except Exception as e:
    # Manejo de errores si es necesario
    print (e)
    return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500

# Editar un negocio existente
@consultasTBNegocios_blueprint.route('/edit', methods=['POST'])
@jwt_required()
def editar_negocio():
    try:
      # Obtener datos enviados por el cliente
      data = request.form
      id = data.get('id')
      new_nombre = data.get('nombre')
      new_telefono = data.get('telefono')
      new_email = data.get('email')
      new_ubicacion = data.get('ubicacion')
      new_imagen = request.files['imagen']      # Obtén el archivo de la solicitud
      id_usuario = get_jwt_identity()
      
      # Obtener negocio original de la base de datos para borrar la imagen original
      negocio_original = get_negocio_by_id(id)
      nombre_imagen_original = negocio_original.url_imagen

      if not negocio_original:
        raise MiErrorPersonalizado("Producto a editar no se ha encontrado en la base de datos.")      
      
      # Guardando imagen en el servidor devuelve el nombre de la imagen guardada
      resultado = guardar_imagen(id_usuario, new_imagen)
      
      # En caso de error al guardar imagen lanzar una excepcion
      if not resultado["data"]:
        raise MiErrorPersonalizado(resultado["error"])
      
      # En caso de guardar la imagen correctamente se obtiene el nombre generado para guardar en DB
      nombre_imagen_servidor = resultado["data"]
      
      # Guardar negocio actualizado en la base de datos
      if not edit_negocio(id, new_nombre, new_telefono, new_email, new_ubicacion, nombre_imagen_servidor,id_usuario):
        raise MiErrorPersonalizado("Error al actualizar la informacion del negocio en la base de datos.")

      # Si se guardaron correctamente los nuevo datos del negocio se procede a eliminar la foto anterior
      imagen_eliminada = eliminar_imagen(nombre_imagen_original)
      if not imagen_eliminada:
        raise MiErrorPersonalizado("Error al eliminar la imagen original del negocio en el servidor.")
      
      return jsonify({"message": "Negocio editado correctamente"}), 200
    
    except MiErrorPersonalizado as error_personalizado:
      return jsonify({"error": str(error_personalizado)}), 500
    
    except Exception as e:
      # Manejo de errores si es necesario
      return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500

# Eliminar un negocio existente
@consultasTBNegocios_blueprint.route('/delete/<id_negocio>', methods=['DELETE'])
@jwt_required()
def eliminar_negocio(id_negocio):
  try:
    # Peticion para eliminar todas las reservas de un negocio
    reservas = delete_reservas_from_negocio (id_negocio)
    
    # Peticion para eliminar un negocio
    negocio = delete_negocio(id_negocio)
    
    imagen_eliminada = False
    
    # Si devuelve un negocio es que se eliminó correctamente
    if negocio:
      if negocio.url_imagen:
        # Proceder a eliminar la imagen de ese negocio del servidor
        imagen_eliminada = eliminar_imagen(negocio.url_imagen)
      else:
        imagen_eliminada = True
      
      # Si no se pudo eliminar la imagen lanzar una excepcion
      if not imagen_eliminada:
        raise ValueError("Error al eliminar la imagen original del negocio en el servidor.")
      
      return jsonify({"data": {}}), 200

    return jsonify({'error': 'Producto a eliminar no se ha encontrado en la base de datos'}), 404
  
  except Exception as e:
    print (e)
    return jsonify({'error': e}), 404

# Enviar imagenes guardadas en el servidor
@consultasTBNegocios_blueprint.route('/uploads/images/<nombre_imagen>')
def servir_imagen(nombre_imagen):
  return send_from_directory('src/uploads/images', nombre_imagen) # Direccion ruta imagenes en el servidor

  
  
  
  
  
  