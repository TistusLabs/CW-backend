var express = require('express');
var Supplier = require('../models/supplier');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var supplier_route = express.Router();

// checking token for each and every request
// supplier_route.use(function (req, res, next) {

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

function addingOrUpdatingSupplier(supplier, flag, req, res) {

    supplier.name = req.body.name;
    supplier.address = req.body.address;
    supplier.logoURL = req.body.logoURL;
    supplier.description = req.body.description;
    supplier.mobile = req.body.mobile;
    supplier.create_date = Date.now();

    supplier.save(function (err, newItem) {
        if (err) {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Error on supplier creation!', IsSuccess: false, Error: err };
            } else if (flag == "update") {
                rObj = { Message: 'Error on supplier dealer!', IsSuccess: false, Error: err };
            }
            console.log(rObj.Message);
            res.json(rObj);
        } else {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Supplier created successfully!', IsSuccess: true, Error: "" };
            } else if (flag == "update") {
                rObj = { Message: 'Supplier updated successfully!', IsSuccess: true, Error: "" };
            }
            console.log(rObj.Message);
            res.json(rObj);
        }
    });
}

// saving inventory item
supplier_route.route('/supplier')
    .post(function (req, res) {

        let newSupplier = new Supplier();
        if (req.body._id != undefined) {
            Supplier.findById(req.body._id, function (err, newSupplier) {
                addingOrUpdatingSupplier(newSupplier, "update", req, res);
            });
        } else {
            addingOrUpdatingSupplier(newSupplier, "save", req, res);
        }

    });

supplier_route.route('/suppliers')
    .get(function (req, res) {
        Supplier.find(function (err, supplierdetails) {
            if (err)
                res.send(err);
            res.json(supplierdetails);
        });
    });

// supplier_route.route('/profile/:profile_id')

//     // get the bear with that id (accessed at GET http://localhost:8080/api/users/:user_id)
//     .get(function (req, res) {
//         Profile.findById(req.params.profile_id, function (err, profile) {
//             if (err) {
//                 var rObj = { Message: 'No Profile found!', IsSuccess: false, Error: err };
//                 console.log(rObj.Message);
//                 res.json(rObj);
//             } else {
//                 res.json(profile);
//             }
//         });
//     });

// update the bear with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
// .put(function (req, res) {

//     // use our bear model to find the bear we want
//     Profile.findById(req.params.profile_id, function (err, user) {

//         if (err)
//             res.send(err);

//         user.name = req.body.name;  // update the bears info

//         // save the bear
//         user.save(function (err) {
//             if (err)
//                 res.send(err);

//             res.json({ message: 'User updated!' });
//         });

//     });
// })

// // delete the bear with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
// .delete(function (req, res) {
//     User.remove({
//         _id: req.params.user_id
//     }, function (err, user) {
//         if (err)
//             res.send(err);

//         res.json({ message: 'Successfully deleted' });
//     });
// });


// Return router
module.exports = supplier_route;