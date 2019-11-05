const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Admin = require('./../models/admin');
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
            subordinateIds: []
        });
        
        return admin.save();
    }

    function sendResponse(adminId) {
        const warehouseId = userWarehouseId;

        return res.status(201).json({
            message: 'User has been created successfuly!',
            result: {
                tokenInfo: getNewToken(userEmail, userId, 1),
                user: {
                    name: userName,
                    phone: userPhone,
                    userId: userId,
                    ...(warehouseId ? { warehouseId } : null)
                },
                isAdmin
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
        const warehouseId = foundUser.warehouseId;
        const foundUserId = foundUser._id;

        if (foundUser.isAdmin) {
            const adminInfo = await Admin.findOne({ userId: foundUserId });

            adminId = adminInfo._id;
        }

        return res.status(200).json({
            message: 'User has been successfully signed in!',
            result: {
                tokenInfo: getNewToken(foundUser.email, foundUserId, 1),
                user: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId: foundUserId,
                    ...(warehouseId ? { warehouseId } : null)
                },
                isAdmin: foundUser.isAdmin
            }
        });
    }
});

module.exports = router;