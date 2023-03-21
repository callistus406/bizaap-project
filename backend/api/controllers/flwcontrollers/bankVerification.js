const asyncWrapper = require('../../../middleware/asyncWrapper');
const flw = require('../../../service/flutterwaveConfig');
const open = require('open');
const { generateUniqueId } = require('../../../utils/uniqueIds');

const bankVerification = asyncWrapper(async (req, res) => {
  //   const { account_number, bankCode } = req.body;
  const details = req.body;

  const isVerified = await flw.Misc.verify_Account(details);
  res.send(isVerified);
});

module.exports = { bankVerification };
