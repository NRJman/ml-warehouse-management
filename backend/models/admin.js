const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    creationDate: String,
    resolvingDate: String,
    isResolved: Boolean,
    description: String,
    assigneeId: String
});

const adminSchema = new Schema({
    userId: String,
    subordinateIds: [String],
    tasksList: [taskSchema]
});

module.exports = mongoose.model('Admin', adminSchema)