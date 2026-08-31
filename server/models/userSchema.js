const mongoose = require('mongoose');
const { nanoid } = require('nanoid')

// 1. make schema
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    username: String,
    userType: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        select: false,
        default: nanoid()
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
});

// 2. make model
const User = mongoose.model('User', userSchema);

module.exports = User;