'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierGraphgrossissementsuividecalibreCtrl
 * @description
 * # PalmierdattierGraphgrossissementsuividecalibreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierGraphgrossissementsuividecalibreCtrl', function($scope, translatedwords, VarieteService, $window, $translatePartialLoader, $translate, $q, $cookies, grossissementsuividecalibre, parcellecultural, toastr, Arbre, _url) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#Arbre").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "VARIETE": [0],
      "PARCELLE_CULTURAL": [0],
      "Arbre": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), grossissementsuividecalibre.getForGraphe(pc.obj),
      VarieteService.showVarieteByCultureFerme({
        FERME: pc.IDFerme,
        culture: [0]
      })
    ]).then(function(values) {
      pc.parcellescultural = values[0].data;
      renderData(values[1].data);
      pc.variete_array = values[2].data;
      NProgress.done();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#Arbre").selectpicker('refresh');
      }, 1000);
    });

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //by parcelle cultural
    $scope.parcelle_change = function() {
      pc.arbres = [0];
      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
        pc.arbres = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
        $q.all([Arbre.getArbreByParcelle({
          DOMAINE: pc.IDFerme,
          PARCELLE_CULTURAL: [$scope.parcelle_sel]
        })]).then(function(values) {
          pc.arbres = values[0].data;
          NProgress.done();
          $('.selectpicker').prop('disabled', false);
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
        });
      }
      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
    };

    pc.variete_change = () => {
      NProgress.start();
      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.VARIETE = $scope.variete;
        pc.obj.PARCELLE = [0];
        pc.obj.Arbre = [0];
      } else {
        pc.obj.VARIETE = [0];
      }

      $q.all([parcellecultural.getParcelleByVarieteCulture({
        culture: [0],
        VARIETE: pc.obj.VARIETE,
        FERME: pc.IDFerme
      })]).then((values) => {
        pc.parcellescultural = values[0].data;
        setTimeout(function() {
          $("#Parcelle").selectpicker('refresh');
          $('#Parcelle').selectpicker('deselectAll');
          $("#Arbre").selectpicker('refresh');
          $('#Arbre').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });
    }

    //by arbre
    $scope.arbre_change = function() {
      if ($scope.Arbre === null || $scope.arbre.arbre === "" || $scope.arbre.arbre === undefined || $scope.arbre.arbre === 0 || $scope.arbre.arbre === "0" || !$scope.arbre.arbre || $scope.arbre.arbre.length === 0 || $scope.arbre.arbre.includes(0)) {
        $scope.arbre_sel = [0];
        pc.arbres = [0];
      } else {
        $scope.arbre_sel = $scope.arbre.arbre;
      }
      pc.obj.Arbre = $scope.arbre_sel;
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

    pc.search = function() {

      $q.all([grossissementsuividecalibre.getForGraphe(pc.obj)]).then(function(values) {
        renderData(values[0].data);
        NProgress.done();
      });
    }

    function renderData(data) {
      var titlevr = "";
      if (data.length == 0) {
        titlevr = "Sorry, Data Not Available, Please Check The Filtre Settings";
      }


      //metio30js chart
      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.data = data;
      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      //dateAxis.renderer.grid.template.location = 0;
      //dateAxis.renderer.minGridDistance = 30;

      var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis1.title.text = "Evolution";

      var title = chart.titles.create();
      title.text = titlevr;

      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "Moyenne_calibre";
      series1.dataFields.dateX = "DateCreated";
      series1.name = "Moyenne Calibre";
      series1.strokeWidth = 2;
      series1.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series1.stroke = am4core.color("#97cf8d");
      series1.tooltip.getFillFromObject = false;
      series1.tooltip.background.fill = am4core.color("#97cf8d");

      var bullet1 = series1.bullets.push(new am4charts.CircleBullet());
      bullet1.circle.radius = 3;
      bullet1.circle.strokeWidth = 2;
      bullet1.circle.fill = am4core.color("#fff");

      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "Calibre_Min";
      series2.dataFields.dateX = "DateCreated";
      series2.name = "Min Calibre";
      series2.strokeWidth = 2;
      series2.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series2.stroke = am4core.color("#f2b330");
      series2.tooltip.getFillFromObject = false;
      series2.tooltip.background.fill = am4core.color("#f2b330");

      var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.radius = 3;
      bullet2.circle.strokeWidth = 2;
      bullet2.circle.fill = am4core.color("#fff");

      var series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueY = "Calibre_Max";
      series3.dataFields.dateX = "DateCreated";
      series3.name = "Max Calibre";
      series3.strokeWidth = 2;
      series3.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series3.stroke = am4core.color("#68b7dc");
      series3.tooltip.getFillFromObject = false;
      series3.tooltip.background.fill = am4core.color("#68b7dc");

      var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");




      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      chart.exporting.menu = new am4core.ExportMenu();

      // Add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = "top";

      // Add scrollbar
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series1);
      chart.scrollbarX.parent = chart.bottomAxesContainer;

    }

  });