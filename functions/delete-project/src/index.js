const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const adminClient = new sdk.Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setKey(process.env['APPWRITE_FUNCTION_API_KEY'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID'])
    .setSelfSigned(true);

  const eventName = process.env.APPWRITE_FUNCTION_EVENT;

  if (eventName === 'database.documents.delete') {
    const data = JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA);

    const { bucketId, $id } = data;

    try {
      const storage = new sdk.Storage(adminClient);
      const teams = new sdk.Teams(adminClient);

      await storage.deleteBucket(bucketId);
      await teams.delete($id);

      res.send({ status: 'ok' });
    } catch (e) {
      res.send({ err: bucketId });
    }
  }
};
