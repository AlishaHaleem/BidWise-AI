from flask import Flask
from routes import register_blueprints
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "Backend is running"

# Register routes
register_blueprints(app)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)