var express = require('express');
var Dealer = require('../models/dealer');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var dealer_route = express.Router();

// checking token for each and every request
// dealer_route.use(function (req, res, next) {

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

function addingOrUpdatingDealer(dealer, flag, req, res) {

    dealer.name = req.body.name;
    dealer.address = req.body.address;
    dealer.logoURL = req.body.logoURL;
    dealer.landline = req.body.landline;
    dealer.mobile = req.body.mobile;
    dealer.sellingPrice = req.body.sellingPrice;
    dealer.create_date = Date.now();

    dealer.save(function (err, newItem) {
        if (err) {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Error on dealer creation!', IsSuccess: false, Error: err };
            } else if (flag == "update") {
                rObj = { Message: 'Error on updating dealer!', IsSuccess: false, Error: err };
            }
            console.log(rObj.Message);
            res.json(rObj);
        } else {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Dealer created successfully!', IsSuccess: true, Error: "" };
            } else if (flag == "update") {
                rObj = { Message: 'Dealer updated successfully!', IsSuccess: true, Error: "" };
            }
            console.log(rObj.Message);
            res.json(rObj);
        }
    });
}

// saving inventory item
dealer_route.route('/dealer')
    .post(function (req, res) {

        let newDealer = new Dealer();
        if (req.body._id != undefined) {
            Dealer.findById(req.body._id, function (err, newDealer) {
                addingOrUpdatingDealer(newDealer, "update", req, res);
            });
        } else {
            addingOrUpdatingDealer(newDealer, "save", req, res);
        }

    });

dealer_route.route('/dealer')
    .get(function (req, res) {
        Dealer.find(function (err, dealerdetails) {
            if (err)
                res.send(err);
            res.json(dealerdetails);
        });
    });

// dealer_route.route('/profile/:profile_id')

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
module.exports = dealer_route;