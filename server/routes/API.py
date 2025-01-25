from flask import jsonify, Blueprint, request
from services.mongodb import MongoDbOperations
from models import Project, Bid, TrafficData, ProjectProgress

api_routes = Blueprint("api", __name__)

@api_routes.route("/projects", methods=["GET"])
def get_projects():
    try:
        db = MongoDbOperations("projects")
        projects = db.get_all(Project)
        return jsonify([project.dict() for project in projects]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
