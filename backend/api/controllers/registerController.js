const asyncWrapper = require('../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../utils/uniqueIds');
const UserModel = require('../../models/userModel');
const { RegisterValidation } = require('../../validation/validation');
const { HashPassword } = require('../../authentication/password');
const { createCustomError } = require('../../middleware/customError');
const generateAccountNumber = require('../../utils/accountNumberGen');
const flw = require('../../service/flutterwaveConfig');
const WalletModel = require('../../models/walletModel');
const registerController = asyncWrapper(async (req, res, next) => {
  const { email, businessName, phone, password } = req.body;
  const validateData = { email, businessName, phone, password };
  // payload validation
  const { error } = new RegisterValidation(validateData).checkValidation();

  if (error) return res.status(200).json({ success: false, payload: error.message });
  // user lookup
  const isRegistered = await UserModel.findOne({ where: { email: email } });

  if (isRegistered)
    return next(createCustomError('Account Already Exist, Please Try Another Email', 400));
  // password hash
  const hashPassword = await new HashPassword(password).hash();
  if (!hashPassword)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 400));

  // const isVerified = await flw.Misc.verify_Account(details);
  // User creation
  const uniqueId = generateUniqueId();

  const createdUser = await UserModel.create({
    _id: uniqueId,
    email,
    businessName,
    phone,
    // bankAccount,
    password: hashPassword,
    // phone,/
  });

  // create wallet
  const walletCode = generateAccountNumber(createdUser.phone);
  const createWallet = await WalletModel.create({
    wallet_owner: createdUser.user_id,
    wallet_code: walletCode,
  });

  // response
  return res.status(201).json({ success: true, payload: createdUser, createWallet });
});

module.exports = {
  registerController,
  // postRegisterController,
};
