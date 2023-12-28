from src.database.db_connector import db
from src.models.usuario_model import Usuario

#--------------------------------------LEER USUARIO POR -----------------------------
# Leer todos los usuarios
def get_all_users():
  return Usuario.query.all()

# Leer un usuario por ID (por la primary key)
def get_user_by_id(user_id):
  return Usuario.query.get(user_id)
  
# Leer un usuario por email
def get_user_by_email(email):
  return Usuario.query.filter_by(email=email).first()

# Leer un usuario por email y contraseña
def get_user_by_email_and_password(email, password):
  return Usuario.query.filter_by(email=email, contraseña = password).first()

# Filtrar usuarios por nombre
def get_users_by_name(name):
  return Usuario.query.filter_by(nombre=name).all()

# Filtrar usuarios por nombre y contraseña
def get_users_by_name_and_password(nombre, contraseña):
  usuarios = Usuario.query.filter_by(nombre=nombre, contraseña=contraseña).all()
  return usuarios

#--------------------------------------AÑADIR NUEVO USUARIO -----------------------------
# Añadir un nuevo usuario
def add_user(name, phone, email, password, cuenta_bancaria):
  new_user = Usuario(nombre = name, telefono = phone, email = email, contraseña=password, cuenta_bancaria = cuenta_bancaria)
  db.session.add(new_user)
  db.session.commit()

#--------------------------------------ACTUALIZAR USUARIO EXISTENTE -----------------------------
# Actualizar un usuario existente buscar por id y actualizar todos los campos
def update_user(user_id, new_name, new_phone, new_email, new_password, new_cuenta_bancaria):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_name
    user_to_update.telefono = new_phone
    user_to_update.email = new_email
    user_to_update.contraseña = new_password
    user_to_update.cuenta_bancaria = new_cuenta_bancaria
    db.session.commit()

# Actualizar un usuario existente buscar por id y actualizar todos los campos excepto la contraseña
def update_user_except_password(user_id, new_name, new_phone, new_email, new_cuenta_bancaria):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_name
    user_to_update.telefono = new_phone
    user_to_update.email = new_email
    user_to_update.cuenta_bancaria = new_cuenta_bancaria
    db.session.commit()

# Actualizar usuario existente buscar por id y actualizar nombre
def update_user_name(user_id, new_name):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_name
    db.session.commit()
        
# Actualizar usuario existente buscar por id y actualizar telefono
def update_user_phone(user_id, new_phone):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_phone
    db.session.commit()
        
# Actualizar usuario existente buscar por id y actualizar email
def update_user_email(user_id, new_email):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_email
    db.session.commit()

# Actualizar usuario existente buscar por id y actualizar contraseña
def update_user_password(user_id, new_password):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_password
    db.session.commit()

# Actualizar usuario existente buscar por id y actualizar cuenta bancaria
def update_user_cuenta_bancaria(user_id, new_cuenta_bancaria):
  user_to_update = Usuario.query.get(user_id)
  if user_to_update:
    user_to_update.nombre = new_cuenta_bancaria
    db.session.commit()

#--------------------------------------ELIMINAR UN USUARIO-----------------------------
# Eliminar un usuario por ID
def delete_user(user_id):
  user_to_delete = Usuario.query.get(user_id)
  if user_to_delete:
    db.session.delete(user_to_delete)
    db.session.commit()
