'use strict'
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();


module.exports = function updateDeliveryStatus(request) {
    if (!request.deliveryId || !request.status)
        throw new Error('status and delivery ID are required')

    return docClient.update({
        TableName: 'pizza-orders',
        Key: {
            orderId: request.deliveryId
        },
        AttributeUpdates: {
            deliveryId: {
                deliveryStatus: {
                    Action: 'PUT',
                    Value: request.status

                }
            }
        }
    }).promise()
        .then(() => {
            return {}
        })
}