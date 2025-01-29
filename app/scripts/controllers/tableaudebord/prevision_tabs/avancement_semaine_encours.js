'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AvancementSemaineEncoursCtrl
 * @description
 * # AvancementSemaineEncoursCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AvancementSemaineEncoursCtrl', function($scope,
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
    GroupeOperationnel, $translatePartialLoader, $translate, $window,
    _url) {
    var chartAvancement;
    PeriodeEstimation.getAvancement().then(e => {
      angular.forEach(e.data, (v, k) => {
        v.resteArealise /= 1000;
        v.Realise /= 1000;
      });

      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      // Create chart instance
      chartAvancement = null;
      chartAvancement = am4core.create("avancement_semaine_chart", am4charts.XYChart);
      // Add data
      chartAvancement.data = e.data;
      // Create axes
      var categoryAxis = chartAvancement.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "Type_variete";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.inversed = true;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.axisFills.template.disabled = false;
      categoryAxis.renderer.axisFills.template.fillOpacity = 0.05;


      var valueAxis = chartAvancement.xAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minGridDistance = 50;
      valueAxis.renderer.ticks.template.length = 5;
      valueAxis.renderer.ticks.template.disabled = false;
      valueAxis.renderer.ticks.template.strokeOpacity = 0.4;

      // Legend
      chartAvancement.legend = new am4charts.Legend();
      chartAvancement.legend.position = "top";
      chartAvancement.legend.width = 400;
      // Use only absolute numbers
      chartAvancement.numberFormatter.numberFormat = "#.#s";
      var interfaceColors = new am4core.InterfaceColorSet();
      var positiveColor = interfaceColors.getFor("positive");
      var negativeColor = interfaceColors.getFor("negative");

      createSeriesAvancement("Realise", "Réalisé", positiveColor);
      createSeriesAvancement("resteArealise", "Reste à réaliser", negativeColor);
      NProgress.done();
    })
    // Create series
    function createSeriesAvancement(field, name, color) {
      var series = chartAvancement.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "Type_variete";
      series.stacked = true;
      series.name = name;
      series.stroke = color;
      series.fill = color;

      var label = series.bullets.push(new am4charts.LabelBullet());
      label.label.text = "{valueX}";
      label.label.fill = am4core.color("#fff");
      label.label.strokeWidth = 0;
      label.label.truncate = false;
      label.label.hideOversized = true;
      label.locationX = 0.5;
      return series;
    }
  });