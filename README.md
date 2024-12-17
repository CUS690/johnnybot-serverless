This project is a St. John's Chatbot which is meant to be hosted online but is run serverlessly, meaning it executes only when a query is sent to the chatbot.
My team did this by creating two functions in AWS Lambda:

- The first function uses Docker to host many dependencies, this function uses an OpenAI API as well as a Google CSE (Cloud Search Engine) API which allows for retrieving real time data about St. John's University, containing information about Student Life, Financial Aid, News, Professors, Athletics, etc.

- The second function uses Flask to simplify and secure the connection between the front end and external services. It keeps the front end clean and lightweight by handling errors, security, and complex API communication in one place.

Our final component was a static front end which retains context memory of 10 chats between the User and the Bot. The front end also calls the Flask Lambda function. This front end is deployed on S3 and the whole system can be viewed on the following url: 

http://johnnybot-live.s3-website-us-east-1.amazonaws.com
