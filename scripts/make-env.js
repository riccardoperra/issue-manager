const fs = require('fs');
const { resolve } = require('path');

const env = resolve(
  __dirname,
  '../',
  'src',
  'environments',
  'environment.prod.ts'
);

const content = `export const environment = {
  production: true,
  appwriteProject: '${process.env.APPWRITE_PROJECT}',
  appwriteEndpoint: '${process.env.APPWRITE_ENDPOINT}',
};`;

fs.writeFileSync(env, content);
