const router = require('express').Router();
const VerifyUser = require('../../middleware/auth');
const { initiateMediaTransfer } = require('../../service/multerConfig');
const {
  checkKycVerification,
  kycVerificationCtrl,
  kycVerificationFinalStageCtrl,
} = require('../controllers');

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

module.exports = router;
