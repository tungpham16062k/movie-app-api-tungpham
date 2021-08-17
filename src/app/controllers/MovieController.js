
const removeViTones = require('../../config/removeViTones');
const Movie = require('../models/Movie');
const User = require('../models/User');

class MovieController {
    // [GET] /movies
    async get(req, res, next) {
        const { page, limit, title_like } = req.query;
        console.log(title_like);
        const PAGE_SIZE = parseInt(limit) || 12;
        if (page) {
            const pages = parseInt(page);
            const skip = (pages - 1) * PAGE_SIZE;

            try {
                var movies = null;
                if (title_like) {
                    const nameRegex = new RegExp(title_like, 'i');
                    movies = await Movie.find({ $or: [{ name: { $in: nameRegex } }, { viNameEn: { $in: nameRegex } }] }).populate('author', 'name').sort({ createdAt: 'desc' }).skip(skip).limit(PAGE_SIZE);
                } else {
                    movies = await Movie.find({}).populate('author', 'name').sort({ createdAt: 'desc' }).skip(skip).limit(PAGE_SIZE);
                }
                const countMovie = await Movie.find({}).countDocuments({});
                res.status(200).json({
                    status: 'Successful',
                    results: movies.length,
                    data: {
                        movies,
                        pagination: {
                            page: pages,
                            limit: PAGE_SIZE,
                            totalRows: countMovie
                        }
                    },
                });
            } catch (error) {
                next(error);
            }
        } else {
            try {
                let movies = null;
                if (title_like) {
                    const nameRegex = new RegExp(title_like, 'i');
                    movies = await Movie.find({ $or: [{ name: { $in: nameRegex } }, { viNameEn: { $in: nameRegex } }] }).populate('author', 'name').sort({ createdAt: 'desc' }).limit(PAGE_SIZE);
                } else {
                    movies = await Movie.find({}).populate('author', 'name').sort({ createdAt: 'desc' }).limit(PAGE_SIZE);
                }
                const countMovie = await Movie.find({}).countDocuments({});
                res.status(200).json({
                    status: 'Successful',
                    results: movies.length,
                    data: {
                        movies,
                        pagination: {
                            page: 1,
                            limit: PAGE_SIZE,
                            totalRows: countMovie
                        }
                    },

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
            const movie = await Movie.findOne({ slug: slug }).populate('author', 'name').populate('category', 'name').populate({ path: 'cast.actor', select: 'name avatar slug' }).populate({ path: 'director', select: 'name slug' });
            res.status(200).json({
                status: 'Successful',
                data: movie
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /movies/getFavorites
    async getFavorite(req, res, next) {
        const { userId } = req.user;
        const user = await User.findOne({ _id: userId });

        if (!Object.keys(user).length) {
            const err = new Error('Email is not correct');
            err.statusCode = 400;
            return next(err);
        }

        const movies = await Movie.find({ _id: { $in: user.favorites } }).populate('category', 'name');

        return res.status(200).json({
            status: 'Successful',
            results: movies.length,
            data: {
                movies
            },
        });
    }

    // [GET] /movies/getPerson/:id
    // async getByPersonId(req, res, next) {
    //     try {
    //         const { id } = req.params;
    //         console.log(id)
    //         const movie = await Movie.find({ 'cast.actor': id });
    //         res.status(200).json({
    //             status: 'Successful',
    //             data: {
    //                 movie,
    //                 person
    //             }
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

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
            const { viName } = req.body;
            const viNameEn = removeViTones(viName);
            const movie = await Movie.create({ ...req.body, author: userId, viNameEn: viNameEn });
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
            console.log(userId);
            const movie = await Movie.updateMany({}, { author: userId }, { multi: true });

            res.status(200).json({
                status: 'Successful',
                result: movie.nModified,
                message: `${movie.nModified} records is updated!!!`
            });
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /movies/updateVi
    async updateViEn(req, res, next) {
        try {
            const movies = await Movie.find({});
            if (movies) {
                movies.map(async (item) => {
                    const viName = removeViTones(item.viName)
                    await Movie.findOneAndUpdate({ _id: item.id }, { viNameEn: viName })
                })

            }
            const newMovies = await Movie.find({});
            res.status(200).json({
                status: 'Successful',
                result: newMovies.length,
                data: {
                    movies: newMovies
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /movies/addCaster/:id
    async addCaster(req, res, next) {
        try {
            const { movieId } = req.params;
            const data = [...req.body];
            var isExistCount = 0;
            const movie = await Movie.findOne({ _id: movieId });
            const newData = data.reduce((result, item) => {
                const isExist = movie.cast.some(caster => item.actor == caster.actor);
                if (!isExist) {
                    return [...result, item];
                } else {
                    isExistCount++;
                }
                return [...result];
            }, []);
            if (Array.isArray(newData)) {
                const movie = await Movie.findOneAndUpdate({ _id: movieId }, { $push: { cast: { $each: newData } } }, { new: true, runValidators: true });
                return res.status(200).json({
                    status: 'Successful',
                    isExist: isExistCount,
                    data: movie
                });
            }

            return res.status(200).json({
                status: 'Successful',
                isExist: isExistCount,
                data: []
            });
        } catch (error) {
            next(error)
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