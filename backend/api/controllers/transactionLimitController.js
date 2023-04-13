const { Op } = require('sequelize');
const asyncWrapper = require('../../middleware/asyncWrapper');
const { createCustomError } = require('../../middleware/customError');
const TransactionLogModel = require('../../models/transactionLogModel');
const { formatDate, formatCurrency } = require('../../utils/formatters');
const { sequelize } = require('../../db/connect');
require('dotenv').config();
const calcTransactionLimitCtrl = asyncWrapper(async (req, res, next) => {
  const user = req.user;
  const envVar = process.env;
  const currentDate = new Date();
  const today = formatDate(currentDate);
  const totalTx = await TransactionLogModel.sum('amount', {
    where: {
      customer_id: user.user_id,
      transaction_type: 'Debit',
      [Op.and]: sequelize.literal(`DATE(updatedAt) = '${today}'`),
    },
  });

  let txLimit = user.business_name ? envVar.BUSINESS_TX_LIMIT : envVar.INDIVIDUAL_TX_LIMIT;
  if (!totalTx)
    return res.status(200).send({
      success: true,
      payload: `Hello! ${
        user.username
      },  We want to let you know that you have not yet reached your transaction limit for the day. Please feel free to continue using our services as needed.You currently have ${formatCurrency(
        txLimit - totalTx
      )} left to reach your limit`,
    });
  const totalTxPlusAmt = totalTx;

  const isEligible =
    (user.business_name && totalTxPlusAmt === txLimit) ||
    (!user.business_name && totalTxPlusAmt === txLimit)
      ? false
      : true;

  if (!isEligible)
    return next(
      createCustomError(
        `We regret to inform you that you have reached the maximum transaction limit for the day. As per our policies, you are only permitted to transfer a sum of ${formatCurrency(
          txLimit - totalTx
        )} at this time.`,
        400
      )
    );

  return res.status(200).send({
    success: true,
    payload: `Hello! ${
      user.username
    },  We want to let you know that you have not yet reached your transaction limit for the day. Please feel free to continue using our services as needed.You currently have ${formatCurrency(
      txLimit - totalTx
    )} left to reach your limit`,
  });
});

module.exports = { calcTransactionLimitCtrl };
