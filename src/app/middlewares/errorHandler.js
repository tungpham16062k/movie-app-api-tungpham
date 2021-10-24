module.exports = function errorHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;

    // Duplication
    if (err.code === 11000) {
        err.statusCode = 400;
        for (let key in err.keyValue) {
            err.message = `${key} have to be unique!`;
        }
    }

    // ObjectId: Not found  
    if (err.kind === 'ObjectId') {
        err.statusCode = 404;
        err.message = `The ${req.originalUrl} is not found because of wrong Id!`;
    }

    // Validation
    if (err.errors) {
        err.statusCode = 400;
        err.message = [];
        for (let key in err.errors) {
            err.message.push(err.errors[key].properties.message);
        }
    }

    res.status(err.statusCode).json({
        status: 'Failure',
        message: err.message
    });
};