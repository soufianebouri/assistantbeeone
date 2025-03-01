'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueRendementCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueRendementCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueRendementCtrl', function($scope, translatedwords, $window, $translatePartialLoader, $translate, $http, $cookies, $q, $rootScope, campagneagricole, _url, cultureService, VarieteService, TrancheAge, portGreffe, tbTechnique) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('beeoneAssistant').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('beeoneAssistant').ferme.IDSociete;
    var Pivot_TableauRendementParVariete = undefined;
    var Pivot_TableauRendementParCulture = undefined;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "culture": [0],
      "VARIETE": [0],
      "AGE": [0],
      "PORTGREFFE": [0]
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#age").selectpicker('refresh');
      $("#portgreff").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
    }, 1000);

    $q.all([cultureService.getCultureByFerme(pc.obj.FERME), VarieteService.getVarieteByFarm({
        idferme: $cookies.getObject('beeoneAssistant').ferme.IDFerme
      }), TrancheAge.getcode(_url), portGreffe.getPortGreffe(),
      tbTechnique.getTableauRendementParCulture(pc.obj),
      tbTechnique.getTableauRendementParVariete(pc.obj), campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('beeoneAssistant').ferme.IDSociete)
    ]).then(function(values) {
      pc.cultures = values[0].data;
      pc.Varietes = values[1].data;
      pc.TrancheAges = values[2].data;
      pc.PortGreffs = values[3].data;
      pc.TableauRendementParCulture = values[4].data;
      pc.TableauRendementParVariete = values[5].data;
      pc.compagne_array = values[6].data;
      pc.loadWidgets(pc.TableauRendementParCulture, pc.TableauRendementParVariete);
      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#age").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
      }, 1000);
      NProgress.done();
    });

    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_qualite_TableauSuiviRendementParCulture = data.tb_technique_qualite_TableauSuiviRendementParCulture;
      $scope.tb_technique_qualite_TableauSuiviRendementParVariete = data.tb_technique_qualite_TableauSuiviRendementParVariete;
      $scope.tb_technique_qualite_GraphiqueSuiviRendementParCulture = data.tb_technique_qualite_GraphiqueSuiviRendementParCulture;
      $scope.tb_technique_qualite_GraphiqueSuiviRendementParVariete = data.tb_technique_qualite_GraphiqueSuiviRendementParVariete;
    })

    pc.loadWidgets = (data_TableauRendementParCulture, data_TableauRendementParVariete) => {
      pc.loadTableauRendementParCulture(data_TableauRendementParCulture);
      pc.loadTableauRendementParVariete(data_TableauRendementParVariete);
    }

    var formatpuvot = [{
      name: "format_number",
      maxDecimalPlaces: 2,
      decimalPlaces: 2,
      decimalSeparator: ".",
      maxSymbols: 20,
      textAlign: "right",
      divideByZeroValue: "0",
      thousandsSeparator: " ",
      nullValue: ""
    }, {
      name: "format_number_percent",
      maxDecimalPlaces: 1,
      decimalPlaces: 2,
      maxSymbols: 20,
      textAlign: "right",
      divideByZeroValue: "0%",
      thousandsSeparator: " ",
      nullValue: "0%",
      currencySymbol: "%",
      currencySymbolAlign: "right",
      isPercent: false
    }, {
      name: "format_number_percent_calculated",
      maxDecimalPlaces: 1,
      decimalPlaces: 2,
      maxSymbols: 20,
      textAlign: "right",
      divideByZeroValue: "0",
      nullValue: "0",
      currencySymbolAlign: "right",
      isPercent: true
    }]




    $scope.exportData = (type, num) => {
      if (num == 1) {
        Pivot_TableauRendementParVariete.exportTo(type, {
          filename: "Tableau du suivi rendement par culture",
          excelSheetName: "Tableau du suivi rendement par culture",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      } else {
        Pivot_TableauRendementParCulture.exportTo(type, {
          filename: "Tableau du suivi rendement par variété",
          excelSheetName: "Tableau du suivi rendement par variété",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      }
    }




    pc.loadTableauRendementParVariete = async (data) => {
      var modeldataTableauRendementParVariete = [{
        "Variete": {
          type: "String"
        },
        "Tonnage_estime": {
          type: "number"
        },
        "Sup": {
          type: "number"
        },
        "Cml": {
          type: "number"
        },
        "Tonnagerecolte": {
          type: "number"
        }
      }];
      Pivot_TableauRendementParVariete = new Flexmonster({
        container: "#wdr-Pivot_TableauRendementParVariete",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          "conditions": [{
            "formula": "#value*100  >= 0 AND #value*100  < 1",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#ff001d",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }, {
            "formula": "#value*100  < 90 AND #value*100  != 0 AND #value*100  >= 1",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#ff7700",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }, {
            "formula": "#value*100  >= 90",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#6bff6b",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }],
          dataSource: {
            data: modeldataTableauRendementParVariete.concat(data)
          },
          options: {
            grid: {
              type: "classic",
              showTotals: "off",
              showGrandTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: formatpuvot,
          slice: {
            rows: [{
              uniqueName: "Variete",
              caption: await translatedwords.getTranslatedWord($translate("Variété")),
              sort: "Variete"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "Sups",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Sup")),
              formula: "min('Sup')"
            }, {
              uniqueName: "Tonnage_estimes",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Tonnage estimé")),
              formula: "sum('Tonnage_estime')"
            }, {
              uniqueName: "Rendement estimés",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Rendement estimé")),
              formula: "sum('Tonnage_estime') / min('Sup')"
            }, {
              uniqueName: "Tonnagerecoltes",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Tonnage récolté")),
              formula: "sum('Tonnagerecolte')"
            }, {
              uniqueName: "Rendement récoltés",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Rendement récolté")),
              formula: "sum('Tonnagerecolte') / min('Sup')"
            }, {
              uniqueName: "Cmls",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Tonnage expédié")),
              formula: "sum('Cml')"
            }, {
              uniqueName: "Production restantes",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Production restante")),
              formula: "(sum('Tonnage_estime') - sum('Tonnagerecolte'))"
            }, {
              uniqueName: "realisations",
              format: "format_number_percent_calculated",
              caption: await translatedwords.getTranslatedWord($translate("% réalisation")),
              formula: "(sum('Tonnagerecolte') / sum('Tonnage_estime'))"
            }]
          }
        },
        reportcomplete: function() {
          Pivot_TableauRendementParVariete.off("reportcomplete");
          google.charts.load('current', {
            packages: ['corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauRendementParVariete(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauRendementParVariete.expandAllData();

    }

    function drawChartTableauRendementParVariete(_data) {


      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Variete');
      data.addColumn('number', 'Tonnage estimé');
      data.addColumn('number', 'Tonnage récolté');
      data.addColumn('number', 'Tonnage expédié');

      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.Variete,
          value.Tonnage_estime,
          value.Tonnagerecolte,
          value.Cml
        ]);
      });

      if (_data.length == 0) {
        data.addRow([
          "", 0, 0, 0
        ]);
      }


      var groupData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage estimé"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage récolté"
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage expédié"
        }]
      );

      var widthChart = (groupData.getNumberOfRows() <= 10) ? 10 : groupData.getNumberOfRows();
      var options = {
        legend: {
          position: 'top',
          textStyle: {
            fontSize: 10
          }
        },
        annotations: {
          alwaysOutside: false,
          textStyle: {
            fontSize: 10
          }
        },
        width: widthChart * 65,
        chartArea: {
          left: 50,
          width: "100%"
        },
        //isStacked: true,
        bar: {
          groupWidth: "95%"
        },
        is3D: true,
        hAxis: {
          title: "Variété",
          direction: -1,
          slantedText: false,
          slantedTextAngle: 45,
          textStyle: {
            fontSize: 10
          },
          titleTextStyle: {
            color: 'green'
          },
          minValue: 0
        },
        vAxis: {
          format: 'short',
          title: "Tonne",
          logScale: true,
          viewWindow: {
            min: 0
          },
          textStyle: {
            fontSize: 10 // or the number you want
          }
        },
        explorer: {
          axis: 'horizontal',
          keepInBounds: true,
          maxZoomIn: 4.0
        }
      };

      var view = new google.visualization.DataView(groupData);
      view.setColumns([0, 1,
        {
          calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation"
        },
        2,
        {
          calc: "stringify",
          sourceColumn: 2,
          type: "string",
          role: "annotation"
        },
        3,
        {
          calc: "stringify",
          sourceColumn: 3,
          type: "string",
          role: "annotation"
        }
      ]);

      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-TableauRendementParVariete'));
      chart.draw(view, options);

      var columns = [];
      var series = {};
      for (var i = 0; i < groupData.getNumberOfColumns(); i++) {
        columns.push(i);
        if (i > 0) {
          series[i - 1] = {};
        }
      }

      google.visualization.events.addListener(chart, 'select', function() {
        var sel = chart.getSelection();
        // if selection length is 0, we deselected an element
        if (sel.length > 0) {
          // if row is undefined, we clicked on the legend
          if (sel[0].row === null) {
            var col = sel[0].column;
            if (columns[col] == col) {
              // hide the data series
              columns[col] = {
                label: groupData.getColumnLabel(col),
                type: groupData.getColumnType(col),
                calc: function() {
                  return null;
                },
              };

              // grey out the legend entry
              series[col - 1].color = '#CCCCCC';
            } else {
              // show the data series
              columns[col] = col;
              series[col - 1].color = null;
            }
            var view = new google.visualization.DataView(groupData);
            view.setColumns(columns);
            chart.draw(view, options);
          }
        }
      });
    }


    pc.loadTableauRendementParCulture = async (data) => {
      var modeldataTableauRendementParCulture = [{
        "Culture": {
          type: "String"
        },
        "Tonnage_estime": {
          type: "number"
        },
        "Sup": {
          type: "number"
        },
        "Cml": {
          type: "number"
        },
        "Tonnagerecolte": {
          type: "number"
        }
      }];
      Pivot_TableauRendementParCulture = new Flexmonster({
        container: "#wdr-Pivot_TableauRendementParCulture",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          "conditions": [{
            "formula": "#value*100  >= 0 AND #value*100  < 1",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#ff001d",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }, {
            "formula": "#value*100  < 90 AND #value*100  != 0 AND #value*100  >= 1",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#ff7700",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }, {
            "formula": "#value*100  >= 90",
            "measure": "realisation",
            "format": {
              "backgroundColor": "#6bff6b",
              "color": "#000000",
              "fontFamily": "Arial",
              "fontSize": "12px"
            }
          }],
          dataSource: {
            data: modeldataTableauRendementParCulture.concat(data)
          },
          options: {
            grid: {
              type: "classic",
              showTotals: "off",
              showGrandTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: formatpuvot,
          slice: {
            rows: [{
              uniqueName: "Culture",
              caption: await translatedwords.getTranslatedWord($translate("Culture")),
              sort: "Culture"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
                uniqueName: "Sups",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Sup")),
                formula: "min('Sup')"
              }, {
                uniqueName: "Tonnage_estimes",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Tonnage estimé")),
                formula: "sum('Tonnage_estime')"
              }, {
                uniqueName: "Rendement estimés",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Rendement estimé")),
                formula: "sum('Tonnage_estime') / min('Sup')"
              }, {
                uniqueName: "Tonnagerecoltes",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Tonnage récolté")),
                formula: "sum('Tonnagerecolte')"
              }, {
                uniqueName: "Rendement récoltés",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Rendement récolté")),
                formula: "sum('Tonnagerecolte') / min('Sup')"
              },
              {
                uniqueName: "Cmls",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Tonnage expédié")),
                formula: "sum('Cml')"
              }, {
                uniqueName: "Production restantes",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Production restante")),
                formula: "(sum('Tonnage_estime') - sum('Tonnagerecolte'))"
              }, {
                uniqueName: "realisations",
                format: "format_number_percent_calculated",
                caption: await translatedwords.getTranslatedWord($translate("% réalisation")),
                formula: "(sum('Tonnagerecolte') / sum('Tonnage_estime'))"
              }
            ]
          }
        },
        reportcomplete: function() {
          Pivot_TableauRendementParCulture.off("reportcomplete");
          google.charts.load('current', {
            packages: ['corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauRendementParCulture(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauRendementParCulture.expandAllData();

    }

    function drawChartTableauRendementParCulture(_data) {


      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Culture');
      data.addColumn('number', 'Tonnage estimé');
      data.addColumn('number', 'Tonnage récolté');
      data.addColumn('number', 'Tonnage expédié');

      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.Culture,
          value.Tonnage_estime,
          value.Tonnagerecolte,
          value.Cml
        ]);
      });

      if (_data.length == 0) {
        data.addRow([
          "", 0, 0, 0
        ]);
      }


      var groupData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage estimé"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage récolté"
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Tonnage expédié"
        }]
      );

      var widthChart = (groupData.getNumberOfRows() <= 10) ? 10 : groupData.getNumberOfRows();
      var options = {
        legend: {
          position: 'top',
          textStyle: {
            fontSize: 10
          }
        },
        annotations: {
          alwaysOutside: false,
          textStyle: {
            fontSize: 10
          }
        },
        width: widthChart * 65,
        chartArea: {
          left: 50,
          width: "100%"
        },
        //isStacked: true,
        bar: {
          groupWidth: "95%"
        },
        is3D: true,
        hAxis: {
          title: "Culture",
          direction: -1,
          slantedText: false,
          slantedTextAngle: 45,
          textStyle: {
            fontSize: 10
          },
          titleTextStyle: {
            color: 'green'
          },
          minValue: 0
        },
        vAxis: {
          format: 'short',
          title: "Tonne",
          logScale: true,
          viewWindow: {
            min: 0
          },
          textStyle: {
            fontSize: 10 // or the number you want
          }
        },
        explorer: {
          axis: 'horizontal',
          keepInBounds: true,
          maxZoomIn: 4.0
        }
      };

      var view = new google.visualization.DataView(groupData);
      view.setColumns([0, 1,
        {
          calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation"
        },
        2,
        {
          calc: "stringify",
          sourceColumn: 2,
          type: "string",
          role: "annotation"
        },
        3,
        {
          calc: "stringify",
          sourceColumn: 3,
          type: "string",
          role: "annotation"
        }
      ]);

      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-TableauRendementParCulture'));
      chart.draw(view, options);

      var columns = [];
      var series = {};
      for (var i = 0; i < groupData.getNumberOfColumns(); i++) {
        columns.push(i);
        if (i > 0) {
          series[i - 1] = {};
        }
      }

      google.visualization.events.addListener(chart, 'select', function() {
        var sel = chart.getSelection();
        // if selection length is 0, we deselected an element
        if (sel.length > 0) {
          // if row is undefined, we clicked on the legend
          if (sel[0].row === null) {
            var col = sel[0].column;
            if (columns[col] == col) {
              // hide the data series
              columns[col] = {
                label: groupData.getColumnLabel(col),
                type: groupData.getColumnType(col),
                calc: function() {
                  return null;
                },
              };

              // grey out the legend entry
              series[col - 1].color = '#CCCCCC';
            } else {
              // show the data series
              columns[col] = col;
              series[col - 1].color = null;
            }
            var view = new google.visualization.DataView(groupData);
            view.setColumns(columns);
            chart.draw(view, options);
          }
        }
      });

    }

    pc.search = () => {
      $q.all([tbTechnique.getTableauRendementParCulture(pc.obj), tbTechnique.getTableauRendementParVariete(pc.obj)]).then(function(values) {
        pc.TableauRendementParCulture = values[0].data;
        pc.TableauRendementParVariete = values[1].data;
        pc.loadWidgets(pc.TableauRendementParCulture, pc.TableauRendementParVariete);
        NProgress.done();
      });
    }

    pc.compagne_change = () => {
      if ($scope.compagne) {

        $("#reportrange_tb_technique span").html(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").val(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").trigger("change");

        pc.obj.DateDebut = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DateFin = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

      }
    }

    pc.culture_change = () => {
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.culture = $scope.culture;
        pc.obj.VARIETE = [0];
      } else {
        pc.obj.culture = [0];
      }

      $q.all([VarieteService.showVarieteByCultureFerme(pc.obj)]).then((values) => {
        pc.Varietes = values[0].data;
        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $('#variete').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });

    }

    pc.variete_change = () => {
      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.VARIETE = $scope.variete;
      } else {
        pc.obj.VARIETE = [0];
      }
    }

    pc.age_change = () => {
      if ($scope.age && $scope.age.length > 0 && !$scope.age.includes(0)) {
        pc.obj.AGE = $scope.age;
      } else {
        pc.obj.AGE = [0];
      }
    }

    pc.port_greff_change = () => {
      if ($scope.port_greff && $scope.port_greff.length > 0 && !$scope.port_greff.includes(0)) {
        pc.obj.PORTGREFFE = $scope.port_greff;
      } else {
        pc.obj.PORTGREFFE = [0];
      }
    }


    $("#reportrange_tb_technique input").change((e) => {
      var periode = $("#reportrange_tb_technique input").val().split(" - ");
      if (periode.length == 1) {
        pc.obj.DateDebut = moment().startOf('year').format('YYYYMMDD');
        pc.obj.DateFin = moment().endOf('year').format('YYYYMMDD');
      } else {
        pc.obj.DateDebut = periode[0];
        pc.obj.DateFin = periode[1];
      }
    });

    async function daterange_tb_technique(from, to) {
      to = moment();
      from = moment().subtract(6, "days");
      var range = {
        'Semaine1': [moment().subtract(6, "days"), moment()],
        '15 jours1': [moment().subtract(14, "days"), moment()],
        '1 mois1': [moment().startOf("month"), moment().endOf("month")],
        'Trimestre1': [moment().subtract(2, 'month').startOf("month"), moment().endOf("month")]
      }

      range[await translatedwords.getTranslatedWord($translate("Semaine"))] = range['Semaine1'];
      range[await translatedwords.getTranslatedWord($translate("15 jours"))] = range['15 jours1'];
      range[await translatedwords.getTranslatedWord($translate("1 mois"))] = range['1 mois1'];
      range[await translatedwords.getTranslatedWord($translate("Trimestre"))] = range['Trimestre1'];
      delete range['Semaine1'];
      delete range['15 jours1'];
      delete range['1 mois1'];
      delete range['Trimestre1'];
      if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function(a, b, c) {
            if (c == "Annuel") {
              $("#reportrange_tb_technique span").html(a.format("YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYY"))
              $("#reportrange_tb_technique input").trigger("change");
            } else {
              $("#reportrange_tb_technique span").html(a.format("DD/MM/YYYY") + " - " + b.format("DD/MM/YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYYMMDD") + " - " + b.format("YYYYMMDD"))
              $("#reportrange_tb_technique input").trigger("change");
            }
          },
          b = {
            startDate: moment().subtract(6, "days"),
            endDate: moment(),
            showDropdowns: !0,
            showWeekNumbers: !0,
            timePicker: !1,
            timePickerIncrement: 1,
            timePicker12Hour: !0,
            ranges: range,
            opens: "left",
            buttonClasses: ["btn btn-default"],
            applyClass: "btn-small btn-primary",
            cancelClass: "btn-small",
            format: "DD/MM/YYYY",
            separator: await translatedwords.getTranslatedWord($translate(" à ")),
            locale: {
              applyLabel: await translatedwords.getTranslatedWord($translate("Valider")),
              cancelLabel: await translatedwords.getTranslatedWord($translate("Vider")),
              fromLabel: await translatedwords.getTranslatedWord($translate("De")),
              toLabel: await translatedwords.getTranslatedWord($translate("à")),
              customRangeLabel: await translatedwords.getTranslatedWord($translate("Personnalisée")),
              daysOfWeek: [await translatedwords.getTranslatedWord($translate("Lun")),
                await translatedwords.getTranslatedWord($translate("Mar")),
                await translatedwords.getTranslatedWord($translate("Mer")),
                await translatedwords.getTranslatedWord($translate("Jeu")),
                await translatedwords.getTranslatedWord($translate("Ven")),
                await translatedwords.getTranslatedWord($translate("Sam")),
                await translatedwords.getTranslatedWord($translate("Dim"))
              ],
              monthNames: [await translatedwords.getTranslatedWord($translate("Janvier")),
                await translatedwords.getTranslatedWord($translate("février")),
                await translatedwords.getTranslatedWord($translate("mars")),
                await translatedwords.getTranslatedWord($translate("avril")),
                await translatedwords.getTranslatedWord($translate("mai")),
                await translatedwords.getTranslatedWord($translate("juin")),
                await translatedwords.getTranslatedWord($translate("juillet")),
                await translatedwords.getTranslatedWord($translate("août")),
                await translatedwords.getTranslatedWord($translate("septembre")),
                await translatedwords.getTranslatedWord($translate("octobre")),
                await translatedwords.getTranslatedWord($translate("novembre")),
                await translatedwords.getTranslatedWord($translate("décembre"))
              ],
              firstDay: 1
            }
          };
        $("#reportrange_tb_technique span").html(moment().subtract(6, "days").format("DD/MM/YYYY") + " - " + moment().format("DD/MM/YYYY")), $("#reportrange_tb_technique").daterangepicker(b, a), $("#reportrange_tb_technique").on("show.daterangepicker", function() {

        }), $("#reportrange_tb_technique").on("hide.daterangepicker", function() {

        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {}), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {}), $("#options1").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(b, a)
        }), $("#options2").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(optionSet2, a)
        }), $("#destroy").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").remove()
        })
      }
    }

    setTimeout(function() {
      daterange_tb_technique(null, null)
    }, 100);






  });