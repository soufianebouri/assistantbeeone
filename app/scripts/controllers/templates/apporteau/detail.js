'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TemplatesApporteauDetailCtrl
 * @description
 * # TemplatesApporteauDetailCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TemplatesApporteauDetailCtrl', function($uibModalInstance, translatedwords, data) {
    var pc = this;
    pc.parcel = data.parcel.split(",");
    pc.dose_per_parcel = data.dose_per_parcel.split(",");
    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };

  });