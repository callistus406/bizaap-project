const S3 = require('aws-sdk/clients/s3');
require('dotenv').config();
const fs = require('fs');
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secreteAccessKey = process.env.AWS_ACCESS_SECRETE_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secreteAccessKey,
});

// upload

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);
  console.log({
    region,
    bucketName,
    accessKeyId,
    secreteAccessKey,
    key: file.filename,
  });
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
};

// download
// downloads a file from s3
function downloadFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,

    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
module.exports = { uploadFile, downloadFileStream };
