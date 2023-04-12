const { Op } = require('sequelize');
const TransactionLogModel = require('../models/transactionLogModel');
const { sequelize } = require('../db/connect');
const formatDate = (date) => {
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
};

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
  if (!totalTx) return true;
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
