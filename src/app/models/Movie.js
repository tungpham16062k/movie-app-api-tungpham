const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const MovieSchema = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    viName: { type: String, required: [true, 'viName must be requied'], },
    poster: { type: String, trim: true, required: [true, 'Poster must be requied'] },
    backdrop: String,
    description: Array,
    time: String,
    releaseAt: Date,
    cast: [
        {
            actor: {
                type: Schema.Types.ObjectId,
                ref: 'Person'
            },
            character: { type: String }
        }
    ],
    director: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }],
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