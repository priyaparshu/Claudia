const pizzas = require('../data/pizzas.json');

function getPizzas(pid) {
    if (!pid) {
        return pizzas
    }

    const pizza = pizzas.find((pizza) => {
        return pizza.id == pid
    })

    if (pizza) {
        return pizza
    } else {
        throw new Error('The Pizza you requested was not found')
    }
}

module.exports = getPizzas