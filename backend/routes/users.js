const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const Admin = require('./../models/admin');
const jwtSecret = require('./../sensitive/jwt-secret');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const isAdmin = (req.body.isAdmin === true) ? true : false;
    let user, userName, userEmail, userPhone, userId;

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
        const warehouseId = req.body.warehouseId;

        userName = req.body.name;
        userEmail = req.body.email;
        userPhone = req.body.phone;

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

        if (!warehouseId || typeof warehouseId !== 'string') {
            throw new Error('The warehouse')
        }

        user = new User({
            name: userName,
            email: userEmail,
            password: hash,
            phone: userPhone,
            isAdmin,
            warehouseId
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
        const token = jwt.sign(
            { email: userEmail, userId },
            jwtSecret,
            { expiresIn: '1h' }
        );
        
        return res.status(201).json({
            message: 'User has been created successfuly!',
            result: {
                token,
                user: {
                    name: userName,
                    phone: userPhone,
                    userId: userId,
                    ...adminInfo
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

            const token = jwt.sign(
                { email: foundUser.email, userId: foundUser.userId },
                jwtSecret,
                { expiresIn: '1h' }
            )

            return res.status(200).json({
                token,
                user: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId: foundUser.userId,
                    adminId: foundUser.userId
                }
            });
        })
        .catch(error => {
            return req.status(401).json({
                message: 'An authentication failed!',
                error
            })
        })
})

module.exports = router;