const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodbAccessKey = require('./sensitive/mongodb-access-key');
const socketIo = require('socket.io');
const adminRoutes = require('./routes/admins');
const warehouseRoutes = require('./routes/warehouses');
const app = express();

app.io = socketIo();

const userRoutes = require('./routes/users');

mongoose.connect(`mongodb+srv://Vadym:${mongodbAccessKey}@wms-cluster-xayjt.mongodb.net/test?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to a db!');
    })
    .catch(() => {
        console.log('Failed to connect to a db');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Rights-Id'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );

    next();
});

app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/warehouses', warehouseRoutes(app.io));

app.io.on("connection", function (socket) {
    console.log('Client connected');
});

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>The home server page!</h1>');
});

module.exports = app;