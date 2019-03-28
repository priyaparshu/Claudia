function updateOrder(id, updates) {
    if (!id || !updates)
        throw new Error('The order ID and updates object are required')
    return {
        message: `order ${id} was successfully updated`
    }
}



module.exports = updateOrder