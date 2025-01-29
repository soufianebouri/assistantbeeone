'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesEtatPreconisationOrdreTailleCtrl
 * @description
 * # OperationsclesEtatPreconisationOrdreTailleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesEtatPreconisationOrdreTailleCtrl', function($scope, $q, cultureService, ordredetaille, translatedwords, toastr, portGreffe, $translatePartialLoader, VarieteService, $translate, $window, analyseQualitative, NiveauColorationService, pourcentageOuverture, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);

    //set date input
    $scope.reload = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      FERME: pc.IDferme,
      culture: [0],
      VARIETE: [0],
      PARCELLE: [0],
      GREFF: [0],
      type_de_taille_sel: [0],
      mode_de_taille_sel: [0],
      intensite_de_la_taille_sel: [0],
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD')
    };

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      NProgress.done();
    }, 100);



    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    pc.clear_data = () => {
      pc.Obs_Analyse_Qualitative = [];
    }
    //loading purpose
    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.loadSynthesisData = () => {
      $q.all([ordredetaille.getForSynthese(pc.obj)]).then(function(values) {
        pc.etat_synthese_preconisation = values[0].data;
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    //$("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#port_greff").selectpicker('refresh');
      $("#type_de_taille_sel").selectpicker('refresh');
      $("#mode_de_taille_sel").selectpicker('refresh');
      $("#intensite_de_la_taille_sel").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([cultureService.getCultureByFerme(pc.obj.FERME),
      /*VarieteService.showVarieteByCultureFerme(pc.obj),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),*/
      portGreffe.getPortGreffe()
    ]).then((values) => {
      pc.culture_array = values[0].data;
      //pc.variete_array = values[1].data;
      //pc.parcelles_array = values[2].data;
      pc.port_greffs_array = values[1].data;
      $scope.types_de_taille = [{
        name: "Taille de Formation",
        code: "'Taille de Formation'"
      }, {
        name: "Taille d'Entretien",
        code: "'Taille d''Entretien'"
      }, {
        name: "Taille d'Hiver",
        code: "'Taille d''Hiver'"
      }, {
        name: "Taille en vert",
        code: "'Taille en vert'"
      }, {
        name: "Taille de Rajeunissement",
        code: "'Taille de Rajeunissement'"
      }, {
        name: "Arcure",
        code: "'Arcure'"
      }, {
        name: "Autres...",
        code: "'Autres...'"
      }, {
        name: "N/A",
        code: "'N/A'"
      }];
      $scope.modes_de_taille = [{
        name: "Manuelle",
        code: "'Manuelle'"
      }, {
        name: "Mécanique",
        code: "'Mécanique'"
      }, {
        name: "Combinée",
        code: "'Combinée'"
      }, {
        name: "N/A",
        code: "'N/A'"
      }];
      $scope.intensites_de_la_taille = [{
        name: "Légère",
        code: "'Légère'"
      }, {
        name: "Moyenne",
        code: "'Moyenne'"
      }, {
        name: "Forte",
        code: "'Forte'"
      }, {
        name: "N/A",
        code: "'N/A'"
      }];
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $(".selectpicker").selectpicker();
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $("#port_greff").selectpicker('refresh');
        $("#type_de_taille_sel").selectpicker('refresh');
        $("#mode_de_taille_sel").selectpicker('refresh');
        $("#intensite_de_la_taille_sel").selectpicker('refresh');
        NProgress.done();
      }, 100);
      NProgress.done();
    });




    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      $("#printThis").height(heightOfTable);
    });


    pc.getArrayFromJson = async function(json, key) {
      let arr = [];
      for (var i = 0; i < json.length; i++) {
        (key === 0) ? arr.push(json[i].ID): arr.push(json[i].Variete);
      }
      return arr
    }


    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
    };

    pc.parcelle_change = () => {
      if ($scope.parcelle && $scope.parcelle.length > 0 && !$scope.parcelle.includes(0)) {
        pc.obj.PARCELLE = $scope.parcelle;
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
      } else {
        pc.obj.GREFF = [0];
      }
    }


    pc.type_de_taille_change = () => {
      if ($scope.type_de_taille_sel && $scope.type_de_taille_sel.length > 0 && !$scope.type_de_taille_sel.includes(0)) {
        pc.obj.type_de_taille_sel = $scope.type_de_taille_sel;
      } else {
        pc.obj.type_de_taille_sel = [0];
      }
    }

    pc.mode_de_taille_change = () => {
      if ($scope.mode_de_taille_sel && $scope.mode_de_taille_sel.length > 0 && !$scope.mode_de_taille_sel.includes(0)) {
        pc.obj.mode_de_taille_sel = $scope.mode_de_taille_sel;
      } else {
        pc.obj.mode_de_taille_sel = [0];
      }
    }

    pc.intensite_de_la_taille_change = () => {
      if ($scope.intensite_de_la_taille_sel && $scope.intensite_de_la_taille_sel.length > 0 && !$scope.intensite_de_la_taille_sel.includes(0)) {
        pc.obj.intensite_de_la_taille_sel = $scope.intensite_de_la_taille_sel;
      } else {
        pc.obj.intensite_de_la_taille_sel = [0];
      }
    }


    pc.Search = async function() {
      $scope.reload = true;
      pc.manageViews();
      pc.loadSynthesisData();

    }

    //toggle filter show
    pc.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    pc.ReverseDisplay('filter_form');

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Etat de synthèse Préconisation-Ordre de la Taille.xls",
        preserveColors: true
      });
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });