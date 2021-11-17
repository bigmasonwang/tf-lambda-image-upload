const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});

module.exports.handler = async (req, res) => {
  const { userId } = req.query;
  if (!_.isString(userId)) {
    return res.status(401).json({ error: 'Invalid userId' });
  }

  // Generate tempUrl with key
  try {
    const tempUrl = await generateTempUrlWithKey('getObject', userId);
    return res.status(200).json({ url: tempUrl });
  } catch {
    return res.status(401).json({ error: 'userId/photo Key not found'});
  }
};