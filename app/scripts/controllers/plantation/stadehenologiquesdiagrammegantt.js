'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PlantationStadehenologiquesdiagrammeganttCtrl
 * @description
 * # PlantationStadehenologiquesdiagrammeganttCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PlantationStadehenologiquesdiagrammeganttCtrl', function($q, translatedwords, campagneagricole, $translatePartialLoader, $window, $translate, societe, $state, _url, $mdDialog, parcellecultural, cultureService, $cookies, $scope, StadePheno) {
    var pc = this;
    var chartapportmensuel;
    $scope.ifoundit = false;
    pc.obj = {
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      PARCELLE: [0],
      DATE_DEBUT: 0,
      DATE_FIN: 0,
      VARIETE: [0]
    };
    NProgress.start();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete),
      cultureService.getCultureByFerme(pc.obj.FERME),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME)
    ]).then((values) => {
      pc.compagne_array = values[0].data;
      pc.culture_array = values[1].data;
      pc.parcelles_array = values[2].data;
      setTimeout(function() {
        $('#compagne').selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $("#culture").selectpicker('refresh');
      }, 1000);
      angular.forEach(pc.compagne_array, function(value, key) {
        if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd')) && !$scope.ifoundit) {
          setTimeout(function() {
            $('#compagne').selectpicker('val', value.ID_compagne);
            $(".selectpicker").selectpicker('refresh');
            pc.obj.DATE_DEBUT = moment(value.Date_debut).format('YYYYMMDD');
            pc.obj.DATE_FIN = moment(value.Date_Fin).format('YYYYMMDD');
            $scope.ifoundit = true;
            $scope.search();
          }, 100);
        }
      });
    });

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
        pc.obj.PARCELLE = [0];
      } else {
        pc.obj.culture = [0];
      }

      $q.all([
        parcellecultural.getParcelleByVarieteCulture(pc.obj)
      ]).then((values) => {
        pc.parcelles_array = values[0].data;

        setTimeout(function() {
          $("#parcelle").selectpicker('refresh');
          $('#parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });

    }




    $scope.search = () => {
      $q.all([StadePheno.diagrammegantt(pc.obj)]).then((values) => {
        pc.diagrammeDate = values[0].data;
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 30;
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

        var colorSet = new am4core.ColorSet();
        colorSet.saturation = 0.4;

        chart.data = pc.diagrammeDate;

        chart.dateFormatter.dateFormat = "yyyy-MM-dd";
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "code";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.inversed = true;
        categoryAxis.title.text = "Stades phénologiques";
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 70;
        dateAxis.baseInterval = {
          count: 1,
          timeUnit: "day"
        };
        // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
        //dateAxis.strictMinMax = true;
        dateAxis.renderer.tooltipLocation = 0;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.height = am4core.percent(70);
        series1.columns.template.tooltipText = "{code} : [bold]{openDateX}[/] - [bold]{dateX}[/]";

        series1.dataFields.openDateX = "min_Date_Constatation";
        series1.dataFields.dateX = "max_Date_Constatation";
        series1.dataFields.categoryY = "code";
        series1.columns.template.propertyFields.fill = "CouleurCalque"; // get color from data
        series1.columns.template.propertyFields.stroke = "CouleurCalque";
        series1.columns.template.strokeOpacity = 1;

        chart.scrollbarX = new am4core.Scrollbar();

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";

        NProgress.done();
      });
    }






  });