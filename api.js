"use strict";
const Api = require('claudia-api-builder');
const api = new Api();
const getPizzas = require('./handlers/get-pizzas');
const createOrder = require('./handlers/create-order')
const updateOrder = require('./handlers/update-order')
const deleteOrder = require('./handlers/delete-order')



api.get('/', () => "Welcome to Pizzas API");

api.get('/pizzas', () => {
    return getPizzas();
})


api.post('/orders', (req) => {
    return createOrder(req.body);
}, {
        success: 201,
        error: 400
    })

api.get('/pizzas/{id}', (request) => {
    return getPizzas(request.pathParams.id)
}, {
        error: 404

    })

api.delete('/order/{id}', (req) => {
    return deleteOrder(req.pathParams.id)
}, {
        error: 400
    })
api.put('/order/{id}', (req) => {
    return updateOrder(req.pathParams.id, req.body)
}, {
        success: 200,
        error: 400
    })

module.exports = api;