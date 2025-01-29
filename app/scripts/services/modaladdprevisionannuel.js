'use strict';

/**
 * @ngdoc service
 * @name beeOneWebFrontApp.modalAddPrevisionAnnuel
 * @description
 * # modalAddPrevisionAnnuel
 * Factory in the beeOneWebFrontApp.
 */
angular.module('beeOneWebFrontApp')
  .factory('modalAddPrevisionAnnuel', function ($mdDialog,$translatePartialLoader, $translate,$window) {
    var parentEl = angular.element(document.body);
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    function show(dataToPasse){
     return  $mdDialog.show({
         locals:dataToPasse,
         parent: parentEl,
         templateUrl: './views/templates/prevision/AddPrevisionAnnyelle.html',
         controller: 'PrevisionAnnuelCtrl',
         clickOutsideToClose: true,
         hasBackdrop: true
     });
   }
    return {
      showModal: show
    };
  });
