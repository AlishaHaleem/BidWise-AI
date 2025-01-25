# scripts/insert_bid_data.py

from services.mongodb import MongoDbOperations
from models.bid import Bid

# Initialize the MongoDB operations for the 'bids' collection
db = MongoDbOperations("bids")

# Define bid data for different projects
bid_data = [
    Bid(
        provider="TechNet Solutions",
        cost="$125,000",
        coverage="98%",
        aiScore=85,
        project_id="Rural Schools Network - Region A",  # Using project name as project_id for simplicity
        bidder_id="BIDDER_1",
        bid_id="BID_1"
    ),
    Bid(
        provider="Connectify Inc.",
        cost="$110,000",
        coverage="95%",
        aiScore=80,
        project_id="Rural Schools Network - Region A",
        bidder_id="BIDDER_2",
        bid_id="BID_2"
    ),
    Bid(
        provider="NetLink Corp.",
        cost="$130,000",
        coverage="99%",
        aiScore=90,
        project_id="Urban Connectivity Project B",
        bidder_id="BIDDER_3",
        bid_id="BID_3"
    )
    # Add more bids as needed
]

# Insert the bid data into the database
for bid in bid_data:
    db.collection.insert_one(bid.dict())

print("Bid data has been successfully inserted into the 'bids' collection.")
