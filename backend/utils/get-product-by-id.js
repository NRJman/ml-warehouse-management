module.exports = (warehouse, productId) =>
    warehouse.products.find(
        product => product._id.toString() === productId
    );