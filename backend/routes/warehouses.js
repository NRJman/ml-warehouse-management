module.exports = function (io) {
    const express = require('express');
    const Warehouse = require('./../models/warehouse');
    const Admin = require('./../models/admin');
    const User = require('./../models/user');
    const request = require('request');
    const predictionApiKey = require('./../sensitive/prediction-api-key');
    const predictionUri = require('./../sensitive/prediction-uri');
    const predictionHandlingConfig = require('./../utils/prediction-handling-config');
    const checkAuth = require('./../middleware/check-auth');
    const checkAdminRights = require('./../middleware/check-admin-rights');
    const taskManipulation = require('./../utils/task-manipulation');

    const router = express.Router();

    router.get('', checkAuth, async (req, res, next) => {
        const userId = req.query.userId;
        let isAdmin, foundUser;

        try {
            foundUser = await User.findById(userId);

            const warehouseId = foundUser.warehouseId;

            isAdmin = foundUser.isAdmin;

            if (!warehouseId) {
                return sendSuccessfulResponse(null);
            }

            const foundWarehouse = await Warehouse.findById(warehouseId);

            return sendSuccessfulResponse({
                areas: foundWarehouse.areas,
                products: foundWarehouse.products,
                tasks: foundWarehouse.tasks,
                warehouseId: foundWarehouse._id,
                ...(isAdmin ? { adminId: foundWarehouse.adminId } : null)
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Failed to fetch the warehouse!',
                error
            })
        }

        function sendSuccessfulResponse(result) {
            res.status(200).json({
                message: result ? 'The warehouse has been fetched successfully' : 'The user is not related to any warehouse yet!',
                result: result ? result : {}
            })
        }
    });

    router.post('/products', checkAuth, checkAdminRights, (req, res, next) => {
        const { warehouseId, productsDataList } = req.body;

        Warehouse.findById(warehouseId)
            .then(warehouse => {
                for (let i = 0, len = productsDataList.length; i < len; i++) {
                    const existingProduct = warehouse.products.find(product =>
                        product.description === productsDataList[i].description &&
                        product.brandName === productsDataList[i].brandName
                    );

                    if (existingProduct) {
                        existingProduct.count += productsDataList[i].count;

                        continue;
                    }

                    const areaId = productsDataList[i].areaId;

                    const newProduct = warehouse.products.create({
                        description: productsDataList[i].description,
                        brandName: productsDataList[i].brandName,
                        count: productsDataList[i].count,
                        areaName: warehouse.areas.id(areaId).name,
                        areaId: areaId,
                        isInWarehouse: false
                    });

                    warehouse.products.push(newProduct);
                    warehouse.areas.id(areaId).productIds.push(newProduct._id);
                }

                return warehouse.save();
            })
            .then(({ areas, products }) => {
                return res.status(201).json({
                    areas,
                    products
                });
            })
            .catch(error => res.status(500).json({
                message: 'Failed to add products to the warehouse!',
                error
            }));
    });

    router.post('/', checkAuth, checkAdminRights, (req, res, next) => {
        const { areas, adminId } = req.body;
        const warehouse = new Warehouse({
            areas,
            products: [],
            tasks: [],
            adminId
        });

        let areasWithCorrectProperties, createdWarehouse;

        warehouse.save()
            .then(warehouse => {
                createdWarehouse = warehouse;
                areasWithCorrectProperties = warehouse.areas
                    .map(({ name, productIds, _id: areaId }) => ({
                        name: name.toLowerCase(),
                        productIds,
                        areaId
                    }));

                return Admin.findById(adminId);
            })
            .then(admin =>
                User.findByIdAndUpdate(
                    admin.userId,
                    { warehouseId: warehouse._id },
                    { new: true }
                )
            )
            .then(user =>
                res.status(201).json({
                    message: 'The warehouse has been successfully created!',
                    result: {
                        areas: areasWithCorrectProperties,
                        adminId: createdWarehouse.adminId,
                        warehouseId: createdWarehouse._id
                    }
                })
            )
            .catch(error =>
                res.status(500).json({
                    message: 'Failed to create a warehouse',
                    error
                })
            );

    });

    router.post('/tasks', checkAuth, checkAdminRights, (req, res, next) => {
        const warehouseId = req.body.warehouseId;
        const newTasks = req.body.tasks.map(task => ({
            description: task,
            creationDate: new Date(),
            isResolved: false
        }));


        Warehouse.findById(warehouseId)
            .then(warehouse => {
                warehouse.tasks = warehouse.tasks.concat(newTasks);

                return warehouse.save();
            })
            .then(({ tasks }) => {
                io.emit('tasks were added', tasks);

                return res.status(201).json({
                    message: 'New tasks have been successfully created!',
                    result: tasks
                });
            })
            .catch(error =>
                res.status(500).json({
                    message: 'Failed to create tasks',
                    error
                })
            )
    });

    router.patch('/tasks/:taskId/assignee', checkAuth, (req, res, next) => {
        const targetTaskId = req.params.taskId;
        const { warehouseId, userId, isInProgress } = req.body;
        let targetTask;

        Warehouse.findById(warehouseId)
            .then(warehouse => {
                targetTask = taskManipulation.getTargetTask(warehouse.tasks, targetTaskId);
                targetTask.assigneeId = isInProgress ? userId : null;

                warehouse.save();
            })
            .then(() =>
                taskManipulation.handleSuccessfulFlow({
                    res,
                    socket: io,
                    socketMessage: 'task was updated',
                    responseMessage: 'The task was successfully assigned to user',
                    updatedTask: targetTask,
                    updatedTaskId: targetTaskId
                })
            )
            .catch(error =>
                taskManipulation.handleFailedFlow(res, 'Failed to resolve the task!', error)
            )
    });

    router.patch('/tasks/:taskId/resolve', checkAuth, (req, res, next) => {
        const targetTaskId = req.params.taskId;
        const { warehouseId, userId } = req.body;
        let targetTask;

        Warehouse.findById(warehouseId)
            .then(warehouse => {
                targetTask = taskManipulation.getTargetTask(warehouse.tasks, targetTaskId);
                targetTask.isResolved = true;
                targetTask.resolvingDate = new Date();

                warehouse.save();
            })
            .then(() =>
                taskManipulation.handleSuccessfulFlow({
                    res,
                    socket: io,
                    socketMessage: 'task was updated',
                    responseMessage: 'The task was successfully resolved',
                    updatedTask: targetTask,
                    updatedTaskId: targetTaskId
                })
            )
            .catch(error =>
                taskManipulation.handleFailedFlow(res, 'Failed to resolve the task!', error)
            )
    });

    router.post('/predict', checkAuth, checkAdminRights, (req, res, next) => {
        const { description, brandName } = req.body;
        const predictionRequestBody = {
            "Inputs": {
                "input1": {
                    "ColumnNames": [
                        "subcategory",
                        "item_name",
                        "merchant_brand_name"
                    ],
                    "Values": [
                        [
                            "",
                            description.toLowerCase(),
                            brandName.toLowerCase()
                        ]
                    ]
                }
            },
            "GlobalParameters": {}
        };

        const options = {
            method: 'POST',
            uri: predictionUri,
            qs: {
                'api-version': '2.0',
                'details': 'true'
            },
            headers: {
                'Authorization': `Bearer ${predictionApiKey}`
            },
            json: true,
            body: predictionRequestBody
        }

        request(options, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', error });
            }

            res.status(200).json({
                message: 'Successfully predicted the category',
                result: getMostPossibleCategories(body)
            })
        });

        function getMostPossibleCategories({ Results: { output1: { value: predictionResult } } }) {
            const scoredProbabilities = predictionResult.Values[0];
            const lengthOfFieldsPredictionInvolves = predictionHandlingConfig.fieldsPredictionInvolves.length;
            const highestProbabilities = scoredProbabilities
                .slice(lengthOfFieldsPredictionInvolves)
                .sort((a, b) => Number(b) - Number(a))
                .slice(0, 3);

            return highestProbabilities.map((probability) => {
                const probabilityIndex = scoredProbabilities.indexOf(probability);

                return predictionResult.ColumnNames[probabilityIndex]
                    .slice(
                        predictionHandlingConfig.lengthOfColumnNameRedundantStartingPart,
                        -predictionHandlingConfig.lengthOfColumnNameRedundantEndingPart
                    );
            });
        }
    });

    router.get('/product/:warehouseId/:productId', checkAuth, (req, res, next) => {
        const { warehouseId, productId } = req.params;

        Warehouse.findById(warehouseId)
            .then(warehouse => {
                const targetProduct = warehouse.products.find(product => {
                    return product._id.toString() === productId;
                });

                res.status(200).json({
                    message: 'Successfully fetched product info',
                    result: targetProduct
                });
            })
            .catch(error =>
                res.status(500).json({
                    message: 'Failed to fetch product info!',
                    error
                })
            );
    });

    return router;
};