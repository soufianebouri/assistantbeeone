'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('HeaderCtrl', async function($scope, $location, $window, translation, auth, domaine, $cookies, toastr, $state, AccessRightsService, translatedwords, $q, $translatePartialLoader, $route, $timeout, $translate, _version) {
   
    $scope._version = _version;
    var pc = this;
    var obj = translation.getObjectTranslated();
    $scope.lang = $window.localStorage.getItem("lang");
    if (obj.reload) {
      $location.path("/home");
    }

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.StatesWithoutFarm = ['home', 'gestionprofils', 'groupe', 'profilsfermes', 'ressources_hydriques', 'tb_organisationparcelisation', 'SuiviressourceshydriquesEtat', 'bilan_technique', 'gestiondessocietes', 'gestiondesfermes', 'suiviinterventionsequipements_synthese', 'profile_calibre_data_integration', 'etatdesynthesescroring', 'ajustement_des_calibres'];


    $scope.changelang = function(lang) {
      $window.localStorage.setItem("lang", lang);
      $window.location.reload();
    }

    $scope.loading = false;   


    //disconnect
    $scope.logout = function() {
      $scope.loading = true;
      $timeout(function () {             
        auth.ClearCredentials();
        $scope.loading = false; 
      }, 3000);
      
    }



  });