const KycModel = require('../models/kycModel');
const UserModel = require('../models/userModel');
const asyncWrapper = require('./asyncWrapper');

const authorizeTransaction = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.user;
  const getUserinfo = await UserModel.findByPk(user_id);
});
