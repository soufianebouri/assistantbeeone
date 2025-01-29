'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TemplatesModaloperationctrlCtrl
 * @description
 * # TemplatesModaloperationctrlCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalOperationCtrl', function($uibModalInstance, data, translatedwords, $base64, $scope, $window, $translatePartialLoader, $translate, FermeService, OperationService, $q) {
    var pc = this;
    pc.data = data;
    pc.loading = true;
    pc.reloadSelectPickerfunction = async () => {
      await loadData();
    }

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#FermeName").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    var updateData = () => {
      if (pc.data.action == "update") {
        pc.operation = pc.data.updateOperation;
      }
      $('#FermeName').selectpicker('refresh');
    }
    var loadData = () => {

      if (pc.data.fermeArray == undefined) {
        var defer = $q.defer();
        return FermeService.getFermesByIdName(pc.data.baseUrl).then(function(res) {
          pc.loading = false;
          pc.data.fermeArray = res.data;
          updateData();
          defer.resolve(res.data);
        });
      } else {
        pc.loading = false;
        updateData();
      }
      setTimeout(function() {
        $(".selectpicker").selectpicker();
        $("#FermeName").selectpicker('refresh');
      }, 1000);
    }


    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.operation = {
        "OpeRef_Id": null,
        "NOM": null,
        "IDFermes": null,
        "OpeRef_Intitule": null
      };


      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;

          console.log(JSON.stringify(pc.operation));
          if (pc.data.action == "update") {
            console.log("update");
            OperationService.updateOperation(pc.data.baseUrl, pc.operation).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          OperationService.pushOperation(pc.data.baseUrl, pc.operation).then(function(resp) {
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
      };

    }

  });