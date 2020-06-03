class Config(object):
    DATABASE_PATH = "./updb.sqlite"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + DATABASE_PATH
    SECRET_KEY = "dkjafkldjakfjdkafjdlkajfkldajfkldajklfjalkjdka"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
