'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TemplatesAddparcelphysiqueCtrl
 * @description
 * # TemplatesAddparcelphysiqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AddparcelphysiqueCtrl', function($uibModalInstance, data, translatedwords, $base64, $scope, $translatePartialLoader, $translate, $window, TypeVarieteService, ParcellePhysique, _url) {
    var pc = this;
    pc.data = data;


    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Error :";
      pc.parcel = {
        "Type": 1,
        "Sup": null,
        "Ref": null,
        "ID": null,
        "IDFermes": null
      };

      if (pc.data.action == "update") {
        pc.parcel = {
          ...pc.data.updateParcel
        };
      }


      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      pc.parcel.Reference = null;
      pc.parcel.IDNature_sol = null;
      pc.parcel.Altitude = null;
      pc.parcel.Coord_X = null;
      pc.parcel.Coord_Y = null;

      setTimeout(function() {
        $('#ferme').selectpicker('val', pc.parcel.IDFermes);
        $(".selectpicker").selectpicker('refresh');
      }, 1000);

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

    $scope.verifyParcel = () => {
      var index = 0;
      if (pc.data.action == 'update') {
        if (pc.parcel.Ref.toLowerCase() == pc.data.updateParcel.Ref.toLowerCase() && pc.parcel.IDFermes == pc.data.updateParcel.IDFermes) {
          return false;
        }
      }
      if (((index = pc.data.allParcel.indexOf(pc.parcel.Ref.toLowerCase())) != -1 && (pc.parcel.IDFermes != pc.data.farmsId[index])) || index == -1) {
        return false;
      }
      return true;
    }


    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };

    pc.submitForm = (isValid) => {
      if (isValid) {
        pc.errPushInsert = "Error :";
        if (pc.data.action == "update") {
          ParcellePhysique.updateParcellePhysique(_url, pc.parcel).then(e => {
            if (e.data[0].message == "ajout reussi") { //validate success
              $uibModalInstance.close('insert');
            } else {
              pc.errPushInsert += "an error occured " + e.data[0].description;
              console.log(e.data[0].description);
            }
          });
          return;
        }

        ParcellePhysique.createParcellePhysique(_url, pc.parcel).then(e => {
          if (e.data[0].message == "ajout reussi") { //validate success
            $uibModalInstance.close('insert');
          } else {
            pc.errPushInsert += "an error occured " + e.data[0].description;
            console.log(e.data[0].description);
          }
        });
      }
    }

  });