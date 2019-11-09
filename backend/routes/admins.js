const express = require('express');
const Admin = require('./../models/admin');
const User = require('./../models/user');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    let adminId, subordinateIds, curriedSendSuccessfullResponse;
    
    try {
        const foundAdmin = await Admin.findOne({ userId: req.params.id });

        adminId = foundAdmin._id;
        subordinateIds = foundAdmin.subordinateIds;
        curriedSendSuccessfullResponse = sendSuccessfullResponse.bind(this, adminId);
        
        if (!(subordinateIds instanceof Array) || subordinateIds.length > 0) {
            return curriedSendSuccessfullResponse([]);
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch subordinates!',
            result: { subordinates: [] },
            error
        });
    }

    User.find({ _id: { $in: subordinateIds } })
        .then(subordinates => curriedSendSuccessfullResponse(subordinates))
        .catch(subordinates => curriedSendSuccessfullResponse([]));
    
    function sendSuccessfullResponse(adminId, subordinates) {
        return res.status(200).json({
            message: 'The admin data has been fetched successfully!',
            result: { adminId, subordinates }
        });
    }
});

module.exports = router;
