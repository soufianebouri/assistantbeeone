'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsTableauBordCtrl
 * @description
 * # MainoeuvreetatsTableauBordCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsTableauBordCtrl', function($scope, translatedwords, mainOuvreBord, $q, periodepaie, jourferie, $cookies, $translatePartialLoader, $translate, $window) {
    var pc = this;
    var header = document.getElementById("dateRangeDiv");
    var sticky = header.offsetTop;
    $scope.periode_from = null;
    $scope.periode_to = null;
    var data = {
      labels: [],
      datasets: [{
          label: "Jour/homme",
          backgroundColor: "rgba(179,181,198,0.2)",
          borderColor: "rgba(179,181,198,1)",
          pointBackgroundColor: "rgba(179,181,198,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(179,181,198,1)",
          data: []
        },
        {
          label: "Heures/Sup",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: []
        },
        {
          label: "Primes",
          backgroundColor: "blue",
          borderColor: "blue",
          pointBackgroundColor: "blue",
          pointBorderColor: "blue",
          pointHoverBackgroundColor: "blue",
          pointHoverBorderColor: "blue",
          data: []
        }
      ]
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var ctx = document.getElementById("myChart");
    var options = {
      tooltips: {
        mode: 'label'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };
    var myRadarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options
    });

    $scope.obj = {
      FROM: moment().format('YYYYMMDD'),
      TO: moment().format('YYYYMMDD'),
      FERME: $cookies.getObject('globals').ferme.IDFerme
    };
    $scope.res = {};

    am4core.ready(function() {

      jourferie.getJourferiers_organized(moment().format('YYYYMMDD')).then(e => {
        $scope.jour_ferier_array = e.data;
      });

      periodepaie.getPerdiodeEnCours().then(e => {
        if (e.data.length > 0) {
          setTimeout(function() {
            init_daterangepicker(e.data[0].date_debut, e.data[0].Date_fin);
          }, 2000);
        }
      });

      $scope.loadData = () => {
        NProgress.set(0.4);
        NProgress.start();
        $q.all([mainOuvreBord.getEffectif($scope.obj),
          mainOuvreBord.getIndicateur($scope.obj),
          mainOuvreBord.getTopOperation($scope.obj),
          mainOuvreBord.getMeilleursOuvriers($scope.obj)
        ]).then((e) => {
          $scope.reloadSpeedPicking(e[3].data);
          pc.Nbr_JH_Pointe = parseFloat(e[1].data[0].Nbr_JH_Pointe).toFixed(2);
          pc.Nbr_Hr_Sup_Pointe = parseFloat(e[1].data[0].Nbr_Hr_Sup_Pointe).toFixed(2);
          pc.Effectif_Pointe = e[1].data[0].Effectif_Pointe;
          pc.Eff_en_exercice = e[0].data[0].Eff_en_exercice;
          pc.Eff_Globale = e[0].data[0].Eff_Globale;
          pc.Poids_Heures_Sup = parseFloat(e[1].data[0].Poids_Heures_Sup).toFixed(2);

          var operation = [];
          var HS = [];
          var JH = [];
          var Primes = [];
          angular.forEach(e[2].data, (v, k) => {
            operation.push(v.Operation);
            HS.push(parseFloat(v.HS).toFixed(2));
            JH.push(parseFloat(v.JH).toFixed(2));
            Primes.push(parseFloat(v.Primes).toFixed(2));
          });
          removeData();
          addData(operation, [JH, HS, Primes]);

          NProgress.done();
          NProgress.remove();
        });
      }
      $scope.loadData();

      function addData(label, data) {

        if (label.length > 0) {
          myRadarChart.data.labels = label;
          myRadarChart.data.datasets.forEach((dataset, i) => {
            dataset.data = data[i];
          });
          myRadarChart.update();
          $("#no_data_radar").fadeOut();
          $("#myChart").fadeIn();
        } else {
          $("#no_data_radar").fadeIn();
          $("#myChart").fadeOut();
        }
      }

      function removeData() {
        myRadarChart.data.labels.pop();
        myRadarChart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
        });
        myRadarChart.update();
      }

      $("#reportrange input").change((e) => {
        var periode = $("#reportrange input").val().split(" - ");
        if (periode.length == 1) {
          $scope.obj.FROM = periode[0];
          $scope.obj.TO = periode[0];
        } else {
          $scope.obj.FROM = periode[0];
          $scope.obj.TO = periode[1];
        }
        $scope.loadData();
      });

      /*
      window.onscroll = function() {myFunction()};

      function myFunction() {
        if (window.pageYOffset > sticky) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }*/




      $scope.reloadSpeedPicking = (d) => {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        /**
         * Chart design taken from Samsung health app
         */
        am4core.disposeAllCharts();
        if (d.length == 0) {
          $("#no_data_speedPicking").fadeIn();
          $("#chartdiv").fadeOut();
          return;
        } else {
          $("#no_data_speedPicking").fadeOut();
          $("#chartdiv").fadeIn();
        }
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 40;

        chart.data = d;

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        var series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = -30;
        series.columnsContainer.zIndex = 100;

        var columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({
          target: columnTemplate,
          property: "fill",
          dataField: "valueX",
          min: am4core.color("#e5dc36"),
          max: am4core.color("#5faa46")
        });
        series.mainContainer.mask = undefined;

        var cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        var bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        var hoverState = bullet.states.create("hover");
        var outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function(radius, target) {
          var circleBullet = target.parent;
          return circleBullet.circle.pixelRadius + 10;
        })

        var image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function(mask, target) {
          var circleBullet = target.parent;
          return circleBullet.circle;
        })

        var previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function(event) {
          var dataItem = series.tooltipDataItem;

          if (dataItem.column) {
            var bullet = dataItem.column.children.getIndex(1);

            if (previousBullet && previousBullet != bullet) {
              previousBullet.isHover = false;
            }

            if (previousBullet != bullet) {

              var hs = bullet.states.getKey("hover");
              hs.properties.dx = dataItem.column.pixelWidth;
              bullet.isHover = true;

              previousBullet = bullet;
            }
          }
        })
      }


    }); // end am4core.ready()



  });