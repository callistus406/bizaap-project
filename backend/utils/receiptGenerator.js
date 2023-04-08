const receiptGenerator = (
  transaction_type,
  amount,
  tx_ref,
  receiver_account,
  description,
  status,
  date,
  naration
) => {
  return {
    transaction_type,
    amount,
    tx_ref,
    receiver_account,
    description,
    status,
    date,
    naration,
  };
};

module.exports = { receiptGenerator };
