const config = require('config');
const request = require('request');
const Notification = require('../models/notification.model');

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