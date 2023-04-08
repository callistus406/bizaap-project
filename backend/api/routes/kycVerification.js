const router = require('express').Router();
const asyncWrapper = require('../../middleware/asyncWrapper');
const VerifyUser = require('../../middleware/auth');
const KycModel = require('../../models/kycModel');
const { initiateMediaTransfer } = require('../../service/multerConfig');
const {
  checkKycVerification,
  kycVerificationCtrl,
  kycVerificationFinalStageCtrl,
} = require('../controllers');

// const authorizeTransaction = asyncWrapper(async (req, res, next) => {
//   const { user_id } = req.user;
//   const getUserinfo = await KycModel.findOne({ where: { user_id: 3 } });

//   res.status(200).send({ success: true, payload: getUserinfo });
// });

router.get('/customer/check/kyc', VerifyUser.ensureAuthenticated, checkKycVerification);
router.post(
  '/customer/initiate/kyc/verification',
  VerifyUser.ensureAuthenticated,
  kycVerificationCtrl
);
router.post(
  '/customer/complete/kyc/verification',
  VerifyUser.ensureAuthenticated,
  (req, res, next) => {
    initiateMediaTransfer(req, res, next, 'kyc_uploads', '');
  },
  kycVerificationFinalStageCtrl
);

// router.get('/customer/verify', authorizeTransaction);
module.exports = router;
