"""Initialize Flask blueprints."""
"""step 1: Import the required libraries"""

from .AI import ai_routes
from .API import api_routes


"""step 2: Define the register_blueprints function"""
def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(ai_routes)
    app.register_blueprint(api_routes)

    