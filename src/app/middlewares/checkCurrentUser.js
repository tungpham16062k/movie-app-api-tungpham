const jwt = require('jsonwebtoken');

module.exports = function checkCurrentUser(req, res, next) {
    const Authorization = req.header('authorization');
    if (!Authorization) {
        req.user = null;
        next();
    } else {
        // Get token
        const token = Authorization.replace('Bearer ', '');
        try {
            const { userId } = jwt.verify(token, process.env.APP_SECRETKEY);
            req.user = { userId };
            next()
        } catch (err) {
            console.log(2)
            req.user = null;
            next();
        }
    }

}