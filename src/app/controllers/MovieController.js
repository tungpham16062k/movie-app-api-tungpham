const Movie = require('../models/Movie');

class MovieController {
    // [GET] /movies
    async get(req, res, next) {
        const { page } = req.query;
        const PAGE_SIZE = 12;
        console.log(page);
        if (page) {
            const pages = parseInt(page);
            const skip = (pages - 1) * PAGE_SIZE;

            try {
                const movies = await Movie.find({}).populate('author', 'name').populate('category', 'name').populate({ path: 'cast.actor', select: 'name avatar' }).skip(skip).limit(PAGE_SIZE);
                res.status(200).json({
                    status: 'Successful',
                    results: movies.length,
                    data: {
                        movies
                    },
                    page: pages,
                    limit: PAGE_SIZE,
                });
            } catch (error) {
                next(error);

            }
        } else {
            try {
                const movies = await Movie.find({}).populate('author', 'name').populate('category', 'name').populate({ path: 'cast.actor', select: 'name avatar' });
                res.status(200).json({
                    status: 'Successful',
                    results: movies.length,
                    data: movies
                });
            } catch (error) {
                next(error);

            }
        }
    }

    // [GET] /movies/:slug
    async getOneBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const movie = await Movie.find({ slug: slug }).populate('author', 'name');
            res.status(200).json({
                status: 'Successful',
                data: movie
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /movies/:id
    // async getOneById(req, res, next) {
    //     try {
    //         const { movieId } = req.params;
    //         const movie = await Movie.findById(movieId).populate('author', 'name');
    //         res.status(200).json({
    //             status: 'Successful',
    //             data: movie
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // [POST] /movies
    async createOne(req, res, next) {
        try {
            const { userId } = req.user;
            const movie = await Movie.create({ ...req.body, author: userId });
            res.status(200).json({
                status: 'Successful',
                data: movie,
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /movies/createMany
    async createMany(req, res, next) {
        try {
            const { userId } = req.user;
            const movies = await Movie.insertMany([...req.body]);
            res.status(200).json({
                status: 'Successful',
                data: movies
            })
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /movies/:id
    async updateOne(req, res, next) {
        try {
            const { movieId } = req.params;

            const movie = await Movie.findByIdAndUpdate(movieId, { ...req.body }, { new: true, runValidators: true });

            res.status(200).json({
                status: 'Successful',
                data: movie
            });
        } catch (error) {
            next(error);
        }
    }
    // [PATCH] /movies/author
    async updateAuthorForAll(req, res, next) {
        try {
            const { userId } = req.user;

            const movie = await Movie.updateMany({ author: null }, { author: userId }, { multi: true });

            res.status(200).json({
                status: 'Successful',
                result: movie.nModified,
                message: `${movie.nModified} records is updated!!!`
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /movies/:id
    async deleteOne(req, res, next) {
        try {
            const { movieId } = req.params;

            const movie = await Movie.delete({ _id: movieId });
            res.status(200).json({
                status: 'Successful',
                message: 'Movie has been deleted'
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /movies
    async deleteAll(req, res, next) {
        try {
            const movie = await Movie.delete();

            res.status(200).json({
                status: 'Successful',
                message: 'Movie has been deleted'
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /movies/detroy
    async destroy(req, res, next) {
        try {
            const movie = await Movie.deleteMany({});

            res.status(200).json({
                status: 'Successful',
                message: 'All movie has been deleted'
            });
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = new MovieController;