
function createOrder(order) {
    if (!order || !order.pid || !order.address)
        throw new Error('The Pizza Id and Address are required')
    return {}
}
module.exports = createOrder

