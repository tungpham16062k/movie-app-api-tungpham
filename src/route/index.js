const userRouter = require('./user');
const movieRouter = require('./movie');
const categoryRouter = require('./category');
const personRouter = require('./person');
function route(app) {
    app.get('/', (req, res, next) => {
        res.status(200).json({
            status: 'Successful'
        });
    });
    app.use('/movies', movieRouter);

    app.use('/users', userRouter);

    app.use('/categories', categoryRouter);

    app.use('/persons', personRouter);

    app.all('*', (req, res, next) => {
        const err = new Error('The route can not be found!');
        err.statusCode = 404;
        next(err);
    });
}

module.exports = route;