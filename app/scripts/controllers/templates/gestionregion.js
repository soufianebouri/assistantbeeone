'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalGestionRegionCtrl
 * @description
 * # ModalGestionRegionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalGestionRegionCtrl', function($uibModalInstance, translatedwords, $uibModal, data, $base64, $scope, $window, $translatePartialLoader, $translate, gestionPays, $q, $filter) {
    var pc = this;
    pc.data = data;
    pc.errPushInsert = "Error :";
    pc.obj = {
      "idP": null,
      "idR": null,
      "idZ": null,
      "Pays": null,
      "Region": null,
      "Zone": null
    };

    var updateData = () => {
      if (pc.data.action == "update") {
        pc.obj = pc.data.updateObj;
        console.log(JSON.stringify(pc.obj) + " hh ");
      }
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    if (pc.data.action == "insert" || pc.data.action == "update") {

      pc.loadDataRegion = () => {
        pc.loading = true;
        return gestionPays.getRegionData(pc.data.baseUrl, {
          ID: pc.obj.idP
        }).then(function(res) {
          pc.loading = false;
          for (var i in res.data) {
            $filter('escapeObject')(res.data[i], false);
          }
          pc.data.regionArray = res.data;
          updateData();
        });

      }

      pc.loadDataCountries = function() {
        pc.loading = true;
        var defer = $q.defer();
        if (pc.data.countriesArray == undefined) {
          return gestionPays.getPays(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            for (var i in res.data) {
              $filter('escapeObject')(res.data[i], false);
            }
            pc.data.countriesArray = res.data;
            updateData();
            defer.resolve(res.data);
          });
        } else {
          return new Promise(function(resolve, reject) {
            pc.loading = false;
            updateData();
            resolve(0);
          });
        }
      }
      //FOR INSERT & Update MODAL
      pc.submitForm = function(isValid) {
        if (isValid) {
          pc.errPushInsert = "Error :";
          pc.loading = true;
          $filter('escapeObject')(pc.obj, true);
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "update") {
            console.log("update");
            gestionPays.updateCountriesWithData(pc.data.baseUrl, pc.obj).then(function(resp) {
              if (resp.data[0].message == "ajout reussi") { //validate success
                $uibModalInstance.close('insert');
              } else {
                pc.errPushInsert += "an error occured " + resp.data[0].description;
              }
              pc.loading = false;
            });
            return;
          }
          gestionPays.pushCountriesWithData(pc.data.baseUrl, pc.obj).then(function(resp) {
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

      pc.addRegion = () => {

        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: './views/templates/addregionmodal.html',
          controller: 'ModalAddRegionCtrl',
          controllerAs: 'pc',
          size: '',
          resolve: {
            data: function() {
              return pc.data;
            }
          }
        });

        modalInstance.result.then(function(res) {
          if (res == 'insert') {
            pc.loadDataRegion();
          }
        }, function() {});

      }

      pc.loadDataCountries().then(() => {
        //if update reload dataRegionSelect
        if (pc.data.action == "update") {
          pc.loadDataRegion();
        }
      });


    } else if (pc.data.action == "delete") {
      //FOR CONFIRMATION MODAL
      pc.confirmeDelete = function(res) {
        if (res == 1) {
          $uibModalInstance.close('deleteRegion');
        } else if (res == 2) {
          $uibModalInstance.close('deleteZone');
        } else {
          $uibModalInstance.dismiss('cancel');
        }
      };
    }
  });