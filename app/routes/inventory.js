var express = require('express');
var Inventory = require('../models/inventory');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var inventory_route = express.Router();

// checking token for each and every request
// inventory_route.use(function (req, res, next) {

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

function addingOrUpdatingInventoryItem(inventoryItem, flag, req, res) {

    inventoryItem.itemCode = req.body.itemCode;
    inventoryItem.itemName = req.body.itemName;
    inventoryItem.dealerPrice = req.body.dealerPrice;
    inventoryItem.sellingPrice = req.body.sellingPrice;
    inventoryItem.imageURL = req.body.imageURL;
    inventoryItem.create_date = Date.now();

    inventoryItem.save(function (err, newItem) {
        if (err) {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Error on inventory item creation!', IsSuccess: false, Error: err };
            } else if (flag == "update") {
                rObj = { Message: 'Error on updating inventory item!', IsSuccess: false, Error: err };
            }
            console.log(rObj.Message);
            res.json(rObj);
        } else {
            var rObj = {};
            if (flag == "save") {
                rObj = { Message: 'Inventory item created successfully!', IsSuccess: true, Error: "" };
            } else if (flag == "update") {
                rObj = { Message: 'Inventory item updated successfully!', IsSuccess: true, Error: "" };
            }
            console.log(rObj.Message);
            res.json(rObj);
        }
    });
}

// saving inventory item
inventory_route.route('/inventory/newitem')
    .post(function (req, res) {

        let newItem = new Inventory();
        if (req.body._id != undefined) {
            Inventory.findById(req.body._id, function (err, newItem) {
                addingOrUpdatingInventoryItem(newItem, "update", req, res);
            });
        } else {
            addingOrUpdatingInventoryItem(newItem, "save", req, res);
        }

    });

inventory_route.route('/inventory')
    .get(function (req, res) {
        Inventory.find(function (err, inventory) {
            if (err)
                res.send(err);
            res.json(inventory);
        });
    });

// inventory_route.route('/profile/:profile_id')

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
module.exports = inventory_route;