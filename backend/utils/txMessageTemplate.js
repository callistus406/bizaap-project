const txSMSTemplate = (txType, account, amount, date, description, balance) => {
  return `${txType}:${account} Amt:${amount} Date:${date},Desc:${description},Bal:${balance}CR`;
};

module.exports = { txSMSTemplate };
