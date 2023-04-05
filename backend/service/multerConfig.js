const multer = require('multer');
const path = require('path');

const initiateMediaTransfer = (dest) => {
  const storage = multer.diskStorage({
    destination: `./uploads/lost_and_found/${dest}`,
    filename: function (req, file, cb) {
      // console.log(file);
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = function (req, file, cb) {
    // Only accept certain file types
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg,jpg and .png files are allowed'), false);
    }
  };

  // Set up the Multer middleware

  const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 }, // 3MB
    fileFilter: fileFilter,
  });
  return upload;
};
// console.log('-----------------------');
// console.log(upload);

module.exports = { initiateMediaTransfer };
