const crypto = require('crypto');

function generateTXCode() {
  const code = crypto.randomBytes(10).toString('hex');
  return code.substring(0, 7);
}

// console.log(generateTXCode());

module.exports = { generateTXCode };
