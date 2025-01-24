import datetime
from dataclasses import dataclass
from typing import List, Optional, Literal, Dict
from datetime import datetime, timedelta
from enum import Enum
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import logging


client = MongoClient("localhost", 27017)

# Bidder Class
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

# Location Class
@dataclass
class Location:
    country: str
    region: str
    coordinates: Optional[Dict[str, float]] = None

# Service Requirements Class
@dataclass
class ServiceRequirements:
    minimum_bandwidth: float
    latency: int
    reliability: float
    service_level: Literal['basic', 'standard', 'premium']

# Cost Breakdown Class
@dataclass
class CostBreakdown:
    setup_cost: float
    monthly_recurring_cost: float
    maintenance_cost: float
    currency: str

# Contact Person Class
@dataclass
class ContactPerson:
    name: str
    email: str
    phone: str

# Previous Experience Class
@dataclass
class PreviousExperience:
    project_name: str
    description: str
    year: int
    reference_contact: Optional[ContactPerson] = None

# Bidder Info Class
@dataclass
class BidderInfo:
    company_name: str
    registration_number: str
    contact_person: ContactPerson
    previous_experience: Optional[List[PreviousExperience]] = None

# Technical Specification Class
@dataclass
class TechnicalSpecification:
    technology: str
    implementation_timeframe: int
    equipment_details: List[str]

# Compliance Details Class
@dataclass
class ComplianceDetails:
    licenses_held: List[str]
    certifications: List[str]
    regulatory_compliance: bool

# Project Phase Enum
class ProjectPhase(Enum):
    PLANNING = "planning"
    IMPLEMENTATION = "implementation"
    TESTING = "testing"
    DEPLOYMENT = "deployment"
    MAINTENANCE = "maintenance"

# Timeline Class
@dataclass
class Timeline:
    phase: ProjectPhase
    start_date: datetime
    end_date: datetime
    deliverables: List[str]
    dependencies: Optional[List[str]] = None

# Risk Assessment Class
@dataclass
class RiskAssessment:
    risk_description: str
    impact: Literal['low', 'medium', 'high']
    probability: Literal['low', 'medium', 'high']
    mitigation_strategy: str
    contingency_plan: str

# Project Team Class
@dataclass
class ProjectTeam:
    role: str
    name: str
    qualifications: List[str]
    responsibilities: List[str]
    availability: Literal['full-time', 'part-time']

# Quality Assurance Class
@dataclass
class QualityAssurance:
    testing_methodology: str
    quality_metrics: List[str]
    monitoring_tools: List[str]
    reporting_frequency: str

# Proposal Class
@dataclass
class Proposal:
    proposal_id: str
    bid_reference: str
    executive_summary: str
    company_profile: str
    project_understanding: str
    proposed_solution: str
    methodology: str
    technical_approach: str
    network_architecture: str
    security_measures: List[str]
    scalability_plan: str
    project_timeline: List[Timeline]
    team_structure: List[ProjectTeam]
    quality_assurance: QualityAssurance
    risk_assessment: List[RiskAssessment]
    maintenance_plan: str
    support_levels: Dict[str, str]
    escalation_matrix: Dict[str, ContactPerson]
    training_plan: Optional[str] = None
    documentation_deliverables: Optional[List[str]] = None
    assumptions: Optional[List[str]] = None
    constraints: Optional[List[str]] = None
    appendices: Optional[Dict[str, str]] = None

# Bid Class
@dataclass
class NetworkBid:
    bid_id: str
    project_id: str
    bidder_info: BidderInfo
    location: Location
    service_requirements: ServiceRequirements
    costs: CostBreakdown
    technical_specification: TechnicalSpecification
    compliance_details: ComplianceDetails
    proposal: Proposal
    submission_date: datetime
    valid_until: datetime
    status: Literal['draft', 'submitted', 'under_review', 'accepted', 'rejected']
    bid_score: Optional[float] = None
    feedback: Optional[str] = None

