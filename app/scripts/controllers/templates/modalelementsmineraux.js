'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalElementsMinerauxCtrl
 * @description
 * # ModalElementsMinerauxCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalElementsMinerauxCtrl', function($uibModalInstance, data, translatedwords, $base64, $scope, $window, $translatePartialLoader, $translate, FermeService, ElementsMinerauxService, $q) {
    var pc = this;
    pc.data = data;


    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.Eelem = {
        "ID": null,
        "Element_mineral": null
      };
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      if (pc.data.action == "update") {
        pc.Eelem = pc.data.updateElem;
      }
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;

          console.log(JSON.stringify(pc.Eelem));
          if (pc.data.action == "update") {
            console.log("update");
            ElementsMinerauxService.updateEelem(pc.data.baseUrl, pc.Eelem).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          ElementsMinerauxService.pushEelem(pc.data.baseUrl, pc.Eelem).then(function(resp) {
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