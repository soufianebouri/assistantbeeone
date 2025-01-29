'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ApporteauAdvenceddetailCtrl
 * @description
 * # ApporteauAdvenceddetailCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ApporteauAdvenceddetailCtrl',  function ($uibModalInstance,data) {
    var pc = this;
        pc.data=data;
    console.log("from modal",data);
    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };

  });
