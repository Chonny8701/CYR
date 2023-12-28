from flask import Blueprint, request, redirect, url_for,jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from src.database.database_queries_usuarios import get_all_users, add_user, update_user,update_user_except_password, delete_user, get_user_by_id, get_user_by_email
from src.services.auth_services import generar_tokens
from flask_bcrypt import Bcrypt

consultasTBUsuarios_blueprint = Blueprint('consultasTBUsuarios', __name__)
bcrypt = Bcrypt()

# Login de usuario por email y contraseña
@consultasTBUsuarios_blueprint.route('/login', methods=['POST'])
def login():
  if request.method == 'POST':
    try:
      data = request.get_json()  # Obtener los datos en formato JSON

      # Si no recibe como parametros email y contraseña enviar un error
      if not data or 'emailUsuario' not in data or 'passwordUsuario' not in data:
          return jsonify({"error": "Datos para inicio de sesión incompletos"}), 400

      # Obtener información de la petición
      email = data['emailUsuario']
      password = data['passwordUsuario']
      
      # Buscar en la base de datos usuario por email
      usuario = get_user_by_email(email)

      # Si no se encuentra el usuario enviar mensaje de error
      if usuario is None:
          return jsonify({"error": "Nombre de usuario y/o contraseña incorrecto"}), 401

      # Si no coincide la contraseña enviar mensaje de error
      if not bcrypt.check_password_hash(usuario.contraseña, password):
        print (f"Email DB: {usuario.email}, Contraseña DB: {usuario.contraseña}")
        print (f"Email login: {email}, Contraseña login: {password}")
        print ({bcrypt.check_password_hash(usuario.contraseña, password)})
        return jsonify({"error": "Nombre de usuario y/o contraseña incorrecto"}), 401

      else:
        # Generar tokens
        access_token, refresh_token = generar_tokens(usuario.id).values()
        
        #  Crear una respuesta HTTP personalizada. Respuesta HTTP con más control sobre sus propiedades, como los encabezados y las cookies.
        res = make_response(jsonify({
            "id": usuario.id,
            "email": usuario.email,
            "nombre": usuario.nombre,
            "telefono": usuario.telefono,
            "contraseña": usuario.contraseña,
            "cuenta_bancaria": usuario.cuenta_bancaria,
            "access_token": access_token,
            "refresh_token": refresh_token
        }))

        # Configurar cookies para el access token y el refresh token
        res.set_cookie('access_token', value=access_token, httponly=False)
        res.set_cookie('refresh_token', value=refresh_token, httponly=False)
        
        return res;
          
    except Exception as e:
      return jsonify({'error': f"Error en el inicio de sesión: {str(e)}"}), 500

# Signup de nuevo usuario
@consultasTBUsuarios_blueprint.route('/signup', methods=['POST'])
def agregar_usuario():
  try:
    data = request.json
    nombre = data['nombreUsuario']
    telefono = data['telefonoUsuario']
    email = data['emailUsuario']
    password = data['passwordUsuario']
    cuenta_bancaria = data['cuentaBancariaUsuario']

    if get_user_by_email(email):
      return jsonify({'error': 'Usuario ya existe en la base de datos'}), 400

    # Intentar añadir un nuevo usuario a la base de datos
    hashed_password = bcrypt.generate_password_hash(password)
    add_user(nombre, telefono, email, hashed_password, cuenta_bancaria)
    
    # Redirigir a la página de inicio si todo salió bien
    return jsonify({'message': 'Usuario agregado correctamente'}), 201  # Cambiar a 201 para indicar creación exitosa

  except Exception as e:
    # Enviar el error al cliente en caso de un problema con la base de datos
    return jsonify({'error': f"Error interno del servidor al agregar usuario a la base de datos: {str(e)}"}), 500

# Devolver todos los negocio de un usuario especifico
@consultasTBUsuarios_blueprint.route('/cuenta', methods=['GET'])
@jwt_required()
def obtener_usuario_cuenta():
  return '', 200

# Obtener datos de un usuario
@consultasTBUsuarios_blueprint.route('/get_user', methods=['POST'])
@jwt_required()
def obtener_usuario():
    try:
        user_id = get_jwt_identity()
        user = get_user_by_id(user_id)

        # Retornar un error si no existe ningun usuario con ese id
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # En caso de que exista un usuario, serializar los datos del usuario
        usuario_serializado = {
            "id": user.id,
            "nombre": user.nombre,
            "telefono": user.telefono,
            "password": user.contraseña,
            "email": user.email,
            "cuenta_bancaria": user.cuenta_bancaria
        }
  
        return jsonify({"data": usuario_serializado})
    
    except Exception as e:
        # Manejo de errores si es necesario
        return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500

