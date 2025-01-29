  'use strict';

  /**
   * @ngdoc function
   * @name beeOneWebFrontApp.controller:ApporteauBilanNutritionnelCtrl
   * @description
   * # ApporteauBilanNutritionnelCtrl
   * Controller of the beeOneWebFrontApp
   */
  angular.module('beeOneWebFrontApp')
    .controller('ApporteauBilanNutritionnelCtrl', function($q,
      campagneagricole,
      societe, translatedwords,
      $state, $window,
      _url,
      VarieteService,
      parcellecultural,
      cultureService, $translatePartialLoader, $translate,
      $cookies,
      portGreffe,
      FermeService,
      $scope,
      bilanHydrique,
      BilanNutritionnel,
      getsuperficie,
      savefilter) {
      var pc = this;
      var chartApportMensuel = null;
      $scope.besoin_recommande = 0;
      $scope.cumul_precipitation = 0;
      $scope.cumul_apport = 0;
      $scope.deficit = 0;
      pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
      pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
      $scope.hatitle = "/Ha";
      $scope.currentNavItem = 'realisation';
      pc.Mode_fert = 0;
      pc.Mode_fert_ha = 0;
      $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $translatePartialLoader.addPart('conduitetechnique');
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
      setTimeout(function() {
        $(".selectpicker").selectpicker();
        $("#compagne").selectpicker('refresh');
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#port_greff").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $('#typeoperation').selectpicker('val', [1, 2]);
        NProgress.done();
      }, 100);

      $scope.ReverseDisplay = function(d) {
        if (document.getElementById(d).style.display === "none") {
          document.getElementById(d).style.display = "block";
        } else {
          document.getElementById(d).style.display = "none";
        }
      }

      $scope.typeoperation = [0];
      pc.obj = {
        FERME: pc.IDFerme,
        culture: [0],
        VARIETE: [0],
        GREFF: [0],
        PARCELLE: [0],
        DATE_DEBUT: moment().format('YYYYMMDD'),
        DATE_FIN: moment().format('YYYYMMDD'),
        superficie: 0,
        Mode_fert: 0,
        Mode_fert_ha: 0,
        type_operation: [0]
      };

      //check saved filter
      if (!angular.equals(savefilter.getFilters(), {})) {
        pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
        pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

        $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
        $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
      }

      NProgress.start();

      am4core.ready(function() {

        $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.IDSociete),
          getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj),
          cultureService.getCultureByFerme(pc.obj.FERME),
          portGreffe.getPortGreffe(),
          VarieteService.showVarieteByCultureFerme(pc.obj),
          parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME),
          BilanNutritionnel.getmodefert(pc.obj)
        ]).then((values) => {
          pc.compagne_array = values[0].data;
          //pc.superficie = values[1].data;
          pc.culture_array = values[2].data;
          pc.port_greffs_array = values[3].data;
          pc.variete_array = values[4].data;
          pc.parcelles_array = values[5].data;

          if (values[6].data.length > 0) {
            try {
              pc.Mode_fert = values[6].data[0].Mode_fert;
              pc.Mode_fert_ha = values[6].data[0].Mode_fert_ha;
              pc.obj.Mode_fert = pc.Mode_fert;
              pc.obj.Mode_fert_ha = pc.Mode_fert_ha;
              if (pc.Mode_fert == 1) {
                pc.hatitle = "/ha";
              } else if (pc.Mode_fert == 2) {
                pc.hatitle = "";
              }
            } catch (error) {
              pc.Mode_fert = 1;
              pc.obj.Mode_fert = 1;
              pc.Mode_fert_ha = 1;
              pc.obj.Mode_fert_ha = 1;
              pc.hatitle = "";
            }
          } else {
            pc.Mode_fert = 1;
            pc.obj.Mode_fert = 1;
            pc.Mode_fert_ha = 1;
            pc.obj.Mode_fert_ha = 1;
            pc.hatitle = "/ha";
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

        //by type_operationchange
        pc.typeoperation_change = function() {
          if ($scope.typeoperation && $scope.typeoperation.length > 0 && !$scope.typeoperation.includes(0)) {
            pc.obj.type_operation = $scope.typeoperation;
          } else {
            pc.obj.type_operation = [0];
          }


        };


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
                pc.getsuperficie();
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
          } else pc.obj.GREFF = [0];
          pc.getsuperficie();
        }

        pc.getsuperficie = function() {
          getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj).then((values) => {
            NProgress.done();
            pc.superficie = values.data;
            try {
              pc.obj.superficie = (pc.superficie[0].Superficie) ? pc.superficie[0].Superficie : 0;
            } catch (e) {
              pc.obj.superficie = 0;
            }

          });
        }

        pc.getsuperficieAsync = function() {
          getsuperficie.getsupFromParcelleCulturaleByfiltre(pc.obj).then((values) => {
            NProgress.done();
            pc.superficie = values.data;
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
          if (pc.Mode_fert == '1') {
            $scope.hatitle = "/Ha";
            $scope.superficiedivide = pc.obj.superficie;
          } else {
            $scope.hatitle = "";
            $scope.superficiedivide = pc.obj.superficie;
          }

          BilanNutritionnel.getIndicateur(pc.obj).then(e => {
            if (e.data.length > 0) {
              $scope.N = (e.data[0].N) ? parseFloat(e.data[0].N) / $scope.superficiedivide : 0;
              $scope.P = (e.data[0].P) ? parseFloat(e.data[0].P) / $scope.superficiedivide : 0;
              $scope.K = (e.data[0].K) ? parseFloat(e.data[0].K) / $scope.superficiedivide : 0;
            } else {
              $scope.N = 0;
              $scope.P = 0;
              $scope.K = 0;
            }
          });

          $scope.reloadSpeedPicking();

        }


        $scope.loadBilanPerCompagne = () => {
          NProgress.start();
          BilanNutritionnel.mensuel(pc.obj).then(e => {
            if (e.data.length > 0) {
              $("#chartdiv_journalier").fadeIn();
              $("#no_data_speedPicking_1").fadeOut();

              //HNA
              // Create chart instance
              am4core.useTheme(am4themes_animated);
              chartApportMensuel = null;
              chartApportMensuel = am4core.create("chartdiv_journalier", am4charts.XYChart);
              chartApportMensuel.scrollbarX = new am4core.Scrollbar();
              chartApportMensuel.scrollbarX.parent = chartApportMensuel.bottomAxesContainer;
              chartApportMensuel.scrollbarY = new am4core.Scrollbar();
              chartApportMensuel.scrollbarY.parent = chartApportMensuel.leftAxesContainer;
              chartApportMensuel.scrollbarY.toBack();
              // Add data
              angular.forEach(e.data, (v, k) => {
                chartApportMensuel.data.push({
                  "date": v.ANNEE + "-" + v.MOIS + "-" + "1",
                  "K": parseFloat(v.K) / $scope.superficiedivide,
                  "N": parseFloat(v.N) / $scope.superficiedivide,
                  "P": parseFloat(v.P) / $scope.superficiedivide
                });
              });
              // Set input format for the dates
              chartApportMensuel.dateFormatter.inputDateFormat = "yyyy-MM-dd";
              var categoryAxis = chartApportMensuel.xAxes.push(new am4charts.CategoryAxis());
              categoryAxis.dataFields.category = "date";
              categoryAxis.renderer.grid.template.location = 0;
              categoryAxis.renderer.minGridDistance = 30;
              categoryAxis.renderer.labels.template.horizontalCenter = "right";
              categoryAxis.renderer.labels.template.verticalCenter = "middle";
              categoryAxis.renderer.labels.template.rotation = 270;
              categoryAxis.tooltip.disabled = true;
              categoryAxis.renderer.minHeight = 110;
              var valueAxis = chartApportMensuel.yAxes.push(new am4charts.ValueAxis());
              valueAxis.renderer.minWidth = 50;

              var knp = ["N", "P", "K"];
              var knpColor = ["#89c97e", "#ffa600", "#73879c"];



              for (let i = 0; i < knp.length; i++) {
                // Create series
                var series = chartApportMensuel.series.push(new am4charts.ColumnSeries());
                series.sequencedInterpolation = true;
                series.dataFields.valueY = knp[i];
                series.name = knp[i];
                series.dataFields.categoryX = "date";
                series.tooltipText = `[bold] ${knp[i]} : {${knp[i]}}[/]`;
                series.columns.template.strokeWidth = 0;
                series.tooltip.pointerOrientation = "vertical";
                series.columns.template.fill = am4core.color(knpColor[i]);
                series.columns.template.column.cornerRadiusTopLeft = 10;
                series.columns.template.column.cornerRadiusTopRight = 10;
                series.columns.template.column.fillOpacity = 0.8;

                // on hover, make corner radiuses bigger
                var hoverState = series.columns.template.column.states.create("hover");
                hoverState.properties.cornerRadiusTopLeft = 0;
                hoverState.properties.cornerRadiusTopRight = 0;
                hoverState.properties.fillOpacity = 1;


              }

              // Add legend
              chartApportMensuel.legend = new am4charts.Legend();
              chartApportMensuel.legend.position = "top";

              // Cursor
              chartApportMensuel.cursor = new am4charts.XYCursor();

              NProgress.done();
              //TL HNA
            } else {
              $("#chartdiv_journalier").fadeOut();
              $("#no_data_speedPicking_1").fadeIn();
              NProgress.done();
            }

          });

        }

        $scope.loadBilanJournalier = () => {
          NProgress.start();

          BilanNutritionnel.journalier(pc.obj).then(e => {

            if (e.data.length > 0) {
              $("#chartdiv").fadeIn();
              $("#no_data_speedPicking_2").fadeOut();
              var chart = am4core.create("chartdiv", am4charts.XYChart);

              // Add data
              angular.forEach(e.data, (v, k) => {
                chart.data.push({
                  "date": moment(v.Jour_Realisation).format('YYYY-MM-DD'),
                  "K": parseFloat(v.K) / $scope.superficiedivide,
                  "N": parseFloat(v.N) / $scope.superficiedivide,
                  "P": parseFloat(v.P) / $scope.superficiedivide
                });
              });

              // Set input format for the dates
              chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

              // Create axes
              var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
              var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

              var knp = ["N", "P", "K"];
              var knpColor = ["#89c97e", "#ffa600", "#73879c"];

              for (let i = 0; i < knp.length; ++i) {
                const element = knp[i];
                // Create series
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.valueY = knp[i];
                series.dataFields.dateX = "date";
                series.tooltipText = knp[i] + " : {" + knp[i] + "}";
                series.strokeWidth = 2;
                series.name = knp[i];
                series.minBulletDistance = 15;
                series.stroke = am4core.color(knpColor[i]);
                series.propertyFields.stroke = knpColor[i];
                // Drop-shaped tooltips
                series.tooltip.background.cornerRadius = 20;
                series.tooltip.background.strokeOpacity = 0;
                series.tooltip.pointerOrientation = "vertical";
                series.tooltip.label.minWidth = 40;
                series.tooltip.label.minHeight = 40;
                series.tooltip.label.textAlign = "middle";
                series.tooltip.label.textValign = "middle";
                series.tooltip.getFillFromObject = false;
                series.columns.template.fill = am4core.color(knpColor[i]);
                series.tooltip.background.fill = am4core.color(knpColor[i]);
                // Make bullets grow on hover
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.strokeWidth = 2;
                bullet.circle.radius = 4;
                bullet.fill = am4core.color(knpColor[i]);
                bullet.stroke = am4core.color(knpColor[i]);


                var bullethover = bullet.states.create("hover");
                bullethover.properties.scale = 1.3;



              }


              // Make a panning cursor

              chart.cursor = new am4charts.XYCursor();
              chart.cursor.behavior = "panXY";
              chart.cursor.xAxis = dateAxis;

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

              // Add legend
              chart.legend = new am4charts.Legend();
              chart.legend.position = "top";


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
          $scope.loadBilanJournalier();
          $scope.loadBilanPerCompagne();
        }

        pc.goBack = () => {
          $state.go("realisation");
        }

      }); // end am4core.ready()

    });