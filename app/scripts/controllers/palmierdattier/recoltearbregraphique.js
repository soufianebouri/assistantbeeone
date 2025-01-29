'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierRecoltearbregraphiqueCtrl
 * @description
 * # PalmierdattierRecoltearbregraphiqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierRecoltearbregraphiqueCtrl', function($q, Arbre, savefilter, translatedwords, campagneagricole, toastr, recolteArbre, $window, $translatePartialLoader, $translate, societe, $state, _url, $mdDialog, VarieteService, parcellecultural, cultureService, $cookies, portGreffe, FermeService, $scope, bilanHydrique, ApportEau, getsuperficie) {
    var pc = this;
    var chartapportmensuel;

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      VARIETE: [0],
      ARBRE: [0],
      PARCELLE: [0],
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD'),
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#compagne").selectpicker('refresh');
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#arbre").selectpicker('refresh');
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



    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete),
      cultureService.getCultureByFerme(pc.obj.FERME),
      VarieteService.showVarieteByCultureFerme(pc.obj),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
    ]).then((values) => {
      pc.compagne_array = values[0].data;
      pc.culture_array = values[1].data;
      pc.variete_array = values[2].data;
      pc.parcelles_array = values[3].data;

      angular.forEach(pc.compagne_array, function(value, key) {

        if (!angular.equals(savefilter.getFilters(), {})) {
          if (moment($scope.date_debut).isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            setTimeout(function() {
              $('#compagne').selectpicker('val', value.ID_compagne);
              $(".selectpicker").selectpicker('refresh');
            }, 100);
          } else {
            setTimeout(function() {
              $(".selectpicker").selectpicker('refresh');
            }, 100);
          }
        }

        if (angular.equals(savefilter.getFilters(), {}) && moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          setTimeout(function() {
            $('#compagne').selectpicker('val', value.ID_compagne);
            $(".selectpicker").selectpicker('refresh');
            pc.obj.DATE_DEBUT = moment(value.Date_debut).format('YYYYMMDD');
            pc.obj.DATE_FIN = moment(value.Date_Fin).format('YYYYMMDD');

            $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
            $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
          }, 100);
        }
      });
      NProgress.done();
    });

    pc.compagne_change = () => {
      if ($scope.compagne) {
        var canGo = true;
        angular.forEach(pc.compagne_array, (v, k) => {
          if (canGo && v.ID_compagne == $scope.compagne) {
            canGo = false;
            pc.obj.DATE_DEBUT = moment(v.Date_debut).format('YYYYMMDD');
            pc.obj.DATE_FIN = moment(v.Date_Fin).format('YYYYMMDD');

            savefilter.setFilters(pc.obj);
            $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
            $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
            savefilter.setFilters(pc.obj);
          }
        });
      }
    }

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
        pc.obj.ARBRE = [0];
        pc.arbres = [];
        $q.all([Arbre.getByParcelleDomaine({
          DOMAINE: pc.obj.FERME,
          PARCELLE_CULTURAL: pc.obj.PARCELLE
        })]).then((values) => {
          pc.arbres = values[0].data;
          setTimeout(function() {
            $("#arbre").selectpicker('refresh');
            $('#arbre').selectpicker('deselectAll');
            NProgress.done();
          }, 100);
        });
      } else {
        pc.obj.PARCELLE = [0];
        pc.obj.ARBRE = [0];
        pc.arbres = [];
        setTimeout(function() {
          $("#arbre").selectpicker('refresh');
          $('#arbre').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      }
    }

    pc.culture_change = () => {
      NProgress.start();
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.culture = $scope.culture;
        pc.obj.VARIETE = [0];
        pc.obj.PARCELLE = [0];
        pc.obj.ARBRE = [0];
        pc.arbres = [];
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
        pc.obj.ARBRE = [0];
        pc.arbres = [];
        pc.getsuperficie();
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

    pc.arbre_change = () => {
      if ($scope.arbre && $scope.arbre.length > 0 && !$scope.arbre.includes(0)) {
        pc.obj.ARBRE = $scope.arbre;
      } else {
        pc.obj.arbre = [0];
      }
    }


    $scope.search = async () => {
      toastr.clear();
      if (pc.obj.DATE_DEBUT && pc.obj.DATE_FIN) {
        $q.all([recolteArbre.getforgraphJournalier(pc.obj),
          recolteArbre.getforgraphMensuel(pc.obj),
          recolteArbre.getforgraphQuantiteTotal(pc.obj),
          recolteArbre.getforgraphByParcelle(pc.obj),
          recolteArbre.getforgraphNbrArbreRecolte(pc.obj),
          recolteArbre.getforgraphNbrArbreTotal(pc.obj)
        ]).then((values) => {
          NProgress.done();
          $scope.loadJournalier(values[0].data);
          $scope.loadMensuel(values[1].data);
          $scope.quantitetotal = values[2].data[0].Quantite / 1000;
          $scope.loadByParcelle(values[3].data);
          $scope.NbrArbreRecolte = values[4].data[0].NbrArbreRecolte;
          $scope.nbrArbreTotal = values[5].data[0].nbrArbreTotal;
        });
      } else {
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez sélectionner une periode")), {
          closeButton: true
        });
      }

    }

    setTimeout(function() {
      $scope.search();
    }, 2000);

    $scope.loadJournalier = (data) => {
      am4core.ready(function() {
        var chart = am4core.create("chartdiv_journalier", am4charts.XYChart);
        // Add data
        angular.forEach(data, (v, k) => {
          chart.data.push({
            "date": moment(v.Date).format('YYYY-MM-DD'),
            "value": v.Quantite
          });
        });

        // Set input format for the dates
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.parseDates = true;
        valueAxis.dashLength = 1;
        valueAxis.equalSpacing = true;
        valueAxis.minorGridEnabled = true;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.tooltipText = "{value}"
        series.strokeWidth = 2;
        series.minBulletDistance = 15;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";

        series.connect = false;

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        // Make a panning cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panXY";
        chart.cursor.snapToSeries = series;

        // Create vertical scrollbar and place it before the value axis
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarY.parent = chart.leftAxesContainer;
        chart.scrollbarY.toBack();

        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        dateAxis.start = 0.79;
        dateAxis.keepSelection = true;
      });
    }



    $scope.loadMensuel = (data) => {
      am4core.ready(function() {
        //HNA
        // Create chart instance
        am4core.useTheme(am4themes_animated);
        chartapportmensuel = null;
        chartapportmensuel = am4core.create("chartdiv_mensuel", am4charts.XYChart);
        chartapportmensuel.scrollbarX = new am4core.Scrollbar();

        chartapportmensuel.scrollbarY = new am4core.Scrollbar();
        chartapportmensuel.scrollbarY.parent = chartapportmensuel.leftAxesContainer;
        chartapportmensuel.scrollbarY.toBack();
        // Add data
        angular.forEach(data, (v, k) => {
          chartapportmensuel.data.push({
            "date": v.Y + " / " + v.M,
            "value": v.Quantite / 1000
          });
        });
        // Set input format for the dates
        //chartapportmensuel.dateFormatter.inputDateFormat = "yyyy/MM";

        var categoryAxis = chartapportmensuel.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;


        var valueAxis = chartapportmensuel.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.integersOnly = true;
        valueAxis.maxPrecision = 0;

        // Create series
        var series = chartapportmensuel.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "date";
        series.tooltipText = `[bold]Mois {date}[/]
      ----
      Quantité (T): {value}`;

        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        chartapportmensuel.exporting.menu = new am4core.ExportMenu();

        chartapportmensuel.scrollbarX = new am4core.Scrollbar();
        chartapportmensuel.scrollbarX.parent = chartapportmensuel.bottomAxesContainer;

        // Cursor
        chartapportmensuel.cursor = new am4charts.XYCursor();

      });
    }


    $scope.loadByParcelle = (data) => {
      am4core.ready(function() {
        //HNA
        // Create chart instance
        am4core.useTheme(am4themes_animated);
        chartapportmensuel = null;
        chartapportmensuel = am4core.create("chartdiv_parcelle", am4charts.XYChart);
        chartapportmensuel.scrollbarX = new am4core.Scrollbar();

        chartapportmensuel.scrollbarY = new am4core.Scrollbar();
        chartapportmensuel.scrollbarY.parent = chartapportmensuel.leftAxesContainer;
        chartapportmensuel.scrollbarY.toBack();
        // Add data
        angular.forEach(data, (v, k) => {
          chartapportmensuel.data.push({
            "RefParcelleCulturale": v.RefParcelleCulturale,
            "value": v.Quantite
          });
        });
        // Set input format for the dates
        //chartapportmensuel.dateFormatter.inputDateFormat = "yyyy/MM";

        var categoryAxis = chartapportmensuel.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "RefParcelleCulturale";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;


        var valueAxis = chartapportmensuel.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.integersOnly = true;
        valueAxis.maxPrecision = 0;

        // Create series
        var series = chartapportmensuel.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "RefParcelleCulturale";
        series.tooltipText = `[bold]Parcelle culturale : {RefParcelleCulturale}[/]
      ----
      Quantité (Kg): {value}`;

        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        chartapportmensuel.exporting.menu = new am4core.ExportMenu();

        chartapportmensuel.scrollbarX = new am4core.Scrollbar();
        chartapportmensuel.scrollbarX.parent = chartapportmensuel.bottomAxesContainer;

        // Cursor
        chartapportmensuel.cursor = new am4charts.XYCursor();

      });
    }




  });