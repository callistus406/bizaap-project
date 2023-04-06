const TransactionLogModel = require('../models/transactionLogModel');
const DepositModel = require('../models/depositModel');
const TransferModel = require('../models/transferModel');
const BillsModel = require('../models/billsModel');

const transactionLogger = async ({ type, amount, customer_id, tx_ref, status }) => {
  let transaction_id;
  if (type === 'Deposit') {
    const getDepositInfo = await DepositModel.findOne({ where: { tx_ref_code: tx_ref } });
    transaction_id = getDepositInfo.deposit_id;
    // console.log('qwerty', getDepositInfo);
  } else if (type === 'Transfer') {
    const getTransfer = await TransferModel.findOne({ where: { transaction_ref: tx_ref } });
    // console.log('----------rrrrrr----------');
    // console.log(getTransfer);
    transaction_id = getTransfer.dataValues?.transfer_id;
  } else if (type === 'Withdrawal') {
    const getTransfer = await TransferModel.findOne({ where: { transaction_ref: tx_ref } });

    transaction_id = getTransfer.transaction_code;
  } else if (type === 'Bills') {
    const getTransfer = await BillsModel.findOne({ where: { tx_ref: tx_ref } });
    transaction_id = getTransfer.bills_id;
  } else {
    console.log('in progress');
  }
  const updateTxLog = await TransactionLogModel.create({
    type,
    amount,
    transaction_id,
    user_id: customer_id,
    status,
  });

  return updateTxLog;
};

module.exports = { transactionLogger };
