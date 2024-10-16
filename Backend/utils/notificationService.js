const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Initialize SNS client with the correct region
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

// Function to publish an SNS notification with email attributes
async function publishJobNotification(message, emails, subject = 'Job Notification') {
  if (!emails || emails.length === 0) {
    console.error('No emails provided for notification.');
    return;
  }

  try {
    const params = {
      Message: message,
      Subject: subject,
      TopicArn: process.env.SNS_TOPIC_ARN,
      MessageAttributes: {
        emails: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(emails), // Ensure emails are sent as JSON array
        },
      },
    };

    const command = new PublishCommand(params);
    const result = await snsClient.send(command);
    console.log(`Notification sent successfully! MessageId: ${result.MessageId}`);
  } catch (error) {
    console.error('Error publishing notification:', error);
  }
}

module.exports = { publishJobNotification };
