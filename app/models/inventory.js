var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InventoryScheme = new Schema({
    itemCode: String,
    itemName: String,
    dealerPrice: Number,
    sellingPrice: Number,
    imageURL: String,
    create_date: Date
});

module.exports = mongoose.model('Inventory', InventoryScheme);