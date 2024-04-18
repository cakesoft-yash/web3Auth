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
        loggedInApp: 'zti',
        appNameForNotification: 'zti'
      },
      json: true
    }, function (err, httpResponse, response) {
      if (err) {
        reject(new Error(err));
        return;
      }
      if (response && typeof response === 'string' && response.includes('Application is not available')) {
        reject(new Error('Chat server not available. Please try after some time'));
        return;
      }
      if (!response.success) {
        reject(new Error(response.message || response.error || response));
        return;
      }
      resolve(response);
    });
  });
  return result;
}

exports.signup = async function (obj) {
  if (!obj.firstName) throw Error('FirstName is required');
  if (!obj.lastName) throw Error('LastName is required');
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.email) throw Error('Email is required');
  if (!obj.password) throw Error('Password is required');
  if (!obj.confirmPassword) throw Error('confirmPassword is required');
  if (!obj.userName) throw Error('UserName is required');
  if (!obj.displayUsername) throw Error('DisplayUsername is required');
  if (!obj.ztiAppName) throw Error('Zti AppName is required');
  if (obj.password !== obj.confirmPassword) throw Error('Password mismatch');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.signup,
      body: {
        signInMethod: 'web2',
        firstName: obj.firstName,
        lastName: obj.lastName,
        phone: obj.phone,
        email: obj.email,
        password: obj.password,
        userName: obj.userName,
        loggedInApp: 'zti',
        appNameForNotification: 'zti',
        displayUsername: obj.displayUsername,
        ztiAppName: obj.ztiAppName,
      },
      json: true
    }, function (err, httpResponse, response) {
      if (err) {
        reject(new Error(err));
        return;
      }
      if (response && typeof response === 'string' && response.includes('Application is not available')) {
        reject(new Error('Chat server not available. Please try after some time'));
        return;
      }
      if (!response.success) {
        reject(new Error(response.message || response.error || response));
        return;
      }
      resolve(response);
    });
  });
  return result;
}