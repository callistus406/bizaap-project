const txSMSTemplate = (txType, account, amount, total_charge, date, description, balance) => {
  return `${txType}:${account} Amt:${amount} commission:${total_charge} Date:${date},Desc:${description},Bal:${balance}CR`;
};

module.exports = { txSMSTemplate };
