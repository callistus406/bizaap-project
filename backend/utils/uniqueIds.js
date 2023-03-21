const { v4: uniqueIdv4 } = require('uuid'); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const generateUniqueId = () => uniqueIdv4();
module.exports = { generateUniqueId };
