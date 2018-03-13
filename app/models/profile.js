var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProfileScheme = new Schema({
    firstName: String,
    lastName: String,
    callingName: String,
    address: String,
    type: { type: String, enum: ['user', 'customer'], default: 'customer' },
    nicPassport: String,
    mobile: String,
    email: String,
    isActive: Boolean,
    mobileVerified: Boolean,
    create_date: Date,
    otherDetails: {
        vehicles: [String]
    }
});

ProfileScheme.methods.MobileVerficationCompleted = function () {
    this.mobileVerified = true;
    return this.mobileVerified;
}

ProfileScheme.methods.UserActivationCompleted = function () {
    this.isActive = true;
    return this.isActive;
}

module.exports = mongoose.model('Profile', ProfileScheme);