const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    name: String,
    productIds: [String]
});

const productSchema = new Schema({
    brandName: String,
    description: String,
    isInWarehouse: Boolean,
    areaId: String,
    warehouseId: String
});

const taskSchema = new Schema({
    creationDate: String,
    resolvingDate: String,
    isResolved: Boolean,
    description: String,
    assigneeId: String
});

const warehouseSchema = new Schema({
    areas: [areaSchema],
    products: [productSchema],
    tasks: [taskSchema],
    adminId: String
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
