'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueQualiteCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueQualiteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueQualiteCtrl', function($scope, translatedwords, $window, $translatePartialLoader, $translate, $http, $cookies, $q, campagneagricole, $rootScope, _url, cultureService, VarieteService, TrancheAge, portGreffe, tbTechnique) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    var Pivot_TableauSuiviQualiteParVariete = undefined;
    var Pivot_TableauSuiviQualiteParCulture = undefined;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "culture": [0],
      "VARIETE": [0],
      "AGE": [0]
      /*,
            "PORTGREFFE": [0]*/
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#age").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      //$("#portgreff").selectpicker('refresh');
    }, 1000);

    $q.all([cultureService.getCultureByFerme(pc.obj.FERME), VarieteService.getVarieteByFarm({
      idferme: $cookies.getObject('globals').ferme.IDFerme
    }), TrancheAge.getcode(_url), tbTechnique.getTableauSuiviQualiteParCulture(pc.obj), tbTechnique.getTableauSuiviQualiteParVarieteCulture(pc.obj), campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete)]).then(function(values) {
      pc.cultures = values[0].data;
      pc.Varietes = values[1].data;
      pc.TrancheAges = values[2].data;
      //portGreffe.getPortGreffe()
      //pc.PortGreffs = values[3].data;
      pc.TableauSuiviQualiteParCulture = values[3].data;
      pc.TableauSuiviQualiteParVarieteCulture = values[4].data;
      pc.compagne_array = values[5].data;
      pc.loadWidgets(pc.TableauSuiviQualiteParCulture, pc.TableauSuiviQualiteParVarieteCulture);
      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#age").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
      }, 1000);
      NProgress.done();
    });

    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_qualite_TableauSuiviQualiteCulture = data.tb_technique_qualite_TableauSuiviQualiteCulture;
      $scope.tb_technique_qualite_TableauSuiviQualiteVariete = data.tb_technique_qualite_TableauSuiviQualiteVariete;
      $scope.tb_technique_qualite_GraphiqueSuiviQualiteParCulture = data.tb_technique_qualite_GraphiqueSuiviQualiteParCulture;
      $scope.tb_technique_qualite_GraphiqueSuiviQualiteParVariete = data.tb_technique_qualite_GraphiqueSuiviQualiteParVariete;
    })

    pc.loadWidgets = (data_TableauSuiviQualiteParCulture, data_TableauSuiviQualiteParVarieteCulture) => {
      pc.loadTableauSuiviQualiteParCulture(data_TableauSuiviQualiteParCulture);
      pc.loadTableauSuiviQualiteParVariete(data_TableauSuiviQualiteParVarieteCulture);
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

    pc.loadTableauSuiviQualiteParVariete = async (data) => {
      var modeldataTableauSuiviQualiteParVariete = [{
        "Variete": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "Brix": {
          type: "number"
        },
        "Tauxjus": {
          type: "number"
        },
        "Acidite": {
          type: "number"
        },
        "Accroissement_journalier_moyen": {
          type: "number"
        },
        "Pepins": {
          type: "number"
        }
      }];
      Pivot_TableauSuiviQualiteParVariete = new Flexmonster({
        container: "#wdr-Pivot_TableauSuiviQualiteParVariete",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauSuiviQualiteParVariete.concat(data)
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
              sort: "ref"
            }, {
              uniqueName: "Code",
              caption: await translatedwords.getTranslatedWord($translate("Age")),
              sort: "Code"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "Accroissement_journalier_moyens",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Accroissement journalier moyen")),
              formula: "sum('Accroissement_journalier_moyen')"
            }, {
              uniqueName: "Brixs",
              format: "format_numbers",
              caption: await translatedwords.getTranslatedWord($translate("Brix")),
              formula: "sum('Brix')"
            }, {
              uniqueName: "Acidites",
              format: "format_numbers",
              caption: await translatedwords.getTranslatedWord($translate("Acidité")),
              formula: "sum('Acidite')"
            }, {
              uniqueName: "Tauxjuss",
              format: "format_numbers",
              caption: await translatedwords.getTranslatedWord($translate("% Jus")),
              formula: "sum('Tauxjus')"
            }, {
              uniqueName: "Pepinss",
              format: "format_numbers",
              caption: await translatedwords.getTranslatedWord($translate("Pépins (moy nbre pépins/fruit)")),
              formula: "sum('Pepins')"
            }]
          }
        },
        reportcomplete: function() {
          Pivot_TableauSuiviQualiteParVariete.off("reportcomplete");
          google.charts.load('current', {
            packages: ['corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauSuiviQualiteParVariete(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauSuiviQualiteParVariete.expandAllData();

    }

    $scope.exportData = (type, num) => {
      if (num == 1) {
        Pivot_TableauSuiviQualiteParCulture.exportTo(type, {
          filename: "Tableau du suivi qualité par culture",
          excelSheetName: "Tableau du suivi qualité par culture",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      } else {
        Pivot_TableauSuiviQualiteParVariete.exportTo(type, {
          filename: "Tableau du suivi qualité par variété",
          excelSheetName: "Tableau du suivi qualité par variété",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      }
    }

    function drawChartTableauSuiviQualiteParVariete(_data) {


      var data = new google.visualization.DataTable();
      data.addColumn('string', 'VarieteCode');
      data.addColumn('number', 'Brix');
      data.addColumn('number', 'Tauxjus');
      data.addColumn('number', 'Acidite');
      data.addColumn('number', 'Accroissement_journalier_moyen');
      data.addColumn('number', 'Pepins');
      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.VarieteCode,
          value.Brix,
          value.Tauxjus,
          value.Acidite,
          (value.Accroissement_journalier_moyen) ? parseFloat(value.Accroissement_journalier_moyen) : 0,
          value.Pepins
        ]);
      });

      if (_data.length == 0) {
        data.addRow([
          "", 0, 0, 0, 0, 0
        ]);
      }


      var groupData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Brix"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "% Jus"
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Acidité"
        }, {
          column: 4,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Accroissement journalier moyen"
        }, {
          column: 5,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Pépins (moy nbre pépins/fruit)"
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
          },
          minValue: 0
        },
        vAxis: {
          format: 'short',
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
        },
        4,
        {
          calc: "stringify",
          sourceColumn: 4,
          type: "string",
          role: "annotation"
        },
        5,
        {
          calc: "stringify",
          sourceColumn: 5,
          type: "string",
          role: "annotation"
        }
      ]);

      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-TableauSuiviQualiteParVariete'));
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

    pc.loadTableauSuiviQualiteParCulture = async (data) => {
      var modeldataTableauSuiviQualiteParCulture = [{
        "Culture": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "Brix": {
          type: "number"
        },
        "Tauxjus": {
          type: "number"
        },
        "Acidite": {
          type: "number"
        },
        "Accroissement_journalier_moyen": {
          type: "number"
        },
        "Pepins": {
          type: "number"
        }
      }];
      Pivot_TableauSuiviQualiteParCulture = new Flexmonster({
        container: "#wdr-Pivot_TableauSuiviQualiteParCulture",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauSuiviQualiteParCulture.concat(data)
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
              sort: "ref"
            }, {
              uniqueName: "Code",
              caption: await translatedwords.getTranslatedWord($translate("Age")),
              sort: "Code"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "Accroissement_journalier_moyens",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Accroissement journalier moyen")),
              formula: "sum('Accroissement_journalier_moyen')"
            }, {
              uniqueName: "Brixs",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Brix")),
              formula: "sum('Brix')"
            }, {
              uniqueName: "Acidites",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Acidité")),
              formula: "sum('Acidite')"
            }, {
              uniqueName: "Tauxjuss",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("% Jus")),
              formula: "sum('Tauxjus')"
            }, {
              uniqueName: "Pepinss",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Pépins (moy nbre pépins/fruit)")),
              formula: "sum('Pepins')"
            }]
          }
        },
        reportcomplete: function() {
          Pivot_TableauSuiviQualiteParCulture.off("reportcomplete");
          google.charts.load('current', {
            packages: ['corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauSuiviQualiteParCulture(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauSuiviQualiteParCulture.expandAllData();

    }

    function drawChartTableauSuiviQualiteParCulture(_data) {


      var data = new google.visualization.DataTable();
      data.addColumn('string', 'CultureCode');
      data.addColumn('number', 'Brix');
      data.addColumn('number', 'Tauxjus');
      data.addColumn('number', 'Acidite');
      data.addColumn('number', 'Accroissement_journalier_moyen');
      data.addColumn('number', 'Pepins');

      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.CultureCode,
          value.Brix,
          value.Tauxjus,
          value.Acidite,
          (value.Accroissement_journalier_moyen) ? parseFloat(value.Accroissement_journalier_moyen) : 0,
          value.Pepins
        ]);
      });

      if (_data.length == 0) {
        data.addRow([
          "", 0, 0, 0, 0, 0
        ]);
      }


      var groupData = google.visualization.data.group(
        data,
        [0],
        [{
          column: 1,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Brix"
        }, {
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "% Jus"
        }, {
          column: 3,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Acidité"
        }, {
          column: 4,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Accroissement journalier moyen"
        }, {
          column: 5,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Pépins (moy nbre pépins/fruit)"
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
          },
          minValue: 0
        },
        vAxis: {
          format: 'short',
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
        },
        4,
        {
          calc: "stringify",
          sourceColumn: 4,
          type: "string",
          role: "annotation"
        },
        5,
        {
          calc: "stringify",
          sourceColumn: 5,
          type: "string",
          role: "annotation"
        }
      ]);


      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-TableauSuiviQualiteParCulture'));
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
      $q.all([tbTechnique.getTableauSuiviQualiteParCulture(pc.obj), tbTechnique.getTableauSuiviQualiteParVarieteCulture(pc.obj)]).then(function(values) {
        pc.TableauSuiviQualiteParCulture = values[0].data;
        pc.TableauSuiviQualiteParVarieteCulture = values[1].data;
        pc.loadWidgets(pc.TableauSuiviQualiteParCulture, pc.TableauSuiviQualiteParVarieteCulture);
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

    /*pc.port_greff_change = () => {
      if ($scope.port_greff && $scope.port_greff.length > 0 && !$scope.port_greff.includes(0)) {
        pc.obj.PORTGREFFE = $scope.port_greff;
      } else {
        pc.obj.PORTGREFFE = [0];
      }
    }*/

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
          //console.log("show event fired")
        }), $("#reportrange_tb_technique").on("hide.daterangepicker", function() {
          //console.log("hide event fired")
        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {
          //console.log("apply event fired, start/end dates are " + b.startDate.format("MMMM D, YYYY") + " to " + b.endDate.format("MMMM D, YYYY"))
        }), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {
          //console.log("cancel event fired")
        }), $("#options1").click(function() {
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