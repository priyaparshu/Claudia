'use strict';
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();
const rp = require('minimal-request-promise')
//const uuid = require('uuid')



function createOrder(request) {
    //console.log(request);
    //console.log(request.address);
    console.log('Save an order', request)
    if (!request || !request.pizza || !request.address)
        throw new Error('Please provide Pizza type and address where it needs to be delivered')

    return rp.post('https://some-like-it-hot.effortless-serverless.com/delivery', {
        headers: {
            "Authorization": "aunt-marias-pizzeria-100000000",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            pickupTime: '15.34pm',
            pickupAddress: 'Aunt Maria Pizzeria',
            deliveryAddress: request.address,
            webhookUrl: 'https://jzuw5t3jfb.execute-api.us-east-1.amazonaws.com/latest/delivery',
        })
    })
        .then(rawResponse => JSON.parse(rawResponse.body)
            .then(response => {
                return docClient.put({
                    TableName: 'pizza-orders',
                    Item: {
                        orderId: response.deliveryId,
                        pizza: request.pizza,
                        address: request.address,
                        orderStatus: 'pending'
                    }
                }).promise()
            })
            .then((res) => {
                console.log('order has been saved', res);
                return res
            })
            .catch((e) => {
                console.log('Sorry, Unable to save', e)
                throw e
            }))
}

module.exports = createOrder

