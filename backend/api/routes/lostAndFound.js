const multer = require('multer');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile } = require('../../service/awsS3Config');
const upload = multer({ dest: '/upload' });
const router = require('express').Router();

router.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file;
  console.log(file);

 console.log(uploadFile)
  // return
  const response = await uploadFile(file);
  console.log(response);
  console.log("-----------------------------------")
  await unlinkFile(file.path);
  const description = req.body.description;
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
