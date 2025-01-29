'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionControlephecChartCtrl
 * @description
 * # NutritionControlephecChartCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionControlephecChartCtrl', function($scope, translatedwords, VarieteService, $window, $translatePartialLoader, $translate, $q, controlephec, $cookies, parcellecultural, toastr, _url) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
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
      "PARCELLE_CULTURAL": 0,
      "DATE_DEBUT": moment($scope.date_fin).format('YYYYMMDD'),
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };



    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      renderData([]);
      NProgress.done();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
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
      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0) {
        $scope.parcelle_sel = 0;
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
        NProgress.done();
      }
      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
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

    pc.search = async function() {
      if (pc.obj.PARCELLE_CULTURAL == 0) {
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
          closeButton: true
        });
      } else {
        $q.all([controlephec.getForGraphe(pc.obj)]).then(function(values) {
          renderData(values[0].data);
          NProgress.done();
        });
      }
    }

    function renderData(data) {
      var titlevr = "";
      if (data.length == 0) {
        titlevr = "Sorry, Data Not Available, Please Check The Filtre Settings";
        data = [{
          date: moment().format('YYYYMMDD'),
          volume_apport: 0,
          volume_drainage: 0
        }]
      }


      //metio30js chart
      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.data = data;
      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());


      var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis1.title.text = "Volume";

      var title = chart.titles.create();
      title.text = titlevr;

      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "volume_apport";
      series1.dataFields.dateX = "date";
      series1.name = "Volume apport";
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
      series2.dataFields.valueY = "volume_drainage";
      series2.dataFields.dateX = "date";
      series2.name = "Volume drainage";
      series2.strokeWidth = 2;
      series2.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series2.stroke = am4core.color("#f2b330");
      series2.tooltip.getFillFromObject = false;
      series2.tooltip.background.fill = am4core.color("#f2b330");

      var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
      bullet2.circle.radius = 3;
      bullet2.circle.strokeWidth = 2;
      bullet2.circle.fill = am4core.color("#fff");





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