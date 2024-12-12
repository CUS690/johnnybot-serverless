from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests

app = Flask(__name__, static_folder = "../public", static_url_path = "/")
CORS(app)

# Define API Gateway URL
event_api_url = "https://iil21nfeal.execute-api.us-east-1.amazonaws.com/dev/generateEvent"

# Serve the frontend files
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/query", methods = ["POST"])
def query():
    data = request.get_json()

    if not data or "query" not in data:
        return jsonify({"error": "Invalid request. 'query' field is required."}), 400

    # Prepare for lambda function
    payload = {
        "query": data["query"],
        "recent_context": data.get("recent_context", "")
    }

    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(event_api_url, json = payload, headers = headers)

        # log lambda response
        if response.status_code == 200:
            print("Lambda response:", response.json())
            return jsonify(response.json())
        else:
            print(f"Failed Lambda request. Status: {response.status_code}")
            return jsonify({"error": "Failed to fetch response from Lambda."}), 500
    except Exception as e:
        print("Error while calling Lambda:", e)
        return jsonify({"error": "Error during Lambda request."}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port = 8888, debug = True)