const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const CategoryScheme = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});

// Add plugin
CategoryScheme.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Category', PersonScheme);