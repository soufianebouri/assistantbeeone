'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:previsionPeriodiqueGrapheCtrl
 * @description
 * # previsionPeriodiqueGrapheCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('previsionPeriodiqueGrapheCtrl', function($scope, parcellecultural, translatedwords, $translatePartialLoader, $translate, $window, campagneagricole, PeriodeEstimation, VarieteService, societe, domaine, $state, _url, $q) {
    var pc = this;

    pc.obj = {
      "ID_Societe": 0,
      "CAMPAGNE": "",
      "DOMAINE": 0,
      "ID_PERIODE": [0],
      "VARIETE": [0]
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#Societe").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#periode").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);


    pc.filterWithItems = {
      societe: -1
    };

    pc.canSearch = () => {
      if (pc.obj.ID_Societe == 0 || pc.obj.CAMPAGNE == "" || pc.obj.DOMAINE == 0 || checkInvalidInput(pc.obj.ID_PERIODE) || checkInvalidInput(pc.obj.VARIETE)) {
        return true;
      }
      return false;
    }

    function checkInvalidInput(t) {
      if (t.length == 0 || t[0] == 0) {
        return true;
      }
      return false;
    }

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    $q.all([societe.getSociete(_url),
      domaine.getDomaine()
    ]).then((values) => {
      pc.societes = values[0].data;
      pc.domaines = values[1].data;
      if (pc.societes.length > 0 && pc.domaines.length > 0) {
        pc.filterWithItems.societe = pc.societes[0].ID;
        $q.all([campagneagricole.getCampagneAgricoleByIDSociete(pc.societes[0].ID), VarieteService.getVarieteByFarm({
          idferme: pc.domaines[0].IDFermes
        })]).then(async e => {
          pc.compagne_array = e[0].data;
          pc.variete_array = e[1].data;
          await asyncForEach(pc.compagne_array, async (d) => {
            var canGo = true;
            if (canGo && moment().isBetween(moment(d.Date_debut).subtract(1, 'd'), moment(d.Date_Fin).add(1, 'd'))) {
              pc.current_campagne = d.Code;
              canGo = false;
            }
          });
          pc.loadEstimamtionPeriodique();
        })
      } else {
        NProgress.done();
      }
    });

    pc.loadEstimamtionPeriodique = () => {
      PeriodeEstimation.getPeriodeEstimation({
        ID_Societe: pc.societes[0].ID,
        CAMPAGNE: pc.current_campagne
      }).then(e => {
        pc.estimation_periode_array = e.data;
        setTimeout(function() {
          pc.obj.ID_Societe = pc.societes[0].ID;
          pc.obj.CAMPAGNE = pc.current_campagne;
          pc.obj.DOMAINE = pc.domaines[0].IDFermes;
          $(".selectpicker").selectpicker('refresh');
          $('#Societe').selectpicker('val', pc.societes[0].ID);
          $('#Domaine').selectpicker('val', pc.domaines[0].IDFermes);
          $('#compagne').selectpicker('val', pc.current_campagne);
        }, 1000);
        NProgress.done();
      });
    }
    pc.goBack = () => {
      $state.go('previsionsPeriodique');
    }
    am4core.ready(function() {

      pc.loadData = () => {
        $("#chartdiv").hide();
        $q.all([PeriodeEstimation.getDataEstimationForChart(pc.obj), PeriodeEstimation.getAllVarieteEstim(pc.obj)]).then((values) => {

          NProgress.done();


          am4core.disposeAllCharts();
          var chart = am4core.create("chartdiv", am4charts.XYChart);


          // Create category axis
          var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
          categoryAxis.dataFields.category = "periode";
          categoryAxis.renderer.opposite = false;


          // Create value axis
          var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.renderer.inversed = false;
          valueAxis.title.text = "Quantité";
          valueAxis.renderer.minLabelPosition = 0.01;
          // Add chart cursor
          chart.cursor = new am4charts.XYCursor();
          chart.cursor.behavior = "zoomY";

          // Add legend
          chart.legend = new am4charts.Legend();

          chart.data = values[0].data;

          angular.forEach(values[1].data, function(value, key) {
            // Create series
            var line = chart.series.push(new am4charts.LineSeries());
            line.dataFields.valueY = value.Variete;
            line.dataFields.categoryX = "periode";
            line.name = value.Variete;
            line.strokeWidth = 3;
            line.bullets.push(new am4charts.CircleBullet());
            //line.tooltipText = "La quantité totale de {name} sur la periode {categoryX} est de {valueY}";
            line.tooltipText = "{name} : {valueY}";
            line.legendSettings.valueText = "{valueY}";
          });
          $("#chartdiv").show();
        });
      }
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      //by variety
      pc.variete_change = function() {

        var variete = $scope.variete.variete;

        if (validateInput(variete) || variete.length === 0 || variete.includes(0))
          variete = [0];
        pc.obj.VARIETE = variete;
      };


      pc.periode_change = function() {

        var periode = $scope.periode_estimation_id.periode_estimation_id;

        if (validateInput(periode) || periode.length === 0 || periode.includes(0))
          periode = [0];
        pc.obj.ID_PERIODE = periode;
      };

      pc.compagne_change = function() {
        $("#chartdiv").hide();
        var compagne = $scope.compagne;

        if (validateInput(compagne))
          compagne = 0;
        pc.obj.CAMPAGNE = compagne;

        PeriodeEstimation.getPeriodeEstimation(pc.obj).then(e => {
          pc.estimation_periode_array = e.data
          setTimeout(function() {
            NProgress.done();
            NProgress.remove();
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
        });

      };

      pc.getPeriodeEstimation = (estimationPeriode) => {
        return moment(estimationPeriode.Date_Debut).format('YYYY-MM-DD') + " / " + moment(estimationPeriode.Date_Fin).format('YYYY-MM-DD') + " (" + estimationPeriode.CodePeriode + ")";
      }

      pc.domaine_change = function() {
        NProgress.start();
        var domaine = $scope.domaine;
        if (validateInput(domaine))
          domaine = 0;
        pc.obj.DOMAINE = domaine;
        VarieteService.getVarieteByFarm({
          idferme: pc.obj.DOMAINE
        }).then(v => {
          pc.variete_array = v.data;
          setTimeout(function() {
            NProgress.done();
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
        });
      };

      pc.societe_change = function() {
        var societe = $scope.societe;
        if (validateInput(societe))
          societe = 0;
        pc.obj.ID_Societe = societe;
        pc.filterWithItems.societe = societe;
        setTimeout(function() {
          $("#Domaine").selectpicker('refresh');
        }, 1000);
        //load variety
      };

      function validateInput(data) {
        if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
          return true;
        }
        return false;
      }


    }); // end am4core.ready()


  });