# Editar datos de un usuario
@consultasTBUsuarios_blueprint.route('/editar_usuario', methods=['PUT'])
@jwt_required()
def editar_usuario():
    try:
      # Obtener el access token del encabezado
      access_token = request.headers.get('Authorization')
      if not access_token:
        return jsonify({"error": "Unauthorized: El token de acceso es inválido"}), 401
      
      # Obtener los datos JSON del body de la solicitud
      dataClient = request.get_json()
      if not dataClient:
        return jsonify({"error": "Datos JSON no encontrados en la solicitud"}), 400

      # Acceder a los datos específicos
      nombre = dataClient.get('nombre') 
      telefono = dataClient.get('telefono')
      email = dataClient.get('email')
      orginal_contraseña = dataClient.get('original_contraseña')
      nueva_contraseña = dataClient.get('nueva_contraseña')
      cuenta_bancaria = dataClient.get('cuenta_bancaria')
      
      user_id = get_jwt_identity()
      usuarioDB = get_user_by_id(user_id)
      
      print ("Comparacion de contraseñas: ",bcrypt.check_password_hash(usuarioDB.contraseña, orginal_contraseña))
      print ("Contraseña del cliente: ",orginal_contraseña)
      print ("Contraseña del servidor: ",usuarioDB.contraseña)
      
      if usuarioDB is None:
        return jsonify({"error": "Unauthorized no se encuentra el usuario"}), 401

      if not bcrypt.check_password_hash(usuarioDB.contraseña, orginal_contraseña):
        print("Comparacion de contraseñas:", bcrypt.check_password_hash(usuarioDB.contraseña, orginal_contraseña))
        return jsonify({"error": "Unauthorized contraseña incorrecta"}), 401
      
      # Actualizar todos los datos del usuario si se modificó la contraseña
      if nueva_contraseña is not None and nueva_contraseña.strip():
        hashed_password = bcrypt.generate_password_hash(nueva_contraseña)     # Encriptar contraseña antes de enviar al servidor
        update_user(user_id= user_id, new_name = nombre, new_phone = telefono, new_email = email, new_password = hashed_password, new_cuenta_bancaria = cuenta_bancaria)
        user = get_user_by_id(user_id)
        
        if not user:
          return jsonify({"error": "Usuario no encontrado"}), 404
        
      #Actualizar todos los datos del usuario excepto la contraseña
      else:
        user = update_user_except_password(user_id= user_id, new_name = nombre, new_phone = telefono, new_email = email, new_cuenta_bancaria = cuenta_bancaria)
        user = get_user_by_id(user_id)
        
        if not user:
          return jsonify({"error": "Usuario no encontrado"}), 404
    
      # Serializar los datos del usuario
      usuario_serializado = {
        "id": user.id,
        "nombre": user.nombre,
        "telefono": user.telefono,
        "contraseña": user.contraseña,
        "email": user.email,
        "cuenta_bancaria": user.cuenta_bancaria
      }

      # Devolver los datos del usuario actualizados en formato JSON
      return jsonify({"data": usuario_serializado})

    except Exception as e:
      # Manejo de errores si es necesario
      return jsonify({"error": f"Error en la solicitud: {str(e)}"}), 500

# Eliminar un usuario
@consultasTBUsuarios_blueprint.route('/eliminar_usuario/<int:user_id>')
@jwt_required()
def eliminar_usuario(user_id):
    # Eliminar el usuario por ID
    delete_user(user_id)

    # Redirigir a la página de inicio
    return redirect(url_for('consultasTBUsuarios.index'))

# Aplicar decorador jwr_required para comprobar que exista token valido en authentication
@consultasTBUsuarios_blueprint.route('/private', methods=['GET'])
@jwt_required()   
def private_route():
    try:
      # Obtén el identity del token decodificado
      email = get_jwt_identity()
      usuario = get_user_by_email(email)
      
      if usuario:
        user_data = {
          'id': usuario.id,
          'nombre': usuario.nombre,
          'email': usuario.email,
          'telefono': usuario.telefono,
          'cuenta_bancaria': usuario.cuenta_bancaria
        }

      # Devuelve una respuesta JSON que indica que el acceso es válido
      return jsonify({"message": "Acceso a la ruta privada exitoso", "user_data": user_data}), 200

    except Exception as e:
        # Manejo de errores si es necesario
        return jsonify({"error": f"Error en la ruta privada: {str(e)}"}), 500
