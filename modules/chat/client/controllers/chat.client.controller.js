(function () {
  'use strict';

  angular
    .module('chat')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', 'Authentication', 'Socket', '$window', 'Upload', '$timeout', '$filter', '$http', '$httpParamSerializer', 'Notification', '$uibModal', '$log', '$document'];

  function ChatController($scope, $state, Authentication, Socket, $window, Upload, $timeout, $filter, $http, $httpParamSerializer, Notification, $uibModal, $log, $document) {
    var vm = this;

    vm.messages = [];
    vm.messageText = '';
    vm.sendMessage = sendMessage;
    $scope.addFriend = addFriend;
    vm.progress = 0;
    vm.sumNoti = 0;
    vm.animationsEnabled = true;
    vm.items = [];

    vm.open = function (size, parentSelector) {
      var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: function($uibModalInstance, items, $scope) {
          console.log(items);
          $scope.items = items;
          vm.selected = {
            item: $scope.items[0]
          };
          $scope.AcceptOrCancel = function(action, object) {
            console.log(action);
            console.log(object);
            var data1 = {
              action: action,
              email: object
            };
            $timeout(function() {
              $http({
                method: 'POST',
                url: '/api/AcceptOrCancel',
                data: $httpParamSerializer(data1),
                headers: {
                  'Content-type': 'application/x-www-form-urlencoded'
                }
              })
              .success(function() {})
              .error(function(err) {console.log(err);});
            });
          };
        },
        controllerAs: vm,
        size: size,
        appendTo: parentElem,
        resolve: {
          items: function () {
            return vm.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        vm.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // Make sure the Socket is connected
      if (!Socket.socket) {
        Socket.connect();
      }

      // Add an event listener to the 'chatMessage' event
      Socket.on('chatMessage', function (message) {
        vm.messages.unshift(message);
        console.log(message);
      });

      Socket.on('notification', function(data) {
        console.log(data);
        $timeout(function() {
          if (data) {
            vm.sumNoti += 1;
            console.log(vm.sumNoti);
            vm.items.push(data);
          }
        }, 0);
      });
      // Remove the event listener when the controller instance is destroyed
      $scope.$on('$destroy', function () {
        Socket.removeListener('chatMessage');
      });
    }

    // Create a controller method for sending messages
    function sendMessage() {
      // Create a new message object
      var message = {
        text: vm.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      vm.messageText = '';
    }
    // Users.query(function (data) {
    //   $scope.users = data;
    //   console.log(data);
    // });
    $http.get('/api/users').success(function(data) {
      $scope.users = data;
    });
    function addFriend(email) {
      var data = {
        email: email
      };
      $timeout(function() {
        $http({
          method: 'POST',
          url: '/api/add',
          data: $httpParamSerializer(data),
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        })
        .success(function() {})
        .error(function(err) {console.log(err);});
      });
    }

    //
    // function UploadPicture(dataUrl) {
    //   console.log(dataUrl);
    // }
    vm.upload = function (dataUrl) {
      console.log(dataUrl);
      Upload.upload({
        url: '/api/upload',
        data: {
          newPicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully to upload picture' });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to upload picture' });
    }

  }
}());
