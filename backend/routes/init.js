const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./../sensitive/jwt-secret');
const User = require('./../models/user');
const Admin = require('./../models/admin');
const Warehouse = require('./../models/warehouse');
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
        let adminInfo, warehouseInfo;

        if (isAdmin) {
            adminInfo = getAdminInfo(foundUser, userId);
        }

        if (warehouseId) {
            warehouseInfo = getWarehouseInfo(warehouseId)
        }

        return res.status(200).json({
            message: 'Successfully fetched initial data!',
            result: {
                name: foundUser.name,
                phone: foundUser.phone,
                userId,
                isAdmin,
                ...adminInfo,
                ...warehouseInfo
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

    async

    async function getWarehouseInfo(warehouseId) {
        try {
            const foundWarehouse = await Warehouse.findById(warehouseId);

            return (
                ({areas, products, tasks, adminId }) => ({ areas, products, tasks, adminId })
            )(foundWarehouse);           
        } catch (error) {
            return null;
        }
    }
});

module.exports = router;