import pymongo.errors
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from utils import get_logger, load_env_variable

logger = get_logger(__name__)


class MongoDbOperations:
    def __init__(self):
        self.conn_string = load_env_variable("MONGO_URI")
        self.bids_table = self.database_conn()

    #Establishing mongo conn.
    def database_conn(self):

        # Create a new client and connect to the server
        logger.info("Connecting to database")
        my_client = MongoClient(self.conn_string)
        logger.info("Success client")

        # Send a ping to confirm a successful connection
        try:
            my_client.admin.command('ping')
            logger.info("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            logger.error("Error connecting to MongoDB: " + str(e))
        # database
        my_db = my_client['app']  # app is my already created database.
        logger.info("Success app")
        # User is like a table in database app. For more see mongodb.
        data_table = my_db['bids']
        logger.info("Success bids table!")
        return data_table


    def add_data(self, bid):
        """Used to add Data user that will newly be added."""
        logger.info("Adding Data to database")
        try:
            self.bids_table.insert_one(bid)
            logger.info("Bid added successfully!")
        except Exception as e:
            logger.error(f"Error adding bid! .... {e}")

sample_bid = {
    "bidder_name": "John Doe",
    "bid_amount": 25000,
    "bid_date": "2025-01-21",
    "project_id": "proj12345",
    "service_requirements": {
        "service_level": "premium",
        "minimum_bandwidth": 500.0,
        "latency": 20,
        "reliability": 99.9
    },
    "costs": {
        "setup_cost": 10000,
        "monthly_recurring_cost": 500,
        "maintenance_cost": 200,
        "currency": "USD"
    },
    "technical_specification": {
        "technology": "Fiber Optic",
        "implementation_timeframe": 90,
        "equipment_details": ["Router", "Switch", "Fiber Cable"]
    },
    "compliance_details": {
        "licenses_held": ["ISP License", "Operational License"],
        "certifications": ["ISO 9001", "Safety Certification"],
        "regulatory_compliance": "True"
    },
    "proposal": "Fiber Optic Network Plan..."
}


db = MongoDbOperations()
db.add_data(sample_bid)
