var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    registrationNumber: {
        type: String,
        required: true,
        trim: true
    },
    create_datetime: Date,
    completed_datetime: Date,
    taskNumber: String,
    customerName: String,
    taskCompleted: Boolean
});

TaskSchema.methods.CompleteTask = function (completedOn) {
    this.completed_datetime = completedOn;
    this.taskCompleted = true;
}

// TaskSchema.methods.UntagCustomer = function (profileID) {
//     this.taggedToCustomer = false;
//     this.profileID = "";
// }

module.exports = mongoose.model('Task', TaskSchema);