const generateAccountNumber = (phone) => {
  const result = phone?.toString().slice(2);

  return 0 + '' + result;
};

module.exports = generateAccountNumber;
