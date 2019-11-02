const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const Admin = require('./../models/admin');
const jwtSecret = require('./../sensitive/jwt-secret');
const getNewToken = require('./../utils/get-new-token');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const isAdmin = (req.body.isAdmin === true) ? true : false;
    const userWarehouseId = req.body.warehouseId;
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPhone = req.body.phone;
    let user, userId;

    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const userCreationResult = await createUser(hash);
        
        if (isAdmin) {
            const adminCreationResult = await createAdmin(userCreationResult);

            return sendResponse(adminCreationResult._id);
        }

        return sendResponse();
    } catch (error) {
        return res.status(500).json({
            message: 'An error has been caught while creating a user!',
            error
        });
    }

    function createUser(hash) {
        if (isAdmin) {
            user = new User({
                name: userName,
                email: userEmail,
                password: hash,
                phone: userPhone,
                isAdmin
            });

            return user.save();
        }

        if (!userWarehouseId || typeof userWarehouseId !== 'string') {
            throw new Error('The warehouse id is invalid or not specified!')
        }

        user = new User({
            name: userName,
            email: userEmail,
            password: hash,
            phone: userPhone,
            isAdmin,
            warehouseId: userWarehouseId
        });

        return user.save()
    }

    function createAdmin(userCreationResult) {
        userId = userCreationResult._id;

        const admin = new Admin({
            userId,
            subordinateIds: [],
            tasksList: []
        });
        
        return admin.save();
    }

    function sendResponse(adminId) {
        const adminInfo = (adminId) ? { adminId } : { };
        const warehouseInfo = (userWarehouseId && typeof userWarehouseId === 'string') ? {
            warehouseId: userWarehouseId
        } : { };

        return res.status(201).json({
            message: 'User has been created successfuly!',
            result: {
                tokenInfo: getNewToken(userEmail, userId, 1),
                user: {
                    name: userName,
                    phone: userPhone,
                    userId: userId,
                    ...warehouseInfo,
                    ...adminInfo,
                }
            }
        });   
    }
});

router.post('/login', (req, res, next) => {
    let foundUser;

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return req.status(401).json({
                    message: `Couldn't find a user with such an email!`
                });
            }

            foundUser = user;

            return bcrypt.compare(req.body.password, user.password)
        })
        .then(comparisonResult => {
            if (!comparisonResult) {
                return req.status(401).json({
                    message: 'The password is incorrect!'
                });
            }

            const adminInfo = (foundUser.isAdmin) ? { adminId: foundUser.userId } : { };
            const warehouseInfo = (foundUser.warehouseId) ? { warehouseId: foundUser.warehouseId } : { };

            return res.status(200).json({
                tokenInfo: getNewToken(foundUser.email, foundUser.userId, 1),
                user: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId: foundUser.userId,
                    ...adminInfo,
                    ...warehouseInfo
                }
            });
        })
        .catch(error => {
            return req.status(401).json({
                message: 'An authentication failed!',
                error
            })
        })
});

module.exports = router;