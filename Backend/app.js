const express = require('express');
const port = process.env.PORT || 4000;
const app = express();
const cors= require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoute');
const jobRouter = require('./routes/jobRoute');
const paper= require('./routes/papers');
const applicationRouter = require('./routes/applicationRoute');
const { ErrorHandler, handleErrors } = require('./controllers/errorController');
const sns = require('./config/awsConfig'); // Adjust the path as needed
const subscriptionRouter = require('./routes/subscriptionRoutes');
 // Adjust the path accordingly
 app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // to parse the data into json coming from frontend which is of other types

  // 3) ROUTES 

app.use('/api/v1/user',userRouter);
app.use('/api/v1/job',jobRouter);
app.use('/api/v1/application',applicationRouter);
app.use('/api/v1/company',paper);
app.use('/api/v1/subscriptions', subscriptionRouter);
  // Global error handling middleware
// app.use(ErrorHandler);
module.exports=app;