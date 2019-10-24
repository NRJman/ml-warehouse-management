const mongoose = require('mongoose');
const uniquenessValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    isAdmin: Boolean,
    warehouseId: String
});

userSchema.plugin(uniquenessValidator);

module.exports = mongoose.model('User', userSchema)