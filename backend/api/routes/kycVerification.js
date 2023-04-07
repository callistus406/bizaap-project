const router = require('express').Router();
const VerifyUser = require('../../middleware/auth');
const { initiateMediaTransfer } = require('../../service/multerConfig');
const {
  checkKycVeification,
  kycVerificationCtrl,
  kycVerificationFinalStageCtrl,
} = require('../controllers');

router.get('/customer/check/kyc', VerifyUser.ensureAuthenticated, checkKycVeification);
router.post(
  '/customer/initiate/kyc/verification',
  VerifyUser.ensureAuthenticated,
  kycVerificationCtrl
);
// router.post('/customer/complete/kyc/verification/',VerifyUser.ensureAuthenticated, initiateMediaTransfer("kyc_uploads",'').single('image'), kycVerificationFinalStageCtrl);

module.exports = router;
