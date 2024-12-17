from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
CORS(app)

# Lambda-compatible handler
def lambda_handler(event, context):
    from werkzeug.serving import run_simple
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.config['DEBUG'] = True
    return run_simple("127.0.0.1", 5000, app)

# Define your API Gateway URL
event_api_url = "https://iil21nfeal.execute-api.us-east-1.amazonaws.com/dev/generateEvent"

@app.route("/query", methods=["POST"])
def query():
    data = request.get_json()
    if not data or "query" not in data:
        return jsonify({"error": "Invalid request. 'query' field is required."}), 400

    payload = {
        "query": data["query"],
        "recent_context": data.get("recent_context", "")
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(event_api_url, json=payload, headers=headers)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to fetch response from Lambda."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Test the app locally
if __name__ == "__main__":
    app.run(debug=True)
