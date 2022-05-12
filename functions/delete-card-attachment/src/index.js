const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const payload = JSON.parse(req.payload ? req.payload : '{}');

  if (
    !payload ||
    !payload.$collection ||
    !payload.ref ||
    !payload.bucketId ||
    !payload.$id
  ) {
    res.json({ error: 'Invalid payload' }, 400);
  }

  const client = new sdk.Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setJWT(process.env['APPWRITE_FUNCTION_JWT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID']);

  const storage = new sdk.Storage(client);
  const database = new sdk.Database(client);

  try {
    await storage.deleteFile(payload.bucketId, payload.ref);
    await database.deleteDocument(payload.$collection, payload.$id);
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
};
