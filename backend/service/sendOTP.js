const nodemailer = require('nodemailer');
require('dotenv').config();
const speakeasy = require('speakeasy');
const OtpModel = require('../models/otpModel');

const service = process.env;
async function sendMailOTP(email, resetUrl, req) {
  // generate otp secrete
  var secret = speakeasy.generateSecret({ length: 20 });
  console.log(secret.base32);

  // store in session
  req.session.user_otp_auth = secret.base32;
  console.log(req.session);

  //   const storeSecrete = await OtpModel.create({
  //     email: email,
  //     tow_factor_secret: secret.base32,
  //   });
  //   TODO:validate
  // Generate a time-based token based on the base-32 key.

  var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    time: 60,
  });

  let transporter = nodemailer.createTransport({
    secure: true,
    host: service.EMAIL_HOST,
    port: service.EMAIL_PORT,
    auth: {
      user: service.EMAIL_SERVER_USERNAME,
      pass: service.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  console.log('-----------iiii-------------------');

  const mailOptions = {
    from: process.env.EMAIL_SERVER_USERNAME,
    to: email,
    subject: 'OTP Authentication',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP</title>
    </head>
    <body>
        <p>To authenticate,Please use the following One Time Password (OTP):</p>
        <h2>${token}</h2>
    </body>`,
  };

  const isSent = await transporter.sendMail(mailOptions);
  console.log('------------------------------');
  console.log(isSent);
}

module.exports = { sendMailOTP };
