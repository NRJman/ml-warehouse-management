const User = require('./../models/user');
const Admin = require('./../models/admin');

module.exports = (req, res, next) => {
    const accessRightsIdHeader = req.headers['access-rights-id'];
    const accessRightsHeaderCipher = 'Access rights id ';
    const userId = accessRightsIdHeader.slice(accessRightsIdHeader.indexOf(accessRightsHeaderCipher) + accessRightsHeaderCipher.length);
    
    User.findById(userId)
        .then(foundUser => {
            if (!foundUser.isAdmin) {
                throw new Error();
            }

            return Admin.findOne({ userId });
        })
        .then(foundAdmin => {
            if (!foundAdmin) {
                throw new Error();
            }

            next();
        })
        .catch(() => {
            return res.status(401).json({
                message: "No admin rights!"
            });
        })
}
