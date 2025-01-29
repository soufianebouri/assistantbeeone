'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NotificationactualiseCtrl
 * @description
 * # NotificationactualiseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NotificationactualiseCtrl', function(test, translatedwords, dtInstance, $scope, Profil, $cookies, pushNotifActualise, toastr, PeriodeEstimation, $translatePartialLoader, $translate, $window, $mdDialog) {
    $scope.culture_array = test.culture_array;
    $scope.variete_array = test.variete_array;
    var lastVariteIsAll = false;
    var lastProfileIsAll = false;
    setTimeout(function() {
      $(".date").datepicker({
        multidate: true,
        todayHighlight: true,
        todayBtn: true,
        multidateSeparator: ',',
        startDate: moment().toDate()
      });
    }, 1000);
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.variete_change = function() {
      if ($scope.variete.includes("0")) {
        $scope.variete = [0];
        lastVariteIsAll = true;
        angular.forEach($scope.variete_array, (v, k) => {
          if ($scope.culture == v.culture) {
            $scope.variete.push(v.ID);
          }
        });
        Profil.getProfilByvariete({
          VARIETE: $scope.variete
        }).then(e => {
          $scope.profile_array = e.data;
        });
      } else if ($scope.variete.length == 0) {
        $scope.profile_array = [];
      } else {
        if (lastVariteIsAll) {
          $scope.variete = [];
        } else {
          Profil.getProfilByvariete({
            VARIETE: $scope.variete
          }).then(e => {
            $scope.profile_array = e.data;

          });
        }
        lastVariteIsAll = false;
      }
    };

    $scope.culture_changed = function() {
      $scope.profile_array = [];
    };

    $scope.profile_change = () => {
      if ($scope.profile.includes("0")) {
        $scope.profile = ["0"];
        lastProfileIsAll = true;
        angular.forEach($scope.profile_array, (v, k) => {
          $scope.profile.push(v.id);
        });
      } else {
        if (lastProfileIsAll) {
          $scope.profile = [];
        }
        lastProfileIsAll = false;
      }


    }

    $scope.orderDate = () => {
      var tabDates = $('.date').val().split(',');
      tabDates.sort(function(a, b) {
        return new Date(a) - new Date(b);
      });
      return tabDates;
    }

    $scope.isItOkey = () => {
      try {
        if ($scope.culture.length == 0 || $scope.variete.length == 0 || $scope.profile.length == 0 || ($scope.orderDate().length == 1 && $scope.orderDate()[0] == "")) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return true;
      }

    }

    $scope.saveData = () => {
      var tabProfile = [];
      var tabeDates = $scope.orderDate();
      var tabeTokens = [];
      if ($scope.profile.includes("0")) {
        tabProfile = $scope.profile_array;
      } else {
        angular.forEach($scope.profile_array, function(profile, key) {
          if ($scope.profile.includes(profile.id + "")) {
            tabProfile.push(profile);
          }
        });
      }

      var rqt = "";
      angular.forEach(tabProfile, function(profile, key) {
        tabeTokens.push(profile.token_notification);
        angular.forEach(tabeDates, function(value, key) {
          rqt += "(" + profile.id + ",'" + moment(new Date(value)).format('YYYY-MM-DD') + "','" + moment().format('YYYY-MM-DD') + "','" + $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom + "'),";
        });
      });

      rqt = rqt.substring(0, rqt.length - 1);


      pushNotifActualise.sendNotifActualise({
        values: rqt
      }).then(async e => {
        dtInstance.reloadData();

        NProgress.done();
        if (e.data[0].message == 'ajout reussi') {
          toastr.clear();
          toastr.info(await translatedwords.getTranslatedWord($translate("Action reussite")), {
            closeButton: true
          });
          $scope.sendNotif(tabeDates, tabeTokens);
        } else {
          var err = await translatedwords.getTranslatedWord($translate("Une erreur est survenue !"));
          if (e.data[0].description.includes("UQ_PROFILE_DATE")) {
            err = await translatedwords.getTranslatedWord($translate("Vous avez déjà notifié ces utilisateurs, veuillez choisir d'autres dates "));
          }
          toastr.clear();
          toastr.error(err, {
            closeButton: true
          });
        }
      });
    }

    $scope.sendNotif = (tabeDates, tabeTokens) => {
      PeriodeEstimation.pushNotification_demande_actualisation({
        days: tabeDates,
        TOKEN: tabeTokens
      }).then(
        e => {
          toastr.clear();
          toastr.info(e.data.message, {
            closeButton: true
          });
          $mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        }).catch((e) => {
        toastr.clear();
        toastr.error(e.data.message, {
          closeButton: true
        });
      }).then(function(e) {
        NProgress.done();
      });
    }

  });