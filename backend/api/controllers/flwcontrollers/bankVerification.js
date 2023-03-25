const asyncWrapper = require('../../../middleware/asyncWrapper');
const flw = require('../../../service/flutterwaveConfig');
const { generateUniqueId } = require('../../../utils/uniqueIds');

const bankVerification = asyncWrapper(async (req, res) => {
  const { account_number, account_bank } = req.body;
  if (!account_number || !account_bank)
    return res.status(400).send({ success: false, payload: 'Inputs can not be empty' });
  if (account_number.length < 10)
    return res.status(400).send({ success: false, payload: 'Invalid account number' });
  if (account_number.toString().length < 10)
    return res.status(400).send({ success: false, payload: 'Invalid account number' });
  if (account_bank.toString().length < 3)
    return res.status(400).send({ success: false, payload: 'Invalid bank code' });
  const details = req.body;
  // flw request
  const isVerified = await flw.Misc.verify_Account({ account_number, account_bank: account_bank });
  // check for error a
  if (isVerified.status !== 'success')
    return res.status(400).send({ success: false, payload: isVerified.message });
  return res.status(200).send({ success: true, payload: isVerified.data });
});

module.exports = { bankVerification };
