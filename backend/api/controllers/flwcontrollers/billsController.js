const asyncWrapper = require('../../../middleware/asyncWrapper');
const flw = require('../../../service/flutterwaveConfig');
const axios = require('axios').default;
const { generateUniqueId } = require('../../../utils/uniqueIds');
const VerifyUser = require('../../../middleware/auth');

require('dotenv').config();

const getBills = asyncWrapper(async (req, res) => {
  const bills = await flw.Bills.fetch_bills_Cat();
  return res.status(200).send({ success: true, payload: bills });
});

const buyAirtime = asyncWrapper((req, res) => {
  // try {
  //   const payload = {
  //     country: 'NG',
  //     customer: '+23490803840303',
  //     amount: '100',
  //     recurrence: 'ONCE',
  //     type: 'AIRTIME',
  //     reference: '930rwrwr0049404444',
  //     biller_name: 'MTN',
  //   };

  //   const response = await flw.Bills.create_bill(payload);
  //   console.log(response);
  // } catch (error) {
  //   console.log(error);
  // }
  var config = {
    method: 'POST',
    url: 'https://api.flutterwave.com/v3/bills',
    headers: {
      Authorization: `Bearer ${process.env.FLW_SECRETE_KEY}`,
      'Content-Type': 'application/json',
    },
    data: {
      country: 'NG',
      customer: '+23490803840303',
      amount: '500',
      recurrence: 'ONCE',
      type: 'AIRTIME',
      reference: '9300049404444',
      biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT',
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = { buyAirtime, getBills };
