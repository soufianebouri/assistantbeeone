'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalQualiteStadeCtrl
 * @description
 * # ModalQualiteStadeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalQualiteStadeCtrl', function($uibModalInstance, translatedwords, data, $base64, $translatePartialLoader, $translate, $scope, $window, qualiteStade, $q, $filter) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "Qualite_Stade": null,
        "CouleurCalque": null,
        "CouleurCadre": null
      };
      if (pc.data.action == "update") {
        pc.obj = pc.data.updateObj;
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
          if (pc.data.action == "update") {
            console.log("update");
            qualiteStade.updateQualiteStade(pc.data.baseUrl, pc.obj).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          qualiteStade.pushQualiteStade(pc.data.baseUrl, pc.obj).then(function(resp) {
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