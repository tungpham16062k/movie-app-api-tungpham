
const Category = require('../models/Category');
const slugify = require('../../config/slugify');

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
    // [POST] /categories/createMany
    async createMany(req, res, next) {
        try {
            const { userId } = req.user;
            const data = req.body;
            data.map((item) => {
                item.author = userId;
                if (!item.slug) {
                    item.slug = slugify.slug(item.name);
                }
            })
            const category = await Category.insertMany([...data]);

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
    // [PUT] /categories/:id
    async updateOne(req, res, next) {
        try {
            const { categoryId } = req.params;

            const category = await Category.findByIdAndUpdate(categoryId, { ...req.body }, { new: true, runValidators: true });

            res.status(200).json({
                status: 'Successful',
                data: category
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
                message: 'All category has been deleted'
            });
        } catch (error) {
            res.json(error);
        }
    }

}

module.exports = new CategoryController;