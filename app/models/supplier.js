var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SupplierScheme = new Schema({
    name: String,
    address: String,
    logoURL: String,
    description: String,
    mobile: String,
    create_date: Date
});

module.exports = mongoose.model('Supplier', SupplierScheme);