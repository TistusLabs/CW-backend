
var express = require('express');
var Vehicle = require('../models/vehicle');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var vehicle_route = express.Router();

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

vehicle_route.route('/vehicle')
    .post(function (req, res) {

        let vehicle = new Vehicle();
        vehicle.registrationNumber = req.body.regNumber;
        vehicle.make = req.body.make;
        vehicle.model = req.body.model;
        vehicle.taggedToCustomer = false;
        vehicle.currentMileage = req.body.currentMileage;
        vehicle.create_date = Date.now();

        vehicle.save(function (err, newProfile) {
            if (err) {
                var rObj = { Message: 'Error on saving vehicle!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var rObj = { Message: 'Vehicle details saved successfully!', IsSuccess: true, Error: "" };
                console.log(rObj.Message);
                res.json(rObj);
            }
        });
    });

vehicle_route.route('/vehicles')
    .get(function (req, res) {
        Vehicle.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// Return router
module.exports = vehicle_route;