
var express = require('express');
var User = require('../models/user');
var Profile = require('../models/profile');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var user_route = express.Router();

const saltRounds = 5;

user_route.route('/users/authenticate')
    .post(function (req, res) {

        var email = req.body.email;
        var password = req.body.password;

        var findObject = { "email": email }
        User.find(findObject, function (err, foundObjects) {
            if (foundObjects.length == 0) {
                var rObj = { Message: 'Invalid user credentials.', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var resultObj = foundObjects[0];
                if (bcrypt.compareSync(password, resultObj.password)) {
                    const payload = {
                        email: resultObj.email,
                        profileID: resultObj.profileID
                    };
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    var rObj = { Message: 'Authentication Successful.', IsSuccess: true, Error: "", Token: token };
                    console.log(rObj.Message);
                    res.json(rObj);
                } else {
                    var rObj = { Message: 'Invalid user credentials.', IsSuccess: false, Error: err };
                    console.log(rObj.Message);
                    res.json(rObj);
                }
            }
        });
    });

user_route.use(function (req, res, next) {

    var token = req.body.Authorization || req.query.Authorization || req.headers['authorization'];

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                var rObj = { Message: 'Authorization Failed.', IsSuccess: false, Error: "" };
                console.log(rObj.Message);
                return res.status(403).send(rObj);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        var rObj = { Message: 'No Authorization Token Available.', IsSuccess: false, Error: "" };
        console.log(rObj.Message);
        return res.status(403).send(rObj);
    }
});

// user_route.get('/users/demo', function (req, res) {
//     console.log(req.decoded);
//     res.json({ message: 'hooray! welcome to our api!' });
// });

user_route.route('/users')
    .post(function (req, res) {

        let profile = new Profile();
        profile.firstName = req.body.firstName;
        profile.lastName = req.body.lastName;
        profile.nicPassport = req.body.nicPassport;
        profile.mobile = req.body.mobile;
        profile.callingName = "";
        profile.isActive = false;
        profile.mobileVerified = false;
        profile.create_date = Date.now();

        let user = new User();
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(req.body.password, salt);

        user.email = req.body.email;
        user.password = hash;

        profile.save(function (err, newProfile) {
            if (err) {
                var rObj = { Message: 'Error on profile creation!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                user.profileID = newProfile.id;
                user.save(function (err) {
                    if (err) {
                        var rObj = { Message: 'Error on profile creation!', IsSuccess: false, Error: err };
                        console.log(rObj.Message);
                        res.json(rObj);
                    } else {
                        var rObj = { Message: 'User created!', IsSuccess: true, Error: "" };
                        console.log(rObj.Message);
                        res.json(rObj);
                    }
                });
            }
        });
    })

    .get(function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

user_route.route('/users/:user_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function (req, res) {
        User.findById(req.params.user_id, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function (req, res) {

        // use our bear model to find the bear we want
        User.findById(req.params.user_id, function (err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;  // update the bears info

            // save the bear
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
    .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// Return router
module.exports = user_route;