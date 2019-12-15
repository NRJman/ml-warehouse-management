const express = require('express');
const Admin = require('./../models/admin');
const User = require('./../models/user');
const checkAuth = require('./../middleware/check-auth');
const checkAdminRights = require('./../middleware/check-admin-rights');

const router = express.Router();

router.get('/:id', checkAuth, async (req, res, next) => {
    let adminId, subordinateIds, curriedSendSuccessfulResponse;
    
    try {
        const foundAdmin = await Admin.findOne({ userId: req.params.id });

        adminId = foundAdmin._id;
        subordinateIds = foundAdmin.subordinateIds;
        curriedSendSuccessfulResponse = sendSuccessfulResponse.bind(this, adminId);

        if (!(subordinateIds instanceof Array) || subordinateIds.length === 0) {
            return curriedSendSuccessfulResponse([]);
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch subordinates!',
            result: { subordinates: [] },
            error
        });
    }

    User.find({ _id: { $in: subordinateIds } })
        .then(subordinates => {
            const resultingSubordinates = subordinates.map(subordinate => ({
                name: subordinate.name,
                phone: subordinate.phone,
                userId: subordinate._id,
                warehouseId: subordinate.warehouseId
            }));

            return curriedSendSuccessfulResponse(resultingSubordinates);
        })
        .catch(subordinates => curriedSendSuccessfulResponse([]));

    function sendSuccessfulResponse(adminId, subordinates) {
        return res.status(200).json({
            message: 'The admin data has been fetched successfully!',
            result: { adminId, subordinates }
        });
    }
});

module.exports = router;
