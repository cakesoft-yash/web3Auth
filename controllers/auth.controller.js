// const config = require('config');
// const request = require('request');

// const ShopService = require('../services/shop.services');
// const UserService = require('../services/user.services');
// const AdminService = require('../services/admin.services');
// const InsuranceService = require('../services/insurance.services');

// exports.verifyTokenForShop = async function (req, res, next) {
//     try {
//         if (!req.headers['authorization']) {
//             res.status(401).send({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//             return;
//         }
//         let [scheme, token] = req.headers['authorization'].toString().split(' ');
//         if (!scheme || !token) {
//             res.status(401).send({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//             return;
//         }
//         if (scheme.toLowerCase() != 'bearer') {
//             res.status(401).send({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//             return;
//         }
//         let shop = await ShopService.getShopByToken(token);
//         if (!shop) {
//             res.status(401).send({
//                 success: false,
//                 message: 'Unauthorized'
//             });
//             return;
//         };
//         req['shop'] = shop;
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send({ success: false, message: error.message });
//     }
//     next();
// }

// exports.verifyTokenForUser = async function (req, res, next) {
//     try {
//         if (!req.headers['authorization']) {
//             res.sendStatus(401);
//             return;
//         }
//         let [scheme, token] = req.headers['authorization'].toString().split(' ');
//         if (!scheme || !token) {
//             res.sendStatus(401);
//             return;
//         }
//         if (scheme.toLowerCase() != 'bearer') {
//             res.sendStatus(401);
//             return;
//         }
//         let user = await UserService.findUser(token);
//         if (!user) {
//             let result = await new Promise((resolve, reject) => {
//                 request.get({
//                     url: config.chatUserDetail.url,
//                     headers: { authorization: `bearer ${token}`, module: 'marketplace' }
//                 }, function (err, httpResponse, response) {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                     if (typeof response === 'string' && response.toLowerCase().includes('503 service unavailable')) {
//                         reject({ message: response.message || response });
//                         return;
//                     }
//                     response = JSON.parse(response);
//                     if (!response.success) reject('Internal server error');
//                     resolve(response.user);
//                 });
//             });
//             user = await UserService.createOrUpdateUser(result, result.marketplaceAccessToken);
//         }
//         req['user'] = user;
//         next();
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send({ success: false, message: error.message || error });
//     }
// }

// exports.verifyTokenForOrder = async function (req, res, next) {
//     try {
//         if (!req.query['access_token']) {
//             res.sendStatus(401);
//             return;
//         }
//         let [scheme, token] = req.query['access_token'].toString().split(' ');
//         if (!scheme || !token) {
//             res.sendStatus(401);
//             return;
//         }
//         if (scheme.toLowerCase() != 'bearer') {
//             res.sendStatus(401);
//             return;
//         }
//         let user = await UserService.findUser(token);
//         if (!user) {
//             res.sendStatus(401);
//             return;
//         };
//         req['user'] = user;
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send({ success: false, message: error.message });
//     }
//     next();
// }

// exports.verifyTokenForAdmin = async function (req, res, next) {
//     try {
//         if (!req.headers['authorization']) {
//             res.sendStatus(401);
//             return;
//         }
//         let [scheme, token] = req.headers['authorization'].toString().split(' ');
//         if (!scheme || !token) {
//             res.sendStatus(401);
//             return;
//         }
//         if (scheme.toLowerCase() != 'bearer') {
//             res.sendStatus(401);
//             return;
//         }
//         let user = await AdminService.getUserByToken(token);
//         if (!user) {
//             res.sendStatus(401);
//             return;
//         };
//         Object.assign(user, { token });
//         req['user'] = user;
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send({ success: false, message: error.message });
//     }
//     next();
// }

// exports.verifyTokenForInsurance = async function (req, res, next) {
//     try {
//         let accessToken = req.body.token || req.query.token;
//         if (!accessToken) {
//             res.sendStatus(401);
//             return;
//         }
//         let token = accessToken.trim();
//         let tokenValid = await InsuranceService.verifyToken(token);
//         if (!tokenValid) {
//             res.sendStatus(401);
//             return;
//         };
//     } catch (error) {
//         console.log('error', error);
//         res.status(500).send({ success: false, message: error.message });
//     }
//     next();
// }