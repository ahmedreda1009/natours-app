const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const schema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password!'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function (element) {
                return element === this.password;
            },
            message: 'Passwords do not match!'
        }
    }
});

// Create method for hashing passwords before saving to database
schema.pre('save', async function (next) {
    // if the password has already been hashed, skip it (to avoid re-hashing)
    if (!this.isModified('password')) return next();

    const saltRounds = 12;

    this.password = await bcryptjs.hash(this.password, saltRounds);

    this.passwordConfirm = undefined;

    next();
});

const User = mongoose.model('User', schema);

module.exports = User;