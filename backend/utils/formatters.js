const formatDate = (date) => {
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
};
const formatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });
  const formattedAmount = formatter.format(amount);

  return formattedAmount;
};

module.exports = { formatDate, formatCurrency };
