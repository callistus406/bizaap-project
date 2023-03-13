const express = require('express');
require('dotenv').config();
const app = express();
const cookiePasser = require('cookie-parser');
const routes = require('./api');
const {connectDb} = require("./db/connect")
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 4000;

// middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", routes);


const startApp = async () => {
    try {
        await connectDb();
      app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // application entry point
  
  startApp();