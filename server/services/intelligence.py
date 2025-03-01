import json
import os
import logging
from datetime import datetime
from typing import List, Dict, Any
from agents.ai_engines import AiEngines
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from services.mongodb import MongoDbOperations
from models import Bid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BidAnalyzer:
    def __init__(self, api_key: str = None):
        self.llm = AiEngines.groq_api()
        self.output_parser = JsonOutputParser()
        self.db = MongoDbOperations()
        self.db.collection_name = "ai_insights"

    def generate_bid_insights(self, bid_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive AI insights for a given bid

        Args:
            bid_data (Dict): Single bid data dictionary

        Returns:
            Dict: Comprehensive AI-generated insights
        """
        try:
            # Create a prompt template for AI analysis
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert bid analyst for a UNICEF school connectivity project. 
                Carefully analyze the following bid details and generate a comprehensive JSON report 
                that provides strategic insights, technical evaluation, and recommendations.

                Key areas to focus:
                - Detailed technical capabilities assessment
                - Financial analysis and cost-effectiveness
                - Risk evaluation
                - Strategic recommendations
                - Compliance and certification review

                Ensure the output is a structured JSON matching the specified schema."""),
                ("human", "Bid Details: {bid_data}")
            ])

            # Create the chain
            chain = prompt | self.llm | self.output_parser

            # Generate insights with additional context
            insights = chain.invoke({
                "bid_data": json.dumps(bid_data)
            })

            logger.info(f"Insights..... {insights}")

            # Ensure insights is a dictionary
            if not isinstance(insights, dict):
                insights = {}

            # Inject additional metadata
            insights['project_id'] = bid_data.get('project_id', 'UNKNOWN')
            insights['bidder_id'] = bid_data.get('bidder_id', 'UNKNOWN')
            insights['bid_id'] = bid_data.get('bid_id', 'UNKNOWN')

            return insights

        except Exception as e:
            logger.error(f"Error generating insights for bid {bid_data.get('bid_id', 'UNKNOWN')}: {e}")
            return {
                'project_id': bid_data.get('project_id', 'UNKNOWN'),
                'bidder_id': bid_data.get('bidder_id', 'UNKNOWN'),
                'bid_id': bid_data.get('bid_id', 'UNKNOWN'),
                'error': str(e)
            }

    def analyze_all_bids(self, bids: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Analyze all bids in the provided list

        Args:
            bids (List[Dict]): List of bid dictionaries

        Returns:
            List[Dict]: List of AI-generated bid insights
        """
        return [self.generate_bid_insights(bid) for bid in bids]


def load_bids(file_path: str) -> List[Bid]:
    """
    Load bids from a JSON file

    Args:
        file_path (str): Path to the JSON file containing bids

    Returns:
        List[Bid]: List of bid instances
    """
    with open(file_path, 'r') as f:
        bids_data = json.load(f)
    return [Bid(**bid) for bid in bids_data]


def analyze_bid_with_groq(bid_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Example function that calls your ChatGroq chain
    to produce a JSON with an 'aiScore' key (and other analysis if desired).
    """

    # 1. Initialize your AI LLM (ChatGroq) from AiEngines
    llm = AiEngines.groq_api()

    # 2. Build your prompt
    # For instance, you can use a simple string or your custom chain.
    system_prompt = """You are an AI specialized in analyzing connectivity project bids.
    Output a JSON with an integer 'aiScore' key, rating cost-effectiveness, coverage, and quality.
    Example:
    {
      "aiScore": 85,
      "analysis": "..."
    }
    """

    user_prompt = f"Bid Details: {json.dumps(bid_data)}"

    # 3. Call the LLM - a minimal example (no advanced chain or JSON parser)
    # You can integrate your existing chain if you prefer.
    response = llm.invoke(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    logger.info("Raw AI Response: %s", response)

    # 4. Attempt to parse out the JSON
    # We'll do a naive approach: find a JSON block in the response
    # If your chain is well-structured, you can parse it more elegantly.
    # Or you can use your existing "JsonOutputParser" from your code.
    analysis = {}
    try:
        # If response is raw text, we do a simple parse.
        # For a robust approach, see your existing 'JsonOutputParser'.
        analysis = json.loads(response)
    except Exception as e:
        logger.error("Failed to parse AI response as JSON: %s", e)
        # fallback to a default
        analysis = {"aiScore": 60, "analysis": "Default fallback score."}

    # Ensure we have an integer aiScore
    if not isinstance(analysis.get("aiScore"), int):
        logger.warning("No valid 'aiScore' found; defaulting to 70.")
        analysis["aiScore"] = 70

    return analysis


def main():
    # Path to your bid data file
    bid_file_path = 'sample.json'  # Use the filename from the logs

    # Load bids
    bids = load_bids(bid_file_path)

    logger.info(f"Loaded {len(bids)} bids from {bid_file_path}")

    # Initialize analyzer (ensure you have GROQ_API_KEY set in environment)
    analyzer = BidAnalyzer()

    # Analyze all bids
    bid_insights = analyzer.analyze_all_bids([bid.dict() for bid in bids])

    # Save insights to MongoDB
    for bid_insight in bid_insights:
        analyzer.db.store_data(bid_insight)

    # Save insights to a file
    # output_file = f'bid_insights_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
    # with open(output_file, 'w') as f:
    #     json.dump(bid_insights, f, indent=2)
    #
    # logger.info(f"Bid analysis completed. Insights saved to {output_file}")


if __name__ == "__main__":
    main()