// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'uhpyuzqbs2'
const region = 'ap-south-1'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'nkalra0123.us.auth0.com',            // Auth0 domain
  clientId: 'kkbrtDcP9BxEIPrCZdesINyERgZ3LYiB',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
