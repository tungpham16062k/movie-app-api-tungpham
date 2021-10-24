const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
    const Authorization = req.header('authorization');

    if (!Authorization) {
        // Error: Unauthorized
        const err = new Error('Unauthorized');
        err.statusCode = 401;
        next(err);
    }
    // Get token
    const token = Authorization.replace('Bearer ', '');

    // Verify Token
    const { userId } = jwt.verify(token, process.env.APP_SECRET_KEY);

    // Assign req
    req.user = { userId };

    next();
}