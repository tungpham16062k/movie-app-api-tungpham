const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const MovieScheme = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    viName: { type: String, required: true, },
    poster: { type: String, trim: true, required: [true, 'Poster must be requied'] },
    description: String,
    time: String,
    backdrop: String,
    releaseAt: Date,
    cast: Array,
    director: String,
    rate: Number,
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
MovieScheme.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Movie', MovieScheme);