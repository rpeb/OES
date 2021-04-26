const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {type: String, unique: true},
    password: String,
    role: String,
    createdOn: {type: Date, default: Date.now()}
})

const User = mongoose.model('User', userSchema);

module.exports = User
