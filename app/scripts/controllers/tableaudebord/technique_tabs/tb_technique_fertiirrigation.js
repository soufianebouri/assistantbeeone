'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueFertiirrigationCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $rootScope, $http, $cookies, $q, _url, BilanNutritionnel, ApportEau, campagneagricole, cultureService, VarieteService, TrancheAge, tbTechnique, $window) {
    moment.locale('fr');
    var pc = this;

    var Pivot_TableauDesApportsParVariete = undefined;
    var Pivot_TableauDesApportsParCulture = undefined;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "culture": [0],
      "VARIETE": [0],
      "AGE": [0],
      "mode_irrigation": 1,
      "mode_irrigation_ha": 0,
      "Mode_fert": 0,
      "Mode_fert_ha": 0
    }
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#age").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
    }, 1000);


    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_fertiIrrigation_TableauApportsParCulture = data.tb_technique_fertiIrrigation_TableauApportsParCulture;
      $scope.tb_technique_fertiIrrigation_TableauApportsParVariete = data.tb_technique_fertiIrrigation_TableauApportsParVariete;
      $scope.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture = data.tb_technique_fertiIrrigation_GraphiqueAapportsParCulture;
      $scope.tb_technique_fertiIrrigation_GraphiqueApportsParVariete = data.tb_technique_fertiIrrigation_GraphiqueApportsParVariete;
    })

    $q.all([ApportEau.getModeIrrigation({
        id_ferme: pc.IDferme
      }),
      BilanNutritionnel.getmodefert(pc.obj)
    ]).then(function(values) {

      if (values[1].data.length) {
        pc.Mode_fert = values[1].data[0].Mode_fert;
        pc.Mode_fert_ha = values[1].data[0].Mode_fert_ha;
        pc.obj.Mode_fert = pc.Mode_fert;
        pc.obj.Mode_fert_ha = pc.Mode_fert_ha;
      }

      if (values[0].data.length > 0) {
        try {
          pc.mode_irrigation = values[0].data[0].mode_irrigation;
          pc.obj.mode_irrigation = pc.mode_irrigation;

          pc.mode_irrigation_ha = values[0].data[0].mode_irrigation_ha;
          pc.obj.mode_irrigation_ha = pc.mode_irrigation_ha;
        } catch (error) {
          pc.mode_irrigation = 1;
          pc.obj.mode_irrigation = 1;
        }
      } else {
        pc.mode_irrigation = 1;
        pc.obj.mode_irrigation = 1;
      }

      $q.all([cultureService.getCultureByFerme(pc.obj.FERME), VarieteService.getVarieteByFarm({
        idferme: $cookies.getObject('globals').ferme.IDFerme
      }), TrancheAge.getcode(_url), tbTechnique.getTableauDesApportsParCulture(pc.obj), tbTechnique.getTableauDesApportsParVariete(pc.obj), campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete)]).then(function(values) {
        pc.cultures = values[0].data;
        pc.Varietes = values[1].data;
        pc.TrancheAges = values[2].data;
        pc.TableauDesApportsParCulture = values[3].data;
        pc.TableauDesApportsParVariete = values[4].data;
        pc.compagne_array = values[5].data;
        pc.loadWidgets(pc.TableauDesApportsParCulture, pc.TableauDesApportsParVariete);
        setTimeout(function() {
          $("#culture").selectpicker('refresh');
          $("#variete").selectpicker('refresh');
          $("#age").selectpicker('refresh');
          $("#compagne").selectpicker('refresh');
        }, 1000);
        NProgress.done();
      });

    });



    pc.loadWidgets = (data_ParCulture, data_ParVariete) => {
      pc.loadTableauDesApportsParCulture(data_ParCulture);
      pc.loadTableauDesApportsParVariete(data_ParVariete);
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
    }]

    //variete
    pc.loadTableauDesApportsParVariete = async (data) => {
      var modeldataTableauDesApportsParVariete = [{
        "VarieteCode": {
          type: "String"
        },
        "Variete": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "Dose_realise": {
          type: "number"
        },
        "Sup": {
          type: "number"
        },
        "SupVariete": {
          type: "number"
        },
        "N": {
          type: "number"
        },
        "P": {
          type: "number"
        },
        "K": {
          type: "number"
        },
        "Sup_variete_age": {
          type: "number"
        }
      }];
      var mymesureha = [];
      if (pc.obj.mode_irrigation == 1) {
        //avancer
        mymesureha = [{
          uniqueName: "SupVarietes",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup variété")),
          formula: "min('SupVariete')"
        }, {
          uniqueName: "SupVarieteAge",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup age")),
          formula: "min('Sup_variete_age')"
        }, {
          uniqueName: "Dose_realisem3",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("m3")),
          formula: "sum('Dose_realise') "
        }, {
          uniqueName: "Dose_realiseSup",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("m3/Ha")),
          formula: "sum('Dose_realise') / min('SupVariete')"
        }, {
          uniqueName: "Nha",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("N/Ha")),
          formula: "sum('N') / min('SupVariete')"
        }, {
          uniqueName: "Pha",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("P/Ha")),
          formula: "sum('P') / min('SupVariete')"
        }, {
          uniqueName: "Kha",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("K/Ha")),
          formula: "sum('K') / min('SupVariete')"
        }];
      } else {
        //simplifier
        mymesureha = [{
          uniqueName: "SupVarietes",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup variété")),
          formula: "min('SupVariete')"
        }, {
          uniqueName: "SupVarieteAge",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup age")),
          formula: "min('Sup_variete_age')"
        }, {
          uniqueName: "Dose_realises",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("m3/Ha")),
          formula: "sum('Dose_realise')  / min('SupVarietes')"
        }, {
          uniqueName: "Ns",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("N/Ha")),
          formula: "sum('N') / min('SupVarietes')"
        }, {
          uniqueName: "Ps",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("P/Ha")),
          formula: "sum('P')  / min('SupVarietes')"
        }, {
          uniqueName: "Ks",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("K/Ha")),
          formula: "sum('K') / min('SupVarietes')"
        }];
      }
      Pivot_TableauDesApportsParVariete = new Flexmonster({
        container: "#wdr-Pivot_TableauDesApportsParVariete",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauDesApportsParVariete.concat(data)
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
              caption: await translatedwords.getTranslatedWord($translate("Variété"))
            }, {
              uniqueName: "Code",
              caption: await translatedwords.getTranslatedWord($translate("AD/JP")),
              sort: "unsorted"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: mymesureha
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        },
        reportcomplete: function() {
          Pivot_TableauDesApportsParVariete.off("reportcomplete");
          //pivotTableReportComplete = true;
          google.charts.load('current', {
            packages: ['corechart', 'bar']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauDesApportsParVariete(data)
          });
        }
      });
      Pivot_TableauDesApportsParVariete.expandAllData();

    }

    $scope.exportData = (type, num) => {
      if (num == 1) {
        Pivot_TableauDesApportsParCulture.exportTo(type, {
          filename: "Tableau des apports par culture",
          excelSheetName: "Tableau des apports par culture",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      } else {
        Pivot_TableauDesApportsParVariete.exportTo(type, {
          filename: "Tableau des apports par variété",
          excelSheetName: "Tableau des apports par variété",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      }
    }

    function drawChartTableauDesApportsParVariete(_data) {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'VarieteCode');
      data.addColumn('number', "m3/Ha");
      data.addColumn('number', 'N/Ha');
      data.addColumn('number', 'P/Ha');
      data.addColumn('number', 'K/Ha');


      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.VarieteCode,
          (value.SupVariete) ? value.Dose_realise / value.SupVariete : 0,
          (value.SupVariete) ? value.N / value.SupVariete : 0,
          (value.SupVariete) ? value.P / value.SupVariete : 0,
          (value.SupVariete) ? value.K / value.SupVariete : 0
        ]);
      });

      var aggData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "m3/Ha"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'N/Ha'
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'P/Ha'
        }, {
          column: 4,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'K/Ha'
        }]
      );
      var widthChart = (aggData.getNumberOfRows() <= 8) ? 8 : aggData.getNumberOfRows();
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
          left: 30,
          width: "100%"
        },
        //isStacked: true,
        bar: {
          groupWidth: "95%"
        },
        is3D: true,
        hAxis: {
          title: "Variété / Age",
          direction: -1,
          slantedText: false,
          slantedTextAngle: 45,
          textStyle: {
            fontSize: 10
          },
          titleTextStyle: {
            color: 'green'
          }
        },
        vAxis: {
          format: 'short',
          logScale: true,
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


      var view = new google.visualization.DataView(aggData);
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
        },
        4,
        {
          calc: "stringify",
          sourceColumn: 4,
          type: "string",
          role: "annotation"
        }
      ]);



      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-variete'));
      chart.draw(view, options);

      var columns = [];
      var series = {};
      for (var i = 0; i < aggData.getNumberOfColumns(); i++) {
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
                label: aggData.getColumnLabel(col),
                type: aggData.getColumnType(col),
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
            var view = new google.visualization.DataView(aggData);
            view.setColumns(columns);
            chart.draw(view, options);
          }
        }
      });

    }

    //culture
    pc.loadTableauDesApportsParCulture = async (data) => {
      var modeldataTableauDesApportsParCulture = [{
        "Culture": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "Dose_realise": {
          type: "number"
        },
        "Sup": {
          type: "number"
        },
        "SupCulture": {
          type: "number"
        },
        "N": {
          type: "number"
        },
        "P": {
          type: "number"
        },
        "K": {
          type: "number"
        },
        "Sup_Culture_age": {
          type: "number"
        }
      }];

      var mymesureha = [];
      if (pc.obj.mode_irrigation == 1) {
        //avancer
        mymesureha = [{
          uniqueName: "SupCultures",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup culture")),
          formula: "min('SupCulture')"
        }, {
          uniqueName: "SupCultureAge",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Sup age")),
          formula: "min('Sup_Culture_age')"
        }, {
          uniqueName: "Dose_realisem3",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("m3")),
          formula: "sum('Dose_realise')"
        }, {
          uniqueName: "Dose_realiseSup",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("m3/Ha")),
          formula: "sum('Dose_realise') / min('SupCulture')"
        }, {
          uniqueName: "Ns",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("N/Ha")),
          formula: "sum('N') / min('SupCulture')"
        }, {
          uniqueName: "Ps",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("P/Ha")),
          formula: "sum('P') / min('SupCulture')"
        }, {
          uniqueName: "Ks",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("K/Ha")),
          formula: "sum('K') / min('SupCulture')"
        }];
      } else {
        //simplifier
        mymesureha = [{
            uniqueName: "SupCultures",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("Sup culture")),
            formula: "min('SupCulture')"
          }, {
            uniqueName: "SupCultureAge",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("Sup age")),
            formula: "min('Sup_Culture_age')"
          }, {
            uniqueName: "Dose_realises",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("m3/Ha")),
            formula: "sum('Dose_realise') / min('SupCulture')"
          },
          {
            uniqueName: "Ns",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("N/Ha")),
            formula: "sum('N') / min('SupCulture')"
          },
          {
            uniqueName: "Ps",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("P/Ha")),
            formula: "sum('P')  / min('SupCulture')"
          },
          {
            uniqueName: "Ks",
            format: "format_number",
            caption: await translatedwords.getTranslatedWord($translate("K/Ha")),
            formula: "sum('K') / min('SupCulture') "
          }
        ];
      }

      Pivot_TableauDesApportsParCulture = new Flexmonster({
        container: "#wdr-Pivot_TableauDesApportsParCulture",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauDesApportsParCulture.concat(data)
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
              caption: await translatedwords.getTranslatedWord($translate("Culture"))
            }, {
              uniqueName: "Code",
              caption: await translatedwords.getTranslatedWord($translate("AD/JP")),
              sort: "unsorted"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: mymesureha
          }
        },
        reportcomplete: function() {
          Pivot_TableauDesApportsParCulture.off("reportcomplete");
          google.charts.load('current', {
            packages: ['controls', 'corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauDesApportsParCulture(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauDesApportsParCulture.expandAllData();

    }

    function drawChartTableauDesApportsParCulture(_data) {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'CultureCode');
      data.addColumn('number', "m3/Ha");
      data.addColumn('number', 'N/Ha');
      data.addColumn('number', 'P/Ha');
      data.addColumn('number', 'K/Ha');

      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.CultureCode,
          (value.SupCulture) ? value.Dose_realise / value.SupCulture : 0,
          (value.SupCulture) ? value.N / value.SupCulture : 0,
          (value.SupCulture) ? value.P / value.SupCulture : 0,
          (value.SupCulture) ? value.K / value.SupCulture : 0
        ]);
      });

      var aggData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "m3/Ha"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'N/Ha'
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'P/Ha'
        }, {
          column: 4,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: 'K/Ha'
        }]
      );
      var widthChart = (aggData.getNumberOfRows() <= 8) ? 8 : aggData.getNumberOfRows();
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
          left: 30,
          width: "100%"
        },
        //isStacked: true,
        bar: {
          groupWidth: "95%"
        },
        is3D: true,
        hAxis: {
          title: "Culture / Age",
          direction: -1,
          slantedText: false,
          slantedTextAngle: 45,
          textStyle: {
            fontSize: 10
          },
          titleTextStyle: {
            color: 'green'
          }
        },
        vAxis: {
          format: 'short',
          logScale: true,
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

      var view = new google.visualization.DataView(aggData);
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
        },
        4,
        {
          calc: "stringify",
          sourceColumn: 4,
          type: "string",
          role: "annotation"
        }
      ]);

      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-culture'));
      chart.draw(view, options);

      var columns = [];
      var series = {};
      for (var i = 0; i < aggData.getNumberOfColumns(); i++) {
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
                label: aggData.getColumnLabel(col),
                type: aggData.getColumnType(col),
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
            var view = new google.visualization.DataView(aggData);
            view.setColumns(columns);
            chart.draw(view, options);
          }
        }
      });
    }




    pc.search = () => {
      $q.all([tbTechnique.getTableauDesApportsParCulture(pc.obj), tbTechnique.getTableauDesApportsParVariete(pc.obj)]).then(function(values) {
        pc.TableauDesApportsParCulture = values[0].data;
        pc.TableauDesApportsParVariete = values[1].data;
        pc.loadWidgets(pc.TableauDesApportsParCulture, pc.TableauDesApportsParVariete);
        NProgress.done();
      });
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


    pc.compagne_change = () => {
      if ($scope.compagne) {

        $("#reportrange_tb_technique span").html(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").val(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").trigger("change");

        pc.obj.DateDebut = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DateFin = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

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