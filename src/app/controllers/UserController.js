const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

class UserController {

    // encodedToken = (userId) => {
    //     return jwt.sign({
    //         sub: userId,
    //         iat: new Date().getTime(),
    //         exp: new Date().setDate(new Date().getDate() + 1),
    //     }, process.env.APP_SECRETKEY);
    // }
    // [GET] /users
    async getAll(req, res, next) {
        try {
            const users = await User.find({});

            return res.status(200).json({
                status: 'Successful',
                results: users.length,
                data: users,
            });
        } catch (error) {
            next(error)
        }
    }
    // [GET] /users/getCurrent
    async getCurrent(req, res, next) {
        try {
            const data = { user: null };
            if (req.user) {
                const user = await User.findOne({ _id: req.user.userId });
                if (!user.isActive) {
                    const err = new Error('Your account is blocked!');
                    err.statusCode = 400;
                    next(err);
                };
                data.user = {
                    userName: user.name,
                    email: user.email,
                    role: user.type,
                    favorites: user.favorites
                };
            };
            return res.status(200).json({
                status: 'Successful',
                data
            });
        } catch (error) {
            next(error)
        }
    }
    // [POST] /users/register
    async register(req, res, next) {
        try {
            const user = await User.create({ ...req.body, favorites: [] });
            // const token = this.encodedToken(user._id);
            const token = jwt.sign({
                userId: user._id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1),
            }, process.env.APP_SECRET_KEY);

            return res.status(200).json({
                status: 'Successful',
                data: {
                    token,
                    userName: user.name,
                    email: user.email,
                    role: user.type,
                    favorites: user.favorites
                }
            });
        } catch (error) {
            next(error)
        }
    }
    // [POST] /users/login
    async login(req, res, next) {
        try {
            console.log(req.body);
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                // Error: Email is not correct
                const err = new Error('Email is not correct');
                err.statusCode = 400;
                next(err);
            }
            if (bcrypt.compareSync(req.body.password, user.password)) {
                //const token = this.encodedToken(user._id);
                const token = jwt.sign({
                    userId: user._id,
                    iat: new Date().getTime(),
                    exp: new Date().setDate(new Date().getDate() + 1),
                }, process.env.APP_SECRET_KEY);
                if (!user.isActive) {
                    const err = new Error('Your account is blocked!');
                    err.statusCode = 400;
                    next(err);
                }
                return res.status(200).json({
                    status: 'Successful',
                    data: {
                        token,
                        userName: user.name,
                        email: user.email,
                        role: user.type,
                        favorites: user.favorites
                    }
                });
            } else {
                // Error: Password is not correct
                const err = new Error('Password is not correct');
                err.statusCode = 400;
                next(err);
            }
        } catch (error) {
            next(error)
        }
    }
    // [PATCH] /users/block/:id
    async blockOne(req, res, next) {
        const { returns } = req.query;
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

            if (returns && returns === 'list') {
                const users = await User.find({});
                return res.status(200).json({
                    status: 'Successful',
                    results: users.length,
                    data: users,
                });
            }
            return res.status(200).json({
                status: 'Successful',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /users/unblock/:id
    async unBlockOne(req, res, next) {
        try {
            const { returns } = req.query;
            const { userId } = req.params;

            const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
            if (returns && returns === 'list') {
                const users = await User.find({});
                return res.status(200).json({
                    status: 'Successful',
                    results: users.length,
                    data: users,
                });
            }
            res.status(200).json({
                status: 'Successful',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }


    // [DELETE] /users
    async deleteAllUser(req, res, next) {
        try {
            const users = await User.deleteMany({});
            res.status(200).json({
                status: "Successful",
                count: users.n
            });
        } catch (error) {
            next(error);
        }
    }

    async removeFavorites(req, res, next) {
        try {
            const { userId } = req.user;
            const { movieId } = req.params;
            console.log(userId);
            if (userId && movieId) {
                const isExist = await User.findOne({ favorites: movieId }).count().exec();
                if (!isExist) {
                    const err = new Error("Movie isn't existed in the favorites list");
                    err.status = 401;
                    return next(err)
                }
                const user = await User.findOneAndUpdate({ _id: userId }, { $pull: { favorites: movieId } }, { runValidators: true, context: 'query', new: true });
                return res.status(200).json({
                    status: 'Successful',
                    data: {
                        favorites: user.favorites
                    }
                });

            }
            return res.status(200).json({
                status: 'Successful',
                data: {
                    favorites: []
                }
            });

        } catch (error) {
            next(error)
        }
    }

    async addFavorites(req, res, next) {
        try {
            const { userId } = req.user;
            const { movieId } = req.params;
            console.log(userId);
            if (userId && movieId) {
                const isExist = await User.findOne({ favorites: movieId }).count().exec();
                if (isExist) {
                    const err = new Error('Movie is existed in the favorites list');
                    err.status = 401;
                    return next(err)
                }
                const user = await User.findOneAndUpdate({ _id: userId }, { $push: { favorites: movieId } }, { runValidators: true, context: 'query', new: true });
                return res.status(200).json({
                    status: 'Successful',
                    data: {
                        favorites: user.favorites
                    }
                });

            }
            return res.status(200).json({
                status: 'Successful',
                data: {
                    favorites: []
                }
            });

        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /users/:id
    async deleteOne(req, res, next) {
        try {
            const { userId } = req.params;
            const { returns } = req.query;

            const user = await User.delete({ _id: userId });
            if (returns && returns === 'list') {
                const users = await User.find({});
                return res.status(200).json({
                    status: 'Successful',
                    results: users.length,
                    data: users,
                });
            }
            return res.status(200).json({
                status: 'Successful',
                message: 'User has been deleted'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController;