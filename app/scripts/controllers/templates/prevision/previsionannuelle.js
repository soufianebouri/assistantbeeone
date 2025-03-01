'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionAnnuelCtrl
 * @description
 * # PrevisionAnnuelCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionAnnuelCtrl', function(test, $mdDialog, translatedwords, $scope, parcellecultural, societe, $translatePartialLoader, $translate, $window, campagneagricole, domaine, $q, PeriodeEstimation, $cookies, reload, toastr, _url) {
    $scope.Annuler = function() {
      $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
    };

    $scope.Ajouter = function() {
      $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $q.all([campagneagricole.getCampagneAgricole(),
      societe.getSociete(_url),
      domaine.getDomaine()
    ]).then((values) => {
      $scope.compagne_array = values[0].data;
      $scope.societes = values[1].data;
      $scope.fermes = values[2].data;

      angular.forEach($scope.compagne_array, function(value, key) {
        if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          $scope.current_campagne = value.Code;
          $scope.societe = $scope.societes[0].ID;
          $scope.getEstimation();
        }
      });
      console.log($scope.fermes);
    });

    $scope.Societe_changed = () => {
      //$scope.getEstimation();
      $scope.estimation_periode_array = [];
      $scope.Ferme_changed();
    }

    $scope.Ferme_changed = () => {
      $scope.parcel = [];
      $scope.selectedParcel = null;
    }


    $scope.getPeriodeEstimation = (estimationPeriode) => {
      return moment(estimationPeriode.Date_Debut).format('YYYY-MM-DD') + " / " + moment(estimationPeriode.Date_Fin).format('YYYY-MM-DD') + " (" + estimationPeriode.CodePeriode + ")";
    }

    $scope.getEstimation = function() {
      if ($scope.estimation_periode_array && $scope.estimation_periode_array.length > 0) {
        return $scope.estimation_periode_array;
      }
      return PeriodeEstimation.getPeriodeEstimation({
        ID_Societe: $scope.societe,
        CAMPAGNE: $scope.current_campagne
      }).then(e => {
        $scope.estimation_periode_array = e.data;
        angular.forEach($scope.estimation_periode_array, function(value, key) {
          value.QT = 0;
        });
        console.log($scope.estimation_periode_array);
        NProgress.done();
      });
    }

    $scope.getParcelle = function() {
      if ($scope.parcel && $scope.parcel.length > 0) {
        return $scope.parcel;
      }

      return parcellecultural.getParcelleCulturalByFerme($scope.ferme).then(e => {
        $scope.parcel = e.data;
      });
      console.log(selectedParcel);
    }

    $scope.saveData = () => {
      var rqtPart = "('" + moment().format('YYYY-MM-DD') + "','" + moment().format("HH:mm:ss") + "','" + $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom + "',";
      rqtPart += "'" + $scope.current_campagne + "',0,'" + moment().format('YYYY-MM-DD') + "',";
      var qrtGlob = "";
      angular.forEach($scope.estimation_periode_array, function(value, key) {
        qrtGlob += rqtPart + value.QT + "," + value.ID + "," + $scope.ferme + "," + $scope.selectedParcel.ID + ",'" + moment().format('YYYY-MM-DD') + "',1),";
        value.QT = 0;
      });
      qrtGlob = qrtGlob.substring(0, qrtGlob.length - 1);
      $scope.parcel = [];
      $scope.selectedParcel = null;
      PeriodeEstimation.createEstimationAnnuel({
        DATA: qrtGlob
      }).then(async e => {
        var resdelete = e.data;
        if (resdelete[0].message == 'ajout reussi') {
          toastr.clear();
          toastr.info(await translatedwords.getTranslatedWord($translate("Action reussite")), {
            closeButton: true
          });
          reload();
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Une erreur est survenue !")), {
            closeButton: true
          });
        }
      });
    }
  });
