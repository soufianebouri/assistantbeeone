'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAnalysequalitativesimplifiedchartCtrl
 * @description
 * # RecolteAnalysequalitativesimplifiedchartCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAnalysequalitativesimplifiedchartCtrl', function($scope, translatedwords, $translate, fermete, $filter, $translatePartialLoader, $window, campagneagricole,
    DTOptionsBuilder, NiveauColorationService, DTColumnBuilder, $q, _url, $compile, analyseQualitative, analyseQualitativesimplified, parcellecultural, $cookies, $state, DTDefaultOptions, $mdDialog, toastr) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
    pc.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;
    pc.IDferme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('beeoneAssistant').ferme.IDSociete;


    analyseQualitative.getmodeAnalyseQualitative({
      farm: pc.IDferme
    }).then(function(result) {
      NProgress.done();
      try {
        if (!result.data[0].mode_analyse_qualitative) {
          $state.go('analyseQualitative');
        }
      } catch (e) {
        $state.go('analyseQualitative');
      }

    }).catch(async e => {
      NProgress.done();
      toastr.clear();
      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
        closeButton: true
      });
    });

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('beeoneAssistant').assistUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'analyse_qualitative'
    });

    //toggle filter show
    pc.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    pc.ReverseDisplay('filter_form');

    pc.obj = {
      "DOMAINE": pc.IDferme,
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };


    analyseQualitative.getmodeAnalyseQualitative({
      farm: pc.IDferme
    }).then(function(result) {
      try {
        if (!result.data[0].mode_analyse_qualitative) {
          $state.go('analyseQualitative');
        }
      } catch (e) {
        $state.go('analyseQualitative');
      }

    }).catch(async e => {
      toastr.clear();
      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
        closeButton: true
      });
    });

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('beeoneAssistant').ferme.IDFerme), analyseQualitativesimplified.getforgraph(pc.obj)]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();
      pc.createChart(values[1].data)
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, 1000);
    });






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
      text: "",
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
      text: "",
      y: am5.p50,
      centerX: am5.p50
    }), 1);

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var columnSeries1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "",
        xAxis: xAxis,
        yAxis: yAxis0,
        stroke: am5.color("#f8f8f9"),
        fill: am5.color("#f8f8f9"),
        valueYField: "",
        valueXField: "date",
      })
    );


    columnSeries1.data.processor = am5.DataProcessor.new(root, {
      dateFields: ["date"],
      dateFormat: "yyyy-MM-dd"
    });




    var series0 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Taux de jus",
        xAxis: xAxis,
        yAxis: yAxis0,
        valueYField: "Tauxjus",
        valueXField: "date",
        stroke: am5.color("#f3ab06"),
        fill: am5.color("#f3ab06"),
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


    //series 1
    var series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Brix",
        xAxis: xAxis,
        yAxis: yAxis0,
        valueYField: "Brix",
        valueXField: "date",
        stroke: am5.color("#407605"),
        fill: am5.color("#407605"),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      })
    );

    series1.strokes.template.setAll({
      strokeWidth: 2
    });

    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series1.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          stroke: series1.get("fill"),
          strokeWidth: 2,
          fill: root.interfaceColors.get("background"),
          radius: 5
        })
      });
    });

    //series2
    var series2 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Acidite",
        xAxis: xAxis,
        yAxis: yAxis0,
        valueYField: "Acidite",
        valueXField: "date",
        stroke: am5.color("#2691dd"),
        fill: am5.color("#2691dd"),
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name}: {valueY}"
        })
      })
    );

    series2.strokes.template.setAll({
      strokeWidth: 2
    });

    // Add bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series2.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          stroke: series2.get("fill"),
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
          Tauxjus: 0,
          Brix: 0,
          Acidite: 0
        }
      }

      legend.data.setAll(chart.series.values);

      columnSeries1.data.setAll(data);


      series0.data.setAll(data);
      series1.data.setAll(data);
      series2.data.setAll(data);



      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series0.appear(1000);
      chart.appear(1000, 100);



    }




    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;



    };
    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');



    };

    //by date_fin
    pc.date_fin_change = function() {

      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');



    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.Search = function() {
      NProgress.start();

      $q.all([analyseQualitativesimplified.getforgraph(pc.obj)]).then((values) => {
        pc.createChart(values[0].data)
        NProgress.done();
      });
    }



  });
