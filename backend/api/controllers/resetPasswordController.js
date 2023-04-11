const jwt = require('jsonwebtoken');
const UserModel = require('../../models/userModel');
const { sendResetEmail } = require('../../service/sendMail');
const asyncWrapper = require('../../middleware/asyncWrapper');
const { HashPassword } = require('../../authentication/password');
const { createCustomError } = require('../../middleware/customError');
const ResetPasswordModel = require('../../models/resetPasswordModel');
const { EmailValidation, PasswordValidation } = require('../../validation/validation');
require('dotenv').config();
const resetPassword = asyncWrapper(async (req, res, next) => {
  const email = req.body.email;
  const { error } = new EmailValidation({ email: email }).validate();
  if (error) return next(createCustomError(error.message, 400));
  // generate a unique token for this reset request
  const resetToken = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });

  // store the reset token in your database, along with the user's email address or username
  const isTrue = await storeResetToken(email, resetToken);

  // send an email to the user with a link that includes the reset token
  const resetUrl = `${process.env.DOMAIN_NAME}customer/reset_password/${resetToken}`;
  // send email to the customer
  const message = await sendResetEmail(email, resetUrl);
  // return a response indicating that the reset request was successful
  res.status(200).json({ success: true, payload: 'Password reset email sent' });
});

const confirmResetPassword = asyncWrapper(async (req, res, next) => {
  // get info from user from FE
  const { token } = req.params;
  const { password } = req.body;
  const { error } = new PasswordValidation({ password: password }).validate();
  if (error) return next(createCustomError(error.message, 400));
  // verify the reset token and retrieve the user's email address or username
  const { email } = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
  // update the user's password in your database
  await updatePassword(email, password, next);

  // delete the reset token from your database
  await deleteResetToken(email, token);

  // return a response indicating that the password reset was successful
  return res.status(200).json({ success: true, payload: 'Password reset successfully' });
});

async function storeResetToken(email, token) {
  // store the reset token in your database, along with the user's email address or username
  const createRecord = await ResetPasswordModel.create({
    email: email,
    token: token,
  });
  return createRecord;
}

async function updatePassword(email, password, next) {
  // return;
  const hashPassword = await new HashPassword(password).hash();

  if (!hashPassword)
    return next(createCustomError('Sorry!, Something went wrong,please try again later', 400));
  // update the user's password in your database
  const updateUser = await UserModel.update(
    { password: hashPassword },
    { where: { email: email } }
  );
  return updateUser;
}

async function deleteResetToken(email, token) {
  const isDeleted = await ResetPasswordModel.destroy({ where: { email: email } });

  return isDeleted;
}
module.exports = { resetPassword, confirmResetPassword };
