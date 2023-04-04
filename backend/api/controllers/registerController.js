const { Op } = require('sequelize');
const UserModel = require('../../models/userModel');
const flw = require('../../service/flutterwaveConfig');
const WalletModel = require('../../models/walletModel');
const { sendMailOTP } = require('../../service/sendOTP');
const asyncWrapper = require('../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../utils/uniqueIds');
const { HashPassword } = require('../../authentication/password');
const { RegisterValidation } = require('../../validation/validation');
const { createCustomError } = require('../../middleware/customError');
const generateAccountNumber = require('../../utils/accountNumberGen');
const { verifyBvn } = require('../../utils/bvnVerification');

// ---------------------------------------------------------------------------
const registerController = asyncWrapper(async (req, res, next) => {
  const { email, fullName, username, bvn, phone, password, confirmPassword } = req.body;
  const validateData = { email, fullName, username, phone, password, bvn };
  // payload validation
  const { error } = new RegisterValidation(validateData).checkValidation();
  if (error) return res.status(200).json({ success: false, payload: error.message });
  console.log(password, confirmPassword);
  if (password !== confirmPassword)
    return next(createCustomError('The passwords entered do not match. ', 400));
  const findUserName = await UserModel.findOne({
    where: {
      username: {
        [Op.regexp]: `(${username}|${username.toUpperCase()})`,
      },
    },
  });
  const full_name = fullName;
  if (findUserName)
    return next(
      createCustomError('Sorry You cannot use this username.please try another one', 400)
    );
  // user lookup
  const isPhoneFound = await UserModel.findOne({ where: { phone: phone } });
  if (isPhoneFound)
    return next(
      createCustomError(
        'Sorry, Phone number already exist in our system, please try another one',
        400
      )
    );

  const isRegistered = await UserModel.findOne({ where: { email: email } });
  if (isRegistered)
    return next(createCustomError('Account Already Exist, Please Try Another Email', 400));
  // password hash
  const hashPassword = await new HashPassword(password).hash();
  if (!hashPassword)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 400));

  // const isVerified = await flw.Misc.verify_Account(details);
  // const redirectLink = "/"
  // TODO: verify BVN

  // const isVerified = await verifyBvn(bvn)

  // if(isVerified.)
  req.session.customer_details = {};
  req.session.customer_details.password = hashPassword;
  req.session.customer_details.email = email;
  req.session.customer_details.phone = phone;
  req.session.customer_details.username = username;
  req.session.customer_details.bvn = bvn;
  req.session.customer_details.full_name = full_name;

  sendMailOTP(email, 'redirectLink', req);
  return res.status(200).json({
    success: true,
    payload: { message: `OTP has been sent to ${email}`, authUrl: '/customer/validate_otp' },
  });

  // response
});

module.exports = {
  registerController,
  // postRegisterController,
};
