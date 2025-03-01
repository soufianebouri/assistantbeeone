'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OnboardingOnboardingStepsCtrl
 * @description
 * # OnboardingOnboardingStepsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OnboardingOnboardingStepsCtrl', function($scope,mainAssist, $timeout, auth,country, _url, $window, $state, $translatePartialLoader, $translate,onboarding, _version) {
    var vm = this;
    vm._version = _version;



    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    vm.countries = country.get_country();

    vm.step_1 = true;

    mainAssist.checkauth()

    $q.all([
  mainAssist.checkauth()
])
.then((values) => {
  // Handle success (values is an array of resolved promises)
})
.catch((error) => {
  NProgress.done();

  if (error.status && error.status !== 200) {
    console.error("Request failed with status:", error.status);
    $state.go('login'); // Redirect to login if status is not 200
  }
});


    vm.steps = async function (step){
      NProgress.start();

      if(step == 1){
        vm.step_1 = false;
        vm.step_2 = true;
      }else if(step == 2){
        vm.step_2 = false;
        vm.step_3 = true;
      }else if(step == 3){
        vm.step_3 = false;
        vm.step_4 = true;
      }else if(step == 4){
        vm.step_4 = false;
        vm.step_5 = true;
      }else if(step == 5){
        vm.step_5 = false;
        vm.step_6 = true;
      }

      NProgress.done();
      return;
    };

    vm.continuer = async function () {
      $scope.loading = true;
      $timeout(function () {
        $scope.loading = false;
        $state.go('main_configuration');
      }, 3000);
    }


    vm.logout  = async function (){
      auth.ClearCredentials();
    }

  });
