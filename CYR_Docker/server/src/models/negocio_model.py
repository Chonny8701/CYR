from src.database.db_connector import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
import uuid

def get_uuid():
  return str(uuid.uuid4())

class Negocio(db.Model):
    __tablename__ = 'tb_negocios'

    id = db.Column(db.String(36), primary_key=True, unique=True, nullable=False)
    nombre = db.Column(db.String(128), nullable=False)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(45), nullable=False)
    ubicacion = db.Column(db.String(128), nullable=False)
    hora_inicio = db.Column(db.Time, default=None)
    hora_fin = db.Column(db.Time, default=None)
    intervalo = db.Column(db.Time, default=None)
    categoria = db.Column(db.String(45), nullable=False)
    url_imagen = db.Column(db.String(256), default=None)
    id_usuario = db.Column(db.String(36), db.ForeignKey('tb_usuarios.id'), nullable=False)

    # # Relación con la tabla de usuarios (tb_usuarios)
    # usuario = relationship('Usuario', back_populates='negocios')
    
    def __init__(self, nombre, telefono, email, ubicacion, url_imagen, hora_inicio, hora_fin, intervalo, categoria, id_usuario):
      self.id = get_uuid()
      self.nombre = nombre
      self.telefono = telefono
      self.email = email
      self.ubicacion = ubicacion
      self.hora_inicio = hora_inicio
      self.hora_fin = hora_fin
      self.intervalo = intervalo
      self.categoria = categoria
      self.url_imagen = url_imagen
      self.id_usuario = id_usuario


