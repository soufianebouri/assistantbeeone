'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SuiviHebdoPrevuRealiseCtrl
 * @description
 * # SuiviHebdoPrevuRealiseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SuiviHebdoPrevuRealiseCtrl', function($translatePartialLoader, translatedwords, $translate, $window, PeriodeEstimation, TypeVarieteService, $scope, BusinessUnit, campagneagricole, domaine, cultureService, VarieteService, societe, $q, FermeService, _url) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      FERME: [0],
      Societe: 0,
      Variete: [0],
      Type_variete: [0],
      DATE_DEBUT: 0,
      DATE_FIN: 0,
      PRODUCTEUR: [0]
    };
    var pivot = {};
    var pivotTableReportComplete = false;
    var googleChartsLoaded = false;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#compagne").selectpicker('refresh');
      $("#societe").selectpicker('refresh');
      $("#ferme").selectpicker('refresh');
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);

    societe.getSociete(_url).then(e => {
      pc.societe_array = e.data;
      $scope.societe = pc.societe_array[0].ID;
      pc.obj.Societe = $scope.societe;
      $scope.producteur = [];
      $scope.ferme = [];
      $q.all([campagneagricole.getCampagneAgricoleByIDSociete(e.data[0].ID),
        domaine.getDomaine(),
        TypeVarieteService.VarietesFarmBySociete({
          ID_Societe: $scope.societe,
          FERME: pc.obj.FERME
        }),
        VarieteService.getVariete(_url),
        BusinessUnit.getBusinessIdSociete()
      ]).then((values) => {
        pc.compagne_array = values[0].data;
        pc.ferme_array = values[1].data;
        pc.culture_array = values[2].data;
        pc.variete_array = values[3].data;
        pc.producteur_array = values[4].data;

        angular.forEach(pc.compagne_array, function(value, key) {
          if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            setTimeout(function() {
              $('#compagne').selectpicker('val', value.ID_compagne);
              $('#societe').selectpicker('val', pc.societe_array[0].ID);
              $("#compagne").selectpicker('refresh');
              $("#societe").selectpicker('refresh');
              $("#ferme").selectpicker('refresh');
              $("#producteur").selectpicker('refresh');
              $(".selectpicker").selectpicker('refresh');
              pc.obj.DATE_DEBUT = moment(value.Date_debut).format('YYYYMMDD');
              pc.obj.DATE_FIN = moment(value.Date_Fin).format('YYYYMMDD');
              loadData();

            }, 100);
            NProgress.done();
          }
        });

      });

    });

    pc.producteur_change = () => {
      if ($scope.producteur && $scope.producteur.length > 0 && !$scope.producteur.includes(0)) {
        pc.obj.PRODUCTEUR = $scope.producteur;
      } else pc.obj.PRODUCTEUR = [0];
      setTimeout(function() {
        $("#ferme").selectpicker('refresh');
      }, 100);
    }

    pc.culture_change = () => {
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.Type_variete = $scope.culture;
      } else pc.obj.Type_variete = [0];
      setTimeout(function() {
        $("#variete").selectpicker('refresh');
      }, 100);
    }

    pc.variete_change = () => {


      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.Variete = $scope.variete;
      } else pc.obj.Variete = [0];
    }

    pc.ferme_change = () => {
      NProgress.start();
      if ($scope.ferme && $scope.ferme.length > 0 && !$scope.ferme.includes(0)) {
        pc.obj.FERME = $scope.ferme;
      } else pc.obj.FERME = [0];

      TypeVarieteService.VarietesFarmBySociete({
        ID_Societe: $scope.societe,
        FERME: pc.obj.FERME
      }).then(e => {
        pc.culture_array = e.data;
        setTimeout(function() {
          $("#culture").selectpicker('refresh');
          NProgress.done();
        }, 100);
      });
    }

    $scope.search = () => {

      loadData();
    }
    pc.compagne_change = () => {
      if ($scope.compagne) {
        var canGo = true;
        angular.forEach(pc.compagne_array, (v, k) => {
          if (canGo && v.ID_compagne == $scope.compagne) {
            canGo = false;
            pc.obj.DATE_DEBUT = moment(v.Date_debut).format('YYYYMMDD');
            pc.obj.DATE_FIN = moment(v.Date_Fin).format('YYYYMMDD');
          }
        });
      }
    }

    pc.societe_change = () => {
      if (!$scope.societe) {
        $('#societe').selectpicker('val', pc.societe_array[0].ID);
        $(".selectpicker").selectpicker('refresh');
        $scope.societe = pc.societe_array[0].ID

      }

    }

    $scope.exportData = (type) => {
      pivot.exportTo(type);
    }

    function customizeCellFunction(cellBuilder, cellData) {
      try {
        if ((cellData.measure.uniqueName == "Ecart" || cellData.measure.uniqueName == "KG/J/H (PREV)" || cellData.measure.uniqueName == "KG/J/H (REAL)") && !cellData.isTotal) {
          cellBuilder.text = "";
        }
      } catch (error) {

      }


      /*
      if (cellData.type == "value") {
        if (cellData.isTotal) {
          cellBuilder.addClass("alter2");
        } else {
          try {
            if (cellData.measure.uniqueName == "Ecart" || cellData.measure.uniqueName == "KG/J/H (PREV)"  || cellData.measure.uniqueName == "KG/J/H (REAL)" ) {
              cellBuilder.text="";
            }
          } catch (error) {

          }
          cellBuilder.addClass("alter1");
        }
      }*/
    }

    function loadData() {
      PeriodeEstimation.suivi_prevu_realise_hebdo(pc.obj).then(async e => {


        pivot = new Flexmonster({
          container: "wdr-component",
          componentFolder: "https://cdn.flexmonster.com/",
          toolbar: false,
          height: $(window).height() - ($(window).height() / 2),
          customizeCell: customizeCellFunction,
          report: {
            dataSource: {
              data: [{
                "Date": {
                  type: "String"
                },
                "PREVU": {
                  type: "number"
                },
                "REALE": {
                  type: "number"
                },
                "Type_variete": {
                  type: "String"
                },
                "Variete": {
                  type: "String"
                },
                "ferme": {
                  type: "String"
                },
                "producteur": {
                  type: "String"
                },
                "superficie": {
                  type: "number"
                }
              }].concat(e.data)
            },
            options: {
              grid: {
                type: "classic",
                showTotals: "off"
              },
            },
            formats: [{
              name: "format_number",
              maxDecimalPlaces: 2,
              decimalPlaces: 2,
              maxSymbols: 20,
              textAlign: "right"
            }],
            slice: {
              rows: [{
                  uniqueName: "Type_variete",
                  caption: await translatedwords.getTranslatedWord($translate("Culture"))
                }, {
                  uniqueName: "Variete",
                  caption: await translatedwords.getTranslatedWord($translate("Variete"))
                },
                {
                  uniqueName: "producteur",
                  caption: await translatedwords.getTranslatedWord($translate("Producteur"))
                },
                {
                  uniqueName: "ferme",
                  caption: await translatedwords.getTranslatedWord($translate("Ferme / Superficie"))
                }
              ],
              columns: [{
                  uniqueName: "Date"
                },
                {
                  uniqueName: "[Measures]"
                }
              ],
              measures: [{
                  uniqueName: "superficie",
                  format: "format_number",
                  active: false
                },
                {
                  uniqueName: "PREVU",
                  aggregation: "sum",
                  format: "format_number",
                  caption: await translatedwords.getTranslatedWord($translate("PREVU"))
                },
                {
                  uniqueName: "REALE",
                  aggregation: "sum",
                  format: "format_number",
                  caption: await translatedwords.getTranslatedWord($translate("Realise"))
                },
                {
                  uniqueName: "Ecart",
                  formula: "sum('REALE') - sum('PREVU')",
                  caption: await translatedwords.getTranslatedWord($translate("Ecart")),
                  active: false
                },
                {
                  uniqueName: "KG/J/H (PREV)",
                  formula: "sum('PREVU')/7/min('superficie')",
                  caption: await translatedwords.getTranslatedWord($translate("KG/J/H (PREV)")),
                  format: "format_number",
                  active: false
                },
                {
                  uniqueName: "KG/J/H (REAL)",
                  formula: "sum('REALE')/7/min('superficie')",
                  caption: await translatedwords.getTranslatedWord($translate("KG/J/H (REAL)")),
                  format: "format_number",
                  active: false
                }
              ]
            }
          },
          global: {
            localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
          },
          reportcomplete: function() {
            pivot.off("reportcomplete");
            pivotTableReportComplete = true;
            createGoogleChart();
          }
        });

        pivot.expandAllData();
        NProgress.done();
        NProgress.remove();
      });

      google.charts.load('current', {
        'packages': ['corechart']
      });
      google.charts.setOnLoadCallback(onGoogleChartsLoaded);

      function onGoogleChartsLoaded() {
        googleChartsLoaded = true;
        if (pivotTableReportComplete) {
          createGoogleChart();
        }
      }

      function createGoogleChart() {
        if (googleChartsLoaded) {
          pivot.googlecharts.getData({
              type: "pie",
              "slice": {
                "rows": [{
                  "uniqueName": "Variete",
                  "sort": "asc"
                }],
                "columns": [{
                  "uniqueName": "Measures"
                }],
                "measures": [{
                  "uniqueName": "PREVU",
                  "aggregation": "sum"
                }]
              }
            },
            drawChart_prevu,
            drawChart_prevu
          );

          pivot.googlecharts.getData({
              type: "pie",
              "slice": {
                "rows": [{
                  "uniqueName": "Variete",
                  "sort": "asc"
                }],
                "columns": [{
                  "uniqueName": "Measures"
                }],
                "measures": [{
                  "uniqueName": "REALE",
                  "aggregation": "sum"
                }]
              }
            },
            drawChart_realise,
            drawChart_realise
          );
        }
      }

      function drawChart_prevu(_data) {
        var data = google.visualization.arrayToDataTable(_data.data);
        var options = {
          title: 'Total des prévues',
          titleTextStyle: {
            italic: false,
            fontSize: 18
          },
          titlePosition: 'none',
          legend: {
            position: 'bottom'
          },
          pieHole: 0.35,
          fontName: "Open Sans",
          vAxis: {
            titleTextStyle: {
              italic: false,
              fontSize: 12
            }
          },
          hAxis: {
            textStyle: {
              fontSize: 12
            }
          },
          pieSliceBorderColor: "none",
          is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('googlechart-container-prevu'));
        chart.draw(data, options);
      }

      function drawChart_realise(_data) {
        var data = google.visualization.arrayToDataTable(_data.data);
        var options = {
          title: 'Total des real',
          titleTextStyle: {
            italic: false,
            fontSize: 18
          },
          titlePosition: 'none',
          legend: {
            position: 'bottom'
          },
          pieHole: 0.35,
          fontName: "Open Sans",
          vAxis: {
            titleTextStyle: {
              italic: false,
              fontSize: 12
            }
          },
          hAxis: {
            textStyle: {
              fontSize: 12
            }
          },
          pieSliceBorderColor: "none",
          is3D: true
        };

        var chart = new google.visualization.PieChart(document.getElementById('googlechart-container-realise'));
        chart.draw(data, options);
      }

    }
    //loadData();
  });