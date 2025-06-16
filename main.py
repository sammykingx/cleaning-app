# application entry point

from app import create_app
# import configurations if needed


def main():
    """Main entry point for the application."""
    
    # Create the Flask application passing the configuration class as an argument
    # e.g., create_app(DevelopmentConfig)
    app = create_app()
    
    @app.route('/')
    def index():
        return "Welcome to the Cleaning App!"
    
    # Run the application
    app.run()


if __name__ == "__main__":
    main()
