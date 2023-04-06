const asyncWrapper = require('../../middleware/asyncWrapper');
const TransferModel = require('../../models/transferModel');
const DepositModel = require('../../models/depositModel');
const UserModel = require('../../models/userModel');
const { sequelize } = require('../../db/connect');
const expense = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const getExpense = await TransferModel.findAll({
    attributes: ['amount', 'updatedAt', 'charged', 'remark'],
    where: {
      account_owner: loggedInUser,
    },
  });

  if (!getExpense) return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: getExpense });
});

const income = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const income = await DepositModel.findAll({
    attributes: ['amount', 'updatedAt', 'remark'],
    where: {
      receiver: loggedInUser,
    },
  });

  if (!income) return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: income });
});

const allTransactions = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const response = await sequelize.query(
    'SELECT deposits.amount AS income_amount,deposits.remark AS income_desc ,deposits.updatedAt AS income_date,transfers.amount AS expense_amount,transfers.updatedAt AS expense_date,transfers.charged AS expense_charge, transfers.remark AS  expense_desc  FROM deposits LEFT JOIN transfers ON deposits.deposit_id = transfers.transfer_id '
  );

  if (!response) return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: response });
});

module.exports = { expense, income, allTransactions };

// select deposits.amount AS income_amount,deposits.remark as income_desc ,deposits.updatedAt as income_date,transfers.amount AS expense_amount,transfers.updatedAt AS expense_date,transfers.charged AS expense_charge, transfers.remark AS  expense_desc  FROM deposits LEFT JOIN transfers ON deposits.receiver = transfers.account_owner ;
// SELECT deposits.amount AS income_amount,deposits.remark as income_desc ,deposits.updatedAt as income_date,transfers.amount AS expense_amount,transfers.updatedAt AS expense_date,transfers.charged AS expense_charge, transfers.remark AS  expense_desc  FROM deposits LEFT JOIN transfers ON deposits.deposit_id = transfers.transfer_id ;
