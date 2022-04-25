// Perform all your imports
const sdk = require('node-appwrite');
const { randomUUID } = require('crypto');

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

const client = new sdk.Client();

client
  .setJWT(process.env.APPWRITE_FUNCTION_JWT)
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID); // Your project ID

const database = new sdk.Database(client);
const teams = new sdk.Teams(client);

module.exports = async (request, response) => {
  const payload = JSON.parse(request.payload ? request.payload : '{}');

  const name = kebabCase(payload.name);

  const team = await teams.create('unique()', `project_workspace_${name}`, []);

  try {
    const teamPermission = `team:${team.$id}`;

    const { name, description, tags, visibility } = payload;

    const project = await database.createDocument(
      payload.$collectionId,
      team.$id,
      { name, description, tags, visibility, workspaceId: team.$id },
      [teamPermission],
      [teamPermission]
    );

    // TODO: init list of categories?

    response.json(project);
  } catch (e) {
    teams.delete(team.$id).then();
    response.send('Error while creating team', 500);
  }
};
