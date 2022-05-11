const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const adminClient = new sdk.Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setKey(process.env['APPWRITE_FUNCTION_API_KEY'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID']);

  const cardsCollection = '626044d20dbc091c2598';
  const categoriesCollection = '62604a098cb45c928e5b';

  const storage = new sdk.Storage(adminClient);
  const database = new sdk.Database(adminClient);
  const teams = new sdk.Teams(adminClient);

  const { bucketId, $id, $collection } = JSON.parse(req.payload);

  const cardsToDelete = await database.listDocuments(cardsCollection, [
    sdk.Query.equal('projectId', $id),
  ]);

  const listsToDelete = await database.listDocuments(categoriesCollection, [
    sdk.Query.equal('projectId', $id),
  ]);

  await Promise.all([
    ...cardsToDelete.documents.map((doc) =>
      database.deleteDocument(cardsCollection, doc.$id)
    ),
    ...listsToDelete.documents.map((doc) =>
      database.deleteDocument(categoriesCollection, doc.$id)
    ),
  ]);

  await database.deleteDocument($collection, $id);
  await storage.deleteBucket(bucketId);
  await teams.delete($id);

  res.send({ status: 'ok' });
};
