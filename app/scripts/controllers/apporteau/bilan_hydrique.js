'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ApporteauBilanHydriqueCtrl
 * @description
 * # ApporteauBilanHydriqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ApporteauBilanHydriqueCtrl', function($q, translatedwords, campagneagricole, $window, $translatePartialLoader, $translate, societe, $state, _url, $mdDialog, VarieteService, parcellecultural, cultureService, $cookies, portGreffe, FermeService, $scope, bilanHydrique, ApportEau, getsuperficie, savefilter) {
    var pc = this;
    var chartapportmensuel;
    $scope.besoin_recommande = 0;
    $scope.cumul_precipitation = 0;
    $scope.cumul_apport = 0;
    $scope.Besoin_eau = 0;
    pc.mode_irrigation = 0;
    pc.unite = "...";
    pc.uniteha = " / ...";
    pc.cols = 3;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      culture: [0],
      VARIETE: [0],
      GREFF: [0],
      PARCELLE: [0],
      mode_irrigation: 1,
      mode_irrigation_ha: 0,
      superficie: 0,
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD')
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#compagne").selectpicker('refresh');
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#port_greff").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
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

    am4core.ready(function() {

      $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete),
        getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj),
        cultureService.getCultureByFerme(pc.obj.FERME), portGreffe.getPortGreffe(),
        VarieteService.showVarieteByCultureFerme(pc.obj),
        parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
        ApportEau.getModeIrrigation({
          id_ferme: $cookies.getObject('globals').ferme.IDFerme
        })
      ]).then((values) => {
        pc.compagne_array = values[0].data;
        //pc.superficie = values[1].data;
        pc.culture_array = values[2].data;
        pc.port_greffs_array = values[3].data;
        pc.variete_array = values[4].data;
        pc.parcelles_array = values[5].data;
        if (values[6].data.length > 0) {
          try {
            pc.mode_irrigation = values[6].data[0].mode_irrigation;
            pc.obj.mode_irrigation = pc.mode_irrigation;

            pc.mode_irrigation_ha = values[6].data[0].mode_irrigation_ha;
            pc.obj.mode_irrigation_ha = pc.mode_irrigation_ha;

            if (pc.mode_irrigation == 1) {
              pc.unite = "m<sup>3</sup>";
              pc.unitem3 = "m<sup>3</sup>";
              pc.uniteha = " / Ha";
              pc.cols = 3;
            } else if (pc.mode_irrigation == 2) {
              pc.unite = "m<sup>3</sup>";
              pc.unitemm = "mm";
              pc.uniteha = "";
              pc.cols = 4;
            }
          } catch (error) {
            pc.mode_irrigation = 1;
            pc.mode_irrigation_ha = 0;
            pc.obj.mode_irrigation = 1;
            pc.unite = "m<sup>3</sup>";
            pc.unitem3 = "m<sup>3</sup>";
            pc.uniteha = " / Ha";
            pc.cols = 3;
          }
        } else {
          pc.mode_irrigation = 1;
          pc.mode_irrigation_ha = 0;
          pc.obj.mode_irrigation = 1;
          pc.unite = "m<sup>3</sup>";
          pc.unitem3 = "m<sup>3</sup>";
          pc.uniteha = " / Ha";
          pc.cols = 3;
        }

        angular.forEach(pc.compagne_array, function(value, key) {

          if (!angular.equals(savefilter.getFilters(), {})) {
            if (moment($scope.date_debut).isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
              setTimeout(function() {
                $('#compagne').selectpicker('val', value.ID_compagne);
                $(".selectpicker").selectpicker('refresh');

                pc.getsuperficieAsync();
              }, 100);
            } else {
              setTimeout(function() {
                $(".selectpicker").selectpicker('refresh');
                pc.getsuperficieAsync();
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
              pc.getsuperficieAsync();
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
              pc.getsuperficie();
            }
          });
        }
      }

      //starting date change listner
      pc.date_debut_change = function() {
        pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
        pc.getsuperficie();
        savefilter.setFilters(pc.obj);
      };

      //by date_fin
      pc.date_fin_change = function() {
        pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
        pc.getsuperficie();
        savefilter.setFilters(pc.obj);
      };

      pc.parcelle_change = () => {
        if ($scope.parcelle && $scope.parcelle.length > 0 && !$scope.parcelle.includes(0)) {
          pc.obj.PARCELLE = $scope.parcelle;
          pc.getsuperficie();
        } else {
          pc.obj.PARCELLE = [0];
        }
      }

      pc.culture_change = () => {
        NProgress.start();
        if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
          pc.obj.culture = $scope.culture;
          pc.obj.VARIETE = [0];
          pc.obj.PARCELLE = [0];
          pc.getsuperficie();
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

      pc.port_greff_change = () => {
        if ($scope.port_greff && $scope.port_greff.length > 0 && !$scope.port_greff.includes(0)) {
          pc.obj.GREFF = $scope.port_greff;
          pc.getsuperficie();
        } else {
          pc.obj.GREFF = [0];
        }
      }


      pc.getsuperficie = function() {
        $q.all([getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj), bilanHydrique.getsupDebutCampagne(pc.obj)]).then((values) => {
          NProgress.done();
          pc.superficie = values[0].data;
          //bilanHydrique.supsimple(pc.obj), bilanHydrique.supirriger(pc.obj)
          //  $scope.supsimple = values[1].data;
          //  $scope.supirriger = values[2].data;
          $scope.SupDebutCampagne = values[1].data;
          try {
            pc.obj.superficie = (pc.superficie[0].Superficie) ? pc.superficie[0].Superficie : 0;
          } catch (e) {
            pc.obj.superficie = 0;
          }
        });
      }

      pc.getsuperficieAsync = function() {

        $q.all([getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj), bilanHydrique.getsupDebutCampagne(pc.obj)]).then((values) => {
          NProgress.done()
          pc.superficie = values[0].data;
          //, bilanHydrique.supsimple(pc.obj), bilanHydrique.supirriger(pc.obj)
          //  $scope.supsimple = values[1].data;
          //  $scope.supirriger = values[2].data;
          $scope.SupDebutCampagne = values[1].data;
          try {
            pc.obj.superficie = (pc.superficie[0].Superficie) ? pc.superficie[0].Superficie : 0;
            $scope.search();
          } catch (e) {
            pc.obj.superficie = 0;
            $scope.search();
          }
        });
      }

      $scope.search = () => {

        NProgress.start();

        $q.all([bilanHydrique.getIndicateurBian(pc.obj), bilanHydrique.besoinrecommande(pc.obj)]).then((values) => {
          if (values[0].data.length > 0) {
            try {
              $scope.besoin_recommande = parseFloat(values[0].data[0].Besoin).toFixed(2);
            } catch (e) {
              $scope.besoin_recommande = 0;
            }
            try {
              $scope.Cumul_apports_ha_moyen = parseFloat(values[0].data[0].Cumul_apports_ha_moyen).toFixed(2);
            } catch (e) {
              $scope.Cumul_apports_ha_moyen = 0;
            }
            try {
              $scope.cumul_apport = parseFloat(values[0].data[0].Cumul_apports).toFixed(2);
            } catch (e) {
              $scope.cumul_apport = 0;
            }
          } else {
            $scope.besoin_recommande = 0;
            $scope.cumul_apport = 0;
          }

          if (values[1].data.length > 0) {
            try {
              if (pc.mode_irrigation == 1) {
                $scope.Besoin_eau = parseFloat(values[1].data[0].Besoin_eau).toFixed(2);
              } else {
                $scope.Besoin_eau = parseFloat(values[1].data[0].Besoin_eau * 10).toFixed(2);
              }
            } catch (e) {
              $scope.Besoin_eau = 0;
            }
          } else {
            $scope.Besoin_eau = 0;
          }
          $scope.reloadSpeedPicking();

        });
      }


      $scope.loadApportPerCompagne = () => {
        NProgress.start();
        bilanHydrique.apportMensuel(pc.obj).then(e => {

          if (e.data.length > 0) {
            $("#chartdiv_journalier").fadeIn();
            $("#no_data_speedPicking_1").fadeOut();

            //HNA
            // Create chart instance
            am4core.useTheme(am4themes_animated);
            chartapportmensuel = null;
            chartapportmensuel = am4core.create("chartdiv_journalier", am4charts.XYChart);
            chartapportmensuel.scrollbarX = new am4core.Scrollbar();

            chartapportmensuel.scrollbarY = new am4core.Scrollbar();
            chartapportmensuel.scrollbarY.parent = chartapportmensuel.leftAxesContainer;
            chartapportmensuel.scrollbarY.toBack();
            // Add data
            angular.forEach(e.data, (v, k) => {
              if (pc.obj.mode_irrigation == 1) {
                chartapportmensuel.data.push({
                  "date": v.Y + " / " + v.M,
                  "value": parseFloat(v.Cumul_apports_ha) / pc.obj.superficie
                });
              } else {
                chartapportmensuel.data.push({
                  "date": v.Y + " / " + v.M,
                  "value": parseFloat(v.Cumul_apports_ha) / pc.obj.superficie
                });
              }

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
Apport: {value}`;

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

            NProgress.done();
            //TL HNA
          } else {
            $("#chartdiv_journalier").fadeOut();
            $("#no_data_speedPicking_1").fadeIn();
            NProgress.done();
          }

        });
      }

      $scope.loadApportJournalier = () => {
        NProgress.start();
        bilanHydrique.apportJournalier(pc.obj).then(e => {

          if (e.data.length > 0) {
            $("#chartdiv").fadeIn();
            $("#no_data_speedPicking_2").fadeOut();
            var chart = am4core.create("chartdiv", am4charts.XYChart);

            // Add data
            angular.forEach(e.data, (v, k) => {
              if (pc.obj.mode_irrigation == 1 || pc.obj.mode_irrigation == "1") {
                chart.data.push({
                  "date": moment(v.Date).format('YYYY-MM-DD'),
                  "value": parseFloat(v.Cumul_apports_ha) / pc.obj.superficie
                });
              } else {
                if (pc.obj.mode_irrigation_ha) {
                  chart.data.push({
                    "date": moment(v.Date).format('YYYY-MM-DD'),
                    "value": parseFloat(v.Cumul_apports_ha) / pc.obj.superficie
                  });
                } else {
                  chart.data.push({
                    "date": moment(v.Date).format('YYYY-MM-DD'),
                    "value": parseFloat(v.Cumul_apports_ha)
                  });
                }

              }
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
            NProgress.done();
          } else {
            $("#chartdiv").fadeOut();
            $("#no_data_speedPicking_2").fadeIn();
            NProgress.done();
          }
          // Create chart instance
        });
      }

      $scope.reloadSpeedPicking = () => {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        am4core.disposeAllCharts();
        $scope.loadApportJournalier();
        $scope.loadApportPerCompagne();
      }

      pc.goApport = () => {
        $state.go('apportEau');
      }

    }); // end am4core.ready()

  });