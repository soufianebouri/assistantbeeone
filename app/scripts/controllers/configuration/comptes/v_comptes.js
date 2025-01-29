'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVComptesCtrl
 * @description
 * # ConfigurationComptesVComptesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVComptesCtrl', function($scope, $timeout, auth,country, _url, $window, $state, $translatePartialLoader, $translate,onboarding, _version) {
    var vm = this;
    vm._version = _version;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    
    $scope.villes = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger'];
    $scope.statuts = ['SARL', 'SA', 'SAS'];
  
    $scope.fileName = 'Aucun fichier choisi';
    $scope.uploadFile = function (element) {
      var file = element.files[0];
      if (file) {
        $scope.fileName = file.name;
        $scope.$apply();
      }
    };


  });