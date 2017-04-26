'use strict';

module.exports = function (app) {
  // User Routes
  var chat = require('../controllers/upload.server.controller.js');
  var user = require('../controllers/list-user.server.controller.js');

  // Setting up the users profile api
  app.route('/api/users').get(user.list);
  app.route('/api/add').post(user.add);
  app.route('/api/AcceptOrCancel').post(user.AcceptOrCancel);
  // Setting up the users profile api
  app.route('/api/upload').post(chat.UploadPicture);
};
