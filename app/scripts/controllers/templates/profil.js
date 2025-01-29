'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalProfilCtrl
 * @description
 * # ModalProfilCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalProfilCtrl', function($uibModalInstance,
    data,
    $scope,
    $window, $translatePartialLoader, $translate,
    $q, translatedwords,
    $filter,
    Profil) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "Nom": null,
        "Prenom": null,
        "Phone": null,
        "Mail": null,
        "Login": null,
        "Password": null,
        "isAdmin": 0,
        "Etat": 0
      };
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      if (pc.data.action == "update") {
        pc.obj = {
          ...pc.data.updateObj
        };
      }

      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          $filter('escapeObject')(pc.obj, true);
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "insert") {
            Profil.pushProfil(pc.data.baseUrl, pc.obj).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
                console.log(resp.data[0].description);
              }
              pc.loading = false;
            });
            return;
          }
          Profil.updateProfil(pc.data.baseUrl, pc.obj).then(function(resp) {
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