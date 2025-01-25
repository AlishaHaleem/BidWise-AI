import pymongo.errors
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for handling MongoDB IDs
from datetime import datetime, timedelta
from server.utils import get_logger, load_env_variable

# Initialize logger
logger = get_logger(__name__)


class MongoDbOperations:
    def __init__(self):
        """Initialize MongoDB connection and bids collection."""
        self.conn_string = load_env_variable("MONGO_URI")
        self.bids_table = self._database_conn()
        self.table_name: str = "bids"

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
            bid_data["submission_date"] = datetime.now()
            bid_data["valid_until"] = datetime.now() + timedelta(days=90)
            result = self.bids_table.insert_one(bid_data)
            logger.info(f"Bid added successfully with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error while adding bid: {e}")
            raise

    def get_bid_by_id(self, bid_id):
        """Fetch a bid by its ID."""
        try:
            bid_object_id = ObjectId(bid_id)
            bid = self.bids_table.find_one({"_id": bid_object_id}, {"_id": 0})  # Exclude _id
            if bid:
                logger.info(f"Fetched bid with ID: {bid_id}")
            else:
                logger.warning(f"No bid found with ID: {bid_id}")
            return bid
        except Exception as e:
            logger.error(f"Error while fetching bid by ID: {e}")
            raise


