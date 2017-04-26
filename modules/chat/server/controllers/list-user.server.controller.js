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
  });
};

exports.add = function (req, res) {
  var io = req.app.get('socketio');
  console.log(req.body);
  var email = req.body.email;
  var myemail = req.user.email;
  console.log(myemail);
  User.findOne({
    email: myemail
  }, function(err, user) {
    if (!err) {
      var data = {
        _id: user._id,
        email: user.email,
        name: user.username,
        profileImageURL: user.profileImageURL,
        status: 'pendding'
      };
      io.emit('notification', data);
      // User.findOne({
      //   email: myemail
      // }, function(_err, _user) {
      //   if (_user !== null) {
      //     console.log(data);
      //     addData(data);
      //   }
      // });
    }

  });
};
exports.AcceptOrCancel = function(req, res) {
  console.log(req.body);
  var email = req.user.email;
  console.log(email);
  var myemail = req.body.email;
  var action = req.body.action;
  console.log(action);
  console.log(myemail);
  function addData(data) {
    User.findOne({
      _id: data._id
    }, function(err, receive) {
      if (receive !== null) {
        receive.friendList.unshift(data);
        receive.save();
      }
    });
  }

  if (action === 'accept') {
    User.findOne({
      email: myemail
    }, function(err, receive1) {
      console.log(receive1);
      if (receive1 !== null) {
        var data1 = {
          _id: receive1._id,
          email: receive1.email,
          name: receive1.username,
          profileImageURL: receive1.profileImageURL,
          status: 'pendding'
        };
        addData(data1);
      }
    });
  }
};
    // User.findOne({
    //   email: myemail
    // }, function(err, receive1) {
    //   var data1 = {
    //     _id: receive1._id,
    //     email: receive1.email,
    //     name: receive1.username,
    //     profileImageURL: receive1.profileImageURL,
    //     status: 'pendding'
    //   };
    //   if (receive !== null && !err) {
    //     receive.friendList.unshift(data1);
    //     receive.save();
    //   }
    // }),


/**
 * User middleware
 */
