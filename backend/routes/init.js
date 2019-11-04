const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./../sensitive/jwt-secret');
const User = require('./../models/user');
const Admin = require('./../models/admin');
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
        let adminInfo;

        if (isAdmin) {
            adminInfo = getAdminInfo(foundUser, userId);
        }

        return res.status(200).json({
            message: 'Successfully fetched initial data!',
            result: {
                name: foundUser.name,
                phone: foundUser.phone,
                userId,
                isAdmin,
                ...adminInfo,
                warehouseId
            }
        })
    } catch (error) {
        return res.status(401).json({
            message: 'Failed to fetch initial data!',
            error
        })
    }

    async function getAdminInfo(foundUser, userId) {
        const foundAdmin = await Admin.findOne({ userId });
        const subordinateIds = foundAdmin.subordinateIds;

        if (!subordinateIds || subordinateIds.length > 0) {
            return { subordinateIds }
        }

        return null;
    }
});

module.exports = router;