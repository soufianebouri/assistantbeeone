'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierEtatNombreArbreCtrl
 * @description
 * # PalmierdattierEtatNombreArbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierEtatNombreArbreCtrl', function($scope, $q, gestionPays, ressourcesHydriques, Arbre, translatedwords, toastr, elementcomptage, $translatePartialLoader, comptageArbre, $translate, $window, analyseQualitative, NiveauColorationService, pourcentageOuverture, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;

    var Pivot_TableauDernieresSaisiesParUtilisateur = undefined;


    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "PARCELLE": [0],
      "ARBRE": [0],
      "ELEMENT": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };



    pc.loadSynthesisData = async () => {
      toastr.clear();
      $q.all([comptageArbre.getforEtat_nombre_Arbre(pc.obj)]).then(async function(values) {
        $scope.dataSource = values[0].data;
        var modeldata = [{
          "element": {
            type: "String"
          },
          "Nombre": {
            type: "number"
          },
          "nbrArbre": {
            type: "number"
          }
        }];

        Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
          container: "#wdr-Pivot_TableauDernieresSaisiesParUtilisateur",
          componentFolder: "https://cdn.flexmonster.com/",
          width: "100%",
          height: 600,
          report: {
            dataSource: {
              data: modeldata.concat($scope.dataSource)
            },
            options: {
              grid: {
                title: "",
                type: "classic",
                showTotals: "off",
                showGrandTotals: "off"
              },
              datePattern: "dd/MM/yyyy"
            },
            formats: [{
              name: "format_number",
              maxDecimalPlaces: 2,
              decimalPlaces: 2,
              maxSymbols: 20,
              textAlign: "right",
              thousandsSeparator: " ",
              nullValue: ""
            }],
            slice: {
              rows: [{
                uniqueName: "element",
                caption: "Élément de comptage"
              }],
              columns: [{
                uniqueName: "Nombre",
                caption: "Nombre d'arbre",
                sort: "asc"
              }, {
                uniqueName: "[Measures]"
              }],
              measures: [{
                uniqueName: "NombreAS",
                caption: await translatedwords.getTranslatedWord($translate("Total")),
                format: "format_number",
                formula: "SUM('nbrArbre')"
              }]
            }
          },
          global: {
            localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
          }
        });
        Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();

        /*var modeldataTableauDernieresSaisiesParUtilisateur = [{
          "Ref": {
            type: "String"
          },
          "Code_Arbre": {
            type: "String"
          },
          "Nombre": {
            type: "number"
          }
        }];*/

        /*  var formatpuvot = [{
            name: "format_number",
            maxDecimalPlaces: 2,
            decimalPlaces: 2,
            decimalSeparator: ".",
            maxSymbols: 20,
            textAlign: "right",
            divideByZeroValue: "",
            thousandsSeparator: " ",
            nullValue: ""
          }]*/

        /*  Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
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
                  title: "",
                  type: "classic",
                  showTotals: "off",
                  showGrandTotals: "off"
                },
                datePattern: "dd/MM/yyyy"
              },
              formats: formatpuvot,
              slice: {
                rows: [{
                  uniqueName: "Ref",
                  caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale"))
                }, {
                  uniqueName: "Code_Arbre",
                  caption: await translatedwords.getTranslatedWord($translate("Arbre"))
                }],
                columns: [{
                  uniqueName: "[Measures]"
                }],
                measures: [{
                  uniqueName: "NombreAS",
                  format: "format_number",
                  caption: await translatedwords.getTranslatedWord($translate("Nombre d'éléments comptés")),
                  formula: "SUM('Nombre')"
                }]
              }
            },
            global: {
              localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
            }
          });
          Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();*/


        NProgress.done();
      });

    }


    $scope.exportData = (type) => {
      Pivot_TableauDernieresSaisiesParUtilisateur.exportTo(type, {
        filename: "Etat comptage par arbre",
        excelSheetName: " Etat comptage par arbre",
        pageFormat: "A0",
        pageOrientation: "landscape",
      });
    }


    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#Arbre").selectpicker('refresh');
      $("#Element").selectpicker('refresh');
    }, 1000);



    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDDOMAINE), elementcomptage.GetElementComptage()]).then((values) => {
      pc.parcelles_array = values[0].data;
      pc.ElementComptage = values[1].data;
      pc.loadSynthesisDataDeffaultTable();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Parcelle").selectpicker('refresh');
        $("#Element").selectpicker('refresh');
      }, 100);
      NProgress.done();
    })


    //by date_fin
    $scope.date_debut_change = function() {
      if ($scope.debut === null || $scope.debut === "" || $scope.debut === undefined || $scope.debut === 0 || $scope.debut === "0" || !$scope.debut || $scope.debut.length === 0) {
        $scope.debut_sel = 0;
      } else {
        $scope.debut_sel = $scope.debut;
        $scope.debut_sel = moment($scope.debut_sel).format('YYYYMMDD');
        pc.obj.DATE_DEBUT = $scope.debut_sel;
      }
    };


    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
        $scope.date_fin_sel = moment($scope.date_fin_sel).format('YYYYMMDD');
        pc.obj.DATE_FIN = $scope.date_fin_sel;
      }
      //  }
    };


    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        parcelle = [0];
      }

      pc.obj.PARCELLE = parcelle;

      Arbre.getByParcelleDomaine({
        DOMAINE: pc.IDDOMAINE,
        PARCELLE_CULTURAL: pc.obj.PARCELLE
      }).then(e => {
        NProgress.done();
        pc.Arbres = e.data;
        setTimeout(function() {
          $("#Arbre").selectpicker('refresh');
        }, 1000);

      }).catch(async e => {
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
          closeButton: true
        });
      });

    };

    pc.element_change = function() {
      var Element = $scope.Element;

      if (validateInput(Element) || $scope.Element.length === 0 || $scope.Element.includes(0)) {
        Element = [0];
      }

      pc.obj.ELEMENT = Element;

    };

    pc.arbre_change = function() {

      var Arbre = $scope.Arbre;

      if (validateInput(Arbre) || $scope.Arbre.length === 0 || $scope.Arbre.includes(0)) {
        Arbre = [0];
      }

      pc.obj.ARBRE = Arbre;

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


    pc.Search = function() {
      pc.loadSynthesisData()
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


    pc.loadSynthesisDataDeffaultTable = async () => {
      $scope.dataSource = [];
      var modeldata = [{
        "Ref": {
          type: "String"
        },
        "Code_Arbre": {
          type: "String"
        },
        "Nombre": {
          type: "number"
        },
        "Nom_Element": {
          type: "String"
        }
      }];

      Pivot_TableauDernieresSaisiesParUtilisateur = new Flexmonster({
        container: "#wdr-Pivot_TableauDernieresSaisiesParUtilisateur",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 600,
        report: {
          dataSource: {
            data: modeldata.concat($scope.dataSource)
          },
          options: {
            grid: {
              title: "",
              type: "classic",
              showTotals: "off",
              showGrandTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: [{
            name: "format_number",
            maxDecimalPlaces: 2,
            decimalPlaces: 2,
            maxSymbols: 20,
            textAlign: "right",
            thousandsSeparator: " ",
            nullValue: ""
          }],
          slice: {
            rows: [{
              uniqueName: "Ref",
              caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale"))
            }, {
              uniqueName: "Code_Arbre",
              caption: await translatedwords.getTranslatedWord($translate("Arbre"))
            }],
            columns: [{
              uniqueName: "Nom_Element",
              caption: await translatedwords.getTranslatedWord($translate("Élément de comptage"))
            }, {
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "NombreAS",
              caption: await translatedwords.getTranslatedWord($translate("Total")),
              format: "format_number",
              formula: "SUM('Nombre')"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauDernieresSaisiesParUtilisateur.expandAllData();


    }

  });