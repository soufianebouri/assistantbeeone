'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl
 * @description
 * # ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatCtrl', function($q, translatedwords, campagneagricole, ChutePhysiologique, $window, $translatePartialLoader, $translate, societe, $state, _url, $mdDialog, VarieteService, parcellecultural, cultureService, $cookies, portGreffe, FermeService, $scope, bilanHydrique, ApportEau, getsuperficie, savefilter) {
    var pc = this;
    var chartapportmensuel;

    $scope.loadingData = false;

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      VARIETE: [0],
      GREFF: [0],
      PARCELLE: [0],
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD')
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#port_greff").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      NProgress.done();
    }, 100);

    NProgress.start();

    pc.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }


    $scope.loadingData = true;
    $q.all([
      cultureService.getCultureByFerme(pc.obj.FERME),
      portGreffe.getPortGreffe(),
      VarieteService.showVarieteByCultureFerme(pc.obj),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME)
    ]).then((values) => {
      pc.culture_array = values[0].data;
      pc.port_greffs_array = values[1].data;
      pc.variete_array = values[2].data;
      pc.parcelles_array = values[3].data;
      $scope.loadingData = false;

      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#port_greff").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
      }, 1000);

      NProgress.done();
    });


    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
      pc.getsuperficie();
      savefilter.setFilters(pc.obj);
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
      pc.getsuperficie();
      savefilter.setFilters(pc.obj);
    };

    pc.parcelle_change = () => {
      if ($scope.parcelle && $scope.parcelle.length > 0 && !$scope.parcelle.includes(0)) {
        pc.obj.PARCELLE = $scope.parcelle;
        pc.getsuperficie();
      } else {
        pc.obj.PARCELLE = [0];
      }
    }

    pc.culture_change = () => {
      NProgress.start();
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.culture = $scope.culture;
        pc.obj.VARIETE = [0];
        pc.obj.PARCELLE = [0];
        pc.getsuperficie();
      } else {
        pc.obj.culture = [0];
      }

      $q.all([VarieteService.showVarieteByCultureFerme(pc.obj),
        parcellecultural.getParcelleByVarieteCulture(pc.obj)
      ]).then((values) => {
        pc.variete_array = values[0].data;
        pc.parcelles_array = values[1].data;

        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $('#variete').selectpicker('deselectAll');
          $("#parcelle").selectpicker('refresh');
          $('#parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });

    }

    pc.variete_change = () => {
      NProgress.start();
      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.VARIETE = $scope.variete;
        pc.obj.PARCELLE = [0];
        pc.getsuperficie();
      } else {
        pc.obj.VARIETE = [0];
      }

      $q.all([parcellecultural.getParcelleByVarieteCulture(pc.obj)]).then((values) => {
        pc.parcelles_array = values[0].data;
        setTimeout(function() {
          $("#parcelle").selectpicker('refresh');
          $('#parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });
    }

    pc.port_greff_change = () => {
      if ($scope.port_greff && $scope.port_greff.length > 0 && !$scope.port_greff.includes(0)) {
        pc.obj.GREFF = $scope.port_greff;
        pc.getsuperficie();
      } else {
        pc.obj.GREFF = [0];
      }
    }




    $scope.search = () => {

      NProgress.start();

      $q.all([ChutePhysiologique.getChuteFruits_forSynt(pc.obj), ChutePhysiologique.getObservations_forSynt(pc.obj)]).then((values) => {
        NProgress.done();
        pc.ChuteFruits_forSynt = values[0].data;
        pc.Observations_forSynt = values[1].data;
      });


    }

    $scope.setObservations = (IDferme, IDParcelle, Date) => {
      var concat_Observation = '';
      try {
        angular.forEach(pc.Observations_forSynt, function(value, key) {
          if (value.IDFermes == IDferme && value.ID_ParcelleCul == IDParcelle && value.Date_Controle == Date) {
            concat_Observation += (value.Observations + " \n");
          }
        });
      } catch (e) {
        concat_Observation = '';
      }
      return concat_Observation
    }


    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Etat de synthèse Suivi de la chute par Filet.xls",
        preserveColors: true
      });
    };







  });