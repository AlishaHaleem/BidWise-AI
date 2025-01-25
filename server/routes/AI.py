from flask import jsonify, Blueprint, request, send_file, send_from_directory
from services.intelligence import BidAnalyzer, load_bids



ai_routes = Blueprint("ai", __name__)

@ai_routes.route("/analyze", methods=["POST"])
def analyze_bids():
    try:
        # Expecting a JSON array of bids
        bids = request.get_json()
        if not isinstance(bids, list):
            return jsonify({"error": "Invalid bid data format"}), 400

        analyzer = BidAnalyzer()
        insights = analyzer.analyze_all_bids(bids)
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500