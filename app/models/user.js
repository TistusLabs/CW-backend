var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserScheme = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    profileID: String
});

module.exports = mongoose.model('User', UserScheme);