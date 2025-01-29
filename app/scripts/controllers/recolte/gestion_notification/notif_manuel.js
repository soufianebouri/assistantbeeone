'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NotifManuelCtrl
 * @description
 * # NotifManuelCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NotifManuelCtrl', function($scope, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, parcellecultural, campagneagricole,
    Profil, societe, VarieteService, domaine, PeriodeEstimation, translatedwords, DTDefaultOptions, $uibModal, $mdDialog, $element, toastr, FermeService, _url, BusinessUnit) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    NProgress.start();
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 5);

    $scope.currentCampId = -1;
    pc.obj = {
      "ID_Societe_Societe": [0],
      "ID_Societe": [0],
      "CAMPAGNE": "",
      "DOMAINE": [0],
      "PARCELLE": [0],
      "operateur": null,
      "TOKEN": "",
      "msg": "",
      "farmName": ""
    };

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Producteur").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#Opérateur").selectpicker('refresh');
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
        parcellecultural.getParcelleCultural(),
        Profil.getProfil(_url),
        BusinessUnit.getBusinessUnit(pc.obj)
      ]).then((values) => {
        pc.societes = values[1].data;
        if (pc.societes.length) {
          pc.compagne_array = values[0].data;
          pc.domaines = values[2].data;
          pc.parcelles_array = values[3].data;
          pc.operateur_array = values[4].data;
          pc.producteurs = values[5].data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
          NProgress.done();
        }
      });
    }
    loadAllDataSpinner();
    //by parcelle cultural
    pc.parcelle_change = function() {
      if ($scope.parcelle && $scope.parcelle.length > 0 && !$scope.parcelle.includes(0))
        pc.obj.PARCELLE = $scope.parcelle;
      else
        pc.obj.PARCELLE = [0];
    };

    pc.operateur_change = function() {
      if ($scope.operateur && $scope.operateur.length > 0 && !$scope.operateur.includes(0))
        pc.obj.operateur = $scope.operateur;
      else
        pc.obj.operateur = null;
    };

    function setFarmName() {
      angular.forEach(pc.domaines, function(value, key) {
        if (value.IDFermes == pc.obj.DOMAINE) {
          pc.obj.farmName = value.Nom;
        }
      });
    }

    pc.domaine_change = function() {

      pc.parcelles_array = [];
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
        $q.all([parcellecultural.showbydomaineIfExist(pc.obj),
          Profil.getProfilByFermeIfExist(pc.obj)
        ]).then(e => {
          pc.parcelles_array = e[0].data;
          pc.operateur_array = e[1].data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 10);
        });
      }


    };

    pc.producteur_change = function() {
      NProgress.start();
      pc.domaines = [];
      pc.parcelles_array = [];
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
      pc.parcelles_array = [];
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
        parcellecultural.getParcelleCultural(),
        Profil.getProfil(_url)
      ]).then((values) => {
        pc.domaines = values[0].data;
        pc.parcelles_array = values[1].data;
        pc.operateur_array = values[2].data;
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
      pc.msg = "";
      pc.obj.PARCELLE = [0];
      pc.obj.TOKEN = "";
      $('td').css("background-color", "");
      $('#parcelle option').attr('selected', false);
      $("#parcelle").selectpicker('refresh');
    }

    $scope.sendNotif = () => {
      if (pc.obj.operateur != null) {
        angular.forEach(pc.obj.operateur, (v, k) => {
          if (v.token_notification)
            pc.obj.TOKEN += v.token_notification + ",";
        });
      } else {
        angular.forEach(pc.operateur_array, (v, k) => {
          if (v.token_notification)
            pc.obj.TOKEN += v.token_notification + ",";
        });
      }
      pc.obj.TOKEN = pc.obj.TOKEN.slice(0, -1);
      PeriodeEstimation.pushNotification(pc.obj).then(
        e => {
          toastr.clear();
          toastr.info(e.data.message, {
            closeButton: true
          });
          clearTokens();

        }).catch((e) => {
        clearTokens();
        toastr.clear();
        toastr.error(e.data.message, {
          closeButton: true
        });
      }).then(function(e) {
        NProgress.done();
      });
    }
  });