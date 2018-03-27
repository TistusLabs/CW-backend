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
    taggedToCustomer: Boolean,
    profileID: String,
    create_date: Date,
});

VehicleSchema.methods.TagToCustomer = function (profileID) {
    this.taggedToCustomer = true;
    this.profileID = profileID;
}

VehicleSchema.methods.UntagCustomer = function (profileID) {
    this.taggedToCustomer = false;
    this.profileID = "";
}

module.exports = mongoose.model('Vehicle', VehicleSchema);