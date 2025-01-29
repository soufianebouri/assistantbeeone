'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:reportingAssolementCtrl
 * @description
 * # reportingAssolementCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('reportingAssolementCtrl', function(PrevisionJournaliere, translatedwords, $scope, ParcellePhysique, campagneagricole, domaine, cultureService, VarieteService, societe, $q, FermeService, _url, $translatePartialLoader, $translate, $window) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      FERME: [0],
      Societe: [0],
      Variete: [0],
      Culture: [0],
      DATE_DEBUT: "",
      DATE_FIN: ""
    };
    var pivot = {};
    var pivotTableReportComplete = false;
    var googleChartsLoaded = false;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#compagne").selectpicker('refresh');
      $("#societe").selectpicker('refresh');
    }, 1000);

    NProgress.start();
    $q.all([societe.getSociete(_url)]).then((values) => {
      pc.societe_array = values[0].data;
      campagneagricole.getCampagneAgricoleByIDSociete(pc.societe_array[0].ID).then(e => {
        pc.compagne_array = e.data;
        angular.forEach(pc.compagne_array, function(value, key) {
          if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            setTimeout(function() {
              $('#compagne').selectpicker('val', value.ID_compagne);
              $('#societe').selectpicker('val', pc.societe_array[0].ID);
              $(".selectpicker").selectpicker('refresh');
              pc.obj.DATE_DEBUT = moment(value.Date_debut).format('YYYYMMDD');
              pc.obj.DATE_FIN = moment(value.Date_Fin).format('YYYYMMDD');
              loadData();
            }, 100);
          }
        });

      })

    });

    pc.search = () => {
      NProgress.start();
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
      if ($scope.societe && $scope.societe.length > 0) {
        pc.obj.Societe = $scope.societe;
      }
    }

    $scope.exportData = (type) => {
      pivot.exportTo(type);
    }

    function loadData() {
      ParcellePhysique.getAssolomentReport(pc.obj).then(async e => {
        NProgress.done();
        pivot = new Flexmonster({
          container: "wdr-component",
          componentFolder: "https://cdn.flexmonster.com/",
          toolbar: false,
          height: $(window).height() - ($(window).height() / 2),
          report: {
            dataSource: {
              data: [{
                "Culture": {
                  type: "String"
                },
                "Nom": {
                  type: "String"
                },
                "Rais_Social": {
                  type: "String"
                },
                "bunit": {
                  type: "String"
                },
                "Variete": {
                  type: "String"
                },
                "sup_sous_serre": {
                  type: "number"
                },
                "superficie_Total": {
                  type: "number"
                },
                "superficier_PC": {
                  type: "number"
                }
              }].concat(e.data)
            },
            options: {
              grid: {
                type: "classic"
              }
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
                  uniqueName: "Rais_Social",
                  caption: await translatedwords.getTranslatedWord($translate("Société"))
                }, {
                  uniqueName: "bunit",
                  caption: await translatedwords.getTranslatedWord($translate("Producteur"))
                },
                {
                  uniqueName: "Nom",
                  caption: await translatedwords.getTranslatedWord($translate("Ferme"))
                },
                {
                  uniqueName: "superficie_Total",
                  format: "format_number",
                  caption: await translatedwords.getTranslatedWord($translate("Superficie totale"))
                },
                {
                  uniqueName: "sup_sous_serre",
                  format: "format_number",
                  caption: await translatedwords.getTranslatedWord($translate("Superficie sous serre"))
                }
              ],
              columns: [{
                  uniqueName: "Culture",
                  caption: await translatedwords.getTranslatedWord($translate("Culture"))
                },
                {
                  uniqueName: "Variete",
                  caption: await translatedwords.getTranslatedWord($translate("Variété"))
                },
                {
                  uniqueName: "[Measures]"
                }
              ],
              measures: [{
                uniqueName: "superficier_PC",
                aggregation: "sum",
                format: "format_number"
              }]
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
                  "uniqueName": "bunit",
                  "sort": "asc"
                }],
                "columns": [{
                  "uniqueName": "Measures"
                }],
                "measures": [{
                  "uniqueName": "superficier_PC",
                  "aggregation": "sum",
                  "format": "format_number"
                }]
              }
            },
            drawChart,
            drawChart
          );

        }
      }

      function drawChart(_data) {
        var data = google.visualization.arrayToDataTable(_data.data);
        var options = {
          title: 'Superficie totale par producteur',
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

        var chart = new google.visualization.PieChart(document.getElementById('googlechart-container'));
        chart.draw(data, options);
      }
    }

  });