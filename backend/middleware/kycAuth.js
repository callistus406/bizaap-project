const KycModel = require('../models/kycModel');
const UserModel = require('../models/userModel');
const asyncWrapper = require('./asyncWrapper');

const authorizeTransaction = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.user;
  const getUserinfo = await KycModel.findOne({ where: { user_id } });

  if (!getUserinfo)
    return res.status(401).send({
      success: false,
      payload: {
        message:
          "Sorry, You'are allowed to carryout any transaction.Please complete your KYC verification",
        redirectUrl: '/customer/initiate/kyc/verification',
      },
    });
  next();
  // res.status.send(200).send({ success: true, payload: getUserinfo });
});

module.exports = { authorizeTransaction };
