from src.database.db_connector import db
from src.models.negocio_model import Negocio

# Obtener todos lo negocios de la base de datos
def get_all_negocios():
  return Negocio.query.all()

# Obtener todos lo negocios de la base de datos
def get_negocio_by_id(id):
  return Negocio.query.filter(id = id)

# Buscar negocios por id_usuario
def get_user_negocio(id_usuario):
  return Negocio.query.filter_by(id_usuario = id_usuario)

# Añadir nuevo negocio
def add_new_negocio(nombre, telefono, email, ubicacion, url_imagen, hora_inicio, hora_fin, intervalo, categoria, id_usuario):
  try:
    negocio = Negocio(nombre=nombre, telefono=telefono, email=email, ubicacion=ubicacion, url_imagen=url_imagen, hora_inicio=hora_inicio, hora_fin= hora_fin, intervalo= intervalo, categoria=categoria, id_usuario=id_usuario)
    db.session.add(negocio)
    db.session.commit()
    return negocio
  except Exception as e:
    print("Error: "+e)
  
# Añadir nuevo negocio
def edit_negocio(id, nombre, telefono, email, ubicacion, url_imagen):
  negocio = Negocio.query.get(id)
  if negocio:
    negocio.nombre = nombre
    negocio.telefono = telefono
    negocio.email = email
    negocio.ubicacion = ubicacion
    negocio.url_imagen = url_imagen
    db.session.commit()
  return negocio
  
# Eliminar un negocio
def delete_negocio(id):
  negocio = Negocio.query.get(id)
  if negocio:
    db.session.delete(negocio)
    db.session.commit()
  return negocio