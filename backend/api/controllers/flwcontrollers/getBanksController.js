const flw = require('../../../service/flutterwaveConfig');
const asyncWrapper = require('../../../middleware/asyncWrapper');
const { createCustomError } = require('../../../middleware/customError');
/**
 ** gets all banks in Nigeria and their codes
 */
const getAllBanks = asyncWrapper(async (req, res, next) => {
  const payload = {
    country: 'NG',
  };
  const response = await flw.Bank.country(payload);
  console.log(response);
  if (!response.data) return next(createCustomError(response.message, 400));
  return res.status(200).send({ success: true, payload: response });
});

module.exports = { getAllBanks };
