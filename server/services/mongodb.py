import pymongo.errors
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from utils.logger import get_logger
import os
from dotenv import load_dotenv
from models import Project, Bid, TrafficData, ProjectProgress
from pydantic import BaseModel

load_dotenv()
# Initialize logger
logger = get_logger(__name__)

class MongoDbOperations:
    def __init__(self, collection_name: str):
        """Initialize MongoDB connection and specific collection."""
        self.conn_string = os.environ.get("MONGO_URI")
        self.collection_name = collection_name
        self.collection = self._database_conn()

    def _database_conn(self):
        """Establish a connection to MongoDB and return the specified collection."""
        try:
            logger.info(f"Connecting to MongoDB collection: {self.collection_name}")
            client = MongoClient(self.conn_string)
            client.admin.command("ping")  # Ping to confirm connection
            logger.info("Successfully connected to MongoDB.")

            # Access the 'app' database and specified collection
            db = client["app"]
            collection = db[str(self.collection_name)]
            logger.info(f"Connected to '{self.collection_name}' collection.")
            return collection
        except Exception as e:
            logger.error(f"Unexpected error while connecting to MongoDB: {e}")
            raise

    def store_data(self, data):
        """
        Store a new document in the MongoDB collection.
        `data` can be an instance of a Pydantic model.
        """
        try:
            if isinstance(data, BaseModel):
                data_dict = data.dict()
            else:
                data_dict = data
            self.collection.insert_one(data_dict)
            logger.info(f"Data added to '{self.collection_name}' successfully.")
        except Exception as e:
            logger.error(f"Error while adding data to '{self.collection_name}': {e}")
            raise

    def get_all(self, model):
        """
        Fetch all documents from the MongoDB collection and return as model instances.
        """
        try:
            data = list(self.collection.find({}, {"_id": 0}))
            logger.info(f"Fetched {len(data)} records from '{self.collection_name}'.")
            return [model(**item) for item in data]
        except Exception as e:
            logger.error(f"Error while fetching data from '{self.collection_name}': {e}")
            raise

    def get_by_id(self, doc_id: str, model):
        """
        Fetch a document by its ID and return as a model instance.
        """
        try:
            doc_object_id = ObjectId(doc_id)
            doc = self.collection.find_one({"_id": doc_object_id}, {"_id": 0})
            if doc:
                logger.info(f"Fetched document with ID: {doc_id} from '{self.collection_name}'.")
                return model(**doc)
            else:
                logger.warning(f"No document found with ID: {doc_id} in '{self.collection_name}'.")
                return None
        except Exception as e:
            logger.error(f"Error while fetching document by ID from '{self.collection_name}': {e}")
            raise