'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalTrancheAgeCtrl
 * @description
 * # ModalTrancheAgeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalTrancheAgeCtrl', function($uibModalInstance, translatedwords, data, $base64, $scope, $window, $translatePartialLoader, $translate, TrancheAge, $q, $filter, VarieteService) {
    var pc = this;
    pc.dateValidation = true;
    pc.data = data;
    pc.loading = true;

    pc.checkYears = () => {
      if (pc.obj.A_ans >= pc.obj.De_ans) {
        pc.dateValidation = true;
      } else {
        pc.dateValidation = false;
      }
    }

    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "Code": null,
        "Estimation": "",
        "De_ans": "",
        "A_ans": "",
        "ID_Variete": null
      };

      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      if (pc.data.varieteArray == undefined) {
        VarieteService.getNameIdVariete(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.varieteArray = res.data;
        });
      } else {
        pc.loading = false;
      }

      if (pc.data.action == "update") {
        pc.obj = pc.data.updateObj;
        console.log(JSON.stringify(pc.obj) + " check this");
      }
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          $filter('escapeObject')(pc.obj, true);
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "update") {
            console.log("update");
            TrancheAge.updateTrancheAge(pc.data.baseUrl, pc.obj).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          TrancheAge.pushTrancheAge(pc.data.baseUrl, pc.obj).then(function(resp) {
            if (resp.data[0].message == "ajout reussi") { //validate success
              $uibModalInstance.close('insert');
            } else {
              pc.errPushInsert += "an error occured " + resp.data[0].description;
              console.log(resp.data[0].description);
            }
            pc.loading = false;
          });
          $uibModalInstance.close('insert');
        }
      };

      pc.cancel = function() {
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