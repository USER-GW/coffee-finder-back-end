const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

//Models
const coffeeDataModel = require('./models/coffee-data');

//Routers
const coffeeDataRouter = require('./controllers/coffee-data');
const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/users');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });

app.use(express.json());
app.use(logger('dev'));
app.use(cors());


//Routes
// app.use(cors({ origin: 'http://localhost:5173' }));

const allowedOrigins = [
  // 'http://localhost:5173', 
  'https://nooksandbrews.com', // live frontend
  // 'https://coffee-finder-front-3bqh89hh8-georgina-walkers-projects.vercel.app/' // Vercel preview URL 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use ("/users", userRouter)
app.use("/", coffeeDataRouter);
app.use("/auth", authRouter);

// app.use("/account", userRouter);




app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

