const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const UserScheme = new Schema({
    name: { type: String, trim: true, required: [true, 'Name must be requied'] },
    email: { type: String, trim: true, lowercase: true, unique: true, required: [true, 'Email must be required'], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    password: { type: String, trim: true, required: [true, 'Password must be required'], minlength: [6, 'Password must be at least 6 characters'] }
}, {
    timestamps: true,
});

UserScheme.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (error, hash) {
        if (error) {
            next(error);
        } else {
            user.password = hash;
            next();
        }
    });
});

// Add plugin
UserScheme.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('User', UserScheme);