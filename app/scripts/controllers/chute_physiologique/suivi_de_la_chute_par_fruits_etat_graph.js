'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatGraphCtrl
 * @description
 * # ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatGraphCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ChutePhysiologiqueSuiviDeLaChuteParFruitsEtatGraphCtrl', function($q, translatedwords, ChutePhysiologique, campagneagricole, $window, $translatePartialLoader, $translate, societe, $state, _url, $mdDialog, VarieteService, parcellecultural, cultureService, $cookies, portGreffe, FermeService, $scope, bilanHydrique, ApportEau, savefilter) {
    var pc = this;
    var chartapportmensuel;

    $scope.loadingData = false;

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.date_debut = moment(moment().subtract(15, 'd').format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      VARIETE: [0],
      GREFF: [0],
      PARCELLE: [0],
      DATE_DEBUT: moment().subtract(15, 'd').format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD')
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#port_greff").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      NProgress.done();
    }, 100);

    NProgress.start();

    pc.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }


    $scope.loadingData = true;
    $q.all([
      cultureService.getCultureByFerme(pc.obj.FERME),
      portGreffe.getPortGreffe(),
      VarieteService.showVarieteByCultureFerme(pc.obj),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
      ChutePhysiologique.getChuteFruits_forgraph(pc.obj)
    ]).then((values) => {
      pc.culture_array = values[0].data;
      pc.port_greffs_array = values[1].data;
      pc.variete_array = values[2].data;
      pc.parcelles_array = values[3].data;
      pc.ChuteFruits_forgraph = values[4].data;
      pc.createChart(pc.ChuteFruits_forgraph)
      $scope.loadingData = false;

      setTimeout(function() {
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#port_greff").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
      }, 1000);

      NProgress.done();
    });


    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
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


    $scope.search = () => {
      NProgress.start();

      $q.all([ChutePhysiologique.getChuteFruits_forgraph(pc.obj)]).then((values) => {
        pc.ChuteFruits_forgraph = values[0].data;

        pc.createChart(pc.ChuteFruits_forgraph)
        NProgress.done();
      });


    }



    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_chutte_day");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
      })
    );




    /*if (data.length === 0) {
    chart.children.unshift(am5.Label.new(root, {
      text: "No data available, Please check your filters",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));
    }  */


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: "dd/MM/yyyy"
      })
    );

    var yAxis0 = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    yAxis0.children.moveValue(am5.Label.new(root, {
      rotation: -90,
      text: "Moyenne journalière des fruits",
      y: am5.p50,
      centerX: am5.p50
    }), 0);

    var yRenderer1 = am5xy.AxisRendererY.new(root, {
      opposite: true
    });
    yRenderer1.grid.template.set("forceHidden", true);

    var yAxis1 = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: yRenderer1,
        syncWithAxis: yAxis0
      })
    );

    yAxis1.children.moveValue(am5.Label.new(root, {
      rotation: 90,
      text: "Cumul du nombre des fruits",
      y: am5.p50,
      centerX: am5.p50
    }), 1);

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var columnSeries1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Avec Calice",
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis0,
        valueYField: "avg_chute_avec_calice",
        valueXField: "date",

        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      })
    );

    columnSeries1.columns.template.setAll({
      width: am5.percent(60),
      fillOpacity: 0.5,
      strokeOpacity: 0
    });


    columnSeries1.data.processor = am5.DataProcessor.new(root, {
      dateFields: ["date"],
      dateFormat: "yyyy-MM-dd"
    });



    var columnSeries0 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Sans Calice",
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis0,
        valueYField: "avg_chute_sans_calice",
        valueXField: "date",

        stroke: am5.color("#eeae2d"),
        fill: am5.color("#eeae2d"),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      })
    );

    columnSeries0.columns.template.set("width", am5.percent(60));

    var series0 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Cumul",
        xAxis: xAxis,
        yAxis: yAxis1,
        valueYField: "cumul",
        valueXField: "date",
        stroke: am5.color("#97cf8d"),
        fill: am5.color("#97cf8d"),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      })
    );

    series0.strokes.template.setAll({
      strokeWidth: 2
    });

    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series0.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          stroke: series0.get("fill"),
          strokeWidth: 2,
          fill: root.interfaceColors.get("background"),
          radius: 5
        })
      });
    });



    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets


    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    var scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 60
    }));

    var sbDateAxis = scrollbar.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: {
          timeUnit: "day",
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );

    var sbValueAxis0 = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    var sbValueAxis1 = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    var sbSeries0 = scrollbar.chart.series.push(
      am5xy.ColumnSeries.new(root, {
        valueYField: "avg_chute_sans_calice",
        valueXField: "date",
        xAxis: sbDateAxis,
        yAxis: sbValueAxis0
      })
    );

    sbSeries0.columns.template.setAll({
      fillOpacity: 0.5,
      strokeOpacity: 0
    });

    var sbSeries1 = scrollbar.chart.series.push(
      am5xy.LineSeries.new(root, {
        valueYField: "cumul",
        valueXField: "date",
        xAxis: sbDateAxis,
        yAxis: sbValueAxis1
      })
    );

    var legend = chart.children.push(
      am5.Legend.new(root, {
        x: am5.p50,
        centerX: am5.p50
      })
    );

    pc.createChart = (data) => {
      if (data.length == 0) {
        data = {
          date: moment().format("YYYY-MM-DD"),
          avg_chute_avec_calice: 0,
          avg_chute_sans_calice: 0,
          cumul: 0
        }
      }

      legend.data.setAll(chart.series.values);

      columnSeries1.data.setAll(data);
      columnSeries0.data.setAll(data);

      series0.data.setAll(data);

      sbSeries0.data.setAll(data);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series0.appear(1000);
      chart.appear(1000, 100);



    }








  });