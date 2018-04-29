var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DealerScheme = new Schema({
    name: String,
    address: String,
    logoURL: String,
    landline: String,
    mobile: String,
    create_date: Date
});

module.exports = mongoose.model('Dealer', DealerScheme);