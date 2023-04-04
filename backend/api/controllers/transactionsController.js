const asyncWrapper = require('../../middleware/asyncWrapper');
const TransferModel = require('../../models/transferModel');
const DepositModel = require('../../models/depositModel');
const UserModel = require('../../models/userModel');

const expense = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const getExpense = await TransferModel.findAll({
    attributes: ['amount', 'date', 'remark'],
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
    attributes: ['amount', 'date', 'remark'],
    where: {
      receiver: loggedInUser,
    },
  });

  if (!income) return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: income });
});

const allTransactions = asyncWrapper(async (req, res) => {
  const loggedInUser = req.user?.user_id;

  const getAllTransaction = await UserModel.findAll({
    where: { id: 1 },
    include: [
      { model: DepositModel, as: 'income', attributes: ['amount', 'date', 'remark'] },
      { model: TransferModel, as: 'expense', attributes: ['amount', 'date', 'remark'] },
    ],
  });

  if (!getAllTransaction)
    return res.status(404).send({ success: false, payload: 'No record found' });

  res.status(200).send({ success: true, payload: getAllTransaction });
});

module.exports = { expense, income, allTransactions };
