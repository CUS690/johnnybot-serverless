import os
import uuid
import json
from googleapiclient.discovery import build
from langchain.chat_models import ChatOpenAI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#Input all of your own keys and information
os.environ["OPENAI_API_KEY"] = ""
os.environ["GOOGLE_API_KEY"] = ""
os.environ["GOOGLE_CSE_ID"] = ""

# Custom Google Search Wrapper
class CustomGoogleSearch:
    def __init__(self, api_key, cse_id):
        self.api_key = api_key
        self.cse_id = cse_id

    def search(self, query, num_results=2):
        """Searches Google Custom Search Engine for the query."""
        logger.info(f"Performing Google Search for query: {query}")
        try:
            service = build("customsearch", "v1", developerKey=self.api_key)
            result = service.cse().list(q=query, cx=self.cse_id, num=num_results).execute()
            logger.info(f"Google Search results: {result}")
            return [
                {
                    "title": item.get("title"),
                    "snippet": item.get("snippet"),
                    "link": item.get("link")
                }
                for item in result.get("items", [])
            ]
        except Exception as e:
            logger.error(f"Error during Google Search: {e}")
            return []

# Initialize the ChatOpenAI model
llm = ChatOpenAI(
    openai_api_key=os.environ["OPENAI_API_KEY"],
    model_name='gpt-3.5-turbo',
    temperature=0.2
)

# Initialize the Google Search wrapper
google_search = CustomGoogleSearch(
    api_key=os.environ["GOOGLE_API_KEY"],
    cse_id=os.environ["GOOGLE_CSE_ID"]
)

def google_search_query(question, num_results=2):
    """Use Google Custom Search API to find information."""
    logger.info(f"Executing Google search query: {question}")
    try:
        search_results = google_search.search(question, num_results=num_results)
        if not search_results:
            logger.warning("No relevant results were found from Google Search.")
            return "No relevant results were found."
        return search_results
    except Exception as e:
        logger.error(f"Error during Google Search query execution: {e}")
        return []

def conversational_rag(question, recent_context):
    """
    Handles a conversational query using Google Search for retrieval.
    - Accepts recent_context and query directly.
    """
    logger.info(f"Processing question: {question}")

    # Perform Google Search
    google_results = google_search_query(question, num_results=2)
    if isinstance(google_results, str):  # Handle case with no results
        search_results_text = "No relevant results were found."
        formatted_links = ""
    else:
        # Process and format Google Search results
        search_results = [
            f"{result['title']}: {result['snippet']}"
            for result in google_results
        ]
        search_results_text = "\n\n".join(search_results)
        
        # Format links separately
        formatted_links = "\n".join(
            [f"{i + 1}. {result['link']}" for i, result in enumerate(google_results)]
        )

    logger.debug(f"Formatted search results:\n{search_results_text}")

    # Generate a response using LangChain
    try:
        llm_input = (
            f"You are Johnny Bot, a friendly and intelligent assistant. The following is a recent conversation:\n\n"
            f"{recent_context}\n\n"
            f"Additional information retrieved from the web:\n\n"
            f"{search_results_text}\n\n"
            f"Given the context of the conversation and the retrieved information, answer the user's latest question accurately, concisely, and in great detail:\n\n"
            f"Question: {question}\n\n"
            f"Provide a highly descriptive, clear, factual, and friendly response."
        )
        logger.debug(f"LLM input:\n{llm_input}")
        response_content = llm.predict(llm_input)
        logger.info(f"Generated response: {response_content}")

        # Combine response and links
        formatted_response = (
            f"{response_content}\n\n"
            f"**Links:**\n{formatted_links}"
        )

    except Exception as e:
        logger.error(f"An error occurred while generating the response: {e}")
        formatted_response = (
            "Sorry, I encountered an issue while processing your request. Please try again later.\n\n"
            f"**Links:**\n{formatted_links if google_results else 'No links available.'}"
        )

    return {
        'answer': formatted_response
    }

def lambda_handler(event, context):
    """AWS Lambda handler for processing user queries."""
    try:
        # Log and print the raw incoming payload
        raw_payload = json.dumps(event, indent=4) if isinstance(event, dict) else str(event)
        logger.info(f"Raw incoming event payload:\n{raw_payload}")
        print(f"Raw incoming event payload:\n{raw_payload}")  # Print the payload for visibility

        # Extract query and recent_context from the event
        query = event.get("query")
        recent_context = event.get("recent_context")

        if not query or not recent_context:
            error_message = "Both 'query' and 'recent_context' must be provided in the event payload."
            logger.error(error_message)
            print(error_message)  # Print the error for visibility
            return {
                "error": "Missing required fields. Please include 'query' and 'recent_context' in the payload."
            }

        # Process the request with conversational_rag
        response = conversational_rag(query, recent_context)

        # Log and print the generated response
        logger.info(f"Generated Response:\n{json.dumps(response, indent=4)}")
        print(f"Generated Response:\n{json.dumps(response, indent=4)}")  # Print the response for visibility

        return response

    except Exception as e:
        error_message = f"Unexpected error occurred: {e}"
        logger.error(error_message)
        print(error_message)  # Print the error for visibility
        return {"error": str(e)}
