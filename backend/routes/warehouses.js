const express = require('express');
const Warehouse = require('./../models/warehouse');

const router = express.Router();

router.get('/:id', (req, res, next) => {
    const warehouseId = req.params.id;
    
    if (!warehouseId) {
        return sendFailedResponse(new Error('The warehouse id was not provided!'));
    }
    
    Warehouse.findById(warehouseId)
        .then((warehouse) => {
            res.status(200).json({
                message: 'The warehouse has been fetched successfully',
                result: { warehouse }
            })
        })
        .catch(sendFailedResponse)

    function sendFailedResponse(error) {
        return res.status(500).json({
            message: 'Failed to fetch the warehouse!',
            result: { warehouse: null },
            error
        })
    }
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
