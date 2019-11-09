const mongoose = require('mongoose');
const uniquenessValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    name: { type: String, required: true, unique: true },
    productIds: [String]
});

areaSchema.plugin(uniquenessValidator);

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
