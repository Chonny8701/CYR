from decouple import config
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token,get_jwt_identity, jwt_required, JWTManager
from src.database.database_queries_usuarios import get_user_by_id, get_user_by_email, get_users_by_name

def generar_tokens(id):
  access_token = create_access_token(identity=id)
  refresh_token = create_refresh_token(identity=id) 
  
  return {
    "access_token": access_token,
    "refresh_token": refresh_token 
  }

def verificar_access_token(access_token):
    try:
        decoded_token = decode_token(access_token)

        if 'sub' in decoded_token:
            user_id = decoded_token['sub']
            usuario = get_user_by_id(user_id)
            return usuario

    except Exception as e:
        # Manejo de errores, por ejemplo, token expirado o inválido
        return None
