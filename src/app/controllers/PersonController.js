
const Person = require('../models/Person');

class PersonController {

    // [GET] /persons
    async getAll(req, res, next) {
        try {
            const persons = await Person.find({});

            res.status(200).json({
                status: 'Successful',
                data: {
                    persons,
                }
            });
        } catch (error) {
            next(error)
        }
    }

    // [POST] /persons
    async createOne(req, res, next) {
        try {
            const { userId } = req.user;

            const person = await Person.create({ ...req.body, author: userId });

            res.status(200).json({
                status: 'Successful',
                data: {
                    person,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /persons
    async deleteAll(req, res, next) {
        try {
            const person = await Person.deleteMany({});

            res.status(200).json({
                status: 'Successful',
                message: 'All movie has been deleted'
            });
        } catch (error) {
            res.json(error);
        }
    }

}

module.exports = new PersonController;