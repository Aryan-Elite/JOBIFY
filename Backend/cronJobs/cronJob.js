const cron = require('node-cron');
const Job = require('../models/jobModel');
const { publishJobNotification } = require('../utils/notificationService');

// Cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running cron job for job expiration checks...');

  const currentDate = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(currentDate.getDate() + 3);

  try {
    // Find jobs expiring in 3 days
    const jobsExpiringSoon = await Job.find({
      expired: false,
      $expr: {
        $lte: [
          {
            $add: ['$jobPostedOn', { $multiply: ['$timeLeftToExpire', 24 * 60 * 60 * 1000] }],
          },
          threeDaysFromNow,
        ],
      },
    }).populate('savedByUsers.userId', 'email');

    if (jobsExpiringSoon.length > 0) {
      console.log(`${jobsExpiringSoon.length} jobs expiring soon...`);

      for (const job of jobsExpiringSoon) {
        const savedUserEmails = job.savedByUsers.map(user => user.userId?.email).filter(email => email); // Use optional chaining and filter out undefined emails

        if (savedUserEmails.length > 0) {
          const message = `Reminder: The job "${job.title}" at "${job.company}" will expire in 3 days. Don't miss the opportunity!`;

          await publishJobNotification(message, savedUserEmails, 'Job Expiration Reminder');
        }
      }
    } else {
      console.log('No jobs expiring soon.');
    }

    // Mark jobs as expired if they have actually expired
    const currentTime = new Date();
    const expiredJobs = await Job.find({
      expired: false,
      $expr: {
        $lt: [
          {
            $add: ['$jobPostedOn', { $multiply: ['$timeLeftToExpire', 24 * 60 * 60 * 1000] }],
          },
          currentTime,
        ],
      },
    });

    if (expiredJobs.length > 0) {
      for (const job of expiredJobs) {
        job.expired = true;
        await job.save();
        console.log(`Marked job "${job.title}" as expired.`);
      }
    } else {
      console.log('No jobs have expired.');
    }

    console.log('Job expiration checks completed successfully.');
  } catch (error) {
    console.error('Error during job expiration checks:', error);
  }
});
