'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TbrendementCtrl
 * @description
 * # TbrendementCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TbrendementCtrl', function($scope, $http, $cookies, translatedwords, tbrendement, campagneagricole, $q, cultureService, VarieteService, $translatePartialLoader, $translate, $window) {

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.obj = {
      DateDebutCampagne: "",
      DateFinCampagne: "",
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      VARIETE: [0]
    };

    $scope.load = () => {

      campagneagricole.getCampagneAgricole().then(e => {
        angular.forEach(e.data, function(value, key) {
          if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            $scope.obj.current_campagne = value.Code;
            $scope.obj.DateDebutCampagne = moment(value.Date_debut).format('YYYYMMDD');
            $scope.obj.DateFinCampagne = moment(value.Date_Fin).format('YYYYMMDD');
          }
        });

        tbrendement.getCultureSuperficie($scope.obj).then(function(response) {
          if (response.data.length > 0) {
            $scope.CultureSuperficie = parseFloat(response.data[0].superficie).toFixed(2);
          } else {
            $scope.CultureSuperficie = 0;
          }
        });

        tbrendement.getRecolteADate($scope.obj).then(function(response) {
          if (response.data.length > 0) {
            $scope.RecolteADate = parseFloat(response.data[0].Tonnage).toFixed(2);

          } else $scope.RecolteADate = 0;
        });

        tbrendement.getRecolteToday($scope.obj).then(function(response) {
          if (response.data.length > 0) {
            $scope.RecolteToday = parseFloat(response.data[0].KG).toFixed(2);
          } else $scope.RecolteToday = 0;
        });

        tbrendement.getRecolteByCulture($scope.obj).then(function(response) {

          NProgress.done();
          var chart = am4core.create("chartdivtonnage", am4charts.XYChart);
          $scope.RecolteByCulture = response.data;
          if ($scope.RecolteByCulture.length > 0) {
            chart.data = $scope.RecolteByCulture;
          } else {
            chart.data = [{
              Culture: "",
              Tonnage: 0
            }]
          }

          am4core.useTheme(am4themes_animated);
          // Themes en

          // Add percent sign to all numbers
          chart.numberFormatter.numberFormat = "#.##' T'";
          chart.scrollbarX = new am4core.Scrollbar();
          chart.scrollbarX.parent = chart.bottomAxesContainer;

          chart.exporting.menu = new am4core.ExportMenu();

          // Create axes
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "Culture";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 30;

          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

          // Create series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = "Tonnage";
          series.dataFields.categoryX = "Culture";
          series.clustered = false;
          series.tooltipText = "{categoryX} : [bold]{valueY}[/]";
          series.stroke = am4core.color("#91cc87");
          series.columns.template.fill = am4core.color("#91cc87");

          chart.cursor = new am4charts.XYCursor();
          chart.cursor.lineX.disabled = true;
          chart.cursor.lineY.disabled = true;

          //}); // end am4core.ready()
        });

        tbrendement.getRecolteByVariete($scope.obj).then(function(response) {

          NProgress.done();
          var chart = am4core.create("chartdivtonnageVariete", am4charts.XYChart);
          $scope.RecolteByVariete = response.data;
          if ($scope.RecolteByVariete.length > 0) {
            chart.data = $scope.RecolteByVariete;
          } else {
            chart.data = [{
              Variete: "",
              Tonnage: 0
            }]
          }

          am4core.useTheme(am4themes_animated);
          // Themes en

          // Add percent sign to all numbers
          chart.numberFormatter.numberFormat = "#.##' T'";
          chart.scrollbarX = new am4core.Scrollbar();
          chart.scrollbarX.parent = chart.bottomAxesContainer;

          chart.exporting.menu = new am4core.ExportMenu();

          // Create axes
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "Variete";
          categoryAxis.renderer.grid.template.location = 0;
          categoryAxis.renderer.minGridDistance = 30;

          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

          // Create series
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = "Tonnage";
          series.dataFields.categoryX = "Variete";
          series.clustered = false;
          series.tooltipText = "{categoryX} : [bold]{valueY}[/]";
          series.stroke = am4core.color("#f5b833");
          series.columns.template.fill = am4core.color("#f5b833");

          chart.cursor = new am4charts.XYCursor();
          chart.cursor.lineX.disabled = true;
          chart.cursor.lineY.disabled = true;

          //}); // end am4core.ready()
        });
      });

    }

    $q.all([
      cultureService.getCultureByFerme($scope.obj.FERME),
      VarieteService.showVarieteByCultureFerme($scope.obj)
    ]).then((values) => {
      $scope.Cultures = values[0].data;
      $scope.Varietes = values[1].data;
      setTimeout(function() {
        //$("#culture").selectpicker('val', $scope.Cultures[0].ID);
        //$scope.obj.CULTURE = [$scope.Cultures[0].ID];
        $(".selectpicker").selectpicker('refresh');
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $scope.load();
      }, 1000);
      NProgress.done();
    });

    $scope.Culture_change = () => {
      if ($scope.CULTURE.length > 0 && !$scope.CULTURE.includes(0)) {
        $scope.obj.culture = $scope.CULTURE;
      } else {
        $scope.obj.culture = [0];
      }

      $q.all([VarieteService.showVarieteByCultureFerme($scope.obj)]).then((values) => {
        $scope.Varietes = values[0].data;

        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $('#variete').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });
    };

    $scope.Variete_change = () => {
      if ($scope.VARIETE.length > 0 && !$scope.VARIETE.includes(0)) {
        $scope.obj.VARIETE = $scope.VARIETE;
      } else {
        $scope.obj.VARIETE = [0];
      }
    };

    $scope.search = () => {
      $scope.load();
    }





  });