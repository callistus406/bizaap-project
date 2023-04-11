const speakeasy = require('speakeasy');
const UserModel = require('../../models/userModel');
const WalletModel = require('../../models/walletModel');
const asyncWrapper = require('../../middleware/asyncWrapper');
const { createCustomError } = require('../../middleware/customError');
const generateAccountNumber = require('../../utils/accountNumberGen');
const KycModel = require('../../models/kycModel');
const { sendSMSOtp } = require('../../utils/sendOtpViaSMS');
require('dotenv').config();
const otpValidation = asyncWrapper(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(createCustomError('Input cannot be empty', 400));
  console.log(req.session);
  if (!req.session.user_otp_auth || !req.session.customer_details)
    return next(createCustomError('Sorry You are not authorized to access this resource', 401));
  const secret = req.session?.user_otp_auth;

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    time: 120,
  });

  // if (!verified) return next(createCustomError('Invalid OTP', 400));
  const { username, password, bvn, phone, email, full_name } = req.session.customer_details;
  // User creation
  const createdUser = await UserModel.create({
    full_name,
    username,
    email,
    phone,
    password,
    bvn,
  });
  // create wallet
  const walletCode = generateAccountNumber(createdUser.dataValues.phone);
  // validate returned value

  if (!Object.values(createdUser.dataValues).length > 0)
    next(createCustomError('Sorry, Something went wrong,pleas try again', 500));
  const createWallet = await WalletModel.create({
    wallet_owner: createdUser.dataValues?.user_id,
    wallet_code: walletCode,
  });
  //   console.log(createWallet);
  // validate returned value
  if (!Object.values(createWallet.dataValues).length > 0)
    next(createCustomError('Sorry, Something went wrong,pleas try again', 500));

  req.session.customer_details = {};
  req.session.user_otp_auth = '';
  return res.status(201).json({ success: true, payload: createdUser, createWallet });
});

const requestOtp = asyncWrapper(async (req, res) => {
  const { phone } = req.session.customer_details;
  const response = await sendSMSOtp(preocess.env.TWILIO_FROM_NUMBER, phone, req);

  if (!response)
    return next(
      createCustomError('System is unable to connect to your phone.please try again later', 500)
    );
  return res.status(200).json({
    success: true,
    payload: { message: `OTP has been sent to ${phone}`, authUrl: '/customer/validste-otp' },
  });
});

module.exports = { otpValidation, requestOtp };
