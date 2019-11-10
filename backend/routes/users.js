const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../sensitive/jwt-secret');
const User = require('./../models/user');
const Admin = require('./../models/admin');
const getNewToken = require('./../utils/get-new-token');

const router = express.Router();

router.post('/signup/admin', (req, res, next) => {
    console.log('REGISTRATION DATA: ', req.body.registrationData);

    const { name, email, password, phone } = req.body.registrationData;
    let userId;

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                name,
                email,
                password: hash,
                phone,
                isAdmin: true
            });

            return user.save();
        })
        .then(createdUser => {
            userId = createdUser._id;

            const admin = new Admin({
                userId,
                subordinateIds: []
            });

            return admin.save();
        })
        .then(createdAdmin => res.status(201).json({
            message: 'Admin has been created successfuly!',
            result: {
                tokenInfo: getNewToken(email, userId, 1),
                user: {
                    name,
                    phone,
                    userId
                },
                isAdmin: true
            }
        }))
        .catch(error => res.status(500).json({
            message: 'Failed to create an admin!',
            error
        }));
});

router.post('/signup/subordinates', (req, res, next) => {
    const warehouseId = req.body.warehouseId;
    const registrationDataList = req.body.registrationDataList;
    
    if (!warehouseId || typeof warehouseId !== 'string' || !(registrationData instanceof Array)) {
        return res.status(400).json({
            message: 'The request body is invalid!'
        });
    }

    const passwordsHashingPromises = registrationData.map(({ password }) => {
        return bcrypt.hash(password, 10)
    });

    Promise.all(passwordsHashingPromises)
        .then(hashedPasswords => {
            const subordinatesDataList = hashedPasswords.map(hashedPassword, i => {
                const appropriateRegistrationData = registrationDataList[i];
                
                return {
                    name: appropriateRegistrationData.name,
                    email: appropriateRegistrationData.email,
                    password: hashedPassword,
                    phone: appropriateRegistrationData.phone,
                    isAdmin: false,
                    warehouseId,
                }
            });

            return User.insertMany(subordinatesDataList);
        })
        .then(createdSubordinates => {
            const mappedCreatedSubordinates = createdSubordinates.map(
                subordinate => ({
                    name,
                    phone,
                    userId: subordinate._id,
                    warehouseId
                })
            );

            return res.status(201).json({
                message: 'Subordinates have been successfully created!',
                result: mappedCreatedSubordinates,
            });
        })
        .catch(error => res.status(500).json({
            message: 'Failed to create subordinates',
            error
        }));
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
        const { isAdmin, warehouseId, _id: userId} = foundUser;

        if (isAdmin) {
            await Admin.findOne({ userId });
        }

        return res.status(200).json({
            message: 'User has been successfully signed in!',
            result: {
                tokenInfo: getNewToken(foundUser.email, userId, 1),
                user: {
                    name: foundUser.name,
                    phone: foundUser.phone,
                    userId,
                    ...(warehouseId ? { warehouseId } : null)
                },
                isAdmin
            }
        });
    }
});

router.get('/init', async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    console.log(authHeader);

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