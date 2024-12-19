# Johnny Thunderbot  

**Johnny Thunderbot** is a St. John's University chatbot that runs serverlessly, executing only when a query is sent. It retrieves real-time information about **Student Life**, **Financial Aid**, **News**, **Professors**, and **Athletics**.

## Architecture Overview  
- **Lambda Function 1**: Docker-based, integrates with OpenAI API and Google Cloud Search Engine (CSE) for real-time data.  
- **Lambda Function 2**: Flask-based, simplifies and secures the connection between the frontend and external services.  
- **Static Frontend**: Deployed on S3, retains context memory of 10 chats and calls the Flask Lambda function.  

### Live Demo  
View the chatbot here:  
[**Johnnybot Live**](http://johnnybot-live.s3-website-us-east-1.amazonaws.com)

---

## Setup  

### 1. Lambda Function 1  

1. **Create a Docker Image**  
   - Clone the `containerized-docker-lambda-function` folder.  
   - Create a `.env` file with the following fields:  
     ```plaintext
     OPENAI_API_KEY=<Your_OpenAI_API_Key>
     GOOGLE_API_KEY=<Your_Google_API_Key>
     GOOGLE_CSE_ID=<Your_Google_CSE_ID>
     ```  
   - [Get OpenAI API Key](https://platform.openai.com/docs/overview)  
   - [Google API & CSE Setup](https://console.cloud.google.com/)  
     - To retrieve specific information, create a **Programmable Search Engine** on Google Cloud Platform.  
     - Copy the **CSE ID** it generates.  
     - Add the following three domains to restrict the search scope:  
       - `*.studentaid.gov/*`  
       - `*.torchonline.com/*`  
       - `*.stjohns.edu/*`  

2. **Push the Docker Image**  
   - Ensure you have sufficient funds in your accounts to generate embeddings and use the OpenAI model (about $10 if already active).  
   - Authenticate your AWS CLI:  
     ```bash
     aws configure
     ```  
   - Build the Docker image locally:  
     ```bash
     docker build -t your-docker-image-name .
     ```  
   - Tag and push the image to **Amazon ECR**:  
     ```bash
     aws ecr create-repository --repository-name your-repository-name  
     docker tag your-docker-image-name:latest <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/your-repository-name  
     docker push <aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/your-repository-name
     ```  

3. **Deploy the Docker Image in AWS Lambda**  
   - Go to the AWS Lambda console.  
   - Create a new Lambda function and select **Container Image** as the source.  
   - Link the image from **Amazon ECR**.

4. **Create an API Gateway**  
   - Go to **API Gateway** in the AWS Console.  
   - Create a new HTTP API.  
   - Set up a **POST route** (e.g., `/query`) and integrate it with the Docker-based Lambda function.  
   - Update the Lambda permissions to allow API Gateway to invoke the function:  
     - Add the **AmazonAPIGatewayInvokeFullAccess** policy to the Lambda’s IAM role.  

---

### 2. Lambda Function 2  

1. **Flask Code**  
   - Clone the `connecting-lambda-function` folder.  
   - Open the file where the connection is defined, typically `app.py`.  
   - Replace the placeholder `API Gateway URL` with the URL for the **POST route** created in the previous step for Lambda Function 1.

2. **Package and Upload to AWS Lambda**  
   - Zip the contents of the `connecting-lambda-function` folder:  
     ```bash
     zip -r lambda_function.zip .
     ```  
   - Go to the **AWS Lambda Console** and create a new function:  
     - Choose **Author from Scratch**.  
     - Select **Python** as the runtime.  
   - Upload the `lambda_function.zip` file to the function.  
   - Ensure the entry point matches your code (e.g., `app.lambda_handler` if your handler is defined in `app.py`).

3. **Set Up API Gateway Integration**  
   - Go to the **API Gateway Console**.  
   - Create another **HTTP API** (separate from the one for Lambda Function 1).  
   - Add a **POST route** (e.g., `/flask-connect`) and integrate it with this Lambda function.  
   - Deploy the API to generate an endpoint URL.  
   - Update the Lambda function’s **execution role** to grant permissions for API Gateway to invoke it.  

4. **Enable CORS (Cross-Origin Resource Sharing)**  
   - Since this Lambda will be accessed by a server (local or web-hosted), configure CORS in API Gateway:  
     - Go to the **CORS settings** in API Gateway.  
     - Set the following headers for general testing:  
       ```json
       {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "content-type",
         "Access-Control-Allow-Methods": "POST, OPTIONS"
       }
       ```  
   - **Note:** In production, replace `"*"` with your specific web URL to improve security.

5. **Test the API Gateway Endpoint**  
   - Use tools like **Postman** or `curl` to test the endpoint and ensure it connects properly to the Flask Lambda function:  
     ```bash
     curl -X POST -H "Content-Type: application/json" \
     -d '{"message": "Test"}' \
     https://your-api-gateway-url.com/flask-connect
     ```  

---

### 3. Local Testing  
1. Clone the `static-front-end` folder.  
2. Replace the API Gateway URL in `johnnybot.js` with your own.  
3. Run the following command to start a local server:  
   ```bash
   python3 -m http.server 8080
4. Open the browser at: [http://127.0.0.1:8080](http://127.0.0.1:8080).

---

### 4. Web Hosting  
1. Go to **Amazon S3** and create a bucket.  
2. Upload all frontend files (ensure folder structure is correct).  
3. Configure bucket settings:  
   - Disable **Block Public Access**.  
   - Add the following bucket policy:  
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::your-bucket-name/*"
             }
         ]
     }
     ```
4. Enable **Static Website Hosting**.  
5. Access the **Bucket Website Endpoint** in the S3 properties tab.

---

## Security  
- Update the `CORS` configuration for the API Gateway (Lambda Function 2):  
   ```json
   "Access-Control-Allow-Origin": "<Your_Web_URL>"
- Avoid using `*` in production for security reasons.

---

## Tools and Services Used  
- **AWS Lambda**  
- **Amazon ECR**  
- **API Gateway**  
- **Google Cloud Search Engine**  
- **OpenAI API**  
- **S3 Static Website Hosting**  

---

## Final Notes  
Follow these steps to replicate the project locally or deploy it to the web. Good luck!
