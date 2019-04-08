const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient()
function deleteOrder(orderId) {

    if (!orderId)
        throw new Error('Order Id is required for deleting the order')

    return docClient.delete({
        TableName: 'pizza-orders',
        Key: {
            orderId: orderId
        }
    }).promise()
        .then((res) => {
            console.log('deleted successfully', res)
            return res
        })
        .catch((delErr) => {
            console.log('Delete operation failed ', res)
            throw delErr

        })

}




module.exports = deleteOrder