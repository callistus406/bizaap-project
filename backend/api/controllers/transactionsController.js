const asyncWrapper = require('../../middleware/asyncWrapper');
const TransferModel = require('../../models/transferModel');
const DepositModel = require('../../models/depositModel');
const UserModel = require('../../models/userModel');
const { sequelize } = require('../../db/connect');
const WalletModel = require('../../models/walletModel');
const { createCustomError } = require('../../middleware/customError');
const expense = asyncWrapper(async (req, res, next) => {
  const loggedInUser = req.user?.user_id;
  const customerWallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
  if (!customerWallet)
    return next(createCustomError('Sorry,something went wrong.please try again later', 500));
  const getExpense = await TransferModel.findAll({
    attributes: ['amount', 'updatedAt', 'charged', 'remark'],
    where: {
      sender_account: customerWallet.dataValues.wallet_code,
    },
  });

  if (getExpense.length == 0)
    return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: getExpense });
});

const income = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;
  const customerWallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
  if (!customerWallet)
    return next(createCustomError('Sorry,something went wrong.please try again later', 500));
  const income = await DepositModel.findAll({
    attributes: ['amount', 'updatedAt', 'remark'],
    where: {
      account_number: customerWallet.dataValues.wallet_code,
    },
  });

  if (income.length == 0)
    return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: income });
});

const allTransactions = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  // TODO:CONSIDER JOINING THE EXPENSE AND INCOME TABLE IF FEASIBLE
  // const response = await sequelize.query(
  //   'SELECT deposits.amount AS income_amount,deposits.remark AS income_desc ,deposits.updatedAt AS income_date,transfers.amount AS expense_amount,transfers.updatedAt AS expense_date,transfers.charged AS expense_charge, transfers.remark AS  expense_desc  FROM deposits LEFT JOIN transfers ON deposits.deposit_id = transfers.transfer_id '
  // );
  const customerWallet = await WalletModel.findOne({ where: { wallet_owner: loggedInUser } });
  if (!customerWallet)
    return next(createCustomError('Sorry,something went wrong.please try again later', 500));
  const income = await DepositModel.findAll({
    attributes: ['amount', 'updatedAt', 'remark'],
    where: {
      account_number: customerWallet.dataValues.wallet_code,
    },
  });
  const getExpense = await TransferModel.findAll({
    attributes: ['amount', 'updatedAt', 'charged', 'remark'],
    where: {
      sender_account: customerWallet.dataValues.wallet_code,
    },
  });
  const response = { income: [...income], expense: [...getExpense] };

  if (!response) return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: response });
});

module.exports = { expense, income, allTransactions };
