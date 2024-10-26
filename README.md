# Jobify - Job-Seeking Platform

### Project Overview
**Jobify** is an advanced job-seeking platform designed to streamline the job search experience, connecting job seekers with tailored job opportunities. The platform offers powerful search and filtering options, real-time notifications, email updates, and reminders for saved jobs nearing expiration. Additional features include web scraping for viweing previous year questions asked in the company and user-friendly profiles for tracking job applications.

---

### Features
- **Search and Filter Jobs**  
   Users can search for jobs by title, company, location, and apply advanced filters like pay range, posting date, job type, and experience level.

- **Real-Time Notifications**  
   Sends real-time notifications using AWS SNS to users with relevant skills whenever matching jobs are posted.

- **'Save for Later' Reminders**  
   A scheduler feature automatically reminds users to review saved jobs as they near expiration.

- **Web Scraping for Job Data**  
   Aggregates job postings from various sources using Cheerio, giving users a broader range of options.

- **Email Notifications**  
   Sends confirmation emails for job applications and acknowledgemnt using Nodemailer.

- **User Profiles**  
   Allows users to create and manage profiles with skills, job preferences, and application history.

---

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React (developed by frontend team)
- **Hosting & Deployment**:  
   - AWS Elastic Beanstalk for application hosting  
   - AWS SNS for notifications  
   - AWS S3 for storage  
- **Other Tools**:  
   - Node-cron for scheduling tasks  
   - Cheerio for web scraping  
   - Nodemailer for email notifications  
   - RESTful APIs for backend communication  

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan-Elite/Jobify.git
