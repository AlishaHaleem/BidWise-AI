

# TODO: Init MongoDB database.

# ------------

# TODO: Add bid
import datetime


class Bidder:
    def __init__(self, name, registered, turnover, experience, references, certifications, tax_clearance, location,
                 industry_certifications):
        self.name = name
        self.registered = registered
        self.turnover = turnover
        self.experience = experience
        self.references = references
        self.certifications = certifications
        self.tax_clearance = tax_clearance
        self.location = location
        self.industry_certifications = industry_certifications
        self.bids = []  # List to store submitted bids


class Bid:
    def __init__(self, bidder_name, bid_amount):
        self.bidder_name = bidder_name
        self.bid_amount = bid_amount
        self.submission_time = datetime.datetime.now()


def check_eligibility(bidder):
    # Define minimum criteria
    MIN_TURNOVER = 500000  # Minimum annual turnover in currency units
    MIN_EXPERIENCE = 2  # Minimum years of relevant experience
    REQUIRED_CERTIFICATIONS = ["ISO 9001", "Safety Certification"]
    REQUIRED_LOCATION = "Local"  # Change based on project-specific requirements

    # Check criteria
    messages = []

    # Registration
    if not bidder.registered:
        messages.append(f"Bidder {bidder.name} is not registered.")

    # Financial Turnover
    if bidder.turnover < MIN_TURNOVER:
        messages.append(f"Bidder {bidder.name} does not meet the financial turnover requirement.")

    # Experience
    if bidder.experience < MIN_EXPERIENCE:
        messages.append(f"Bidder {bidder.name} lacks the required experience.")

    # Certifications
    missing_certs = [cert for cert in REQUIRED_CERTIFICATIONS if cert not in bidder.certifications]
    if missing_certs:
        messages.append(f"Bidder {bidder.name} is missing required certifications: {', '.join(missing_certs)}.")

    # Tax Clearance
    if not bidder.tax_clearance:
        messages.append(f"Bidder {bidder.name} does not have tax clearance.")

    # References
    if len(bidder.references) < 2:
        messages.append(f"Bidder {bidder.name} must provide at least 2 references.")

    # Location
    if bidder.location != REQUIRED_LOCATION:
        messages.append(f"Bidder {bidder.name} must have a local presence.")

    # Final Decision
    if messages:
        return f"Bidder {bidder.name} does NOT meet eligibility criteria:\n" + "\n".join(messages)
    return f"Bidder {bidder.name} meets all eligibility criteria."


def submit_bid(bidder, bid_amount):
    # Check if the bidder meets eligibility criteria
    eligibility_result = check_eligibility(bidder)
    if "NOT meet" in eligibility_result:
        return f"Bid submission failed: {eligibility_result}"

    # Create and store the bid
    new_bid = Bid(bidder_name=bidder.name, bid_amount=bid_amount)
    bidder.bids.append(new_bid)
    return f"Bid submitted successfully by {bidder.name} for amount {bid_amount}."


# Example Usage
bidder = Bidder(
    name="Tech Solutions Inc.",
    registered=True,
    turnover=600000,
    experience=3,
    references=["Client A", "Client B"],
    certifications=["ISO 9001", "Safety Certification"],
    tax_clearance=True,
    location="Local",
    industry_certifications={"Industry": "IT", "Certifications": ["Cybersecurity Certification"]}
)

# Submit a bid
bid_result = submit_bid(bidder, 120000)
print(bid_result)

# List all bids
print(f"\nBids by {bidder.name}:")
for bid in bidder.bids:
    print(f"- Amount: {bid.bid_amount}, Submitted on: {bid.submission_time}")

# TODO: Get bids
# TODO: Delete bids


# ------------
# TODO: Add bidders.


