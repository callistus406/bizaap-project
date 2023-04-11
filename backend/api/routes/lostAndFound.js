const router = require('express').Router();
const VerifyUser = require('../../middleware/auth');
const LostItemModel = require('../../models/lostItemModel');
const { initiateMediaTransfer, InitiateUpload } = require('../../service/multerConfig');

const {
  lostItemCtrl,
  fetchLostItemsCtrl,
  fetchCustomerLostItems,
  foundLostItemCtrl,
  fetchFoundItemsCtrl,
  fetchCustomerFoundItems,
} = require('../controllers');

router.get('/fetch/lost-items', VerifyUser.ensureAuthenticated, fetchLostItemsCtrl);
router.get('/fetch/found-items', VerifyUser.ensureAuthenticated, fetchFoundItemsCtrl);
router.get('/fetch/customer/lost-items', VerifyUser.ensureAuthenticated, fetchCustomerLostItems);
router.get('/fetch/customer/found-items', VerifyUser.ensureAuthenticated, fetchCustomerFoundItems);
router.post(
  '/customer/register/found-items',
  VerifyUser.ensureAuthenticated,
  (req, res, next) => {
    initiateMediaTransfer(req, res, next, 'lost_and_found', 'found');
  },
  foundLostItemCtrl
);

router.post(
  '/register/customer/lost-item',
  VerifyUser.ensureAuthenticated,
  (req, res, next) => {
    initiateMediaTransfer(req, res, next, 'req.user', 'lost');
  },
  lostItemCtrl
);

module.exports = router;
