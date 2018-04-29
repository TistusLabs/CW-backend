var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventoryScheme = new Schema({
    partNumber: String,
    nameDescription: String,
    itemType: String,
    make: String,
    dealerPrice: Number,
    sellingPrice: Number,
    imageURL: String,
    create_date: Date,
    supplierType: String,
    supplierPartNumber: String,
    dealerID: String
});

module.exports = mongoose.model('Inventory', InventoryScheme);