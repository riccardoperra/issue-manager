# create-project

Trigger the create-project steps:
- Creates a new team
- Create a new storage bucket 
- Add permissions to collections
- Creates the project entity

## 🤖 Documentation

Simple function similar to typical "hello world" example, but instead, we return a simple JSON that tells everyone how awesome developers are.

<!-- Update with your description, for example 'Create Stripe payment and return payment URL' -->

_Example input:_

This function expects no input

<!-- If input is expected, add example -->

_Example output:_

<!-- Update with your expected output -->

```json
{
 "areDevelopersAwesome": true
}
```

## 📝 Environment Variables

List of environment variables used by this cloud function:

- **APPWRITE_FUNCTION_ENDPOINT** - Endpoint of Appwrite project
- **APPWRITE_FUNCTION_API_KEY** - Appwrite API Key
<!-- Add your custom environment variables -->

## 🚀 Deployment

There are two ways of deploying the Appwrite function, both having the same results, but each using a different process. We highly recommend using CLI deployment to achieve the best experience.

### Using CLI

Make sure you have [Appwrite CLI](https://appwrite.io/docs/command-line#installation) installed, and you have successfully logged into your Appwrite server. To make sure Appwrite CLI is ready, you can use the command `appwrite client --debug` and it should respond with green text `✓ Success`.

Make sure you are in the same folder as your `appwrite.json` file and run `appwrite deploy function` to deploy your function. You will be prompted to select which functions you want to deploy.


```bash
appwrite functions createDeployment \
--functionId=create-project \
--activate=true \
--entrypoint='src/index.js' \
--code='./functions/create-project'

```
