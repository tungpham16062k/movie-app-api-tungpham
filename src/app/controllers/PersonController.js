
const Person = require('../models/Person');
const Movie = require('../models/Movie');
const slugify = require('../../config/slugify');

class PersonController {

    // [GET] /persons
    async getAll(req, res, next) {
        try {
            const persons = await Person.find({});

            res.status(200).json({
                status: 'Successful',
                results: persons.length,
                data: persons
            });
        } catch (error) {
            next(error)
        }
    }

    // [GET] /persons/:slug
    async getOneBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            console.log(slug);

            const person = await Person.findOne({ slug: slug });
            console.log(person);
            const movie = await Movie.find({ 'cast.actor': person._id }, 'name viName poster slug');
            console.log(movie);

            res.status(200).json({
                status: 'Successful',
                data: {
                    person,
                    movie
                }
            });
        } catch (error) {
            next(error);
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

    // [POST] /persons/createMany
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
            const persons = await Person.insertMany([...data]);

            res.status(200).json({
                status: 'Successful',
                data: {
                    persons,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /persons/author
    async updateAuthorForAll(req, res, next) {
        try {
            const { userId } = req.user;

            const person = await Person.updateMany({}, { author: userId }, { multi: true });

            res.status(200).json({
                status: 'Successful',
                result: person.nModified,
                message: `${person.nModified} records is updated!!!`
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
                message: 'All person has been deleted'
            });
        } catch (error) {
            res.json(error);
        }
    }

}

module.exports = new PersonController;