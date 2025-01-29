'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TlemetrieSaisieCtrl
 * @description
 * # TlemetrieSaisieCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TlemetrieSaisieCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $q,
    PeriodeEstimation, translatedwords,
    _url) {
    var pc = this;
    am4core.useTheme(am4themes_animated);
    pc.show_detail = false;
    pc.widget = 0;
    pc.detailSelectedFarm = {};
    $q.all([PeriodeEstimation.semain_prochaine(),
      PeriodeEstimation.saisie_demain(),
      PeriodeEstimation.saisie_today()
    ]).then((values) => {
      pc.ferme_telemetrie_array = [];
      pc.semain_prochaine_array = values[0].data;
      pc.saisie_demain_array = values[1].data;
      pc.saisie_today_array = values[2].data;
      pc.loadDataChart();
      NProgress.done();
    })

    pc.loadDataChart = () => {
      //var data = pc.searchFermeByName($scope.ferme_telemetrie);
      pc.loadChartNextWeek(pc.semain_prochaine_array, "chartdiv_next_week");
      pc.loadChartNextWeek(pc.saisie_demain_array, "chartdiv_tomorrow");
      pc.loadChartNextWeek(pc.saisie_today_array, "chartdiv_today");
    }

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    var ChartNextWeek;
    pc.loadChartNextWeek = (d, container, chart) => {

      var data = [{
        "label": "Parcelles non saisies",
        "val": 0
      }, {
        "label": "Parcelles saisies",
        "val": 0
      }];

      angular.forEach(d, (v, k) => {
        data[0].val += v.parcNonsaisie;
        data[1].val += v.countParcSaisie;
      })

      // Create chart instance
      ChartNextWeek = null;
      ChartNextWeek = am4core.create(container, am4charts.PieChart);

      // Add data
      ChartNextWeek.data = data;

      // Add and configure Series
      var pieSeries = ChartNextWeek.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "val";
      pieSeries.dataFields.category = "label";
      pieSeries.innerRadius = am4core.percent(50);
      pieSeries.ticks.template.disabled = true;
      pieSeries.labels.template.disabled = true;

      var rgm = new am4core.RadialGradientModifier();
      rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, -0.5);
      pieSeries.slices.template.fillModifier = rgm;
      pieSeries.slices.template.strokeModifier = rgm;
      pieSeries.slices.template.strokeOpacity = 0.4;
      pieSeries.slices.template.strokeWidth = 0;

      ChartNextWeek.legend = new am4charts.Legend();
      ChartNextWeek.legend.position = "right";
      ChartNextWeek.legend.width = 200;
    }

    pc.loadToday = (d) => {
      console.log(d, "recived 3");
    }
    pc.getFarmWithParcelNonEntered = () => {
      var data = [];
      var source = [];
      if (pc.widget == 0) {
        source = pc.saisie_today_array
      } else if (pc.widget == 1)
        source = pc.saisie_demain_array
      else source = pc.semain_prochaine_array

      angular.forEach(source, (v, k) => {
        if (v.countParcSaisie == 0) {
          data.push(v);
        }
      })

      return data;
    }

    pc.fillDataTableDetail = (widget) => {
      pc.show_detail = true;
      pc.widget = widget;
      pc.detailFarms = pc.getFarmWithParcelNonEntered();
      console.log(pc.detailFarms);

    }
  });