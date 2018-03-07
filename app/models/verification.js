var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emailVerificationScheme = new Schema({
    verificationItem: String,
    type:String,
    verificationCode: String,
    create_date: Date,
    verificationCompleted:Boolean
});

emailVerificationScheme.methods.VerificationCompleted = function(){
    this.verificationCompleted = true;
    return this.verificationCompleted;
}

module.exports = mongoose.model('Verification', emailVerificationScheme);