'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl
 * @description
 * # RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RessourceshydriquesSuiviinterventionsequipementsSyntheseCtrl', function($scope, $q, suiviressourceshydriques, suiviinterventionsequipements, ressourcesHydriques, translatedwords, toastr, $translatePartialLoader, $translate, $window, NiveauColorationService, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    var Pivot_TableauDernieresSaisiesParUtilisateur = undefined;

    $scope.Mois = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $("#loadingData").hide();
    $("#printThis").show();

    pc.obj = {
      "Region": [0],
      "Mois": undefined,
      "Year": undefined,
      "Type": [1, 2],
      "Ferme": [0],
      "DATE_DEBUT": undefined,
      "DATE_FIN": undefined,
      "Reference": [0],
      "campagne": ""
    };

    $scope.dataSource = [];

    pc.loadSynthesisData = () => {
      $("#loadingData").show();
      $("#printThis").hide();
      $q.all([suiviinterventionsequipements.getForEtat(pc.obj)]).then(async function(values) {
        $scope.dataSource = values[0].data;
        $("#loadingData").hide();
        $("#printThis").show();
        NProgress.done();
      });
    }

    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Suivi des interventions & équipements - Vue synthétique.xls",
        preserveColors: true
      });
    };



    $scope.exportData = (type) => {
      Pivot_TableauDernieresSaisiesParUtilisateur.exportTo(type, {
        filename: "Suivi des ressources hydriques",
        excelSheetName: " Suivi des ressources hydriques",
        pageFormat: "A0",
        pageOrientation: "landscape",
      });
    }


    $("#printThis").height(heightOfTable);


    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Ferme").selectpicker('refresh');
      $("#Type").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#Mois").selectpicker('refresh');
      $("#Reference").selectpicker('refresh');
    }, 1000);



    $q.all([domaine.getDomaine(), campagneagricole.getall(), ressourcesHydriques.showforfiltre(pc.obj)]).then((values) => {
      pc.Fermes = values[0].data;
      pc.compagne_array = values[1].data;
      pc.References = values[2].data;
      pc.Types = [{
        Type: 1,
        Name: "Eaux souterraines"
      }, {
        Type: 2,
        Name: "Eaux de surface"
      }];
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Ferme").selectpicker('refresh');
        $("#Type").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
        $("#Mois").selectpicker('refresh');
        $("#Reference").selectpicker('refresh');
      }, 100);
      NProgress.done();
    })

    $scope.filterFn = function(cn) {
      if (pc.obj.Type[0] !== 0)
        return pc.obj.Type.includes(cn.Type)
      return true;
    }


    $scope.allmoiscampagne = [];
    pc.compagne_change = () => {

      $scope.allmoiscampagne = [];
      pc.obj.Mois = undefined;
      pc.obj.Year = undefined;
      pc.obj.DATE_DEBUT = moment($scope.compagne.Date_debut).format('YYYYMMDD');
      pc.obj.DATE_FIN = moment($scope.compagne.Date_Fin).format('YYYYMMDD');
      pc.obj.campagne = $scope.compagne.Code;

      $scope.dateStart = moment($scope.compagne.Date_debut, "YYYY-MM-DD");
      $scope.dateEnd = moment($scope.compagne.Date_Fin, "YYYY-MM-DD");
      while ($scope.dateEnd > $scope.dateStart || $scope.dateStart.format('M') === $scope.dateEnd.format('M')) {
        $scope.allmoiscampagne.push($scope.dateStart.format('YYYY-M'));
        $scope.dateStart.add(1, 'month');
      }
      setTimeout(function() {
        $("#Mois").selectpicker('refresh');
        $('#Mois').selectpicker('deselectAll');
        NProgress.done();
      }, 100);
    }

    pc.Ferme_change = function() {

      var Ferme = $scope.Ferme;
      if (validateInput(Ferme) || $scope.Ferme.length === 0 || $scope.Ferme.includes(0)) {
        Ferme = [0];
      }

      pc.obj.Ferme = Ferme;
      NProgress.start();
      $q.all([ressourcesHydriques.showforfiltre(pc.obj)]).then((values) => {
        pc.References = values[0].data;
        pc.obj.Reference = [0];
        setTimeout(function() {
          $("#Reference").selectpicker('refresh');
          $('#Reference').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      })

    };

    pc.Mois_change = function() {
      pc.obj.Mois = [];
      pc.obj.Year = [];
      if ($scope.mois.mois.length === 0 || $scope.mois.mois === 0 || String($scope.mois.mois) === "0") {
        pc.obj.Mois = undefined;
        pc.obj.Year = undefined;
      } else {

        $scope.mois.mois.forEach(function(item) {
          pc.obj.Year.push(item.split('-')[0]);
          pc.obj.Mois.push(item.split('-')[1]);
        });

      }
    };

    pc.type_change = function() {


      var Type = $scope.Type;
      if (validateInput(Type) || $scope.Type.length === 0 || $scope.Type.includes(0)) {
        Type = [0];
      }

      pc.obj.Type = Type;

      setTimeout(function() {
        $("#Reference").selectpicker('refresh');
        $('#Reference').selectpicker('deselectAll');
        NProgress.done();
      }, 100);

    };

    pc.reference_change = function() {

      var Reference = $scope.Reference;
      if (validateInput(Reference) || $scope.Reference.length === 0 || $scope.Reference.includes(0))
        Reference = [0];

      pc.obj.Reference = Reference;
    };

    //starting date change listner
    pc.date_debut_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    pc.date_fin_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      NProgress.done();
      NProgress.remove();
    };


    $scope.NiveauColoration = [];
    //by parcelle cultural
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelleculturalsel;
      if (validateInput(parcelle) || !$scope.parcelleculturalsel) {
        parcelle = {};
      } else {
        pc.obj.PARCELLE_CULTURAL = parcelle;
        NiveauColorationService.getColorationbyvariete({
          ID_Variete: pc.obj.PARCELLE_CULTURAL.Variete
        }).then(e => {
          NProgress.done();
          $scope.NiveauColoration = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }
      NProgress.done();

    };


    pc.Search = async function() {
      toastr.clear();
      if (pc.obj.DATE_DEBUT && pc.obj.DATE_FIN && pc.obj.Mois && pc.obj.Year && !pc.obj.Ferme.includes(0)) {
        pc.loadSynthesisData()
      } else {
        toastr.error("Veuillez sélectionner les éléments obligatoires.", {
          closeButton: true
        });
      }
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


    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });