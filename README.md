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
     - Add these domains to your CSE:  
       `*.studentaid.gov/*`, `*.torchonline.com/*`, `*.stjohns.edu/*`

2. **Push the Docker Image**  
   - Authenticate AWS CLI and push the image to **Amazon ECR**.  
   - Deploy the image in **AWS Lambda**.

3. **Create an API Gateway**  
   - Set up a **POST route** in HTTP API Gateway and integrate it with the Lambda function.  
   - Update Lambda permissions to allow API Gateway to invoke it.

---

### 2. Lambda Function 2  
1. **Flask Code**  
   - Clone the `connecting-lambda-function` folder.  
   - Replace the `API Gateway URL` in your code.

2. **Upload to Lambda**  
   - Zip the project folder and upload it to a new **Lambda function**.  
   - Deploy and set up an HTTP API Gateway with a **POST route**.

3. **Enable CORS**  
   - Set the following CORS headers for testing:  
     ```json
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Headers": "content-type",
     "Access-Control-Allow-Methods": "POST, OPTIONS"
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
Follow these steps to replicate the project locally or deploy it to the web. Let me know if you encounter any issues! 🚀
