import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
lm = LoginManager()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    lm.init_app(app)
    lm.login_view = "views.login"

    from web_app.views import views
    app.register_blueprint(views)

    if not os.path.exists(config.DATABASE_PATH):
        with app.app_context():
            db.create_all()

    return app
