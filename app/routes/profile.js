
var express = require('express');
var Profile = require('../models/profile');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var profile_route = express.Router();

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

// saving profile information
profile_route.route('/profile')
    .post(function (req, res) {

        let profile = new Profile();
        profile.firstName = req.body.firstName;
        profile.lastName = req.body.lastName;
        profile.nicPassport = req.body.nicPassport;
        profile.mobile = req.body.mobile;
        profile.email = req.body.email;
        profile.address = req.body.address;
        profile.type = "customer";
        profile.callingName = "";
        profile.isActive = false;
        profile.mobileVerified = false;
        profile.create_date = Date.now();
        profile.otherDetails.vehicles = req.body.otherDetails.vehicles;

        profile.save(function (err, newProfile) {
            if (err) {
                var rObj = { Message: 'Error on profile creation!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var rObj = { Message: 'Profile created successfully!', IsSuccess: true, Error: "" };
                console.log(rObj.Message);
                res.json(rObj);
            }
        });
    });

profile_route.route('/profiles')
    .get(function (req, res) {
        Profile.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

profile_route.route('/profile/:profile_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function (req, res) {
        Profile.findById(req.params.profile_id, function (err, profile) {
            if (err) {
                var rObj = { Message: 'No Profile found!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                res.json(profile);
            }
        });
    });

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
module.exports = profile_route;