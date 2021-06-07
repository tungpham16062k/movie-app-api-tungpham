
const Category = require('../models/Category');

class CategoryController {

    // [GET] /categories
    async getAll(req, res, next) {
        try {
            const categories = await Category.find({});

            res.status(200).json({
                status: 'Successful',
                results: categories.length,
                data: categories,
            });
        } catch (error) {
            next(error)
        }
    }

    // [POST] /categories
    async createOne(req, res, next) {
        try {
            const { userId } = req.user;

            const category = await Category.create({ ...req.body, author: userId });

            res.status(200).json({
                status: 'Successful',
                data: {
                    category,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /categories
    async deleteAll(req, res, next) {
        try {
            const category = await Category.deleteMany({});

            res.status(200).json({
                status: 'Successful',
                message: 'All movie has been deleted'
            });
        } catch (error) {
            res.json(error);
        }
    }

}

module.exports = new CategoryController;