from flask_sqlalchemy import SQLAlchemy
from decouple import config

db = SQLAlchemy()

def init_db(app):
    db_url = f"mysql://{config('DB_USER')}:{config('DB_PASSWORD')}@{config('DB_HOST')}:{config('DB_PORT')}/{config('DB_DATABASE')}"
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
