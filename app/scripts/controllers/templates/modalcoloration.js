'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalColorationCtrl
 * @description
 * # ModalColorationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalColorationCtrl', function($uibModalInstance, $cookies, cultureService, data, translatedwords, $base64, $scope, $window, $translatePartialLoader, $translate, FermeService, NiveauColorationService, $q) {
    var pc = this;
    pc.data = data;
    console.log(pc.data);
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Culture").selectpicker('refresh');
    }, 1000);

    function loadData() {
      if (pc.data.CultureArray == undefined) {
        cultureService.getCultureByFerme($cookies.getObject('beeoneAssistant').ferme.IDFerme).then(function(res) {
          pc.loading = false;
          pc.data.CultureArray = res.data;
        });
      } else {
        pc.loading = false;
      }
      setTimeout(function() {
        $(".selectpicker").selectpicker();
        $("#Culture").selectpicker('refresh');
      }, 1000);

    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.loading = true;
      pc.errPushInsert = "Error :";
      pc.coloration = {
        "Niveau_Coloration": null,
        "Photo": null,
        "ID_Culture": null
      };

      if (pc.data.action == "update") {
        pc.coloration = pc.data.updateColoration;
      }
      loadData();
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;

          console.log(JSON.stringify(pc.coloration));
          if (pc.data.action == "update") {
            console.log("update");
            NiveauColorationService.updateColoration(pc.data.baseUrl, pc.coloration).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          NiveauColorationService.pushColoration(pc.data.baseUrl, pc.coloration).then(function(resp) {
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