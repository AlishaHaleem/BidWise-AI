from flask import jsonify, Blueprint, request
from services.mongodb import MongoDbOperations
from models import Project, Bid, TrafficData, ProjectProgress
from services.intelligence import analyze_bid_with_groq


api_routes = Blueprint("api", __name__)

@api_routes.route("/projects", methods=["POST"])
def create_project():
    """
    Create a new project document in the `projects` collection.
    Expected JSON structure: {
      "name": str,
      "status": str,
      "schools": int
    }
    """
    try:
        data = request.json or {}
        # Validate and parse with the Pydantic model
        project = Project(**data)

        db = MongoDbOperations("projects")
        db.store_data(project)  # This will insert into 'projects' collection

        return jsonify({"message": "Project created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_routes.route("/projects", methods=["GET"])
def get_projects():
    try:
        db = MongoDbOperations("projects")
        projects = db.get_all(Project)
        return jsonify([project.dict() for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_routes.route("/projects/status", methods=["PUT"])
def update_project_status():
    """
    Update the status of an existing project.
    Expects JSON: { "name": str, "newStatus": str }
    """
    try:
        data = request.json or {}
        project_name = data.get("name")
        new_status = data.get("newStatus")

        if not project_name or not new_status:
            return jsonify({"error": "Project 'name' and 'newStatus' are required"}), 400

        db = MongoDbOperations("projects")

        # Update the project using Mongo's update_one
        update_result = db.collection.update_one(
            {"name": project_name},
            {"$set": {"status": new_status}}
        )

        if update_result.matched_count == 0:
            # No project found with that name
            return jsonify({"error": "No project found with the specified name"}), 404

        return jsonify({"message": "Project status updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@api_routes.route("/bids", methods=["POST"])
def create_bid():
    """
    Create a new Bid in the 'bids' collection.
    Expects JSON:
    {
      "provider": str,
      "cost": str,
      "coverage": str,
      "project_id": str
    }
    The 'aiScore' is generated by the GROQ AI.
    """
    try:
        data = request.json or {}
        
        provider = data.get("provider")
        cost = data.get("cost")
        coverage = data.get("coverage")
        project_id = data.get("project_id")

        if not all([provider, cost, coverage, project_id]):
            return jsonify({"error": "Missing required bid fields."}), 400

        # 1. Use AI logic to get or approximate the 'aiScore'
        ai_result = analyze_bid_with_groq({
            "provider": provider,
            "cost": cost,
            "coverage": coverage,
            "project_id": project_id
        })
        ai_score = ai_result.get("aiScore", 70)  # fallback if missing

        # 2. Construct the Bid object
        new_bid = Bid(
            provider=provider,
            cost=cost,
            coverage=coverage,
            aiScore=ai_score,
            project_id=project_id,
            bidder_id="AUTO_GENERATED",
            bid_id="AUTO_BID_123"
        )

        # 3. Store in Mongo
        db = MongoDbOperations("bids")
        db.store_data(new_bid)

        # 4. Return the newly created bid
        return jsonify(new_bid.dict()), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api_routes.route("/bids", methods=["GET"])
def get_bids():
    try:
        project_id = request.args.get('project_id')
        db = MongoDbOperations("bids")
        if project_id:
            bids_data = list(db.collection.find({"project_id": project_id}, {"_id": 0}))
            bids = [Bid(**bid) for bid in bids_data]
        else:
            bids = db.get_all(Bid)
        return jsonify([bid.dict() for bid in bids]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_routes.route("/traffic-data", methods=["GET"])
def get_traffic_data():
    try:
        db = MongoDbOperations("traffic_data")
        traffic_data = db.get_all(TrafficData)
        return jsonify([data.dict() for data in traffic_data]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_routes.route("/project-progress", methods=["GET"])
def get_project_progress():
    try:
        project_name = request.args.get('project')
        db = MongoDbOperations("project_progress")
        if project_name:
            progress_data = db.collection.find_one({"project": project_name}, {"_id": 0})
            if progress_data:
                progress = ProjectProgress(**progress_data)
                return jsonify(progress.dict()), 200
            else:
                return jsonify({"error": "Project progress not found."}), 404
        else:
            progress_data = db.get_all(ProjectProgress)
            return jsonify([progress.dict() for progress in progress_data]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
