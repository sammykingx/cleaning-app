from app import create_app
from app.config import ProductionConfig

application = create_app(ProductionConfig)