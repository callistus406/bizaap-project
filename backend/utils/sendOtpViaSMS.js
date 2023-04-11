const nodemailer = require('nodemailer');
require('dotenv').config();
const speakeasy = require('speakeasy');
const { sendSMS } = require('../service/twilioConfig');

const service = process.env;
async function sendSMSOtp(fromNumber, toNumber, req) {
  // generate otp secrete
  var secret = speakeasy.generateSecret({ length: 20 });
  console.log(secret.base32);

  // store in session
  req.session.user_otp_auth = secret.base32;

  //   const storeSecrete = await OtpModel.create({
  //     email: email,
  //     tow_factor_secret: secret.base32,
  //   });
  //   TODO:validate
  // Generate a time-based token based on the base-32 key.

  var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    time: 120,
  });

  const isSent = sendSMS(
    fromNumber,
    toNumber,
    `Your One Time Verification Code (OTP) is: ${token}.Do not share with any one `
  );
  return isSent;
}

module.exports = { sendSMSOtp };
