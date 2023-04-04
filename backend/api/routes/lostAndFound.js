const multer = require('multer');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { upload: uploadFile } = require('../../service/awsS3Config');
const upload = multer({ dest: '/upload' });
const router = require('express').Router();

router.post('/customer/upload', upload.single('image'), async (req, res) => {
  const file = req.file;
  console.log(file);

  const response = await uploadFile(file);
  await unlinkFile(file.path);
  const description = req.body.description;
  console.log(response);
  res.send({ imagePath: `/images/${response.Key}` });
});

// ------------------------------------------------------

router.get('/images/:key', (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;
