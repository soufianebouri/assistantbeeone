'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalFermesProfilCtrl
 * @description
 * # ModalFermesProfilCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalFermesProfilCtrl', function($uibModalInstance,
    data,
    $scope,
    $translatePartialLoader, $translate, $window, translatedwords,
    $q,
    $filter,
    FermeService,
    Profil,
    FermesProfil) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "ID_Profil": null,
        "ID_Ferme": null
      };
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      pc.loadDataProfil = () => {
        pc.loading = true;
        if (pc.data.profilArray == undefined) {
          var defer = $q.defer();
          return Profil.getProfilWithSomeProps(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            pc.data.profilArray = res.data;
            for (var i = 0; i < pc.data.profilArray.length; i++) {
              $filter('escapeObject')(pc.data.profilArray[i], false);
            }
            defer.resolve(res.data);
          });
        } else {
          pc.loading = false;
        }
      }

      if (pc.data.action == "update") {
        pc.loadDataProfil();
        pc.obj = {
          ...pc.data.updateObj
        };
        console.log(JSON.stringify(pc.obj) + " hna ");
      }

      pc.loadDataFarms = () => {
        pc.loading = true;
        if (pc.data.farmsArray == undefined) {
          var defer = $q.defer();
          return FermeService.getFermesByIdName(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            pc.data.farmsArray = res.data;
            for (var i = 0; i < pc.data.farmsArray.length; i++) {
              $filter('escapeObject')(pc.data.farmsArray[i], false);
            }
            defer.resolve(res.data);
          });
        } else {
          pc.loading = false;
        }
      }
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          pc.obj.createdBy = 'Admin';
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "insert") {
            FermesProfil.pushFermesProfil(pc.data.baseUrl, pc.obj).then(function(resp) {
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
          FermesProfil.updateFermesProfil(pc.data.baseUrl, pc.obj).then(function(resp) {
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