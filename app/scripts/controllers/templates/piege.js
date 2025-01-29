'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalPiegeCtrl
 * @description
 * # ModalPiegeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalPiegeCtrl', function($uibModalInstance,
    data,
    $scope, translatedwords,
    $window, $translatePartialLoader, $translate,
    $q,
    $filter,
    FermeService,
    ParcellePhysique,
    Piege,
    Cible,
    moment) {
    var pc = this;
    pc.data = data;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    if (pc.data.action == "insert" || pc.data.action == "update") {
      pc.errPushInsert = "Error :";
      pc.obj = {
        "ID": null,
        "ID_Parcelle": null,
        "ID_Ferme": null,
        "Code_Piege": null,
        "Ligne": null,
        "Piege": null,
        "Long_Piege": null,
        "Etat_Piege": 1,
        "Caracteristique": 1,
        "Date_Installation": null,
        "DateCreated": null
      };
      pc.validateDate = true;
      pc.checkdate = () => {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        pc.validateDate = (pc.obj.Date_Installation.getTime() >= today.getTime()) ? true : false;
      }
      pc.loadDataParcelle = () => {
        pc.loading = true;
        var defer = $q.defer();
        return ParcellePhysique.getParcellePhysique(pc.data.baseUrl, {
          IDFermes: pc.obj.ID_Ferme
        }).then(function(res) {
          pc.loading = false;
          pc.data.parcelsArray = res.data;
          defer.resolve(res.data);
        });
      }
      if (pc.data.action == "update") {
        pc.obj = {
          ...pc.data.updateObj
        };
        pc.loadDataParcelle();
      }

      pc.loadDataFarms = () => {
        pc.loading = true;
        if (pc.data.farmsArray == undefined) {
          var defer = $q.defer();
          return FermeService.getFermesByIdName(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            pc.data.farmsArray = res.data;
            defer.resolve(res.data);
          });
        } else {
          pc.loading = false;
        }
      }

      pc.loadDataTarget = () => {
        pc.loading = true;
        if (pc.data.targetArray == undefined) {
          var defer = $q.defer();
          return Cible.getCible(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            pc.data.targetArray = res.data;
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
          pc.obj.Date_Installation = moment(pc.obj.Date_Installation).format('YYYY-MM-DD');
          $filter('escapeObject')(pc.obj, true);
          if (pc.data.action == "insert") {
            Piege.pushPiege(pc.data.baseUrl, pc.obj).then(function(resp) {
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
          Piege.updatePiege(pc.data.baseUrl, pc.obj).then(function(resp) {
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