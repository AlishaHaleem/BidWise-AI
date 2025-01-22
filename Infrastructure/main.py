from mongodb_operations import submit_bid_to_mongo, fetch_all_bids, fetch_bid_by_id, process_bid_with_ai
from utils import load_env_variable
# Sample usage
if __name__ == "__main__":
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
            "regulatory_compliance": True
        },
        "proposal": "Fiber Optic Network Plan..."
    }

    # Submit the bid
    try:
        result = submit_bid_to_mongo(sample_bid)
        print(f"Bid submitted successfully: {result}")
    except Exception as e:
        print(f"Error in submitting bid: {e}")

    # Fetch all bids
    try:
        all_bids = fetch_all_bids()
        print("All Bids:", all_bids)
    except Exception as e:
        print(f"Error fetching all bids: {e}")

    # Fetch a specific bid
    bid_id = "BID-2025-234"  # Replace with a valid ID from your database
    try:
        bid = fetch_bid_by_id(bid_id)
        if bid:  # Check if bid exists
            print(f"Specific Bid (ID: {bid_id}):", bid)
        else:
            print(f"No bid found with ID: {bid_id}")
    except Exception as e:
        print(f"Error fetching bid by ID: {e}")

    # Process a bid with AI (example with a mock AI model)
    class MockAIModel:
        def predict(self, data):
            # Simulate AI scoring logic
            return 85  # Example static score

    ai_model = MockAIModel()
    try:
        processed_result = process_bid_with_ai(bid_id, ai_model)
        print("Processed Result:", processed_result)
    except Exception as e:
        print(f"Error processing bid with AI: {e}")
