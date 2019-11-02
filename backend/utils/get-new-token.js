const jwt = require('jsonwebtoken');
const jwtSecret = require('./../sensitive/jwt-secret');

function getNewToken(userEmail, userId, expiresInHoursNumber) {
    const expiresIn = expiresInHoursNumber + 'h';
    const token = jwt.sign(
        { email: userEmail, userId },
        jwtSecret,
        { expiresIn }
    );

    return {
        token,
        expirationTime: Date.now() + expiresInHoursNumber * 3600000 // ... + ... * milliseconds in one hour
    }
}

module.exports = getNewToken;
