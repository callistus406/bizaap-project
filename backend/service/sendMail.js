const { emailTemplate } = require('../utils/resetPasswordTemplate');
const nodemailer = require('nodemailer');
require('dotenv').config();
const service = process.env;
async function sendResetEmail(email, resetUrl) {
  // send an email to the user with a link that includes the reset token

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
    subject: 'Reset your password',
    html: emailTemplate('bola', email, resetUrl),
  };

  const isSent = await transporter.sendMail(mailOptions);
  console.log('------------------------------');
  console.log(isSent);
}

module.exports = { sendResetEmail };
