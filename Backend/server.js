const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080; // Elastic Beanstalk uses 8080 by default
const sns = require('./config/awsConfig'); // Adjust the path as needed

// Require your cron job
require('./cronJobs/cronJob'); // Adjust path to where your cron job logic is located

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

// Replace <PASSWORD> with the actual password from your environment variables
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {}).then(() => {
  console.log('DB connection established');
});

