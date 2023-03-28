const TransactionLogModel = require('../models/transactionLogModel');
const DepositModel = require('../models/depositModel');
const WithdrawalModel = require('../models/withdrawalModel');

const transactionLogger = async ({ type, amount, customer_id, tx_ref, status }) => {
  let transaction_id;
  if (type === 'Deposit') {
    const getDepositInfo = await DepositModel.findOne({ where: { tx_ref_code: tx_ref } });
    transaction_id = getDepositInfo.deposit_id;
    console.log('qwerty', getDepositInfo);
  } else if (type === 'Withdrawal') {
    const getWithdrawal = await WithdrawalModel.findOne({ where: { transaction_ref: tx_ref } });
    transaction_id = getWithdrawal.withdrawal_id;
  } else {
    console.log('in progress');
  }
  const updateTxLog = await TransactionLogModel.create({
    type,
    customer_id,
    amount,
    transaction_id,
    status,
    user_id: customer_id,
  });

  return updateTxLog;
};

module.exports = { transactionLogger };
