'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NotifAutoCtrl
 * @description
 * # NotifAutoCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NotifAutoCtrl', function($scope, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, campagneagricole,
    Profil, societe, VarieteService, domaine, PeriodeEstimation, translatedwords, DTDefaultOptions, $uibModal, $mdDialog, $element, toastr, FermeService, _url, BusinessUnit) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    NProgress.start();
    $scope.days = [1, 2, 3, 4, 5, 6];
    $scope.currentCampId = -1;
    $scope.periode_days = 0;

    //FROM
    $scope.mytime_period = new Date();
    $scope.mytime_today = new Date();
    $scope.mytime_tomorrow = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    //TO
    pc.obj = {
      "ID_Societe_Societe": [0],
      "ID_Societe": [0],
      "CAMPAGNE": "",
      "DOMAINE": [0],
      "operateur": null,
      "TOKEN": [],
      "msg_periodique": "",
      "msg_today": "",
      "msg_tomorrow": ""
    };

    $scope.periodique = [];
    $scope.today = [];
    $scope.tomorrow = [];

    pc.addToday = async () => {
      var t = moment($scope.mytime_today).format('HH:mm');
      var add = true;
      for (let i = 0; i < $scope.today.length; i++) {
        if ($scope.today[i].time == t) {
          add = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("L'alert est déjà dans la liste des rappels !!")), {
            closeButton: true
          });
          break;
        }
      }
      if (add) {
        $scope.today.push({
          msg: pc.obj.msg_today,
          time: t,
          days: null
        });
      } else {

      }
    }

    pc.addTomorrow = async () => {
      var t = moment($scope.mytime_tomorrow).format('HH:mm');
      var add = true;
      for (let i = 0; i < $scope.tomorrow.length; i++) {
        if ($scope.tomorrow[i].time == t) {
          add = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("L'alert est déjà dans la liste des rappels !!")), {
            closeButton: true
          });
          break;
        }
      }
      if (add) {
        $scope.tomorrow.push({
          msg: pc.obj.msg_tomorrow,
          time: t,
          days: null
        });
      } else {}
    }

    pc.addPeriodique = async () => {
      var t = moment($scope.mytime_period).format('HH:mm');
      var add = true;
      for (let i = 0; i < $scope.periodique.length; i++) {
        if ($scope.periodique[i].time == t && $scope.periodique[i].days == $scope.periode_days) {
          add = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("L'alert est déjà dans la liste des rappels !!")), {
            closeButton: true
          });
          break;
        }
      }
      if (add) {
        $scope.periodique.push({
          msg: pc.obj.msg_periodique,
          time: t,
          days: $scope.periode_days
        });
      } else {}

    }

    $scope.deletePeriodique = (elm) => {
      $scope.periodique = $scope.periodique.filter((value, index, arr) => {
        return value !== elm;
      });
    }

    $scope.deleteToday = (elm) => {
      $scope.today = $scope.today.filter((value, index, arr) => {
        return value !== elm;
      });
    }

    $scope.deleteTomorrow = (elm) => {
      $scope.tomorrow = $scope.tomorrow.filter((value, index, arr) => {
        return value !== elm;
      });
    }

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Producteur").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#Operateur").selectpicker('refresh');
    }, 1000);



    pc.filterWithItems = {
      societe: -1
    };

    pc.canSearch = () => {
      if (pc.obj.ID_Societe == 0 || pc.obj.DOMAINE == 0) {
        return true;
      }
      return false;
    }

    function loadAllDataSpinner() {
      $q.all([campagneagricole.getCampagneAgricole(),
        societe.getSociete(_url),
        domaine.getDomaine(),
        Profil.getProfil(_url),
        BusinessUnit.getBusinessUnit(pc.obj)
      ]).then((values) => {
        pc.societes = values[1].data;
        if (pc.societes.length) {
          pc.compagne_array = values[0].data;
          pc.domaines = values[2].data;
          pc.operateur_array = values[3].data;
          pc.producteurs = values[4].data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
          NProgress.done();
        }
      });
    }
    loadAllDataSpinner();


    pc.operateur_change = function() {
      if ($scope.operateur && $scope.operateur.length > 0 && !$scope.operateur.includes(0))
        pc.obj.operateur = $scope.operateur;
      else
        pc.obj.operateur = null;
    };


    pc.domaine_change = function() {
      pc.operateur_array = [];

      if ($scope.domaine && $scope.domaine.length > 0 && !$scope.domaine.includes(0)) {
        pc.obj.DOMAINE = $scope.domaine;
      } else {
        pc.obj.DOMAINE = [];
        angular.forEach(pc.domaines, (v, k) => {
          pc.obj.DOMAINE.push(v.IDFermes);
        });
      }
      if (pc.obj.DOMAINE.length > 0) {
        NProgress.start();
        $q.all([Profil.getProfilByFermeIfExist(pc.obj)]).then(e => {
          pc.operateur_array = e[0].data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            NProgress.done();
          }, 10);
        });
      }


    };

    pc.producteur_change = function() {
      NProgress.start();
      pc.domaines = [];
      pc.operateur_array = [];

      if ($scope.producteur && $scope.producteur.length > 0 && !$scope.producteur.includes(0)) {
        pc.obj.ID_Societe = $scope.producteur;
        FermeService.bySociete({
          Societe: pc.obj.ID_Societe_Societe,
          businessUnit: pc.obj.ID_Societe
        }).then(e => {
          pc.domaines = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            NProgress.done();
          }, 10);
        })
      } else {
        pc.obj.ID_Societe = [0];
        NProgress.done();
        loadDataSpinnerBasedSociete();
      }

    };

    pc.societe_change = function() {
      NProgress.start();
      pc.domaines = [];
      pc.operateur_array = [];
      pc.producteurs = [];
      if ($scope.societe && $scope.societe.length > 0 && !$scope.societe.includes(0)) {
        pc.obj.ID_Societe_Societe = $scope.societe;
      } else {
        pc.obj.ID_Societe_Societe = [0];
      }
      pc.obj.ID_Societe = [0];
      $q.all([BusinessUnit.getBusinessUnit(pc.obj),
        FermeService.bySociete({
          Societe: pc.obj.ID_Societe_Societe,
          businessUnit: pc.obj.ID_Societe
        })
      ]).then((values) => {
        pc.producteurs = values[0].data;
        pc.domaines = values[1].data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          NProgress.done();
        }, 10);
      });
    };

    function loadDataSpinnerBasedSociete() {
      $q.all([domaine.getDomaine(),
        Profil.getProfil(_url)
      ]).then((values) => {
        pc.domaines = values[0].data;
        pc.operateur_array = values[1].data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 10);
      });
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    function clearTokens() {
      pc.obj.TOKEN = [];
      $scope.operateur = [];
      $scope.periode_days = undefined;
      setTimeout(function() {
        $("#Operateur").selectpicker('deselectAll');
        $("#Operateur").selectpicker('refresh');
      }, 1000);

    }

    $scope.sendNotif = (type) => {
      pc.obj.type = type;
      if (pc.obj.operateur != null) {
        angular.forEach(pc.obj.operateur, (v, k) => {
          if (v.token_notification)
            pc.obj.TOKEN.push(v.token_notification);
        });
      } else {
        angular.forEach(pc.operateur_array, (v, k) => {
          if (v.token_notification)
            pc.obj.TOKEN.push(v.token_notification);
        });
      }

      if (type == 1) {
        pc.obj.data = $scope.periodique;
      } else if (type == 2) {
        pc.obj.data = $scope.today;
      } else {
        pc.obj.data = $scope.tomorrow;
      }


      PeriodeEstimation.notifications_automatisees(pc.obj).then(
        e => {
          toastr.clear();
          toastr.info(e.data.message, {
            closeButton: true
          });
          //clearTokens();
          pc.clearReminderList(type);
        }).catch((e) => {
        toastr.clear();
        toastr.error(e.data.message, {
          closeButton: true
        });
      }).then(function(e) {
        NProgress.done();
      });
    }

    pc.clearReminderList = (t) => {

      if (t == 1) {
        $scope.periodique = [];
        pc.obj.msg_periodique = "";
      } else if (t == 2) {
        $scope.today = [];
        pc.obj.msg_today = "";
      } else {
        $scope.tomorrow = [];
        pc.obj.msg_tomorrow = "";
      }
    }
  });