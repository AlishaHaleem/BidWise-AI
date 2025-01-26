from flask import Flask
from routes import register_blueprints
from flask_cors import CORS
import os

app = Flask(__name__)

cors_config = {
        r"*": {
            "origins": [os.getenv("BASE_URL"), "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "X-CSRF-Token"
            ],
            "supports_credentials": True  # Allow sending cookies
        }
    }
CORS(app, resources=cors_config)

@app.route("/")
def home():
    return "Backend is running"

# Register routes
register_blueprints(app)


""" Step 4: Start the server """
if __name__ == '__main__':
    HOST = os.getenv("FLASK_RUN_HOST") or "0.0.0.0"
    PORT = os.getenv("FLASK_RUN_PORT") or 8000
    app.run(debug=True, host=HOST, port=PORT)