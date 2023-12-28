from flask import jsonify
from src.database.db_connector import db
from src.models.reserva_model import Reserva
from datetime import date
from src.services.general_services import (
  generar_lista_reservas,
)

# Obtener todas la reservas
def get_all_reservas():
    return Reserva.query.all()

# Buscar reservas de un negocio por su id_negocio
def get_reservas_negocio(id_negocio):
    return Reserva.query.filter_by(id_negocio=id_negocio)

def agregar_30_dias_reservas(id_negocio, hora_inicio, hora_fin, intervalo):
  # Obtener la fecha actual sin la hora
  fecha_actual = date.today()
  
  # Generar lista de reserva de los próximos 30 días
  cantidad_dias = 30
  lista_reservas_30_dias = generar_lista_reservas(fecha_actual, hora_inicio, hora_fin, intervalo, cantidad_dias)

  # Obtener las reservas del negocio desde la base de datos
  lista_reservas_db = Reserva.query.filter_by(id_negocio=id_negocio).all()

  # Crear un conjunto (una colección no ordenada y sin duplicados) de fechas existentes para facilitar la búsqueda
  fechas_existentes = set(reserva.fecha for reserva in lista_reservas_db)

  # Crear un arreglo con las nuevas reservas que no existen en la base de datos
  nuevas_reservas = [
    Reserva(id_negocio=id_negocio, fecha=reserva_nueva, estado=False)
    for reserva_nueva in lista_reservas_30_dias
    if reserva_nueva not in fechas_existentes
  ]

  # Si hay fechas nuevas se agregan a la base de datos
  if nuevas_reservas:
    db.session.add_all(nuevas_reservas)
    db.session.commit()

# Añadir nueva reserva
def add_new_reserva(id_negocio, fecha,estado):
    reserva = Reserva(id_negocio=id_negocio, fecha=fecha, estado=estado, nombre="", telefono="")
    db.session.add(reserva)
    db.session.commit()

# Editar el estado de una reserva
def edit_reserva(id, nombre, telefono, estado):
  reserva = Reserva.query.get(id)
  if reserva:
    reserva.nombre = nombre
    reserva.telefono = telefono
    reserva.estado = estado
    db.session.commit()
  return reserva

# Eliminar todas las reservas de un negocio
def delete_reservas_from_negocio (id_negocio):
  # Filtrar para optener todas las reservas que contengan el id_negocio que se quiere eliminar
  reservas_a_eliminar = Reserva.query.filter_by(id_negocio=id_negocio).all()
  
  print (type(reservas_a_eliminar))
  # Hacer ciclo para commitear cada reserva
  for reserva in reservas_a_eliminar:
    db.session.delete(reserva)

  # Realiza la confirmación para aplicar los cambios
  db.session.commit()
  
  return jsonify({"status": "success", "message": "Reservas eliminadas correctamente"})

