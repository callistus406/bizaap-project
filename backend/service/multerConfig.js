const multer = require('multer');
const path = require('path');

const initiateMediaTransfer = (req, res, next, _path, dest) => {
  if (_path === 'lost_and_found') {
  }

  dest = dest === '' ? req.user.username : dest;
  // if
  const storage = multer.diskStorage({
    destination: `./uploads/${_path}/${dest}`,
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
  return upload.single('image')(req, res, next);
};
// console.log('-----------------------');
// console.log(upload);

class InitiateUpload {
  constructor(path = '', dest = '') {
    this.path = path;
    this.dest = dest;
    this.startInfoUpload = this.startInfoUpload.bind(this);
  }

  startInfoUpload(req, res, next, path) {
    console.log('ododododo');
    console.log(path, this.dest);
    // return;
    if (this.path) {
      const storage = multer.diskStorage({
        destination: `./uploads/${this.path}/${this.dest}`,
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
      return upload.single('image')(req, res, next);
    }
  }
}
module.exports = { initiateMediaTransfer, InitiateUpload };
