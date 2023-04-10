const maskAccountNumber = (account) => {
  let numStr = account.toString(); // Convert the number to a string
  let maskedAccount = numStr.substring(0, 2) + '****' + numStr.substring(6); // Mask the middle four digits
  return maskedAccount;
};

module.exports = { maskAccountNumber };
