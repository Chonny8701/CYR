from src.database.db_connector import db
import uuid

def get_uuid():
  return str(uuid.uuid4())

class Usuario(db.Model):
  __tablename__ = 'tb_usuarios'  # Nombre de la tabla
  id = db.Column(db.String(36), primary_key=True, unique=True, nullable=False)
  nombre = db.Column(db.String(45), nullable=False)
  telefono = db.Column(db.String(20), nullable=False)
  email = db.Column(db.String(45), nullable=False)
  contraseña = db.Column(db.String(80), nullable=False)
  cuenta_bancaria = db.Column(db.String(34))

  def __init__(self, nombre, telefono, email, contraseña, cuenta_bancaria):
    self.id = get_uuid()
    self.nombre = nombre
    self.telefono = telefono
    self.email = email
    self.contraseña = contraseña
    self.cuenta_bancaria = cuenta_bancaria
