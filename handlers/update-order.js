const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

function updateOrder(orderId, options) {
    if (!options || !options.pizza || !options.address)
        throw new Error('Pizza and address  are required')

    return docClient.update({
        TableName: 'pizza-orders',
        Key: {
            orderId: orderId
        },
        UpdateExpression: 'set pizza = :p , address = :a',
        ExpressionAttributeValues: {
            ':p': options.pizza,
            ':a': options.address
        },
        ReturnValues: "ALL_NEW"
    })
        .promise()
        .then((res) => {
            console.log('order is updated', res)
            return res.Attributes
        })
        .catch((updatedErr) => {
            console.log(`order was nt updated`, updatedErr)
            throw updatedErr
        })
}



module.exports = updateOrder