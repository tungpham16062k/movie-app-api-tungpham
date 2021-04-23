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
    async getAll(req, res, next) {
        try {
            const user = await User.find({});

            res.status(200).json({
                status: 'Successful',
                data: {
                    user,
                }
            });
        } catch (error) {
            next(error)
        }
    }
    async register(req, res, next) {
        try {
            const user = await User.create(req.body);
            // const token = this.encodedToken(user._id);
            const token = jwt.sign({
                userId: user._id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1),
            }, process.env.APP_SECRETKEY);

            res.status(200).json({
                status: 'Successful',
                data: {
                    token,
                    userName: user.name
                }
            });
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
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
                }, process.env.APP_SECRETKEY);
                res.status(200).json({
                    status: 'Successful',
                    data: {
                        token,
                        userName: user.name
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

    async deleteAllUser(req, res, next) {
        try {
            const users = await User.deleteMany({});
            res.status(200).json({
                status: "Successful",
                users
            });
        } catch (error) {
            next(error);
        }
    }
    async getCurrent(req, res, next) {
        try {
            const data = { user: null };
            if (req.user) {
                const user = User.findById(req.user.userId);
                data.user = { userName: user.name };
            }
            res.status(200).json({
                status: 'Successful',
                data
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController;