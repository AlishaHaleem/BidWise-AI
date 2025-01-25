import pymongo.errors
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from utils.utils import get_logger
import os
from dotenv import load_dotenv

load_dotenv()
# Initialize logger
logger = get_logger(__name__)

class MongoDbOperations:
    def __init__(self, table_name: str = "bids"):
        """Initialize MongoDB connection and bids collection."""
        self.conn_string = os.environ.get("MONGO_URI")
        self.table_name = table_name  # Move this before _database_conn()
        self.table = self._database_conn()

    def _database_conn(self):
        """Establish a connection to MongoDB and return the bids collection."""
        try:
            logger.info("Connecting to MongoDB...")
            client = MongoClient(self.conn_string)
            client.admin.command("ping")  # Ping to confirm connection
            logger.info("Successfully connected to MongoDB.")

            # Access the 'app' database and specified collection
            db = client["app"]
            collection = db[str(self.table_name)]
            logger.info(f"Connected to '{self.table_name}' collection.")
            return collection
        except Exception as e:
            logger.error(f"Unexpected error while connecting to MongoDB: {e}")
            raise

    def store_bid(self, bid_data):
        """Store a new bid in the MongoDB collection."""
        try:
            self.table.insert_one(bid_data)
            logger.info("Bid added successfully.")
        except Exception as e:
            logger.error(f"Error while adding bid: {e}")
            raise

    def get_bid_by_id(self, bid_id):
        """Fetch a bid by its ID."""
        try:
            bid_object_id = ObjectId(bid_id)
            bid = self.table.find_one({"_id": bid_object_id}, {"_id": 0})  # Exclude _id
            if bid:
                logger.info(f"Fetched bid with ID: {bid_id}")
            else:
                logger.warning(f"No bid found with ID: {bid_id}")
            return bid
        except Exception as e:
            logger.error(f"Error while fetching bid by ID: {e}")
            raise


# db = MongoDbOperations()
#
# data = {"hi": 2}
#
# db.store_bid(data)