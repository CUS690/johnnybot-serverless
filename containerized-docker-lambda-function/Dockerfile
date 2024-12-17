# Base image for AWS Lambda Python runtime
FROM public.ecr.aws/lambda/python:3.8

# Install system dependencies
RUN yum -y install gcc gcc-c++ make

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application code
COPY app.py /var/task/

# Set the Lambda handler
CMD ["app.lambda_handler"]
