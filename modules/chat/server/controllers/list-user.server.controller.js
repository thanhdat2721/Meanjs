'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
    console.log(users);
  });
};

exports.add = function (req, res) {
  var io = req.app.get('socketio');
  console.log('>>>>>>>>>>', req.body);
  console.log(typeof(req.body));
  var myemail = req.body.myemail;
  var email = req.user.email;
  console.log(email);
  console.log(myemail);
  function addData(data) {
    User.findOne({
      email: email
    }, function(err, receive) {
      if (receive !== null) {
        receive.friendList.unshift(data);
        receive.save();
        io.emit('notification', data);
      }
    });
  }
  User.findOne({
    email: email
  }, function(err, user) {
    if (!err) {
      User.findOne({
        email: myemail
      }, function(_err, _user) {
        if (_user !== null) {

          var data = {
            _id: _user._id,
            email: _user.email,
            name: _user.username,
            profileImageURL: _user.profileImageURL,
            status: 'pendding'
          };
          console.log(data);
          addData(data);
        }
      });
    }

  });
};

/**
 * User middleware
 */
