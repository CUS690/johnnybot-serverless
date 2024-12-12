import requests
import json

# Define API Gateway URL for the event generation
event_api_url = "https://iil21nfeal.execute-api.us-east-1.amazonaws.com/dev/generateEvent"

# Payload for the Lambda function
event_payload = {
    "query": "I am a perspective student for St. John's University.",
    "recent_context": "Reply as Johnny Thunderbot, the AI assistant for St. John's University."
}

# Function to send a query and handle the response
def generate_event(api_url, payload):
    headers = {"Content-Type": "application/json"}
    print("Sending request to the event generation API...")

    try:
        # Send POST request
        response = requests.post(
            api_url,
            headers=headers,
            json=payload  # Send the payload directly
        )

        if response.status_code == 200:
            print("Event generated successfully.")
            print()
            # Parse the response as JSON
            try:
                event_response = response.json()
                # Extract and print specific fields
                parsed_response = event_response.get("answer", "No response content found.")
                print(parsed_response)
            except json.JSONDecodeError:
                print("Failed to parse response as JSON.")
        else:
            print(f"Failed to generate event. Status code: {response.status_code}, Response: {response.text}")
    except Exception as e:
        print("An error occurred while generating the event:", str(e))


# Run the function to generate the event and handle responses
generate_event(event_api_url, event_payload)
