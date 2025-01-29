'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordPrevisionCtrl
 * @description
 * # TableaudebordPrevisionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordPrevisionCtrl', function($scope,
    $q,
    PeriodeEstimation, $translatePartialLoader, $translate, $window, translatedwords,
    _url) {

    //alert();
    var pc = this;
    am4core.useTheme(am4themes_animated);
    pc.loadDataYesterday = (data) => {
      if (data.length > 0) {
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        angular.forEach(data, (v, k) => {
          chart.data.push({
            "Type_variete": v.Type_variete,
            "PrevuHier": parseFloat(v.PrevuHier / 1000).toFixed(2),
            "RealiseHier": parseFloat(v.RealiseHier / 1000).toFixed(2)
          });
        });
        $translatePartialLoader.addPart('conduitetechnique');
        $translate.use($window.localStorage.getItem("lang").toLowerCase());
        $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "Type_variete";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.labels.template.rotation = 80;
        categoryAxis.renderer.minGridDistance = 30;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "PrevuHier";
        series.dataFields.categoryX = "Type_variete";
        series.clustered = false;
        series.tooltipText = "Prévu / {categoryX} : [bold]{valueY}[/]";

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "RealiseHier";
        series2.dataFields.categoryX = "Type_variete";
        series2.clustered = false;
        series2.columns.template.width = am4core.percent(50);
        series2.tooltipText = "Réalisé / {categoryX} : [bold]{valueY}[/]";

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;

        $("#chartdiv").fadeIn();
        $("#chartdiv_no_data").fadeOut();
      } else {
        $("#chartdiv_no_data").fadeIn();
        $("#chartdiv").fadeOut();
      }

    }
    pc.loadDataLastWeek = (data) => {

      if (data.length > 0) {
        //am4core.disposeAllCharts();
        var chart = am4core.create("chartdiv_semaine_derniere", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        // Add data
        angular.forEach(data, (v, k) => {
          chart.data.push({
            "Type_variete": v.Type_variete,
            "PrevuLastWeek": parseFloat(v.PrevuLastWeek / 1000).toFixed(2),
            "RealiseLastWeek": parseFloat(v.RealiseLastWeek / 1000).toFixed(2)
          });
        });

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "Type_variete";
        categoryAxis.renderer.labels.template.rotation = 80;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "PrevuLastWeek";
        series.dataFields.categoryX = "Type_variete";
        series.clustered = false;
        series.tooltipText = "Prévu / {categoryX} : [bold]{valueY}[/]";

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "RealiseLastWeek";
        series2.dataFields.categoryX = "Type_variete";
        series2.clustered = false;
        series2.columns.template.width = am4core.percent(50);
        series2.tooltipText = "Réalisé / {categoryX} : [bold]{valueY}[/]";

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;
        $("#chartdiv_semaine_derniere").fadeIn();
        $("#chartdiv_semaine_derniere_no_data").fadeOut();
      } else {
        $("#chartdiv_semaine_derniere_no_data").fadeIn();
        $("#chartdiv_semaine_derniere").fadeOut();
      }

    }
    pc.loadDataCurrentWeek = (data) => {

      if (data.length > 0) {
        var chart = am4core.create("chartdiv_semaine_cours", am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();
        // Add data
        angular.forEach(data, (v, k) => {
          chart.data.push({
            "Type_variete": v.Type_variete,
            "PrevuAdate": parseFloat(v.PrevuAdate / 1000).toFixed(2),
            "RealiseADate": parseFloat(v.RealiseADate / 1000).toFixed(2)
          });
        });

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "Type_variete";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.labels.template.rotation = 80;
        categoryAxis.renderer.minGridDistance = 30;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "PrevuAdate";
        series.dataFields.categoryX = "Type_variete";
        series.clustered = false;
        series.tooltipText = "Prévu / {categoryX} : [bold]{valueY}[/]";

        var series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "RealiseADate";
        series2.dataFields.categoryX = "Type_variete";
        series2.clustered = false;
        series2.columns.template.width = am4core.percent(50);
        series2.tooltipText = "Réalisé / {categoryX} : [bold]{valueY}[/]";

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;
        $("#chartdiv_semaine_cours").fadeIn();
        $("#chartdiv_semaine_cours_no_data").fadeOut();
      } else {
        $("#chartdiv_semaine_cours_no_data").fadeIn();
        $("#chartdiv_semaine_cours").fadeOut();
      }

    }

    $q.all([PeriodeEstimation.hier(moment().format('YYYYMMDD')),
      PeriodeEstimation.semain_derniere(moment().format('YYYYMMDD')),
      PeriodeEstimation.semaine_en_cours(moment().format('YYYYMMDD'))
    ]).then((values) => {
      pc.loadDataYesterday(values[0].data);
      pc.loadDataLastWeek(values[1].data);
      pc.loadDataCurrentWeek(values[2].data);
      NProgress.done();
    });

  });