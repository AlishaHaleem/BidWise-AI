import pymongo.errors
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for handling MongoDB IDs
from datetime import datetime, timedelta
from server.utils import get_logger, load_env_variable

# Initialize logger
logger = get_logger(__name__)

print(load_env_variable("MONGO_URI"))

class MongoDbOperations:
    def __init__(self):
        """Initialize MongoDB connection and bids collection."""
        self.conn_string = load_env_variable("MONGO_URI")
        self.table_name: str = "bids"
        self.table = self._database_conn()
        

    def _database_conn(self):
        """Establish a connection to MongoDB and return the bids collection."""
        try:
            logger.info("Connecting to MongoDB...")
            client = MongoClient(self.conn_string)
            client.admin.command("ping")  # Ping to confirm connection
            logger.info("Successfully connected to MongoDB.")

            # Access the 'app' database and 'bids' collection
            db = client["app"]
            collection = db[self.table_name]
            logger.info("Connected to 'bids' collection.")
            return collection
        except Exception as e:
            logger.error(f"Unexpected error while connecting to MongoDB: {e}")
            raise

    def store_bid(self, bid_data):
        """Store a new bid in the MongoDB collection."""
        try:
            return self.table.insert_one(bid_data)
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


db = MongoDbOperations()

data = {"hi": 2}

db.store_bid(data)