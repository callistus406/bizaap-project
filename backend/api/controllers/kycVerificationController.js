const asyncWrapper = require('../../middleware/asyncWrapper');
const { createCustomError } = require('../../middleware/customError');
const KycModel = require('../../models/kycModel');
const UserModel = require('../../models/userModel');
require('dotenv').config();
const checkKycVerification = asyncWrapper(async (req, res, next) => {
  console.log(req.use);
  const isVerified = await UserModel.findOne({
    where: { user_id: req.user.user_id },
    include: KycModel,
  });

  if (isVerified) return next(createCustomError('Your account has not been verified.', 400));

  return res.status(200).send({ success: true, payload: 'Your Account is verified' });
});

// ------------------------create kyc
const kycVerificationCtrl = asyncWrapper(async (req, res, next) => {
  const { nin_number } = req.body;
  const { user_id } = req.user;
  if (!nin_number) return next(createCustomError('Please provide your  NIN ', 400));

  //   query nin verification api :TODO:

  // check for error and success

  // cache response
  req.session.kyc_verification = {};
  req.session.kyc_verification.nin_number = nin_number;
  // req.user.session.kyc_verification. = ;

  res
    .status(200)
    .send({ success: true, payload: { redirectUrl: '/customer/complete/kyc/verification' } });
});

const kycVerificationFinalStageCtrl = asyncWrapper(async (req, res, next) => {
  const { user_id } = req.user;

  const { nin_number } = req.session.kyc_verification;

  // get photo url
  if (!req.file)
    return next(createCustomError('Please upload a photo of your national ID card', 400));
  let { path } = req.file;
  // destination = destination.slice(1);
  const photo_url = process.env.DOMAIN_NAME + '' + path;
  // console.log(req.file);

  // return;
  // update kyc table
  const storeKycDetails = await KycModel.create({
    user_id,
    nin_number,
    photo_url,
  });
  //   verify
  if (!storeKycDetails)
    return res.status(500).send({
      success: false,
      payload: 'System is unable to complete verification please try again later',
    });
  // send response
  return res.status(200).send({
    success: true,
    payload: 'congratulation,your account has been verified.You can now carry out transactions',
  });
});

module.exports = { checkKycVerification, kycVerificationFinalStageCtrl, kycVerificationCtrl };
