from mongodb import MongoDbOperations, submit_bid_to_mongo, fetch_all_bids, fetch_bid_by_id, process_bid_with_ai
from bson.objectid import ObjectId  # Import ObjectId for MongoDB ID handling

# Sample usage
if __name__ == "__main__":
    # Initialize MongoDB handler
    try:
        db_handler = MongoDbOperations()
        print("Database handler initialized successfully.")
    except Exception as e:
        print(f"Error initializing database handler: {e}")
        exit(1)

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

    # Submit the bid
    bid_id = None
    try:
        bid_submission_message = submit_bid_to_mongo(sample_bid, db_handler)
        bid_id = bid_submission_message.split()[-1]  # Extract the ID from the success message
        if ObjectId.is_valid(bid_id):  # Validate bid ID
            print(f"Bid submitted successfully with ID: {bid_id}")
        else:
            print("Invalid bid ID format returned.")
    except Exception as e:
        print(f"Error in submitting bid: {e}")

    # Fetch all bids
    try:
        all_bids = fetch_all_bids(db_handler)
        if all_bids:
            print("All Bids:", all_bids)
        else:
            print("No bids found.")
    except Exception as e:
        print(f"Error fetching all bids: {e}")

    # Fetch a specific bid
    try:
        if bid_id and ObjectId.is_valid(bid_id):  # Validate bid ID before fetching
            bid = fetch_bid_by_id(bid_id, db_handler)
            if bid:  # Check if bid exists
                print(f"Specific Bid (ID: {bid_id}):", bid)
            else:
                print(f"No bid found with ID: {bid_id}")
        else:
            print("No valid bid ID available to fetch.")
    except Exception as e:
        print(f"Error fetching bid by ID: {e}")

    # Process a bid with AI (example with a mock AI model)
    class MockAIModel:
        def predict(self, data):
            # Simulate AI scoring logic (returning a static score for demo purposes)
            return 85  # Example static score

    ai_model = MockAIModel()
    try:
        if bid_id and ObjectId.is_valid(bid_id):  # Validate bid ID before processing
            processed_result = process_bid_with_ai(bid_id, ai_model, db_handler)
            print("Processed Result:", processed_result)
        else:
            print("No valid bid ID available to process with AI.")
    except Exception as e:
        print(f"Error processing bid with AI: {e}")
