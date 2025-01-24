import pymongo.errors
from pymongo import MongoClient
from bson.objectid import ObjectId  # Import ObjectId for handling MongoDB IDs
from datetime import datetime, timedelta
from utils import get_logger, load_env_variable

# Initialize logger
logger = get_logger(__name__)


class MongoDbOperations:
    def __init__(self):
        """Initialize MongoDB connection and bids collection."""
        self.conn_string = load_env_variable("MONGO_URI")
        self.bids_table = self._database_conn()

    def _database_conn(self):
        """Establish a connection to MongoDB and return the bids collection."""
        try:
            logger.info("Connecting to MongoDB...")
            client = MongoClient(self.conn_string, server_api={"version": "1"})
            client.admin.command("ping")  # Ping to confirm connection
            logger.info("Successfully connected to MongoDB.")

            # Access the 'app' database and 'bids' collection
            db = client["app"]
            collection = db["bids"]
            logger.info("Connected to 'bids' collection.")
            return collection
        except pymongo.errors.ConnectionError as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
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

    def get_all_bids(self):
        """Fetch all bids from the MongoDB collection."""
        try:
            bids = list(self.bids_table.find({}, {"_id": 0}))  # Exclude MongoDB's _id field
            logger.info("Fetched all bids successfully.")
            return bids
        except Exception as e:
            logger.error(f"Error while fetching bids: {e}")
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

    def update_bid(self, bid_id, update_fields):
        """Update a bid with new fields."""
        try:
            bid_object_id = ObjectId(bid_id)
            result = self.bids_table.update_one({"_id": bid_object_id}, {"$set": update_fields})
            if result.matched_count > 0:
                logger.info(f"Updated bid with ID: {bid_id}")
            else:
                logger.warning(f"No bid found with ID: {bid_id} to update.")
            return result.modified_count
        except Exception as e:
            logger.error(f"Error while updating bid: {e}")
            raise


class AIModel:
    """Mock AI Model for demonstration purposes."""

    def predict(self, data):
        """Process data and return a score."""
        # AI model logic to predict a score based on input data
        return 85  # Static score for demonstration


def rank_bids(bids):
    """Rank bids based on specific criteria."""
    ranked_bids = []

    for bid in bids:
        rank_score = 0

        # Ranking logic (weighting can be adjusted as needed)
        rank_score += 100000 / (bid.get("bid_amount", 1))  # Higher bid amount = higher score
        if bid.get("service_requirements", {}).get("service_level") == "premium":
            rank_score += 50  # Premium service gets a boost
        if bid.get("compliance_details", {}).get("regulatory_compliance", False):
            rank_score += 30  # Compliant bids get a boost
        if "bid_score" in bid:
            rank_score += bid["bid_score"]  # Add AI score to rank score

        # Append bid with its rank score
        bid["rank_score"] = rank_score
        ranked_bids.append(bid)

    # Sort bids by rank score (higher score means higher rank)
    return sorted(ranked_bids, key=lambda x: x["rank_score"], reverse=True)


# Bid Management Functions
def submit_bid_to_mongo(bid_data, db_handler):
    """Submit a bid to MongoDB."""
    bid_id = db_handler.store_bid(bid_data)
    return f"Bid with ID {bid_id} stored successfully."


def fetch_all_bids(db_handler):
    """Fetch all bids from MongoDB."""
    return db_handler.get_all_bids()


def fetch_bid_by_id(bid_id, db_handler):
    """Fetch a bid by its ID."""
    return db_handler.get_bid_by_id(bid_id)


def process_bid_with_ai(bid_id, ai_model, db_handler):
    """Process a bid with AI and update the bid with a score."""
    try:
        bid_data = fetch_bid_by_id(bid_id, db_handler)
        if not bid_data:
            return f"No bid found with ID: {bid_id}"

        # Prepare data for AI model
        ai_input_data = {
            "service_level": bid_data.get("service_requirements", {}).get("service_level"),
            "setup_cost": bid_data.get("costs", {}).get("setup_cost"),
            "regulatory_compliance": bid_data.get("compliance_details", {}).get("regulatory_compliance"),
            "equipment_count": len(bid_data.get("technical_specification", {}).get("equipment_details", [])),
        }

        # AI model processes bid and assigns a score
        bid_score = ai_model.predict(ai_input_data)
        db_handler.update_bid(bid_id, {"bid_score": bid_score})

        return f"Bid {bid_id} processed with AI. Score: {bid_score}"
    except Exception as e:
        logger.error(f"Error processing bid with AI: {e}")
        raise


# Sample Usage
if __name__ == "__main__":
    try:
        # Initialize MongoDB Handler
        db_handler = MongoDbOperations()
        logger.info("Database handler initialized successfully.")

        # Sample Bid Data
        sample_bid = {
            "bidder_name": "John Doe",
            "bid_amount": 25000,
            "bid_date": "2025-01-21",
            "project_id": "proj12345",
            "service_requirements": {
                "service_level": "premium",
                "minimum_bandwidth": 500.0,
                "latency": 20,
                "reliability": 99.9,
            },
            "costs": {
                "setup_cost": 10000,
                "monthly_recurring_cost": 500,
                "maintenance_cost": 200,
                "currency": "USD",
            },
            "technical_specification": {
                "technology": "Fiber Optic",
                "implementation_timeframe": 90,
                "equipment_details": ["Router", "Switch", "Fiber Cable"],
            },
            "compliance_details": {
                "licenses_held": ["ISP License", "Operational License"],
                "certifications": ["ISO 9001", "Safety Certification"],
                "regulatory_compliance": True,
            },
            "proposal": "Fiber Optic Network Plan...",
        }

        # Submit a bid
        submit_result = submit_bid_to_mongo(sample_bid, db_handler)
        logger.info(submit_result)

        # Fetch all bids
        all_bids = fetch_all_bids(db_handler)
        logger.info(f"Fetched all bids: {len(all_bids)} bids found.")

        # Process a bid with AI
        ai_model = AIModel()
        example_bid_id = "64a3b8f4f2345c0e3e22d6b2"  # Replace with an actual ObjectId
        ai_result = process_bid_with_ai(example_bid_id, ai_model, db_handler)
        logger.info(ai_result)

        # Rank bids based on the criteria
        ranked_bids = rank_bids(all_bids)
        logger.info(f"Ranked Bids: {ranked_bids}")

    except Exception as e:
        logger.error(f"Error during sample usage: {e}")
