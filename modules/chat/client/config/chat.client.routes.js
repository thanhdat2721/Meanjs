(function () {
  'use strict';

  angular
    .module('chat')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Chat state routing
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chat'
        }
      });
      // .state('modalFriend', {
      //   url: '/chat/addfriend',
      //   templateUrl: '/modules/chat/client/views/modal.client.view.html',
      //   controller: 'ChatController'
      // });
  }
}());
