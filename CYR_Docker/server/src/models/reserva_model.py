from src.database.db_connector import db
import uuid

def get_uuid():
  return str(uuid.uuid4())

class Reserva(db.Model):
  __tablename__ = 'tb_reservaciones'
  id = db.Column(db.String(36), primary_key=True, unique=True, nullable=False)
  id_negocio = db.Column(db.String(36), db.ForeignKey('tb_usuarios.id'), nullable=False)
  fecha = db.Column(db.DateTime, nullable=False)
  estado = db.Column(db.Boolean, nullable=False)
  nombre = db.Column(db.String(45))
  telefono = db.Column(db.String(20))

  # # Define la relación con la tabla de usuarios (tb_usuarios)
  # usuario = relationship('Usuario', back_populates='reserva')

  def __init__(self, id_negocio, fecha, estado):
    self.id = get_uuid()    
    self.id_negocio = id_negocio
    self.fecha = fecha
    self.estado = estado
    self.nombre = ""
    self.telefono = ""
 