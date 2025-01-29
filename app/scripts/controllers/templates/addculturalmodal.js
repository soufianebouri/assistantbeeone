'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TemplatesAddculturalmodalCtrl
 * @description
 * # TemplatesAddculturalmodalCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalCultureCtrl', function($uibModalInstance, data, translatedwords, cultureService, $base64, $scope, Upload, $window, $translatePartialLoader, $translate) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {

      //FOR INSERT & Update MODAL
      pc.picRequired = false;
      pc.loading = true;
      pc.errPushInsert = "Error :";
      pc.photo = null;
      pc.culture = {
        "culture": "",
        "famille": "",
        "ref": "",
        "nom_Famille": "",
        "ID": ""
      };

      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      if (pc.data.action == "update") {
        pc.culture = pc.data.updateCulture;
      }

      pc.uploadService = null;

      if (pc.data.familleArray == undefined) {
        cultureService.getFamilleCulture(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.familleArray = res.data;
        });
      } else {
        pc.loading = false;
      }

      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;

          if (pc.data.action == "insert") {
            pc.uploadService = cultureService.uploadService(pc.data.baseUrl, pc.photo, pc.culture);
          } else {
            pc.uploadService = cultureService.updateService(pc.data.baseUrl, pc.photo, pc.culture);
          }

          pc.uploadService.then(function(resp) { //upload function returns a promise
            if (resp.data[0].message == "ajout reussi") { //validate success
              $uibModalInstance.close('insert');
            } else {
              pc.errPushInsert += "an error occured " + resp.data[0].description;
            }
            pc.loading = false;
          }, function(resp) { //catch error
            pc.errPushInsert += 'Error status: ' + resp.status + "  ";
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