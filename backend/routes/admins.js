const express = require('express');
const Admin = require('./../models/admin');
const User = require('./../models/user');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const foundAdmin = await Admin.findOne({ userId: req.params.id });
        const subordinateIds = foundAdmin.subordinateIds;
        let subordinates = [];
        
        if (!(subordinateIds instanceof Array) || subordinateIds.length > 0) {
            return sendSuccessfullResponse([]);
        }
        
        for (let i = 0, len = subordinateIds; i < len; i++) {
            const subordinate = await User.findById(subordinateIds[i]);

            subordinates.push({
                name: subordinate.name,
                phone: subordinate.phone,
                userId: subordinate._id,
                isAdmin: false,
                warehouseId: subordinate.warehouseId
            });
        }

        return sendSuccessfullResponse(subordinates);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch subordinates!',
            result: { subordinates: null },
            error
        })
    }
    
    function sendSuccessfullResponse(subordinates) {
        return res.status(200).json({
            message: 'The admin info has been fetched successfully!',
            result: { subordinates }
        })
    }
});

module.exports = router;
