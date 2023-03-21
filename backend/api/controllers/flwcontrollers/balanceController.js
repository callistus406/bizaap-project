const asyncWrapper = require('../../../middleware/asyncWrapper');
const flw = require('../../../service/flutterwaveConfig');

const fetchBal = asyncWrapper(async (req, res) => {
  const response = await flw.Misc.bal();
  console.log(response);

  return res.status(200).send({ success: true, payload: response });
});

module.exports = { fetchBal };
