class VerifyUser {
  static ensureAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) return next();
    return res
      .status(401)
      .send({ success: false, payload: 'Sorry, You are not authorized to access this resource' });
  }
  static forwardAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/api/v1/dashboard');
    return next();
  }
}
module.exports = VerifyUser;
