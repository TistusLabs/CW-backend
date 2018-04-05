
var express = require('express');
var Task = require('../models/task');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var task_route = express.Router();

// checking token for each and every request
// profile_route.use(function (req, res, next) {

//     var token = req.body.Authorization || req.query.Authorization || req.headers['authorization'];

//     if (token) {
//         jwt.verify(token, config.secret, function (err, decoded) {
//             if (err) {
//                 var rObj = { Message: 'Authorization Failed.', IsSuccess: false, Error: "" };
//                 console.log(rObj.Message);
//                 return res.status(403).send(rObj);
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         var rObj = { Message: 'No Authorization Token Available.', IsSuccess: false, Error: "" };
//         console.log(rObj.Message);
//         return res.status(403).send(rObj);
//     }
// });

// task_route.route('/vehicles/tag')
//     .post(function (req, res) {

//         var findObject = { "registrationNumber": req.body.regNumber }
//         Vehicle.find(findObject, function (err, foundObjects) {
//             if (foundObjects.length == 0) {
//                 var rObj = { Message: 'Invalid vehicle registration number.', IsSuccess: false, Error: err };
//                 console.log(rObj.Message);
//                 res.json(rObj);
//             } else {
//                 var resultObj = foundObjects[0];
//                 resultObj.TagToCustomer(req.body.profileID);
//                 resultObj.save(function (err, newProfile) {
//                     if (err) {
//                         var rObj = { Message: 'Error on tagging profile to the vehicle!', IsSuccess: false, Error: err };
//                         console.log(rObj.Message);
//                         res.json(rObj);
//                     } else {
//                         var rObj = { Message: 'Profile tagged to the Vehicle successfully!', IsSuccess: true, Error: "" };
//                         console.log(rObj.Message);
//                         res.json(rObj);
//                     }
//                 });
//             }
//         });
//     });

task_route.route('/task')
    .post(function (req, res) {

        let task = new Task();
        task.registrationNumber = req.body.regNumber;
        task.create_datetime = req.body.create_datetime;
        task.taskNumber = req.body.taskNumber;
        task.currentMileage = req.body.currentMileage;
        task.customerName = "";
        task.taskCompleted = false;

        task.save(function (err, newTask) {
            if (err) {
                var rObj = { Message: 'Error on saving task!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var rObj = { Message: 'Task details saved successfully!', IsSuccess: true, Error: "" };
                console.log(rObj.Message);
                res.json(rObj);
            }
        });
    });

task_route.route('/tasks')
    .get(function (req, res) {
        Task.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

task_route.route('/tasks/ongoing')
    .get(function (req, res) {

        var findObject = { "taskCompleted": false }
        Task.find(findObject, function (err, foundObjects) {
            if (foundObjects.length == 0) {
                var rObj = { Message: 'No Ongoing tasks available!', IsSuccess: false, Error: "", Data: foundObjects };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var rObj = { Message: 'Ongoing tasks retrived successfully!', IsSuccess: true, Error: "", Data: foundObjects };
                console.log(rObj.Message);
                res.json(rObj);
            }
        });
    });

task_route.route('/task/complete')
    .post(function (req, res) {

        var findObject = { "_id": req.body.taskID }
        Task.find(findObject, function (err, foundObjects) {
            if (foundObjects.length == 0) {
                var rObj = { Message: 'Invalid task ID.', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var resultObj = foundObjects[0];
                resultObj.CompleteTask(req.body.completedDatetime);
                resultObj.save(function (err, newTask) {
                    if (err) {
                        var rObj = { Message: 'Error on completing the task!', IsSuccess: false, Error: err };
                        console.log(rObj.Message);
                        res.json(rObj);
                    } else {
                        var rObj = { Message: 'Task completed successfully!', IsSuccess: true, Error: "" };
                        console.log(rObj.Message);
                        res.json(rObj);
                    }
                });
            }
        });
    });

// Return router
module.exports = task_route;