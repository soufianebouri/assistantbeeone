'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TemplatesAssolementAddcycleCtrl
 * @description
 * # TemplatesAssolementAddcycleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TemplatesAssolementAddcycleCtrl', function($uibModalInstance, translatedwords, data, $base64, $scope, $translatePartialLoader, $translate, $window, campagneagricole, cycle, _url) {
    var pc = this;
    pc.data = data;
    pc.cycle = {};
    pc.cycle.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.errPushInsert = "Error :";
    setCampagne();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      if (pc.data.action == "update") {
        pc.cycle = {
          ...pc.data.updateCycle
        };
        pc.cycle.date_debut = moment(moment(pc.cycle.date_debut).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
        pc.cycle.date_fin = moment(moment(pc.cycle.Date_fin).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
        $scope.current_date = pc.cycle.date_debut;
        pc.cycle.Type = pc.cycle.Type_cycle;
        console.log(pc.data.updateCycle);
      }

      setTimeout(function() {
        $('#ferme').selectpicker('val', pc.cycle.IDFermes);
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
    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };

    pc.submitForm = (isValid) => {
      if (isValid) {
        pc.cycle.date_debut = moment(pc.cycle.date_debut).format('YYYY-MM-DD');
        pc.cycle.date_fin = moment(pc.cycle.date_fin).format('YYYY-MM-DD');
        //pc.cycle.CODE = pc.cycle.CODE + " " + pc.cycle.current_campagne;

        if (pc.data.action == "update") {
          cycle.updateCycle(pc.cycle).then(e => {
            if (e.data[0].message == "ajout reussi") { //validate success
              $uibModalInstance.close('insert');
            } else {
              pc.errPushInsert += "an error occured " + e.data[0].description;
              console.log(e.data[0].description);
            }
          });
          return;
        }

        cycle.createCycle(pc.cycle).then(e => {
          if (e.data[0].message == "ajout reussi") { //validate success
            $uibModalInstance.close('insert');
          } else {
            pc.errPushInsert += "an error occured " + e.data[0].description;
            console.log(e.data[0].description);
          }
        });
      }
    }

    function setCampagne() {
      campagneagricole.getCampagneAgricole().then(r => {
        angular.forEach(r.data, function(value, key) {
          if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            pc.cycle.current_campagne = value.Code;
          }
        });
      });
    }
    $scope.verifyParcel = () => {
      console.log(pc.cycle.CODE.toLowerCase(), pc.data.action);
      if (pc.data.action == 'update') {
        if (pc.cycle.CODE.toLowerCase() == pc.data.updateCycle.CODE.toLowerCase() && pc.cycle.IDFermes == pc.data.updateCycle.IDFermes) {
          return false;
        }
      }

      console.log(pc.data.codeCyle.indexOf(pc.cycle.CODE.toLowerCase()));
      console.log(pc.data.codeCyle, pc.cycle.CODE.toLowerCase());

      if (pc.data.codeCyle.indexOf(pc.cycle.CODE.toLowerCase()) != -1) {
        return true;
      }
      return false;
    }

  });