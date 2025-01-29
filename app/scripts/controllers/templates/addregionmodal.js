'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalAddRegionCtrl
 * @description
 * # ModalAddRegionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalAddRegionCtrl', function($uibModalInstance, data, translatedwords, $scope, $translatePartialLoader, $translate, $window, gestionPays, $q, $filter) {
    var pc = this;
    pc.data = data;
    pc.errPushInsert = "Error :";
    pc.obj = {
      "IDPays": null,
      "Region": null
    };

    var loadDataCountries = () => {
      pc.loading = true;
      if (pc.data.countriesArray == undefined) {
        var defer = $q.defer();
        return gestionPays.getPays(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.countriesArray = res.data;
          defer.resolve(res.data);
        });
      } else {
        pc.loading = false;
      }
    }

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.submitForm = function(isValid) {
      if (isValid) {
        pc.errPushInsert = "Error :";
        pc.loading = true;
        $filter('escapeObject')(pc.obj, true);
        console.log(JSON.stringify(pc.obj));

        gestionPays.pushRegionData(pc.data.baseUrl, pc.obj).then(function(resp) {
          if (resp.data[0].message == "ajout reussi") { //validate success
            $uibModalInstance.close('insert');
          } else {
            pc.errPushInsert += "an error occured " + resp.data[0].description;
            console.log(resp.data[0].description);
          }
          pc.loading = false;
        });
      }
    };

    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };


  });