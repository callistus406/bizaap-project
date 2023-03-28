function pollPaymentStatus(paymentId, intervalId) {
  flw.Transaction.verify({ id: paymentId })
    .then((response) => {
      // Check the status of the payment
      if (response.data.status === 'successful') {
        clearInterval(intervalId);

        return res.status(200).send({ success: true, response });
      } else if (response.data.status === 'failed') {
        clearInterval(intervalId);

        return res.status(500).send({ success: false, response });
      } else {
        console.log('Payment status:', response.data.status);
      }
    })
    .catch((error) => {
      console.error('Error fetching payment status:', error);
    });
}

module.exports = { pollPaymentStatus };
