const express = require('express');
const Admin = require('./../models/admin');
const User = require('./../models/user');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    let subordinateIds;
    
    try {
        console.log(req.params.id);

        const foundAdmin = await Admin.findOne({ userId: req.params.id });

        console.log('FOUND ADMIN', foundAdmin);
        
        subordinateIds = foundAdmin.subordinateIds;
        
        if (!(subordinateIds instanceof Array) || subordinateIds.length > 0) {
            return sendSuccessfullResponse([]);
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch subordinates!',
            result: { subordinates: [] },
            error
        });
    }

    User.find({ _id: { $in: subordinateIds } })
        .then(subordinates => sendSuccessfullResponse(subordinates))
        .catch(subordinates => sendSuccessfullResponse([]));
    
    function sendSuccessfullResponse(subordinates) {
        return res.status(200).json({
            message: 'The admin data has been fetched successfully!',
            result: { subordinates }
        });
    }
});

module.exports = router;
