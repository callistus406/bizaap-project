const { Op } = require('sequelize');
const TransactionLogModel = require('../models/transactionLogModel');
const { sequelize } = require('../db/connect');
const { formatDate } = require('./formatters');

const validateTransactionLimit = async ({ _user, _amount }) => {
  const envVar = process.env;
  const currentDate = new Date();
  const today = formatDate(currentDate);
  const totalTx = await TransactionLogModel.sum('amount', {
    where: {
      customer_id: _user.user_id,
      transaction_type: 'Debit',
      [Op.and]: sequelize.literal(`DATE(updatedAt) = '${today}'`),
    },
  });
  //

  //   return;
  let _txLimit = _user.business_name ? envVar.BUSINESS_TX_LIMIT : envVar.INDIVIDUAL_TX_LIMIT;
  _txLimit = parseFloat(_txLimit);
  if (!totalTx) return { isEligible: true, txLimit: _txLimit, totalTx };
  const totalTxPlusAmt = totalTx + _amount;
  console.log(totalTxPlusAmt);
  const isEligible =
    (_user.business_name && totalTxPlusAmt > _txLimit) ||
    (!_user.business_name && totalTxPlusAmt > _txLimit)
      ? false
      : true;

  return { isEligible, txLimit: _txLimit, totalTx };
};

module.exports = { validateTransactionLimit };
