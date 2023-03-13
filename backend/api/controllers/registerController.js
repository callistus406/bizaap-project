const asyncWrapper = require('../../middleware/asyncWrapper');
const { generateUniqueId } = require('../../utils/uniqueIds');
const UserModel = require('../../models/userModel');
const { RegisterValidation } = require('../../validation/validation');
const { HashPassword } = require('../../authentication/password');
// const registerController = asyncWrapper((req, res) => {
//   res.status(200).json({ success: true, payload: 'Register Get Login route' });
// });
const registerController = asyncWrapper(async (req, res) => {
  const { email, businessName, phone, password, bvn } = req.body;
  const validateData = { email, businessName, phone, password, bvn };

  const { error } = new RegisterValidation(validateData).checkValidation();
  // console.log(error);
  if (error) return res.status(200).json({ success: false, payload: error.message });
  const isRegistered = await UserModel.findOne({
    where: { email: email },
    attributes: { exclude: ['password'] },
  });

  if (isRegistered)
    return res.send({ success: false, payload: 'Account Already Exist, Please Try Another Email' });

  const hashPassword = await new HashPassword(password).hash();
  if (!hashPassword)
    return res.status(400).json({
      success: false,
      payload: 'Sorry!, Something went wrong,please try again later',
    });

  const uniqueId = generateUniqueId();
  const createdUser = await UserModel.create({
    _id: uniqueId,
    email,
    businessName,
    phone,
    bvn,
    password: hashPassword,
    phone,
  });

  return res.status(200).json({ success: true, payload: createdUser });
});

module.exports = {
  registerController,
  // postRegisterController,
};
