const LocalStrategy = require('passport-local').Strategy;
const { LoginValidation } = require('../validation/validation');
const bcrypt = require('bcrypt');
const passport = require('passport');

const initializePassport = (passport, getUserByEmail, getUserById) => {
  async function authenticateUser(email, password, done) {
    const validateData = { email, password };
    console.log(validateData);
    const { error } = new LoginValidation(validateData).validate();

    if (error) return done(null, false, { message: error.message });

    const user = await getUserByEmail(email);

    if (user == null) return done(null, false, { message: 'Invalid Credentials' });
    const fetchUser = user?.dataValues;

    try {
      if (await bcrypt.compare(password, fetchUser.password)) {
        // console.log(fetchUser)
        return done(null, fetchUser);
      } else {
        return done(null, false, {
          message: 'Incorrect Username or Password',
        });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser(async (id, done) => {
    console.log(id);
    return done(null, await getUserById(id));
  });
};

module.exports = initializePassport;
