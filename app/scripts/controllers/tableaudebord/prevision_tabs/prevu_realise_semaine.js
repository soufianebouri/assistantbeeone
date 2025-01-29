'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionTabsPrevuRealiseSemaineCtrl
 * @description
 * # PrevisionTabsPrevuRealiseSemaineCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionTabsPrevuRealiseSemaineCtrl', function($scope, $translatePartialLoader, $translate, $window,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    $compile,
    domaine, translatedwords,
    $cookies,
    PeriodeEstimation,
    societe,
    campagneagricole,
    TypeVarieteService,
    FermeService,
    VarieteService,
    parcellecultural,
    GroupeOperationnel,
    _url) {
    var pc = this;
    var pivot = {};
    pc.obj_prevu_realise_week = {
      "GO": [0],
      "multi": true,
      "idferme": [0],
      "VARIETE": [0],
      "TYPE_VARIETE": 0,
      "CAMPAGNE": {}
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $q.all([campagneagricole.getCampagneAgricole()]).then((values) => {
      var canGo = true;
      pc.campagne_prevu_realise_week_array = values[0].data;

      angular.forEach(values[0].data, function(value, key) {
        if (canGo && moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          $scope.currentCampagne = value.Code;
          canGo = false;
        }
      });

      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $('#campagne_prevu_realise_week').selectpicker('val', pc.campagne_prevu_realise_week_array[0].ID_compagne);
        $scope.campagne_prevu_realise_week = pc.campagne_prevu_realise_week_array[0].ID_compagne;
        loadAllDataSpinner_detail();
      }, 1000);
      NProgress.done();
    });

    //refresh ll picker
    setTimeout(function() {
      $("#societe_prevu_realise_week").selectpicker('refresh');
      $("#campagne_prevu_realise_week").selectpicker('refresh');
      $("#type_variete_prevu_realise_week").selectpicker('refresh');
      $("#domaine_prevu_realise_week").selectpicker('refresh');
      $("#group_operationnel_prevu_realise_week").selectpicker('refresh');
      $("#variete_prevu_realise_week").selectpicker('refresh');
    }, 100);
    //end refresh
    pc.societe_change_prevu_realise_week = () => {
      pc.type_variete_prevu_realise_week_array = [];
      pc.domaine_prevu_realise_week_array = [];
      pc.group_operationnel_prevu_realise_week_array = [];
      pc.variete_prevu_realise_week_array = [];
      $q.all([TypeVarieteService.showBySociete({
        ID_Societe: $scope.societe_prevu_realise_week
      })]).then((values) => {
        pc.type_variete_prevu_realise_week_array = values[0].data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          pc.loadDataPrevuRealise();
        }, 100);
        NProgress.done();
      });
    }

    pc.type_variete_prevu_realise_week_change = () => {
      pc.domaine_prevu_realise_week_array = [];
      pc.group_operationnel_prevu_realise_week_array = [];
      pc.variete_prevu_realise_week_array = [];

      if ($scope.type_variete_prevu_realise_week) {
        NProgress.start();
        pc.obj_prevu_realise_week.TYPE_VARIETE = $scope.type_variete_prevu_realise_week;
        FermeService.byTypeVariete({
          idfamille_variete: $scope.type_variete_prevu_realise_week
        }).then(e => {
          pc.domaine_prevu_realise_week_array = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 100);
        pc.obj_prevu_realise_week.TYPE_VARIETE = 0;
      }
    }

    pc.domaine_change_prevu_realise_week = () => {
      pc.group_operationnel_prevu_realise_week_array = [];
      pc.variete_prevu_realise_week_array = [];

      if ($scope.domaine_prevu_realise_week && $scope.domaine_prevu_realise_week.length > 0 && !$scope.domaine_prevu_realise_week.includes(0)) {
        pc.obj_prevu_realise_week.idferme = $scope.domaine_prevu_realise_week;
      } else {
        pc.obj_prevu_realise_week.idferme = [];
        angular.forEach(pc.domaine_prevu_realise_week_array, (v, k) => {
          pc.obj_prevu_realise_week.idferme.push(v.idfermes);
        });
      }
      if (pc.obj_prevu_realise_week.idferme.length > 0) {
        $q.all([VarieteService.getVarieteByFarm(pc.obj_prevu_realise_week), GroupeOperationnel.getGroupeOperationnelByProduitFerme(pc.obj_prevu_realise_week)]).then((values) => {
          pc.variete_prevu_realise_week_array = values[0].data;
          pc.group_operationnel_prevu_realise_week_array = values[1].data;

          setTimeout(function() {
            $("#group_operationnel_prevu_realise_week").selectpicker('refresh');
            $("#variete_prevu_realise_week").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $("#group_operationnel_prevu_realise_week").selectpicker('refresh');
          $("#variete_prevu_realise_week").selectpicker('refresh');
          NProgress.done();
        }, 100);
      }

    }

    pc.group_operationnel_prevu_realise_week_change = () => {
      NProgress.start();
      pc.variete_prevu_realise_week_array = [];
      if ($scope.group_operationnel_prevu_realise_week && $scope.group_operationnel_prevu_realise_week.length > 0 && !$scope.group_operationnel_prevu_realise_week.includes(0)) {
        pc.obj_prevu_realise_week.GO = $scope.group_operationnel_prevu_realise_week;
      } else {
        pc.obj_prevu_realise_week.GO = [];
        angular.forEach(pc.group_operationnel_prevu_realise_week_array, (v, k) => {
          pc.obj_prevu_realise_week.GO.push(v.IDGroupeCultural_Operationnel);
        });
      }

      if (pc.obj_prevu_realise_week.GO.length > 0) {
        $q.all([VarieteService.getVarieteByFermeGroup(pc.obj_prevu_realise_week)]).then((values) => {
          pc.variete_prevu_realise_week_array = values[0].data;
          setTimeout(function() {
            $("#variete_prevu_realise_week").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $("#variete_prevu_realise_week").selectpicker('refresh');
          NProgress.done();
        }, 100);
      }
    }

    pc.variete_prevu_realise_week_change = () => {
      if ($scope.variete_prevu_realise_week && $scope.variete_prevu_realise_week.length > 0 && !$scope.variete_prevu_realise_week.includes(0)) {
        pc.obj_prevu_realise_week.VARIETE = $scope.variete_prevu_realise_week;
      } else {
        pc.obj_prevu_realise_week.VARIETE = [0];
      }
    }

    pc.loadDataPrevuRealise = () => {
      var canGo = true;
      angular.forEach(pc.campagne_prevu_realise_week_array, (v, k) => {
        if (canGo && v.ID_compagne == $scope.campagne_prevu_realise_week) {
          pc.obj_prevu_realise_week.CAMPAGNE = v;
          pc.obj_prevu_realise_week.CAMPAGNE.Date_Fin = moment(pc.obj_prevu_realise_week.CAMPAGNE.Date_Fin).format('YYYYMMDD');
          pc.obj_prevu_realise_week.CAMPAGNE.Date_debut = moment(pc.obj_prevu_realise_week.CAMPAGNE.Date_debut).format('YYYYMMDD');
          canGo = false;
        }
      });

      var chartapportmensuel;
      PeriodeEstimation.getPrevuRealiseParSemaine(pc.obj_prevu_realise_week).then(e => {
        // Create chart instance
        am4core.useTheme(am4themes_animated);
        chartapportmensuel = null;
        chartapportmensuel = am4core.create("RealiseParSemaine_chartdiv", am4charts.XYChart);
        chartapportmensuel.scrollbarX = new am4core.Scrollbar();

        // Add data
        angular.forEach(e.data, (v, k) => {
          chartapportmensuel.data.push({
            "Ecart": parseFloat(v.Ecart / 1000).toFixed(2),
            "Prevu": parseFloat(v.Prevu / 1000).toFixed(2),
            "Realise": parseFloat(v.Realise / 1000).toFixed(2),
            "weeks": v.weeks + ` (${v.Type_variete})`,
            "Type_variete": v.Type_variete
          });
        });

        var categoryAxis = chartapportmensuel.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "weeks";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 40;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.fontSize = 13;

        var valueAxis = chartapportmensuel.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        // Create series


        var series1 = chartapportmensuel.series.push(new am4charts.ColumnSeries());
        series1.sequencedInterpolation = true;
        series1.dataFields.valueY = "Prevu";
        series1.dataFields.categoryX = "weeks";
        series1.tooltipText = `[bold]Semaine {categoryX}[/]
                            Type variete: {Type_variete}[/]
                            Prévue: {Prevu}[/]
                            Realisée: {Realise}[/]
                            Ecart: {Ecart}
                            `;
        series1.columns.template.strokeWidth = 0;

        series1.tooltip.pointerOrientation = "vertical";

        series1.columns.template.column.cornerRadiusTopLeft = 10;
        series1.columns.template.column.cornerRadiusTopRight = 10;
        series1.columns.template.column.fillOpacity = 0.8;

        var series2 = chartapportmensuel.series.push(new am4charts.ColumnSeries());
        series2.sequencedInterpolation = true;
        series2.dataFields.valueY = "Realise";
        series2.dataFields.categoryX = "weeks";
        series2.columns.template.strokeWidth = 0;

        series2.tooltip.pointerOrientation = "vertical";

        series2.columns.template.column.cornerRadiusTopLeft = 10;
        series2.columns.template.column.cornerRadiusTopRight = 10;
        series2.columns.template.column.fillOpacity = 0.8;
        // on hover, make corner radiuses bigger
        var hoverState = series1.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series1.columns.template.adapter.add("fill", function(fill, target) {
          return chartapportmensuel.colors.getIndex(target.dataItem.index);
        });
        series2.columns.template.adapter.add("fill", function(fill, target) {
          return chartapportmensuel.colors.getIndex(target.dataItem.index);
        });
        // Cursor
        chartapportmensuel.cursor = new am4charts.XYCursor();

        NProgress.done();
      });
    }


    function loadAllDataSpinner_detail() {
      $q.all([societe.getSociete(_url)]).then((values) => {
        pc.societe_prevu_realise_week_array = values[0].data;
        setTimeout(function() {
          $('#societe_prevu_realise_week').selectpicker('val', values[0].data[0].ID);
          $scope.societe_prevu_realise_week = values[0].data[0].ID;
          $("#societe_prevu_realise_week").selectpicker('refresh');
          pc.societe_change_prevu_realise_week();
        }, 100);
        NProgress.done();
      });
    }

  });