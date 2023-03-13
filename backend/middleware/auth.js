class VerifyUser {
  static ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.status(401).redirect('/login');
  }
  forwardAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/dashboard');
    return next();
  }
  static isAdmin(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/');
    console.log(req.user, req.isAuthenticated());
    // TODO:this should be a redirect action

    res.status(400).json({
      success: false,
      payload: 'You are not authorized to access this resource',
    });
  }
}
module.exports = VerifyUser;
