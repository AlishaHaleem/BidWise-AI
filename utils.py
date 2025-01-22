import logging
from dotenv import load_dotenv
import os

def get_logger(name: str) -> logging.Logger:
    """
    Template for getting a logger.

    Args:
        name: Name of the logger.

    Returns: Logger.
    """

    # Configure
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logger = logging.getLogger(name)

    return logger





def load_env_variable(var_name):
    """
    Load an environment variable from a custom .env file.

    Parameters:
    var_name (str): The name of the environment variable to load.

    Returns:
    str: The value of the environment variable if found, otherwise None.
    """
    # Load the .env file
    for path in ['.env', '../.env', '../../.env', '../../../.env']:
        if os.path.exists(path):
            load_dotenv(dotenv_path=path)
            break

    # Get the environment variable
    return os.getenv(var_name)