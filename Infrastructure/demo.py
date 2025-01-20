from dataclasses import dataclass
from typing import List, Optional, Literal, Dict
from datetime import datetime, timedelta
from enum import Enum


# Previous classes remain the same
@dataclass
class Location:
    country: str
    region: str
    coordinates: Optional[dict[str, float]] = None


@dataclass
class ServiceRequirements:
    minimum_bandwidth: float
    latency: int
    reliability: float
    service_level: Literal['basic', 'standard', 'premium']


@dataclass
class CostBreakdown:
    setup_cost: float
    monthly_recurring_cost: float
    maintenance_cost: float
    currency: str


@dataclass
class ContactPerson:
    name: str
    email: str
    phone: str


@dataclass
class PreviousExperience:
    project_name: str
    description: str
    year: int
    reference_contact: Optional[ContactPerson] = None


@dataclass
class BidderInfo:
    company_name: str
    registration_number: str
    contact_person: ContactPerson
    previous_experience: Optional[List[PreviousExperience]] = None


@dataclass
class TechnicalSpecification:
    technology: str
    implementation_timeframe: int
    equipment_details: List[str]


@dataclass
class ComplianceDetails:
    licenses_held: List[str]
    certifications: List[str]
    regulatory_compliance: bool


class ProjectPhase(Enum):
    PLANNING = "planning"
    IMPLEMENTATION = "implementation"
    TESTING = "testing"
    DEPLOYMENT = "deployment"
    MAINTENANCE = "maintenance"


@dataclass
class Timeline:
    phase: ProjectPhase
    start_date: datetime
    end_date: datetime
    deliverables: List[str]
    dependencies: Optional[List[str]] = None


@dataclass
class RiskAssessment:
    risk_description: str
    impact: Literal['low', 'medium', 'high']
    probability: Literal['low', 'medium', 'high']
    mitigation_strategy: str
    contingency_plan: str


@dataclass
class ProjectTeam:
    role: str
    name: str
    qualifications: List[str]
    responsibilities: List[str]
    availability: Literal['full-time', 'part-time']


@dataclass
class QualityAssurance:
    testing_methodology: str
    quality_metrics: List[str]
    monitoring_tools: List[str]
    reporting_frequency: str


@dataclass
class Proposal:
    # Basic Information
    proposal_id: str
    bid_reference: str
    executive_summary: str

    # Detailed Sections
    company_profile: str
    project_understanding: str
    proposed_solution: str
    methodology: str

    # Technical Details
    technical_approach: str
    network_architecture: str
    security_measures: List[str]
    scalability_plan: str

    # Project Management
    project_timeline: List[Timeline]
    team_structure: List[ProjectTeam]
    quality_assurance: QualityAssurance
    risk_assessment: List[RiskAssessment]

    # Support and Maintenance
    maintenance_plan: str
    support_levels: Dict[str, str]
    escalation_matrix: Dict[str, ContactPerson]

    # Training and Documentation
    training_plan: Optional[str] = None
    documentation_deliverables: Optional[List[str]] = None

    # Additional Information
    assumptions: Optional[List[str]] = None
    constraints: Optional[List[str]] = None
    appendices: Optional[Dict[str, str]] = None


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


# Example usage:
if __name__ == "__main__":
    # Create a sample timeline
    timeline_sample = [
        Timeline(
            phase=ProjectPhase.PLANNING,
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=30),
            deliverables=["Project Charter", "Detailed Project Plan"],
            dependencies=[]
        ),
        Timeline(
            phase=ProjectPhase.IMPLEMENTATION,
            start_date=datetime.now() + timedelta(days=31),
            end_date=datetime.now() + timedelta(days=60),
            deliverables=["Network Infrastructure", "Equipment Installation"],
            dependencies=["Planning Phase Completion"]
        )
    ]

    # Create a sample quality assurance plan
    qa_plan = QualityAssurance(
        testing_methodology="Agile Testing Framework",
        quality_metrics=["Network Uptime", "Latency", "Packet Loss"],
        monitoring_tools=["Nagios", "Grafana", "Prometheus"],
        reporting_frequency="Weekly"
    )

    # Create a sample proposal
    sample_proposal = Proposal(
        proposal_id="PROP-2025-001",
        bid_reference="BID-2025-001",
        executive_summary="Comprehensive network solution for connecting schools in Kenya...",
        company_profile="TechConnect Solutions is a leading provider of network infrastructure...",
        project_understanding="The GIGA project aims to connect schools to the internet...",
        proposed_solution="High-speed fiber optic network with redundant backup...",
        methodology="Agile project management methodology with weekly sprints...",
        technical_approach="Hybrid network architecture combining fiber and wireless...",
        network_architecture="Star topology with redundant paths...",
        security_measures=["Firewall", "IDS/IPS", "End-to-end encryption"],
        scalability_plan="Modular design allowing for easy expansion...",
        project_timeline=timeline_sample,
        team_structure=[
            ProjectTeam(
                role="Project Manager",
                name="John Doe",
                qualifications=["PMP", "PRINCE2"],
                responsibilities=["Overall project delivery", "Stakeholder management"],
                availability="full-time"
            )
        ],
        quality_assurance=qa_plan,
        risk_assessment=[
            RiskAssessment(
                risk_description="Weather-related installation delays",
                impact="medium",
                probability="high",
                mitigation_strategy="Include weather contingency in schedule",
                contingency_plan="Indoor work during bad weather"
            )
        ],
        maintenance_plan="24/7 monitoring with preventive maintenance...",
        support_levels={
            "Level 1": "24/7 Help Desk",
            "Level 2": "Technical Support",
            "Level 3": "Expert Engineering"
        },
        escalation_matrix={
            "Technical": ContactPerson(
                name="Jane Smith",
                email="jane.smith@techconnect.com",
                phone="+254700123456"
            )
        }
    )

    # Create the full bid with proposal
    sample_bid = NetworkBid(
        bid_id="BID-2025-001",
        project_id="GIGA-KEN-2025-01",
        bidder_info=BidderInfo(
            company_name="TechConnect Solutions",
            registration_number="TC123456",
            contact_person=ContactPerson(
                name="Jane Smith",
                email="jane.smith@techconnect.com",
                phone="+254700123456"
            )
        ),
        location=Location(
            country="Kenya",
            region="Nairobi",
            coordinates={"latitude": -1.2921, "longitude": 36.8219}
        ),
        service_requirements=ServiceRequirements(
            minimum_bandwidth=100,
            latency=50,
            reliability=99.9,
            service_level="standard"
        ),
        costs=CostBreakdown(
            setup_cost=15000,
            monthly_recurring_cost=2500,
            maintenance_cost=500,
            currency="USD"
        ),
        technical_specification=TechnicalSpecification(
            technology="Fiber",
            implementation_timeframe=45,
            equipment_details=[
                "Cisco Routers",
                "Fiber Optic Cables",
                "Network Switches"
            ]
        ),
        compliance_details=ComplianceDetails(
            licenses_held=["ISP License", "Network Operator License"],
            certifications=["ISO 27001", "ISO 9001"],
            regulatory_compliance=True
        ),
        proposal=sample_proposal,
        submission_date=datetime.fromisoformat("2025-01-20T10:00:00+00:00"),
        valid_until=datetime.fromisoformat("2025-03-20T10:00:00+00:00"),
        status="submitted"
    )