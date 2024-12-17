This project is a St. John's Chatbot which is meant to be hosted online but is run serverlessly, meaning it executes only when a query is sent to the chatbot.
My team did this by creating two functions in AWS Lambda:

- The first function uses Docker to host many dependencies, this function uses an OpenAI API as well as a Google CSE (Cloud Search Engine) API which allows for retrieving real time data about St. John's University, containing information about Student Life, Financial Aid, News, Professors, Athletics, etc.

- The second function uses Flask to simplify and secure the connection between the front end and external services. It keeps the front end clean and lightweight by handling errors, security, and complex API communication in one place.

Our final component was a static front end which retains context memory of 10 chats between the User and the Bot. The front end also calls the Flask Lambda function. This front end is deployed on S3 and the whole system can be viewed on the following url: 

http://johnnybot-live.s3-website-us-east-1.amazonaws.com


If you want to duplicate this, you have to: 

Lambda Function 1:
- Create a Docker image in ECS Farget using my containerized-docker-lambda-function files. In order to work with my app.py file here, you'll need to create a .env file
specify your own API keys. You'll need the following fields: OPENAI_API_KEY Open AI, GOOGLE_API_KEY Google Cloud Platform, GOOGLE_CSE_ID Programmable Search Engine.
- Ensure you have suficient funds in your accounts to create the embeddings and to use the model (about $10 in OpenAI if you already use the platforms a lot).
- To get this specific information, create a Programmable Search Engine on Google Cloud Platform and copy the CSE ID it gives you. Do not use the entire web; just add the following three domains: *.studentaid.gov/* , *.torchonline.com/* , *.stjohns.edu/*
- Then, create an API key to use with this service through Google Cloud Platform. Add the key and search engine ID to your app.py file.
- Once this file is created, you need to push the docker image through your terminal by connecting to AWS through CLI and deploying to ECS.
- You then have to deploy this docker image in AWS Lambda.
- Once the image is deployed, you must create an HTTP API in API Gateway. You can specify a POST route request and integrate it with this function. Go to permissions in the Lambda function and give permissions to this API to invoke the function.

Lambda Function 2:
- Next, to create the Flask code that connects the Docker code to the front end, you can clone the connecting-lambda-function folder locally and input the API Gateway route url that you created in the previous step.
- Zip this file up and upload it to a new Lambda function and deploy it.
- Create another HTTP API in API Gateway. Create a new POST route and integrate it with this function. Go to permissions in the Lambda function and give permissions to this API to invoke the function.
- Since this API will be accessed through a server (local or web hosted), you must enable CORS. For general testing specify: "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"content-type", "Access-Control-Allow-Methods":"POST","OPTIONS". 

Local Testing:
- If you want to test locally, you can use clone the static-front-end locally. Input the Gateway API route url you created in the previous step into johnnybot.js instead of my team's url (which only works with my our website).
- Save the changes and run the following command: python3 -m http.server 8080
- Now open up this link in your browser: http://127.0.0.1:8080
- You should see the complete product

Web Hosting:
- If you want to deploy your application to the web, you must go to S3. Create a bucket, and upload everything that was developed locally in the last step (make sure all the files are in the correct folders).
- Once these are uploaded:
  - Disable Block Public Access in your bucket settings.
  - Add a bucket policy to allow s3:GetObject for public access
  - Save the policy, and ensure Static Website Hosting is enabled.
- Finally, you should be able to go to properties, and at the buttom of the page you will see bucket website endpoint. Click on this and you should see the project hosted on the web.

Security:
- If you plan to deploy this to the web and you want to secure your intermediary Gateway API, you must go to the API Gateway for your second Lambda function, and in the CORS that you previously set up, specify your web url for the "Access-Control-Allow-Origin".
