const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();

  if (!req.env['APPWRITE_FUNCTION_ENDPOINT']) {
    console.warn(
      'Environment variables are not set. Function cannot use Appwrite SDK.'
    );
  }

  client
    .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
    // .setKey(req.env['APPWRITE_FUNCTION_API_KEY'])
    .setJWT(req.env['APPWRITE_FUNCTION_JWT']);

  const database = new sdk.Database(client);
  const teams = new sdk.Teams(client);

  const payload = JSON.parse(req.payload ? req.payload : '{}');

  const name = payload.name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const team = await teams.create('unique()', `project_workspace_${name}`, [
    'owner',
  ]);

  try {
    const teamPermission = `team:${team.$id}`;

    const { name, description, tags, visibility } = payload;

    const project = await database.createDocument(
      payload.$collectionId,
      team.$id,
      { name, description, tags, visibility },
      [teamPermission],
      [teamPermission]
    );

    // TODO: init list of categories?
    res.json(project);
  } catch (e) {
    teams.delete(team.$id).then();
    res.send('Error while creating team', 300);
  }
};