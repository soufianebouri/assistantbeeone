'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RessourceshydriquesSuiviressourceshydriquesetatCtrl
 * @description
 * # RessourceshydriquesSuiviressourceshydriquesetatCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RessourceshydriquesSuiviressourceshydriquesetatCtrl', function($scope, $q, gestionPays, suiviressourceshydriques, ressourcesHydriques, translatedwords, toastr, $translatePartialLoader, $translate, $window, analyseQualitative, NiveauColorationService, pourcentageOuverture, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
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

    pc.obj = {
      "Region": [0],
      "Mois": undefined,
      "Year": undefined,
      "Type": [1, 2],
      "Ferme": [0],
      "DATE_DEBUT": undefined,
      "DATE_FIN": undefined,
      "Reference": [0]
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }




    pc.loadSynthesisData = () => {
      $q.all([suiviressourceshydriques.getForEtat(pc.obj)]).then(async function(values) {
        $scope.dataSource = values[0].data;

        var modeldataTableauDernieresSaisiesParUtilisateur = [{
          "Mois": {
            type: "String"
          },
          "Region": {
            type: "String"
          },
          "Ferme": {
            type: "string"
          },
          "Type": {
            type: "string"
          },
          "Reference": {
            type: "string"
          },
          "Volume": {
            type: "number"
          },
          "DureeFonctionnent": {
            type: "number"
          },
          "Debit": {
            type: "number"
          }
        }];

        var formatpuvot = [{
          name: "format_number",
          maxDecimalPlaces: 2,
          decimalPlaces: 2,
          decimalSeparator: ".",
          maxSymbols: 20,
          textAlign: "right",
          divideByZeroValue: "",
          thousandsSeparator: " ",
          nullValue: ""
        }]

        Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
          container: "#wdr-Pivot_TableauDernieresSaisiesParUtilisateur",

          componentFolder: "https://cdn.flexmonster.com/",
          width: "100%",
          height: 400,
          toolbar: false,
          report: {
            dataSource: {
              data: modeldataTableauDernieresSaisiesParUtilisateur.concat($scope.dataSource)
            },
            options: {
              grid: {
                title: pc.title,
                type: "classic",
                showTotals: "off",
                showGrandTotals: "off"
              },
              datePattern: "dd/MM/yyyy"
            },
            formats: formatpuvot,
            slice: {
              rows: [{
                uniqueName: "Mois",
                caption: await translatedwords.getTranslatedWord($translate("Mois"))
              }, {
                uniqueName: "Region",
                caption: await translatedwords.getTranslatedWord($translate("Région"))
              }, {
                uniqueName: "Ferme",
                caption: await translatedwords.getTranslatedWord($translate("Ferme"))
              }, {
                uniqueName: "Type",
                caption: await translatedwords.getTranslatedWord($translate("Type de la ressource hydrique"))
              }, {
                uniqueName: "Reference",
                caption: await translatedwords.getTranslatedWord($translate("Référence de la ressource"))
              }],
              columns: [{
                uniqueName: "[Measures]"
              }],
              measures: [{
                uniqueName: "VolumeAS",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Volume (m3)")),
                formula: "SUM('Volume')"
              }, {
                uniqueName: "DureeFonctionnentAS",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Durée de fonctionnement (h)")),
                formula: "SUM('DureeFonctionnent')"
              }, {
                uniqueName: "DebitAS",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Débit (m3/h)")),
                formula: "SUM('Volume') / SUM('DureeFonctionnent')"
              }]
            }
          },
          global: {
            localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
          }
        });
        Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();


        NProgress.done();
      });
    }


    pc.loadSynthesisDataEmpty = async () => {

      var modeldataTableauDernieresSaisiesParUtilisateur = [{
        "Mois": {
          type: "String"
        },
        "Region": {
          type: "String"
        },
        "Ferme": {
          type: "string"
        },
        "Type": {
          type: "string"
        },
        "Reference": {
          type: "string"
        },
        "Volume": {
          type: "number"
        },
        "DureeFonctionnent": {
          type: "number"
        },
        "Debit": {
          type: "number"
        }
      }];

      var formatpuvot = [{
        name: "format_number",
        maxDecimalPlaces: 2,
        decimalPlaces: 2,
        decimalSeparator: ".",
        maxSymbols: 20,
        textAlign: "right",
        divideByZeroValue: "",
        thousandsSeparator: " ",
        nullValue: ""
      }]

      Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
        container: "#wdr-Pivot_TableauDernieresSaisiesParUtilisateur",

        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 400,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauDernieresSaisiesParUtilisateur.concat([])
          },
          options: {
            grid: {
              title: pc.title,
              type: "classic",
              showTotals: "off",
              showGrandTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: formatpuvot,
          slice: {
            rows: [{
              uniqueName: "Mois",
              caption: await translatedwords.getTranslatedWord($translate("Mois"))
            }, {
              uniqueName: "Region",
              caption: await translatedwords.getTranslatedWord($translate("Région"))
            }, {
              uniqueName: "Ferme",
              caption: await translatedwords.getTranslatedWord($translate("Ferme"))
            }, {
              uniqueName: "Type",
              caption: await translatedwords.getTranslatedWord($translate("Type de la ressource hydrique"))
            }, {
              uniqueName: "Reference",
              caption: await translatedwords.getTranslatedWord($translate("Référence de la ressource"))
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "VolumeAS",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Volume (m3)")),
              formula: "SUM('Volume')"
            }, {
              uniqueName: "DureeFonctionnentAS",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Durée de fonctionnement (h)")),
              formula: "SUM('DureeFonctionnent')"
            }, {
              uniqueName: "DebitAS",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Débit (m3/h)")),
              formula: "SUM('Debit')"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();


    }


    $scope.exportData = (type) => {
      Pivot_TableauDernieresSaisiesParUtilisateur.exportTo(type, {
        filename: "Suivi des ressources hydriques",
        excelSheetName: " Suivi des ressources hydriques",
        pageFormat: "A0",
        pageOrientation: "landscape",
      });
    }


    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Region").selectpicker('refresh');
      $("#Ferme").selectpicker('refresh');
      $("#Type").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#Mois").selectpicker('refresh');
      $("#Reference").selectpicker('refresh');
    }, 1000);



    $q.all([gestionPays.getregion(), domaine.getDomaine(), campagneagricole.getall(), ressourcesHydriques.showforfiltre(pc.obj)]).then((values) => {
      pc.Regions = values[0].data;
      pc.Fermes = values[1].data;
      pc.compagne_array = values[2].data;
      pc.References = values[3].data;
      pc.loadSynthesisDataEmpty();
      pc.Types = [{
        Type: 1,
        Name: "Eaux souterraines"
      }, {
        Type: 2,
        Name: "Eaux de surface"
      }];
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Region").selectpicker('refresh');
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

    pc.Region_change = function() {

      var Region = $scope.Region;
      if (validateInput(Region) || $scope.Region.length === 0 || $scope.Region.includes(0)) {
        Region = [1, 2];
      }

      pc.obj.Region = Region;

      NProgress.start();
      $q.all([domaine.getDomaineByRegions(pc.obj)]).then((values) => {
        pc.Fermes = values[0].data;
        pc.obj.Ferme = [0];
        setTimeout(function() {
          $("#Ferme").selectpicker('refresh');
          $('#Ferme').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      })


    };

    $scope.allmoiscampagne = [];
    pc.compagne_change = () => {


      $scope.allmoiscampagne = [];
      pc.obj.Mois = undefined;
      pc.obj.Year = undefined;
      pc.obj.DATE_DEBUT = moment($scope.compagne.Date_debut).format('YYYYMMDD');
      pc.obj.DATE_FIN = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

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
        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires")), {
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