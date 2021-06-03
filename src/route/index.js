const userRouter = require('./user');
const movieRouter = require('./movie');
const categoryRouter = require('./category');
function route(app) {
    app.get('/api', (req, res, next) => {
        res.status(200).json({
            status: 'Successful'
        });
    });
    app.use('/api/movies', movieRouter);

    app.use('/api/users', userRouter);

    app.use('/api/categories', categoryRouter);

    app.all('*', (req, res, next) => {
        const err = new Error('The route can not be found!');
        err.statusCode = 404;
        next(err);
    });
}

module.exports = route;