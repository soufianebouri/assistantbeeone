'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationMainConfigurationCtrl
 * @description
 * # ConfigurationMainConfigurationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationMainConfigurationCtrl', function($scope, $timeout, auth, _url, $window, $state, $translatePartialLoader, $translate,onboarding, _version) {
    var vm = this;
    vm._version = _version;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    
   vm.go_config = async function (params) {
    $scope.loading = true;
    if(params == 1){
      $timeout(function () {
        $scope.loading = false;
        $state.go('v_comptes');
      }, 2000);
    }
   }

    vm.logout  = async function (){
      auth.ClearCredentials();
    }

  });