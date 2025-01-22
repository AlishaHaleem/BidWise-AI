from datetime import datetime, timedelta
from Database import MongoDBHandler
# Initialize MongoDB Handler
db_handler = MongoDBHandler()

def submit_bid_to_mongo(bid_data):
    """
    Submit a bid to MongoDB.
    """
    bid_data["submission_date"] = datetime.now()
    bid_data["valid_until"] = datetime.now() + timedelta(days=90)
    bid_id = db_handler.store_bid(bid_data)
    return f"Bid with ID {bid_id} stored successfully."

def fetch_all_bids():
    """
    Fetch all bids from MongoDB.
    """
    bids = db_handler.get_all_bids()
    return bids

def fetch_bid_by_id(bid_id):
    """
    Fetch a bid by its ID.
    """
    bid = db_handler.get_bid_by_id(bid_id)
    if not bid:
        return f"No bid found with ID: {bid_id}"
    return bid

def process_bid_with_ai(bid_id, ai_model):
    """
    Process a bid with AI.
    """
    bid_data = fetch_bid_by_id(bid_id)
    if isinstance(bid_data, str):  # Error message
        return bid_data

    # Ensure bid_data includes only relevant fields for AI processing
    ai_input_data = {
        "service_level": bid_data.get("service_requirements", {}).get("service_level"),
        "setup_cost": bid_data.get("costs", {}).get("setup_cost"),
        "regulatory_compliance": bid_data.get("compliance_details", {}).get("regulatory_compliance"),
        "equipment_count": len(bid_data.get("technical_specification", {}).get("equipment_details", []))
    }

    # AI model processes bid and assigns score
    bid_score = ai_model.predict(ai_input_data)  # Replace with actual AI function
    db_handler.update_bid(bid_id, {"bid_score": bid_score})

    return f"Bid {bid_id} processed with AI. Score: {bid_score}"
