// controllers/subscriptionController.js
const { SubscribeCommand, UnsubscribeCommand } = require("@aws-sdk/client-sns");
const snsClient = require("../config/awsConfig"); // Import the SNS client
const catchAsync = require("../utils/catchAsync");

// Subscribe to SNS Topic
const subscribeToTopic = catchAsync(async (req, res, next) => {
  try {
    const { protocol, endpoint } = req.body; // e.g., 'email', 'sms', 'application'

    if (!protocol || !endpoint) {
      return res.status(400).json({
        status: "fail",
        message: "Protocol and endpoint are required.",
      });
    }

    // Define supported protocols
    const supportedProtocols = ["email", "sms", "application"];
    if (!supportedProtocols.includes(protocol)) {
      return res.status(400).json({
        status: "fail",
        message: `Unsupported protocol. Supported protocols are: ${supportedProtocols.join(
          ", "
        )}`,
      });
    }

    const params = {
      Protocol: protocol.toLowerCase(), // 'email', 'sms', 'application'
      TopicArn: process.env.SNS_TOPIC_ARN,
      Endpoint: endpoint, // Email address, phone number, or application endpoint
    };

    const command = new SubscribeCommand(params);
    const response = await snsClient.send(command);

    res.status(200).json({
      status: "success",
      message: `Subscription request sent to ${endpoint}. Please confirm to start receiving notifications.`,
      data: response, // Contains SubscriptionArn
    });
  } catch (error) {
    console.error("Error subscribing to SNS topic:", error);
    next(error); // Pass error to the global error handler
  }
});

// Unsubscribe from SNS Topic
const unsubscribeFromTopic = catchAsync(async (req, res, next) => {
  try {
    const { subscriptionArn } = req.body; // The ARN of the subscription to unsubscribe

    if (!subscriptionArn) {
      return res.status(400).json({
        status: "fail",
        message: "Subscription ARN is required.",
      });
    }

    const params = {
      SubscriptionArn: subscriptionArn,
    };

    const command = new UnsubscribeCommand(params);
    const response = await snsClient.send(command);

    res.status(200).json({
      status: "success",
      message: "Unsubscribed successfully!",
      data: response,
    });
  } catch (error) {
    console.error("Error unsubscribing from SNS topic:", error);
    next(error); // Pass error to the global error handler
  }
});

module.exports = {
  subscribeToTopic,
  unsubscribeFromTopic,
};
