# Jobify - Job-Seeking Platform

### Project Overview
**Jobify** is an advanced job-seeking platform designed to streamline the job search experience, connecting job seekers with tailored job opportunities. The platform offers powerful search and filtering options, real-time notifications, email updates, and reminders for saved jobs nearing expiration. Additional features include web scraping for viewing previous year questions asked in the company and user-friendly profiles for tracking job applications.

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
### API Endpoints

#### User Routes
- **Register User**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/users/register`
  - **Description**: Registers a new user and initiates two-factor authentication (2FA) setup.
  
- **Verify 2FA**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/users/verify-2fa`
  - **Description**: Confirms the 2FA code immediately after user registration.
  
- **Login**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/users/login`
  - **Description**: Authenticates the user and initiates 2FA if enabled.
  
- **Validate 2FA**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/users/validate-2fa`
  - **Description**: Validates 2FA code after login.
  
- **Logout**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/users/logout`
  - **Description**: Logs out the authenticated user.
  
- **Get User Profile**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/users/getuser`
  - **Description**: Retrieves the authenticated user's profile.

#### Subscription Routes
- **Subscribe to Notifications**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/subscription/subscribe`
  - **Description**: Subscribes an authenticated user to a job notifications topic.
  
- **Unsubscribe from Notifications**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/subscription/unsubscribe`
  - **Description**: Unsubscribes an authenticated user from a job notifications topic.

#### Paper Routes (Web Scraping)
- **Scrape and Save Papers**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/papers/Accenture/papers`
  - **Description**: Scrapes and saves previous years' papers for Accenture.

#### Job Routes
- **Get All Jobs**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/getall`
  - **Description**: Retrieves a list of all available job postings.
  
- **Search Jobs**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/searchJobs`
  - **Description**: Searches for jobs based on specific criteria such as title, company, location, and more.
  
- **Post Job**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/post`
  - **Description**: Allows an authenticated user to post a new job listing.
  
- **Get My Jobs**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/getmyjobs`
  - **Description**: Retrieves job postings by the authenticated user.
  
- **Update Job**
  - **Method**: `PATCH`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/update/:id`
  - **Description**: Updates an existing job listing by its ID for authenticated users.
  
- **Delete Job**
  - **Method**: `DELETE`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/delete/:id`
  - **Description**: Deletes a job listing by its ID for authenticated users.
  
- **Get Single Job**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/jobs/:id`
  - **Description**: Retrieves details of a single job posting by its ID.

#### Application Routes
- **Post Application**
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:4000/api/v1/application/post`
  - **Description**: Allows an authenticated user to apply for a job.
  
- **Employer Get All Applications**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/application/employer/getall`
  - **Description**: Retrieves all applications for jobs posted by the employer.
  
- **Jobseeker Get All Applications**
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:4000/api/v1/application/jobseeker/getall`
  - **Description**: Retrieves all applications submitted by the authenticated jobseeker.
  
- **Delete Application**
  - **Method**: `DELETE`
  - **Endpoint**: `http://localhost:4000/api/v1/application/delete/:id`
  - **Description**: Allows an authenticated jobseeker to delete a submitted application.

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aryan-Elite/Jobify.git
