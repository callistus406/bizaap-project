const { Op } = require('sequelize');
const UserModel = require('../../models/userModel');
const asyncWrapper = require('../../middleware/asyncWrapper');
const { ProfileValidator } = require('../../validation/validation');
const { createCustomError } = require('../../middleware/customError');
const getCustomersProfile = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;

  const userProfile = await UserModel.findOne({
    where: { user_id },
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  });
  if (!userProfile)
    return res.status(500).send({ success: false, payload: 'Sorry something went wrong' });

  return res.status(200).send({ success: true, payload: userProfile });
});

// ---------------------------UPDATE CUSTOMERS PROFILE-----------------------------------------------------------------

const updateCustomersProfile = asyncWrapper(async (req, res, next) => {
  const { user_id, phone, username } = req.user;
  const { full_name, newUsername, newPhone } = req.body;
  const { error } = new ProfileValidator({
    full_name,
    username: newUsername,
    phone: newPhone,
  }).validate();
  if (error) return next(createCustomError(error.message, 400));
  const isPhoneReg = await UserModel.findOne({ where: { phone: newPhone } });
  if (isPhoneReg && isPhoneReg.dataValues.phone !== phone)
    return next(
      createCustomError('phone number is already registered.Please try another phone number', 400)
    );
  const isUsernameReg = await UserModel.findOne({
    where: {
      username: {
        [Op.regexp]: `(${username}|${username.toUpperCase()})`,
      },
    },
  });
  if (isUsernameReg && isUsernameReg.dataValues.username !== username)
    return next(createCustomError('Username  is already taken.Please try another name', 400));

  const userProfile = await UserModel.update(
    { username: newUsername, phone: newPhone, full_name },
    { where: { user_id } }
  );
  if (!userProfile[0])
    return next(createCustomError('Sorry, something went wrong.Please try again later', 500));

  return res.status(200).send({ success: true, payload: 'Profile update, successful!' });
});

module.exports = { getCustomersProfile, updateCustomersProfile };
