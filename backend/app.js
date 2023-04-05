const express = require('express');
require('dotenv').config();
const app = express();
const cookiePasser = require('cookie-parser');
const routes = require('./api');
const { connectDb } = require('./db/connect');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./db/connect');
const PORT = process.env.PORT || 4000;
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
// require('./service/flutterwaveConfig');

// store config

const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 60 * 60 * 60 * 1000, // 1 hr
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hr
    httpOnly: true,
    secure: true,
  },
});

// middle wares

app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    res.status(500).send({
      success: false,
      payload:
        'An Error occurred while uploading file. please wait for a few seconds and  try again',
    });
    // res.status(500).send('Multer error: ' + err.message);
  } else if (err) {
    // An unknown error occurred
    res.status(500).send('Unknown error: ' + err.message);
  } else {
    // No error occurred
    next();
  }
});
app.use(cors());
app.use(cookiePasser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// application route
app.use('/api/v1', routes);
// error handler middleware
app.use(errorHandler);
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
