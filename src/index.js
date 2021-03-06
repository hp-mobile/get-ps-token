const request = require('request-promise');

const getToken = async ({
  PS_HOSTNAME = '',
  PS_ENVIRONMENT = '',
  PS_USERNAME = '',
  PS_PASSWORD = '',
  HTTP_USERNAME = '',
  HTTP_PASSWORD = ''
}) => {
  const jar = request.jar();
  const uri = `https://${PS_HOSTNAME}/psp/${PS_ENVIRONMENT}/?cmd=login`;

  let response = null;

  if(HTTP_USERNAME && HTTP_PASSWORD) {
    response = await request
    .post({
      uri,
      headers: { 'User-Agent': 'request' },
      jar,
      resolveWithFullResponse: true,
      simple: false
    })
    .form({ userid: PS_USERNAME, pwd: PS_PASSWORD })
    .auth(HTTP_USERNAME, HTTP_PASSWORD);
  } else {
    response = await request
    .post({
      uri,
      headers: { 'User-Agent': 'request' },
      jar,
      resolveWithFullResponse: true,
      simple: false
    })
    .form({ userid: PS_USERNAME, pwd: PS_PASSWORD });
  }

  if (response.statusCode === 401) {
    throw new Error('Invalid web server username and/or password');
  }

  if (response.statusCode >= 400) {
    throw new Error(response.message);
  }

  if (!jar.getCookieString(uri).includes('PS_TOKEN')) {
    throw new Error('Invalid PeopleSoft username and/or password');
  }

  return jar;
};

module.exports = getToken;
