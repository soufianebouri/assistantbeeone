'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalIntensiteStadeCtrl
 * @description
 * # ModalIntensiteStadeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalIntensiteStadeCtrl', function($uibModalInstance, data, $base64, translatedwords, $translatePartialLoader, $translate, $scope, $window, FermeService, IntensiteStadeService, $q) {
    var pc = this;
    pc.data = data;


    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.intensiteStade = {
        "ID": null,
        "Intensite_Stade": null
      };

      if (pc.data.action == "update") {
        pc.intensiteStade = pc.data.updatIntensiteStade;
      }

      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;

          console.log(JSON.stringify(pc.intensiteStade));
          if (pc.data.action == "update") {
            console.log("update");
            IntensiteStadeService.updateStade(pc.data.baseUrl, pc.intensiteStade).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          IntensiteStadeService.pushStade(pc.data.baseUrl, pc.intensiteStade).then(function(resp) {
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
        if (pc.uploadService != null) {
          pc.uploadService.abort();
        }
        $uibModalInstance.close('cancel create');
      };

    } else if (pc.data.action == "delete") {

      //FOR CONFIRMATION MODAL
      pc.confirmeDelete = function(res) {
        if (res == 1) {
          $uibModalInstance.close('delete');
          return;
        }
        $uibModalInstance.dismiss('cancel delete');
      };

    }
  });