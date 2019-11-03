const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    userId: String,
    subordinateIds: [String]
});

module.exports = mongoose.model('Admin', adminSchema)