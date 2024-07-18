const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const cors= require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoute');
const jobRouter = require('./routes/jobRoute');
const applicationRouter = require('./routes/applicationRoute');
const globalErrorHandler= require('./controllers/errorController');
// app.use(
//     cors({
//       origin: [process.env.FRONTEND_URL],
//       method: ["GET", "POST", "DELETE", "PUT"],
//       credentials: true,
//     })
//   );

  // 3) ROUTES
app.use('/api/v1/user',userRouter);
app.use('/api/v1/job',jobRouter);
app.use('/api/v1/application',applicationRouter);
 //USED different middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Global error handling middleware
app.use(globalErrorHandler);
module.exports=app;