'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ModalArbreCtrl
 * @description
 * # ModalArbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ModalArbreCtrl', function($uibModalInstance,
    data,
    $scope,
    $translatePartialLoader, $translate, $window, translatedwords,
    $q,
    $filter,
    FermeService,
    Arbre,
    parcelleCultural,
    uuid,
    moment) {
    var pc = this;
    pc.data = data;

    if (pc.data.action == "insert" || pc.data.action == "update") {
      pc.errPushInsert = "Error :";
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      pc.obj = {
        "ID": null,
        "ID_Ferme": null,
        "ID_ParcelleCulturale": null,
        "Date_Plantation": null,
        "NumLotPepiniere": null,
        "Code_Arbre": null,
        "QR_CODE": uuid.v4()
      };
      pc.validateDate = true;
      pc.checkdate = () => {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        pc.validateDate = (pc.obj.Date_Plantation.getTime() >= today.getTime()) ? true : false;
      }
      pc.loadDataParcelle = () => {
        pc.loading = true;
        var defer = $q.defer();
        console.log(JSON.stringify(pc.obj));
        return parcelleCultural.getParcelleCultural(pc.data.baseUrl, {
          IDFermes: pc.obj.ID_Ferme
        }).then(function(res) {
          console.log(JSON.stringify(res.data));
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
        console.log(JSON.stringify(pc.obj));
      }
      pc.generateCode = () => {
        $("#QR_CODE").val(pc.obj.QR_CODE);
        new QRCode("QrCodeImg", {
          text: pc.obj.QR_CODE,
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
      pc.loadDataFarms = () => {
        pc.loading = true;
        if (pc.data.farmsArray == undefined) {
          var defer = $q.defer();
          return FermeService.getFermesByIdName(pc.data.baseUrl).then(function(res) {
            pc.loading = false;
            pc.data.farmsArray = res.data;
            console.log(JSON.stringify(pc.data.farmsArray));
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
          pc.obj.Date_Plantation = moment(pc.obj.Date_Plantation).format('YYYY-MM-DD');
          $filter('escapeObject')(pc.obj, true);
          console.log(JSON.stringify(pc.obj));
          if (pc.data.action == "insert") {
            Arbre.pushArbre(pc.data.baseUrl, pc.obj).then(function(resp) {
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
          Arbre.updateArbre(pc.data.baseUrl, pc.obj).then(function(resp) {
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