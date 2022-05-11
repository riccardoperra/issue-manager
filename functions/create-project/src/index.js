const sdk = require('node-appwrite');

const adminClient = new sdk.Client()
  .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
  .setKey(process.env['APPWRITE_FUNCTION_API_KEY'])
  .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID']);

module.exports = async function (req, res) {
  const client = new sdk.Client()
    .setEndpoint(process.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setJWT(process.env['APPWRITE_FUNCTION_JWT'])
    .setProject(process.env['APPWRITE_FUNCTION_PROJECT_ID']);

  const database = new sdk.Database(adminClient);
  const storage = new sdk.Storage(adminClient);
  const teams = new sdk.Teams(client);

  const payload = JSON.parse(req.payload ? req.payload : '{}');

  const name = payload.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const team = await teams.create('unique()', payload.name, ['owner']);

  try {
    const teamPermission = `team:${team.$id}`;

    const { name, description, tags, visibility } = payload;

    const readPermissions = [
      ...(visibility === 'public' ? ['role:all'] : []),
      teamPermission,
    ];

    const bucket = await storage.createBucket(
      'unique()',
      `bucket_${name}`,
      'bucket',
      readPermissions,
      [teamPermission],
      true,
      undefined,
      undefined,
      true,
      true
    );

    const project = await database.createDocument(
      payload.$collectionId,
      team.$id,
      { name, description, tags, visibility, bucketId: bucket.$id },
      readPermissions,
      [teamPermission]
    );

    res.json(project);
  } catch (e) {
    teams.delete(team.$id).then();
    storage.deleteBucket(name).then().catch();
    database.deleteDocument(payload.$collectionId, team.$id).then().catch();
    res.send('Error while creating team', 300);
  }
};
