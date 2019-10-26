const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const Admin = require('./../models/admin');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    const isAdmin = (req.body.isAdmin === true) ? true : false;

    console.log(isAdmin);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log(`hash: ${hash}`)

            if (isAdmin) {
                const userName = req.body.name;
                const userPhone = req.body.phone;
                let userId;

                const user = new User({
                    name: userName,
                    email: req.body.email,
                    password: hash,
                    phone: userPhone,
                    isAdmin
                });

                user.save()
                    .then(userCreationResult => {
                        userId = userCreationResult._id;
                        
                        const admin = new Admin({
                            userId,
                            subordinatesIds: [],
                            tasksList: []
                        });

                        console.log(`saved user: ${userId}`);
                        
                        return admin.save();
                    })
                    .then(adminCreationResult => {
                        res.status(201).json({
                            message: 'User has been created successfuly!',
                            result: {
                                name: userName,
                                phone: userPhone,
                                userId: userId,
                                adminId: adminCreationResult._id
                            }
                        })
                        
                        console.log(`saved admin: ${adminCreationResult._id}`);                        
                    })
                    .catch(error => {
                        console.log(`error: ${error}`);

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