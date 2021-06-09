const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const CategorySchema = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    slug: { type: String, slug: 'name', unique: true }
}, {
    timestamps: true,
});

// Add plugin
CategorySchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Category', CategorySchema);