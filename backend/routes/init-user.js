const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../sensitive/jwt-secret');
const User = require('../models/user');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.slice(authHeader.indexOf('Bearer ') + 'Bearer '.length);

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;
        const foundUser = await User.findById(userId);
        const isAdmin = foundUser.isAdmin;
        const warehouseId = foundUser.warehouseId;

        return res.status(200).json({
            message: 'Successfully fetched initial data!',
            result: {
                user: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId,
                    ...(warehouseId ? { warehouseId } : null)
                },
                isAdmin
            }
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Failed to fetch initial data!',
            error
        })
    }
});

module.exports = router;