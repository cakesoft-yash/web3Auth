const config = require('config');
const request = require('request');

exports.login = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.password) throw Error('Password is required');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.login,
      body: {
        email: obj.email,
        password: obj.password,
        loggedInApp: 'zti'
      },
      json: true
    }, function (err, httpResponse, response) {
      if (err) {
        reject(err);
        return;
      }
      if (!response.success) reject(response);
      resolve(response);
    });
  });
  return result;
}