const LocalStrategy = require('passport-local').Strategy;
const { LoginValidation } = require('../validation/validation');
const bcrypt = require('bcrypt');
const { UnHashPassword } = require('../authentication/password');
const passport = require('passport');

const initializePassport = (passport, getUserByUsername, getUserById) => {
  async function authenticateUser(username, password, done) {
    const validateData = { username, password };
    console.log(username);
    const { error } = new LoginValidation(validateData).validate();

    if (error) return done(null, false, { payload: error.message });

    const user = await getUserByUsername(username);

    if (user == null) return done(null, false, { payload: 'Invalid Credentials' });
    const fetchUser = user?.dataValues;

    try {
      if (await new UnHashPassword(password, fetchUser.password).unHash()) {
        // console.log(fetchUser)
        return done(null, fetchUser);
      } else {
        return done(null, false, {
          payload: 'Incorrect Username or Password',
        });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser(async (id, done) => {
    console.log(id);
    return done(null, await getUserById(id));
  });
};

module.exports = initializePassport;
