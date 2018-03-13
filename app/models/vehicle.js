var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    registrationNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    make: String,
    model: String,
    currentMileage: Number,
    taggedToCustomer:Boolean,
    create_date: Date,
});

module.exports = mongoose.model('Vehicle', VehicleSchema);