const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const cors= require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoute');
const jobRouter = require('./routes/jobRoute');
const applicationRouter = require('./routes/applicationRoute');
const { ErrorHandler, handleErrors } = require('./controllers/errorController');
 // Adjust the path accordingly
// app.use(
//     cors({
//       origin: [process.env.FRONTEND_URL],
//       method: ["GET", "POST", "DELETE", "PUT"],
//       credentials: true,
//     })
//   );

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // to parse the data into json coming from frontend which is of other types

  // 3) ROUTES 
app.use('/api/v1/user',userRouter);
app.use('/api/v1/job',jobRouter);
app.use('/api/v1/application',applicationRouter);
  // Global error handling middleware
// app.use(ErrorHandler);
module.exports=app;