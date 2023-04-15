const generateAccountNumber = (phone) => {
  const result = phone?.toString().slice(2);

  return 2 + '' + result;
};

module.exports = generateAccountNumber;
