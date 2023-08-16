const config = require('config');
const request = require('request');
const Notification = require('../models/notification.model');
const SocialNotification = require('../models/socialNotification.model');
const WalletNotification = require('../models/walletNotification.model');
const MarketplaceNotification = require('../models/marketplaceNotification.model');

exports.create = async function (obj) {
    return await Notification.create(obj);
}

exports.send = async function () {
    let totalNotifications = await Notification.find(
        {
            status: 'pending'
        }
    ).count();
    for (let index = 0; index < totalNotifications; index += 10) {
        let notifications = await Notification.find(
            {
                status: 'pending'
            }
        ).skip(index).limit(10);
        for (let notification of notifications) {
            try {
                await Notification.updateOne(
                    {
                        _id: notification._id
                    }, {
                    $set: { status: 'processing' }
                }).exec();
                await new Promise((resolve, reject) => {
                    request.post({
                        url: config.sendNotification.url,
                        headers: {
                            authorization: `bearer ${config.sendNotification.token}`
                        },
                        body: {
                            userName: notification.username,
                            title: notification.title,
                            message: notification.message,
                            payload: {
                                type: notification.type,
                                note: notification.note
                            }
                        },
                        json: true
                    }, async function (err, httpResponse, response) {
                        let status;
                        let logs;
                        if (err) { status = 'error'; logs = err }
                        else if (!response.success) { status = 'failed'; logs = response }
                        else { status = 'sent'; logs = response }
                        await Notification.updateOne(
                            {
                                _id: notification._id
                            }, {
                            $set: {
                                status: status,
                                logs: logs,
                                sentAt: new Date(),
                            }
                        }).exec();
                        resolve('');
                    });
                });
            } catch (error) {
                console.log({ errorFromNotificationSend: error });
            }
        }
    }
    setTimeout(exports.send, 5000);
}

exports.list = async function (user) {
    const notifications = await Notification.find(
        {
            username: user.username,
            status: 'sent',
            $or: [
                { isCleared: false },
                { isCleared: { $exists: false } }
            ]
        },
        {
            title: 1,
            message: 1,
            username: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 }).limit(20);
    const socialNotifications = await SocialNotification.find(
        {
            username: user.username,
            status: 'sent',
            $or: [
                { isCleared: false },
                { isCleared: { $exists: false } }
            ]
        },
        {
            title: 1,
            message: 1,
            username: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 }).limit(20);
    const walletNotifications = await WalletNotification.find(
        {
            username: user.username,
            status: 'sent',
            $or: [
                { isCleared: false },
                { isCleared: { $exists: false } }
            ]
        },
        {
            title: 1,
            message: 1,
            username: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 }).limit(20);
    const marketplaceNotifications = await MarketplaceNotification.find(
        {
            username: user.username,
            status: 'sent',
            $or: [
                { isCleared: false },
                { isCleared: { $exists: false } }
            ]
        },
        {
            title: 1,
            message: 1,
            username: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 }).limit(20);
    let allNotifications = [
        ...notifications,
        ...socialNotifications,
        ...walletNotifications,
        ...marketplaceNotifications
    ];
    allNotifications = allNotifications
        .sort((notification1, notification2) => new Date(notification2.createdAt) - new Date(notification1.createdAt))
        .slice(0, 30);
    return {
        success: true,
        allNotifications
    }
}

exports.clearAll = async function (obj, user) {
    if (!obj.notificationIds || !obj.notificationIds.length) throw Error('Notification Ids is required');
    await Notification.updateMany(
        {
            _id: { $in: obj.notificationIds }
        },
        {
            $set: {
                isCleared: true
            }
        }
    );
    await SocialNotification.updateMany(
        {
            _id: { $in: obj.notificationIds }
        },
        {
            $set: {
                isCleared: true
            }
        }
    );
    await WalletNotification.updateMany(
        {
            _id: { $in: obj.notificationIds }
        },
        {
            $set: {
                isCleared: true
            }
        }
    );
    await MarketplaceNotification.updateMany(
        {
            _id: { $in: obj.notificationIds }
        },
        {
            $set: {
                isCleared: true
            }
        }
    );
    return {
        success: true,
        message: 'Notifications cleared successfully'
    }
}