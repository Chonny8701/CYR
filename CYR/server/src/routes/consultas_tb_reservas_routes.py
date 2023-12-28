from flask import Blueprint, jsonify, request, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from datetime import datetime
from src.services.general_services import guardar_imagen, eliminar_imagen, MiErrorPersonalizado
from src.database.database_queries_reserva import (
  get_all_reservas,
  get_reservas_negocio,
  add_new_reserva,
  agregar_30_dias_reservas,
  edit_reserva,
)

consultasTBReservas_blueprint = Blueprint('consultasTBReservas', __name__)

# Devolver todas los reservas de la base de datos
@consultasTBReservas_blueprint.route('/all', methods=['GET'])
def obtener_todas_reservas():
  print("accediendo a todos los reservas")
  try:
    
    # Hacer consulta a la base de datos
    reservas = get_all_reservas()
    reservas_serializados = []
    
    # Convertir informacion de una lista de objetos SQLAlchemy a una lista de diccionarios
    for reserva in reservas:
      reserva_dict = {
        'id': reserva.id,
        'fecha': reserva.fecha,
        'estado': reserva.estado,
        'id_negocio': reserva.id_negocio,
      }
      reservas_serializados.append(reserva_dict)
        
    return jsonify({"data": reservas_serializados}), 200
  
  except Exception as e:
    # Manejo de errores si es necesario
    return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500

# Devolver todos las reservas de un negocio especifico
@consultasTBReservas_blueprint.route('/negocio/<id_negocio>', methods=['GET'])
def obtener_reservas_negocio(id_negocio):
  try:
    reservas = get_reservas_negocio(id_negocio)
    reservas_serializados = []

    # Convertir informacion de una lista de objetos SQLAlchemy a una lista de diccionarios
    for reserva in reservas:
      reserva_dict = {
        'id': reserva.id,
        'id_negocio': reserva.id_negocio,
        'fecha': reserva.fecha,
        'estado': reserva.estado,
      }
      reservas_serializados.append(reserva_dict)
    
    return jsonify({"data": reservas_serializados}), 200
  
  except Exception as e:
    print("recibiendo peticion")
    return jsonify({'error': f'Error accediendo a los reservas: {str(e)})'}), 404

# Añadir nuevas reservas
@consultasTBReservas_blueprint.route('/add', methods=['POST'])
@jwt_required()
def agregar_reserva():    
  try:
    # Obtener datos enviados por el cliente
    data = request.form
    id_negocio = data.get('id_negocio')
    hora_inicio = data.get('hora_inicio')
    hora_fin = data.get('hora_fin')
    intervalos = data.get('intervalos')
    
    # Guardar reserva en la base de datos
    agregar_30_dias_reservas(id_negocio, hora_inicio, hora_fin, intervalos)

    return jsonify({"message": "Reserva agregada correctamente"}), 200
  
  except Exception as e:
    # Manejo de errores
    return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500

# Editar un reserva existente
@consultasTBReservas_blueprint.route('/edit/<id>', methods=['PUT'])
def editar_reserva(id):
  try:
    # Obtener datos enviados por el cliente
    data = request.form
    nombre = data.get('nombre')
    telefono = data.get('telefono')
    estado = bool(data.get('estado')) 
    codigo = data.get('codigo')

    print (f"Código: {codigo} \nID corto: {id[:4]} \nNombre: {nombre} \nTelefono: {telefono} \nEstado:{data.get('estado')}")
  
    if codigo!=id[:4] and not estado:
      raise ValueError("Código de cancelación incorrecto")
    
    # Editar una reserva que coincida su id
    if not edit_reserva(id, nombre, telefono, estado):
        raise ValueError("Error al actualizar la informacion del reserva en la base de datos.")
  
    # Si se actualizó correctamente la base de datos
    if estado:
      return jsonify({"message": f"Se ha registrado su reserva correctamente. En caso que desee cancelar su reserva su código de cancelación es {id[:4]}", "status":True}), 200
    else:
      return jsonify({"message": f"Su reserva se ha cancelado correctamente", "status":True}), 200
  except Exception as e:
    print(e)
    return jsonify({"error": str(e), "status":False}), 500



  
  
  
  
  
  