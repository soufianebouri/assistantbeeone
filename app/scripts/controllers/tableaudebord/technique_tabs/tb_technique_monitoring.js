'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueMonitoringCtrl', function($scope, translatedwords, $window, $http, $translatePartialLoader, campagneagricole, $translate, $cookies, $q, _url, $rootScope, cultureService, VarieteService, TrancheAge, tbTechnique) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('beeoneAssistant').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('beeoneAssistant').ferme.IDSociete;

    var Pivot_TableauAlertesRavageurs = undefined;
    var Pivot_TableauInfestation = undefined;

    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "culture": [0],
      "VARIETE": [0],
      "AGE": [0]
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
    }, 1000);

    $q.all([cultureService.getCultureByFerme(pc.obj.FERME), VarieteService.getVarieteByFarm({
      idferme: $cookies.getObject('beeoneAssistant').ferme.IDFerme
    }), TrancheAge.getcode(_url), tbTechnique.getAlertesRavageurs(pc.obj), tbTechnique.getTableauInfestation(pc.obj), campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('beeoneAssistant').ferme.IDSociete)]).then(function(values) {
      pc.cultures = values[0].data;
      pc.Varietes = values[1].data;
      pc.TrancheAges = values[2].data;
      pc.AlertesRavageurs = values[3].data;
      pc.TableauInfestation = values[4].data;
      pc.compagne_array = values[5].data;
      pc.loadWidgets(pc.AlertesRavageurs, pc.TableauInfestation);
      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#age").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
      }, 1000);
      NProgress.done();
    });

    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_monitoring_AlertesRavageurs = data.tb_technique_monitoring_AlertesRavageurs;
      $scope.tb_technique_monitoring_TableauInfestation = data.tb_technique_monitoring_TableauInfestation;
      $scope.tb_technique_monitoring_GraphiqueInfestation = data.tb_technique_monitoring_GraphiqueInfestation;
    })

    pc.loadWidgets = (data_AlertesRavageurs, data_TableauInfestation) => {
      pc.loadAlertesRavageurs(data_AlertesRavageurs);
      pc.loadTableauInfestation(data_TableauInfestation);
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
    }]


    pc.loadAlertesRavageurs = async (data) => {
      var modeldataTableauAlertesRavageurs = [{
        "ref": {
          type: "String"
        },
        "Code_Piege": {
          type: "String"
        },
        "Cible": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "DateCreated": {
          type: "date string"
        },
        "Nombre_Insecte": {
          type: "number"
        }
      }];
      Pivot_TableauAlertesRavageurs = new Flexmonster({
        container: "#wdr-Pivot_TableauAlertesRavageurs",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauAlertesRavageurs.concat(data)
          },
          options: {
            grid: {
              type: "classic",
              showTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: formatpuvot,
          slice: {
            rows: [{
              uniqueName: "ref",
              caption: await translatedwords.getTranslatedWord($translate("Parcelle")),
              sort: "ref"
            }, {
              uniqueName: "Code_Piege",
              caption: await translatedwords.getTranslatedWord($translate("Piège")),
              sort: "Code_Piege"
            }, {
              uniqueName: "Cible",
              caption: await translatedwords.getTranslatedWord($translate("Cible")),
              sort: "Cible"
            }, {
              uniqueName: "DateCreated",
              caption: await translatedwords.getTranslatedWord($translate("Date d'observation")),
              sort: "DateCreated"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
              uniqueName: "Nombre_Insectes",
              format: "format_number",
              caption: await translatedwords.getTranslatedWord($translate("Nombre des insectes")),
              formula: "sum('Nombre_Insecte')"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauAlertesRavageurs.expandAllData();

    }


    pc.loadTableauInfestation = async (data) => {
      var modeldataTableauInfestation = [{
        "Variete": {
          type: "String"
        },
        "Code": {
          type: "String"
        },
        "Cible": {
          type: "String"
        },
        "Nombre_Insecte": {
          type: "number"
        }
      }];
      Pivot_TableauInfestation = new Flexmonster({
        container: "#wdr-Pivot_TableauInfestation",
        componentFolder: "https://cdn.flexmonster.com/",
        width: "100%",
        height: 300,
        toolbar: false,
        report: {
          dataSource: {
            data: modeldataTableauInfestation.concat(data)
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
            }, {
              uniqueName: "Code",
              caption: await translatedwords.getTranslatedWord($translate("Age")),
              sort: "Code"
            }],
            columns: [{
              uniqueName: "[Measures]"
            }, {
              uniqueName: "Cible",
              caption: await translatedwords.getTranslatedWord($translate("Cible (%)"))
            }],
            measures: [{
              uniqueName: "Nombre_Insecte",
              format: "format_number_percent",
              caption: await translatedwords.getTranslatedWord($translate("Moyen")),
              formula: "SUM('Nombre_Insecte')"
            }]
          }
        },
        reportcomplete: function() {
          Pivot_TableauInfestation.off("reportcomplete");
          google.charts.load('current', {
            packages: ['corechart']
          });
          google.charts.setOnLoadCallback(function() {
            drawChartTableauInfestation(data)
          });
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      Pivot_TableauInfestation.expandAllData();

    }

    function drawChartTableauInfestation(_data) {


      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Cible');
      data.addColumn('string', 'VarieteCode');
      data.addColumn('number', 'Nombre_Insecte');

      angular.forEach(_data, function(value, key) {
        data.addRow([
          value.Cible,
          value.VarieteCode,
          value.Nombre_Insecte
        ]);
      });

      if (_data.length == 0) {
        data.addRow([
          "",
          "",
          0
        ]);
      }


      var groupData = google.visualization.data.group(
        data,
        [1, 0],
        [{
          column: 2,
          aggregation: google.visualization.data.sum,
          type: 'number',
          label: "Nombre_Insecte"
        }]
      );


      // create data view
      var view = new google.visualization.DataView(groupData);

      // sum column array
      var aggColumns = [];

      // use date as first view column
      var viewColumns = [0];

      // build view & agg columns for each person
      groupData.getDistinctValues(1).forEach(function(gender, index) {
        // add view column for each person
        viewColumns.push({
          calc: function(dt, row) {
            if (dt.getValue(row, 1) === gender) {
              return dt.getValue(row, 2);
            }
            return null;
          },
          label: gender,
          type: 'number'
        });

        // add sum column for each person
        aggColumns.push({
          aggregation: google.visualization.data.sum,
          column: index + 1,
          label: gender,
          type: 'number'
        });
      });

      // set view columns
      view.setColumns(viewColumns);

      // sum view by date
      var aggData = google.visualization.data.group(
        view,
        [0],
        aggColumns
      );


      var widthChart = (aggData.getNumberOfRows() <= 8) ? 8 : aggData.getNumberOfRows();
      var options = {
        legend: {
          position: 'top',
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
          title: "%",
          logScale: true,
          viewWindow: {
            min: 0
          },
          textStyle: {
            fontSize: 10 // or the number you want
          }
        },
        explorer: {
          actions: ['dragToZoom', 'rightClickToReset'],
          axis: 'horizontal',
          keepInBounds: true,
          maxZoomIn: 4.0
        }
        /*,
                width: aggData.getNumberOfRows() * 130,
                bar: {
                  groupWidth: 120
                }*/
      };


      var chart = new google.visualization.ColumnChart(document.getElementById('googlechart-container-column-TableauInfestation'));
      chart.draw(aggData, options);

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

    $scope.exportData = (type, num) => {
      if (num == 1) {
        Pivot_TableauAlertesRavageurs.exportTo(type, {
          filename: "Alertes ravageurs",
          excelSheetName: "Alertes ravageurs",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      } else {
        Pivot_TableauInfestation.exportTo(type, {
          filename: "Tableau du % d'infestation",
          excelSheetName: "Tableau du % d'infestation",
          pageFormat: "A0",
          pageOrientation: "landscape",
        });
      }
    }

    pc.search = () => {
      $q.all([tbTechnique.getAlertesRavageurs(pc.obj), tbTechnique.getTableauInfestation(pc.obj)]).then(function(values) {
        pc.AlertesRavageurs = values[0].data;
        pc.TableauInfestation = values[1].data;
        pc.loadWidgets(pc.AlertesRavageurs, pc.TableauInfestation);
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

        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {}), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {

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