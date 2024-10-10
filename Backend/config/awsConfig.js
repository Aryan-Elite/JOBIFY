// config/awsConfig.js
const { SNSClient } = require("@aws-sdk/client-sns");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize SNS Client
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = snsClient;
