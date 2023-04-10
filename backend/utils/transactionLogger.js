const TransactionLogModel = require('../models/transactionLogModel');
const DepositModel = require('../models/depositModel');
const TransferModel = require('../models/transferModel');
const BillsModel = require('../models/billsModel');

const transactionLogger = async ({
  transaction_type,
  amount,
  account_number,
  description,
  tx_ref,
  status,
  customer_id,
}) => {
  // let transaction_id;
  // if (transaction_type === 'Credit') {
  //   const getDepositInfo = await DepositModel.findOne({ where: { tx_ref_code: tx_ref } });
  //   transaction_id = getDepositInfo.deposit_id;
  // } else if (transaction_type === 'dsdsd') {//todo
  //   const getTransfer = await TransferModel.findOne({ where: { transaction_ref: tx_ref } });
  //   transaction_id = getTransfer.dataValues?.transfer_id;
  // } else if (transaction_type === 'Withdrawal') {
  //   const getTransfer = await TransferModel.findOne({ where: { transaction_ref: tx_ref } });
  //   transaction_id = getTransfer.transaction_code;
  // } else if (transaction_type === 'Bills') {
  //   const getTransfer = await BillsModel.findOne({ where: { tx_ref: tx_ref } });
  //   transaction_id = getTransfer.bills_id;
  // } else {
  //   console.log('in progress');
  // }

  const updateTxLog = await TransactionLogModel.create({
    transaction_type,
    amount,
    account_number,
    tx_ref,
    description,
    status,
    customer_id,
  });

  return updateTxLog;
};

module.exports = { transactionLogger };
