const axios = require('axios'); // Assuming you have axios installed (npm install axios)

// Define API Gateway URL for the event generation
const eventApiUrl = "https://iil21nfeal.execute-api.us-east-1.amazonaws.com/dev/generateEvent";

// Payload for the Lambda function
const eventPayload = {
  query: "Who is the dean of The college of professional studies?",
  recent_context: "Assistant: Today is 12/12/2024. Make sure as best as you can that all information is as recent as it can be. You are a chatbot assistant for St.John's University, make sure to be polite and first assume that all queries are about the university unless otherwise specified."
};

// Function to send a query and handle the response
async function generateEvent(apiUrl, payload) {
  const headers = { "Content-Type": "application/json" };

  try {
    // Send POST request using axios
    const response = await axios.post(apiUrl, payload, { headers });

    if (response.status === 200) {
      // Parse the response as JSON
      try {
        const eventResponse = response.data;
        console.log(eventResponse);
        // Extract and return specific field
        const parsedResponse = eventResponse.answer || "No response content found.";
        return parsedResponse;
      } catch (error) {
        console.error("Failed to parse response as JSON:", error);
      }
    } else {
      console.error(`Failed to generate event. Status code: ${response.status}, Response: ${response.data}`);
    }
  } catch (error) {
    console.error("An error occurred while generating the event:", error);
  }
}

// Run the function to generate the event and handle responses
generateEvent(eventApiUrl, eventPayload)
  .then(response => console.log(response)) // Handle successful response
  .catch(error => console.error(error)); // Handle errors