const TransactionLogModel = require('../models/transactionLogModel');
const DepositModel = require('../models/depositModel');

const transactionLogger = async ({ type, amount, customer_id, tx_ref, status }) => {
  let transaction_id;
  if (type === 'Deposit') {
    const getDepositInfo = await DepositModel.findOne({ where: { tx_ref_code: tx_ref } });
    transaction_id = getDepositInfo.deposit_id;
    console.log('qwerty', getDepositInfo);
  } else {
    console.log('in progress');
  }
  const updateTxLog = await TransactionLogModel.create({
    type,
    customer_id,
    amount,
    transaction_id,
    status,
  });

  return updateTxLog;
};

module.exports = { transactionLogger };
