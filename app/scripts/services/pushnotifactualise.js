'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.pushNotifActualise
 * @description
 * # pushNotifActualise
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('pushNotifActualise', function ($mdDialog,$http,_url) {
    var parentEl = angular.element(document.body);

    function show(dataToPasse){
     return  $mdDialog.show({
         locals:dataToPasse,
         parent: parentEl,
         templateUrl: './views/templates/prevision/pushNotifiActualise.html',
         controller: 'NotificationactualiseCtrl',
         clickOutsideToClose: true,
         hasBackdrop: true
     });
   }
    return {
      showModal: show,
      sendNotifActualise: function(d) {
        NProgress.start();
        return $http.post(_url + "/demande_actualisation/", d);
      },
      getNotifActualise: function(d) {
        NProgress.start();
        return $http.get(_url + "/demande_actualisation/");
      }
    };
  });
