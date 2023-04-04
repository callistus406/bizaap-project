const router = require('express').Router();
const passport = require('passport');
const initializePassport = require('../../authentication/passportConfig');
const UserModel = require('../../models/userModel');
const GatewayModel = require('../../models/gatewayModel');
const { verifyBvn } = require('../../utils/bvnVerification');
initializePassport(
  passport,
  (email) => UserModel.findOne({ where: { email: email } }),
  (id) => UserModel.findOne({ where: { user_id: id } })
);
router.post(
  '/login',

  (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(400).json({ success: false, payload: info });
      if (!user) return res.status(401).json({ success: false, payload: info });
      if (user) {
        // console.log(req.logIn);
        req.login(user, function (err) {
          console.log('err');
          if (err) {
            return next(err);
          }
          // (async function () {
          //   await GatewayModel.create({
          //     gateway_name: 'flutterwave',
          //     gateway_type: 'payment',
          //     status: 'active',
          //   });
          // })();
          // verifyBvn();
          return res.redirect('/api/v1/dashboard');
        });
      }
    })(req, res, next);
  }
);

router.post('/logout', (req, res, next) => {
  req.logOut(function (error) {
    if (error) return next(error);
    return res.redirect('/');
  });
  return res.status(200).json({ success: true, payload: 'you are successfully  logged out' });
});

module.exports = router;
