'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OnboardingOnboardingStepsCtrl
 * @description
 * # OnboardingOnboardingStepsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OnboardingOnboardingStepsCtrl', function($scope,mainAssist,  $cookies, toastr, $timeout, $q, auth,country, _url, $window, $state, $translatePartialLoader, $translate,onboarding, _version) {
    var vm = this;
    vm._version = _version;

vm.onboardingData = $cookies.getObject('beeoneAssistant');
    if(vm.onboardingData.assistUser.onbording_passed){
      $state.go('main_configuration');
    }


    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    vm.countries = country.get_country();

    vm.step_1 = true;

    mainAssist.checkauth()

    /*$q.all([
          mainAssist.checkauth()
      ])
      .then((values) => {
        // Handle success (values is an array of resolved promises)
      })
      .catch((error) => {
        NProgress.done();
        console.log(error);
        if (error.status && error.status !== 200) {
          console.error("Request failed with status:", error.status);
          auth.ClearCredentials();
        }
      });*/


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

      vm.autreValue = (vm.autreValue) ? vm.autreValue : 'Autre'
      let data = {
        onbording_language : vm.langue,
        onbording_country :vm.country,
        Nom : vm.nom,
        Prenom : vm.prenom,
        Post : (vm.poste !== 'Autre') ? vm.poste : vm.autreValue,
        already_use_beeone : (vm.usedbefore == 2) ? 1 : 0,
        onbording_passed : true
      }

      NProgress.start()

      toastr.clear();
      auth.onbording(data).then( e => {
          auth.saveOnboard(data);
          $state.go('main_configuration');
          $scope.loading = false;
          NProgress.done();
      }).catch( e => {
        NProgress.done();
        toastr.clear();
        $scope.loading = false;
        toastr.error(e.data.message, {
          closeButton: true
        });
      });

    }


    vm.logout  = async function (){
      auth.ClearCredentials();
    }

  });
