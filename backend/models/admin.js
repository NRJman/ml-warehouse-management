const mongoose = require('mongoose');
const uniquenessValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userInfo: userInfoSchema,
    subordinates: [userInfoSchema],
    tasksList: [taskSchema]
});

const userInfoSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    isAdmin: Boolean,
    warehouseId: String
});

const taskSchema = new Schema({
    creationDate: String,
    resolvingDate: String,
    isResolved: Boolean,
    description: String,
    assignee: String
});

userSchema.plugin(uniquenessValidator);

module.exports = mongoose.model('User', userSchema)