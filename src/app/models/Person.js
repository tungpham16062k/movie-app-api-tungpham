const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const PersonSchema = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    avatar: { type: String, trim: true, required: [true, 'Poster must be requied'] },
    description: String,
    birthday: String,
    cast: Array,
    gender: String,
    movies: {
        type: Schema.Types.ObjectId,
        ref: 'Movie'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: { type: String, slug: 'name', unique: true }
}, {
    timestamps: true,
});

// Add plugin
mongoose.plugin(slug);
PersonSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Person', PersonSchema);