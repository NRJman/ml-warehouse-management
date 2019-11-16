const express = require('express');
const Warehouse = require('./../models/warehouse');
const Admin = require('./../models/admin');
const User = require('./../models/user');

const router = express.Router();

router.get('', (req, res, next) => {
    const idOfUserResponsibleForWarehouse = req.query.userId;
    
    Admin.findOne({ userId: idOfUserResponsibleForWarehouse })
        .then((foundAdmin) => Warehouse.findOne({ adminId: foundAdmin._id }))
        .then((warehouse) => {
            res.status(200).json({
                message: 'The warehouse has been fetched successfully',
                result: {
                    areas: warehouse.areas,
                    products: warehouse.products,
                    tasks: warehouse.tasks,
                    adminId: warehouse.adminId,
                    warehouseId: warehouse._id
                }
            })
        })
        .catch(error => res.status(500).json({
            message: 'Failed to fetch the warehouse!',
            error
        }));
});

router.post('/products', (req, res, next) => {
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
                    isInWarehouse: true
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

router.post('/', (req, res, next) => {
    const { areas, adminId } = req.body;
    const warehouse = new Warehouse({
        areas,
        products: [],
        tasks: [],
        adminId
    });

    let areasWithCorrectProperties, createdWarehouse;

    warehouse.save()
        .then((warehouse) => {
            createdWarehouse = warehouse;
            areasWithCorrectProperties = warehouse.areas
                .map(({ name, productIds, _id: areaId }) => ({
                    name: name.toLowerCase(),
                    productIds,
                    areaId
                }));

            console.log('areas: ', areasWithCorrectProperties);

            return Admin.findById(adminId);
        })
        .then((foundAdmin) => User.findByIdAndUpdate(
            foundAdmin.userId,
            { warehouseId: warehouse._id },
            { new: true }
        ))
        .then((updatedUser) => {
            console.log('UPDATED USER: ', updatedUser);

            return res.status(201).json({
                message: 'The warehouse has been successfully created!',
                result: {
                    areas: areasWithCorrectProperties,
                    adminId: createdWarehouse.adminId,
                    warehouseId: createdWarehouse._id
                }
            });
        })
        .catch(error => res.status(500).json({
            message: 'Failed to create a warehouse',
            error
        }));

});

module.exports = router;

/* async function getWarehouseInfo(warehouseId) {
    try {
        const foundWarehouse = await Warehouse.findById(warehouseId);

        return (
            ({areas, products, tasks, adminId }) => ({ areas, products, tasks, adminId })
        )(foundWarehouse);           
    } catch (error) {
        return null;
    }
} */
