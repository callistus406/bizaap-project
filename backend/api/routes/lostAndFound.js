const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { initiateMediaTransfer } = require('../../service/multerConfig');
const LostItemModel = require('../../models/lostItemModel');
const VerifyUser = require('../../middleware/auth');
const {
  lostItemCtrl,
  fetchLostItemsCtrl,
  fetchCustomerLostItems,
  foundLostItemCtrl,
  fetchFoundItemsCtrl,
  fetchCustomerFoundItems,
} = require('../controllers');
router.post(
  '/register/customer/lost-item',
  VerifyUser.ensureAuthenticated,
  initiateMediaTransfer('lost').single('image'),
  lostItemCtrl
);

router.get('/fetch/lost-items', fetchLostItemsCtrl);
router.get('/fetch/found-items', fetchFoundItemsCtrl);
router.get('/fetch/customer/lost-items', VerifyUser.ensureAuthenticated, fetchCustomerLostItems);
router.get('/fetch/customer/found-items', VerifyUser.ensureAuthenticated, fetchCustomerFoundItems);
router.post(
  '/customer/register/found-items',
  VerifyUser.ensureAuthenticated,
  initiateMediaTransfer('found').single('image'),
  foundLostItemCtrl
);

module.exports = router;
