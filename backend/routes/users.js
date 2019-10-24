const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Admin = require('./../models/admin');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    const isAdmin = (req.query.isAdmin === 'true') ? true : false;

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            if (isAdmin) {
                let createdUserId;

                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    phone: req.body.phone,
                    isAdmin: true
                });

                user.save()
                    .then(userCreationResult => {
                        createdUserId = result._id;

                        const admin = new Admin({
                            userId: createdUserId,
                            subordinatesIds: [],
                            tasksList: []
                        });

                        return admin.save();
                    })
                    .then(adminCreationResult => {
                        res.status(201).json({
                            message: 'User has been created successfuly!',
                            result: {
                                userId: createdUserId
                            }
                        })
                    })
                    .catch(error => {
                        res.status(500).json({
                            message: 'An error has been caught while creating a user!',
                            error
                        })
                    });

                return;
            }
        });
})

module.exports = router;