from src.routes.index_routes import index_blueprint
from src.routes.consultas_tb_usuarios_routes import consultasTBUsuarios_blueprint
from src.routes.consultas_tb_negocios_routes import consultasTBNegocios_blueprint
from src.routes.consultas_tb_reservas_routes import consultasTBReservas_blueprint
from src.routes.consultas_stripe_routes import consultas_Stripe_blueprint

def init_routes(app):
  app.register_blueprint(index_blueprint)
  app.register_blueprint(consultasTBUsuarios_blueprint, url_prefix='/api/usuarios')
  app.register_blueprint(consultasTBNegocios_blueprint, url_prefix='/api/negocios')
  app.register_blueprint(consultasTBReservas_blueprint, url_prefix='/api/reservas')
  app.register_blueprint(consultas_Stripe_blueprint, url_prefix='/api/stripe')
