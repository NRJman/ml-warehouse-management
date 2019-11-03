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
        const adminInfo = (adminId) ? { adminId } : null;
        const warehouseInfo = (userWarehouseId && typeof userWarehouseId === 'string') ? {
            warehouseId: userWarehouseId
        } : null;

        return res.status(201).json({
            message: 'User has been created successfuly!',
            result: {
                tokenInfo: getNewToken(userEmail, userId, 1),
                userInfo: {
                    name: userName,
                    phone: userPhone,
                    userId: userId,
                    isAdmin,
                    ...warehouseInfo,
                    ...adminInfo,
                }
            }
        });   
    }
});

router.post('/signin', async (req, res, next) => {
    let foundUser;

    try {
        foundUser = await User.findOne({ email: req.body.email });

        if (!foundUser) {
            throw new Error(`Couldn't find a user with such an email!`);
        }

        if (!arePasswordsEqual()) {
            throw new Error('The password is incorrect!');
        }

        return sendResponse();
    } catch (error) {
        return res.status(401).json({
            message: 'An authentication failed!',
            error
        })
    }

    async function arePasswordsEqual() {
        return await bcrypt.compare(req.body.password, foundUser.password)
    }

    async function sendResponse() {
        const foundUserId = foundUser._id;
        const warehouseInfo = (foundUser.warehouseId) ? { warehouseId: foundUser.warehouseId } : null;

        if (foundUser.isAdmin) {
            const adminInfo = await Admin.findOne({ userId: foundUserId });
            var { _id: adminId, subordinateIds } = adminInfo;
        }

        return res.status(200).json({
            message: 'User has been successfully signed in!',
            result: {
                tokenInfo: getNewToken(foundUser.email, foundUser.userId, 1),
                userInfo: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId: foundUserId,
                    isAdmin: foundUser.isAdmin,
                    ...warehouseInfo,
                    ...((adminId) ? { adminId } : null),
                    ...((subordinateIds) ? { subordinateIds } : null)
                }
            }
        });
    }
});

module.exports = router;