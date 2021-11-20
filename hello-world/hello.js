// // Lambda function code
// const { v4: uuidv4 } = require('uuid');
// const AWS = require('aws-sdk');

// const region = process.env.AWS_REGION;
// const UploadBucket = process.env.AWS_UPLOAD_IMAGE_BUCKET;
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

// AWS.config.update({ region });
// const s3 = new AWS.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: 'v4'
// });

// module.exports.handler = async (event) => {
//   console.log('Event: ', event);

//   // Random ID for image
//   const Key = uuidv4();

//   const params = {
//     Bucket: UploadBucket,
//     Key,
//     Expires: 300,
//   };

//   const uploadURL = await s3.getSignedUrlPromise('putObject', params);

//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       uploadURL,
//       Key,
//     }),
//   };
// };

const AWS = require('aws-sdk');

const region = process.env.AWS_REGION;
const UploadBucket = process.env.AWS_UPLOAD_IMAGE_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({ region });
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

module.exports.handler = async (event) => {
  let Key = '';
  if (event.queryStringParameters && event.queryStringParameters['key']) {
    Key = event.queryStringParameters['key'];
  } else {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'key needed',
      }),
    };
  }
  const params = {
    Bucket: UploadBucket,
    Key,
    Expires: 3600,
  };

  // Get signed temporary URL from S3, with deleteObject/getObject option
  const tempUrl = await s3.getSignedUrlPromise('getObject', params);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tempUrl,
    }),
  };
};
