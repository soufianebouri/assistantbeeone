'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationMainConfigurationCtrl
 * @description
 * # ConfigurationMainConfigurationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationMainConfigurationCtrl', function($scope,toastr , $cookies, $timeout, $q, mainAssist, auth, _url, $window, $state, $translatePartialLoader, $translate,onboarding, _version) {
    var vm = this;
    vm._version = _version;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    vm.onboardingData = $cookies.getObject('beeoneAssistant');
    vm.Post = vm.onboardingData.assistUser.Post;
    vm.go_config = async function (params) {

    if(params == 1){
      $scope.loading = true;
      $timeout(function () {
        $state.go('v_comptes');
          $scope.loading = false;
      }, 2000);
    }else if(params == 2){
      $scope.loading = true;
        $timeout(function () {
          $state.go('v_referentiel');
            $scope.loading = false;
        }, 2000);
    }else if(params == 3){
      $scope.loading = true;
      $timeout(function () {
        $state.go('v_attachement_parcelles');
          $scope.loading = false;
      }, 2000);
    }else if(params == 4){
      $scope.loading = true;
      $timeout(function () {
        $state.go('v_secteurs_irrigation');
          $scope.loading = false;
      }, 2000);
    }else {
        toastr.clear();
        toastr.info("Task in progress 👀", {
        closeButton: true,
       });
      }
   }

    vm.logout  = async function (){
      auth.ClearCredentials();
    }


   NProgress.start();
    $q.all([
      mainAssist.get_percents()
    ]).then((values) => {
      vm.data_percents = values[0].data;
      console.log(vm.data_percents);
      NProgress.done();
    }).catch((error) => {
      NProgress.done();
    });

  });
