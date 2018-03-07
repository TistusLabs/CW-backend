var express = require('express');
var mail_route = express.Router();
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");
var twilio = require('twilio');
var Verification = require('../models/verification');
var User = require('../models/user');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tistuslabs@gmail.com',
        pass: 'iamshehantissera'
    }
});

function UpdateUserProfile(obj,req,res) {
    console.log("Updating profile details");
    var findObject = {}

    if (obj.type == "mobile") {
        findObject = { "mobile": obj.verificationItem }
    } else if (obj.type == "email") {
        findObject = { "email": obj.verificationItem }
    }

    User.find(findObject, function (err, foundObjects) {

        if (foundObjects.length == 0) {
            var rObj = { Message: 'Profile not found for the given detail.', IsSuccess: false, Error: err };
            console.log(rObj.Message);
            res.json(rObj);
        } else {
            var resultObj = foundObjects[0];
            if(obj.type == "mobile"){
                resultObj.MobileVerficationCompleted();
            } else if (obj.type == "email") {
                resultObj.UserActivationCompleted();
            }
            resultObj.save(function (err) {
                if (err) {
                    var rObj = { Message: 'Error on saving user details!', IsSuccess: false, Error: err };
                    console.log(rObj.Message);
                    res.json(rObj);
                } else {
                    var rObj = { Message: 'Profile update successfull.', IsSuccess: true, Error: "" };
                    console.log(rObj.Message);
                    res.json(rObj);
                }
            });
        }

    });
}

function SaveVerificationDetails(obj,req,res) {
    console.log("Saving verification information");
    obj.save(function (err) {
        if (err) {
            var rObj = { Message: 'Error on saving verification details!', IsSuccess: false, Error: err };
            console.log(rObj.Message);
            res.json(rObj);
        } else {
            UpdateUserProfile(obj,req,res);
        }
    });
}

mail_route.route('/verification/email')
    .post(function (req, res) {

        var verificationCode = randomstring.generate({
            length: 10,
            charset: 'alphanumeric'
        });;

        var veriObj = new Verification();
        veriObj.verificationItem = req.body.email;
        veriObj.type = "email";
        veriObj.verificationCode = verificationCode;
        veriObj.create_date = Date.now();
        veriObj.verificationCompleted = false;

        var mailOptions = {
            from: 'no-reply@bingo.com',
            to: req.body.email,
            subject: 'BBBings Verification Email',
            text: 'Hi, This is your verification code: ' + verificationCode
        };

        veriObj.save(function (err) {
            if (err) {
                var rObj = { Message: 'Error on email verification code creation!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        var rObj = { Message: 'Error on sending Email!', IsSuccess: false, Error: error };
                        console.log(rObj.Message);
                        res.json(rObj);
                    } else {
                        var rObj = { Message: 'Email sent successfully!', IsSuccess: true, Error: "" };
                        console.log(rObj.Message);
                        res.json(rObj);
                    }
                });
            }
        });
    });

mail_route.route('/verification/mobile')
    .post(function (req, res) {

        var verificationCode = randomstring.generate({
            length: 10,
            charset: 'alphanumeric'
        });;

        var veriObj = new Verification();
        veriObj.verificationItem = req.body.mobile;
        veriObj.type = "mobile";
        veriObj.verificationCode = verificationCode;
        veriObj.create_date = Date.now();
        veriObj.verificationCompleted = false;

        var accountSid = 'AC4bb192786663f920bc115f6bc23cfd55';
        var authToken = 'bf68a987222fbf2ca7f8383b2b3016f2';

        var client = new twilio(accountSid, authToken);

        veriObj.save(function (err) {
            if (err) {
                var rObj = { Message: 'Error on mobile verification code creation!', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                client.messages.create({
                    body: 'Hello from BBBings, Your verification code is: ' + verificationCode,
                    to: '+94770727245',  // Text this number
                    from: '+94770727245' // From a valid Twilio number
                })
                    .then(function (message) {
                        if (message.errorMessage) {
                            var rObj = { Message: 'Error on sending SMS!', IsSuccess: false, Error: message.errorMessage };
                            console.log(rObj.Message);
                            res.json(rObj);
                        } else {
                            var rObj = { Message: 'SMS sent successfully!', IsSuccess: true, Error: "" };
                            console.log(rObj.Message);
                            res.json(rObj);
                        }
                    });
            }
        });
    });

mail_route.route('/verification/check')
    .post(function (req, res) {

        var findObject = {
            type: req.body.type,
            verificationItem: req.body.item,
            verificationCode: req.body.code
        }

        Verification.find(findObject, function (err, foundObjects) {
            if (foundObjects.length == 0) {
                var rObj = { Message: 'Incorrect details provided', IsSuccess: false, Error: err };
                console.log(rObj.Message);
                res.json(rObj);
            } else {
                var obj = foundObjects[0];
                obj.VerificationCompleted();
                SaveVerificationDetails(obj,req,res);
            }

        });


    });

module.exports = mail_route;