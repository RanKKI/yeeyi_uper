from web_app import create_app
from conf import config

app = create_app(config)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4999)
