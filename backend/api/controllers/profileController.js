const asyncWrapper = require('../../middleware/asyncWrapper');
const { createCustomError } = require('../../middleware/customError');
const UserModel = require('../../models/userModel');
const { ProfileValidator } = require('../../validation/validation');

const getCustomersProfile = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const userProfile = await UserModel.findOne({
    where: { user_id: loggedInUser },
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
  });

  if (!userProfile)
    return res.status(500).send({ success: false, payload: 'Sorry something went wrong' });

  return res.status(200).send({ success: true, payload: userProfile });
});
const updateCustomersProfile = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;
  const { businessName, phone } = req.body;
  const { error } = new ProfileValidator({ businessName, phone }).validate();
  if (error) return next(createCustomError(error.message, 400));

  const userProfile = await UserModel.update(
    { businessName, phone },
    { where: { user_id: loggedInUser } }
  );
  if (!userProfile[0]) return next(createCustomError('Sorry, something went wrong', 500));

  return res.status(200).send({ success: true, payload: userProfile });
});

module.exports = { getCustomersProfile, updateCustomersProfile };
