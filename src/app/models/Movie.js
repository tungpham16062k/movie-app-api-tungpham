const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const MovieSchema = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    viName: { type: String, required: true, },
    poster: { type: String, trim: true, required: [true, 'Poster must be requied'] },
    description: Array,
    time: String,
    backdrop: String,
    releaseAt: Date,
    cast: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Person',
        }
    ],
    director: String,
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
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
MovieSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Movie', MovieSchema);