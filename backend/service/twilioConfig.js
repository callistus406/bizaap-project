const asyncWrapper = require('../middleware/asyncWrapper');
require('dotenv').config();
const variable = process.env;
const accountSid = variable.TWILIO_ACCT_SID;
const authToken = variable.TWILIO_ACCT_SECRETE;
const client = require('twilio')(accountSid, authToken);

const sendSMS = async (fromNumber, toNumber, message) => {
  const response = await client.messages.create({
    from: fromNumber,
    to: toNumber,
    body: message,
  });

  return response;
};

module.exports = { sendSMS };