# Eligibility Check
def check_eligibility(bidder):
    MIN_TURNOVER = 500000
    MIN_EXPERIENCE = 2
    REQUIRED_CERTIFICATIONS = ["ISO 9001", "Safety Certification"]
    REQUIRED_LOCATION = "Local"

    messages = []

    if not bidder.registered:
        messages.append(f"Bidder {bidder.name} is not registered.")
    if bidder.turnover < MIN_TURNOVER:
        messages.append(f"Bidder {bidder.name} does not meet the financial turnover requirement.")
    if bidder.experience < MIN_EXPERIENCE:
        messages.append(f"Bidder {bidder.name} lacks the required experience.")
    missing_certs = [cert for cert in REQUIRED_CERTIFICATIONS if cert not in bidder.certifications]
    if missing_certs:
        messages.append(f"Bidder {bidder.name} is missing required certifications: {', '.join(missing_certs)}.")
    if not bidder.tax_clearance:
        messages.append(f"Bidder {bidder.name} does not have tax clearance.")
    if len(bidder.references) < 2:
        messages.append(f"Bidder {bidder.name} must provide at least 2 references.")
    if bidder.location != REQUIRED_LOCATION:
        messages.append(f"Bidder {bidder.name} must have a local presence.")

    if messages:
        return f"Bidder {bidder.name} does NOT meet eligibility criteria:\n" + "\n".join(messages)
    return f"Bidder {bidder.name} meets all eligibility criteria."

# Calculate Bid Score
def calculate_bid_score(bid):
    score = 0

    # Example scoring criteria
    if bid.service_requirements.service_level == 'premium':
        score += 30
    elif bid.service_requirements.service_level == 'standard':
        score += 20
    else:
        score += 10

    if bid.costs.setup_cost < 20000:
        score += 25
    else:
        score += 15

    if bid.compliance_details.regulatory_compliance:
        score += 20

    if len(bid.technical_specification.equipment_details) > 2:
        score += 25

    bid.bid_score = score
    return score

# Provide Feedback
def provide_feedback(bid, comments):
    bid.feedback = comments
    return f"Feedback for bid {bid.bid_id} added successfully."

# Submit Bid
def submit_bid(bidder, bid_id, project_id, location, service_requirements, costs, technical_specification,
               compliance_details, proposal):
    eligibility_result = check_eligibility(bidder)
    if "NOT meet" in eligibility_result:
        return f"Bid submission failed: {eligibility_result}"

    new_bid = NetworkBid(
        bid_id=bid_id,
        project_id=project_id,
        bidder_info=BidderInfo(
            company_name=bidder.name,
            registration_number="REG123",
            contact_person=ContactPerson(
                name="John Doe",
                email="john.doe@example.com",
                phone="+123456789"
            )
        ),
        location=location,
        service_requirements=service_requirements,
        costs=costs,
        technical_specification=technical_specification,
        compliance_details=compliance_details,
        proposal=proposal,
        submission_date=datetime.now(),
        valid_until=datetime.now() + timedelta(days=90),
        status="submitted"
    )

    score = calculate_bid_score(new_bid)
    feedback_comments = "Bid scored based on quality of service, cost efficiency, and compliance."
    provide_feedback(new_bid, feedback_comments)

    bidder.bids.append(new_bid)
    return f"Bid submitted successfully by {bidder.name}. Score: {score}."

# MongoDBHandler Class
class MongoDBHandler:
    def __init__(self):
        try:
            # Load .env file
            dotenv_path = "D:/persona-projects/BidWise-AI/.env"
            load_dotenv(dotenv_path=dotenv_path)

            # Get the MongoDB URI from the .env file
            connection_string = os.getenv("MONGO_URI")
            if not connection_string:
                raise ValueError("MONGO_URI is not set or is empty in the .env file")

            # Connect to MongoDB
            self.client = MongoClient(connection_string)
            self.db = self.client['bid_database']
            self.collection = self.db['bids']
            logging.info("Successfully connected to MongoDB")

        except ValueError as e:
            logging.error(f"ValueError during initialization: {str(e)}")
            raise  # Raise exception to stop the program if environment variable is missing

        except Exception as e:
            logging.error(f"Error initializing database handler: {str(e)}")
            raise  # Catch any other exception, log it, and raise it to stop the program

    def store_bid(self, bid_data):
        try:
            result = self.collection.insert_one(bid_data)
            return result.inserted_id
        except Exception as e:
            logging.error(f"Error inserting bid: {str(e)}")
            raise  # Raise exception if something goes wrong

    def get_all_bids(self):
        try:
            return list(self.collection.find())
        except Exception as e:
            logging.error(f"Error fetching all bids: {str(e)}")
            raise  # Raise exception if something goes wrong

    def get_bid_by_id(self, bid_id):
        try:
            return self.collection.find_one({'bid_id': bid_id})
        except Exception as e:
            logging.error(f"Error fetching bid by id: {str(e)}")
            raise  # Raise exception if something goes wrong

    def update_bid(self, bid_id, update_data):
        try:
            result = self.collection.update_one({'bid_id': bid_id}, {'$set': update_data})
            return result.modified_count
        except Exception as e:
            logging.error(f"Error updating bid: {str(e)}")
            raise  # Raise exception if something goes wrong


