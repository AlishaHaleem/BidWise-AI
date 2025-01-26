from flask import jsonify, Blueprint, request
from services.mongodb import MongoDbOperations
from models import Project, Bid, TrafficData, ProjectProgress

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
