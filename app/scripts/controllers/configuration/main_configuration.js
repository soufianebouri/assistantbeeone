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
    
    $scope.steps = [
      {
        title: "Configuration Du Compte",
        description: "This step is about simply configuring your account and addressing all the needed informations.",
        icon: "person",
        role: "Responsable RH - Controleur De Gestion",
        etapes: 3,
        duration: "30min - 45min",
        progress: 0,
        buttonActive: true
      },
      {
        title: "Création Du Référentiel",
        description: "This step is about simply .",
        icon: "storage",
        role: "Gestionnaire de ferme",
        etapes: 3,
        duration: "30min - 45min",
        progress: 0,
        buttonActive: false
      },
      {
        title: "Attachement Parcelles",
        description: "This step is about simply configuring your account and addressing all the needed informations.",
        icon: "share",
        role: "Responsable RH - Controleur De Gestion",
        etapes: 2,
        duration: "30min - 45min",
        progress: 0,
        buttonActive: false
      }
    ];



    vm.logout  = async function (){
      auth.ClearCredentials();
    }

  });