'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalNiveauAttaqueCtrl
 * @description
 * # ModalNiveauAttaqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalNiveauAttaqueCtrl', function($uibModalInstance, data, translatedwords, $base64, $scope, $window, $translatePartialLoader, $translate, NiveauAttaque, $q, $filter) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "Niveau_Attaque": null
      };
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      if (pc.data.action == "update") {
        pc.obj = pc.data.updateObj;
      }
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          $filter('escapeObject')(pc.obj, true);
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "update") {
            console.log("update");
            NiveauAttaque.updateNiveauAttaque(pc.data.baseUrl, pc.obj).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          NiveauAttaque.pushNiveauAttaque(pc.data.baseUrl, pc.obj).then(function(resp) {
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