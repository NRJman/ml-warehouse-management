const jwt = require('jsonwebtoken');
const jwtSecret = require('./../sensitive/jwt-secret');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // According to the "Bearer" approach:
        const token = authHeader.slice(authHeader.indexOf('Bearer ') + 'Bearer '.length);

        jwt.verify(token, jwtSecret);

        next();
    } catch (error) {
        res.status(401).json({
            message: "An authentication failed due to an invalid access token!"
        })
    }
}
