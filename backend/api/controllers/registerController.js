const asyncWrapper = require('../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../utils/uniqueIds');
const UserModel = require('../../models/userModel');
const { RegisterValidation } = require('../../validation/validation');
const { HashPassword } = require('../../authentication/password');
const flw = require('../../service/flutterwaveConfig');
const registerController = asyncWrapper(async (req, res) => {
  const { email, businessName, phone, password } = req.body;
  const validateData = { email, businessName, phone, password };
  // payload validation
  const { error } = new RegisterValidation(validateData).checkValidation();

  if (error) return res.status(200).json({ success: false, payload: error.message });
  // user lookup
  const isRegistered = await UserModel.findOne({ where: { email: email } });

  if (isRegistered)
    return res
      .status(302)
      .send({ success: false, payload: 'Account Already Exist, Please Try Another Email' });
  // password hash
  const hashPassword = await new HashPassword(password).hash();
  if (!hashPassword)
    return res.status(400).json({
      success: false,
      payload: 'Sorry!, Something went wrong,please try again later',
    });

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
  // response
  return res.status(201).json({ success: true, payload: createdUser });
});

module.exports = {
  registerController,
  // postRegisterController,
};
