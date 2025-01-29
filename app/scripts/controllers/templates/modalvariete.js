'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalVarieteeCtrl
 * @description
 * # ModalVarieteeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalVarieteeCtrl', function($uibModalInstance, data, VarieteService, translatedwords, $base64, $scope, $translatePartialLoader, $translate, Upload, $window, cultureService, TypeVarieteService) {
    var pc = this;
    pc.data = data;

    function loadData() {
      if (pc.data.cultureArray == undefined) {
        cultureService.getCultureIdName(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.cultureArray = res.data;
        });
      } else {
        pc.loading = false;
      }

      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      pc.loading = true;
      if (pc.data.typeVarieteArray == undefined) {
        TypeVarieteService.getTypeVariete(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.typeVarieteArray = res.data;
        });
      } else {
        pc.loading = false;
      }
    }

    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.loading = true;
      pc.errPushInsert = "Error :";
      pc.variete = {
        "varieteName": "",
        "kg": "",
        "culture": "",
        "couleur": "",
        "descriptif": "",
        "refFamille_variete": null,
        "iS_Envoi": null,
        "reference": "",
        "age_entree_production": "",
        "age_adulte": "",
        "mois_debut_cycle": "",
        "mois_fin_cycle": "",
        "jour_debut_cycle": "",
        "jour_fin_cycle": "",
        "abreviation": "",
        "couleurCalque": "",
        "couleurCadre": ""
      };

      if (pc.data.action == "update") {
        pc.variete = pc.data.updateVariete;
        console.log(JSON.stringify(pc.variete));
      }

      pc.uploadService = null;
      // load Data for selections (idFamilleVariete & culture)
      loadData();
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          if (pc.data.action == "update") {
            console.log(JSON.stringify(pc.variete));
            VarieteService.updateDataVariete(pc.data.baseUrl, pc.variete).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
                console.log("ok");
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
                console.log(resp.data[0].description);
              }
              pc.loading = false;
            });
            return;
          }

          VarieteService.pushDataVariete(pc.data.baseUrl, pc.variete).then(function(resp) {
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