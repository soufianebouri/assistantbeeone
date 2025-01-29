'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTechniqueTabsTbTechniqueMetioCtrl
 * @description
 * # TableaudebordTechniqueTabsTbTechniqueMetioCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTechniqueTabsTbTechniqueMetioCtrl', function($scope, $rootScope, translatedwords, $translatePartialLoader, $translate, $http, campagneagricole, $cookies, $q, tbTechnique, domaine, $window) {
    moment.locale('fr');
    var pc = this;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;
    pc.latFerme = $cookies.getObject('globals').ferme.latitude;
    pc.lngFerme = $cookies.getObject('globals').ferme.longitude;
    pc.obj = {
      "FERME": pc.IDferme,
      "IDSOCIETE": pc.IDSOCIETE,
      "DateDebut": moment().subtract(6, "days").format("YYYYMMDD"),
      "DateFin": moment().format("YYYYMMDD"),
      "latitude": 0,
      "longitude": 0
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.yr = false;


    $rootScope.$on('broadcastDashboard', function(event, data) {
      $scope.tb_technique_metio_ForecastMetiogramme = data.tb_technique_metio_ForecastMetiogramme;
      $scope.tb_technique_metio_ForecastGeneral = data.tb_technique_metio_ForecastGeneral;
    })

    pc.loadData = function() {
      $q.all([tbTechnique.getForecastGenerale(pc.obj), domaine.DomaineByID({
        "IDFermes": pc.IDferme
      })]).then(function(values) {
        pc.ForecastGenerale = values[0].data;
        pc.MyDomaine = values[1].data;
        if (pc.MyDomaine.length > 0) {
          pc.obj.latitude = pc.MyDomaine[0].Latitude;
          pc.obj.longitude = pc.MyDomaine[0].Longitude;
        }
        if (!pc.obj.latitude || !pc.obj.longitude || pc.obj.latitude == 0 || pc.obj.longitude == 0 || pc.obj.latitude == "" || pc.obj.longitude == "") {
          $scope.latlongValidate = false;
        } else {
          $scope.latlongValidate = true;
        }
        if ($scope.latlongValidate) {
          $scope.placeWindy = 'https://embed.windy.com/embed2.html?lat=' + pc.obj.latitude + '&lon=' + pc.obj.longitude + '&detailLat=' + pc.obj.latitude + '&detailLon=' + pc.obj.longitude + '&height=430&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1';
          $q.all([tbTechnique.getPlaces(pc.obj)]).then(function(values) {
            pc.Places = values[0].data;
            pc.PlacePath = pc.Places._embedded.location[0].urlPaths;
            if (pc.PlacePath) {
              $scope.place = 'https://www.yr.no/place/' + pc.PlacePath.replace(/\s/g, '_') + '/external_box_hour_by_hour.html';
            } else {
              $scope.place = 'https://www.yr.no/place/Morocco/Casablanca/Douar_Sidi_Youssef_Ben_Ali/external_box_hour_by_hour.html';
            }
            NProgress.done();
          });
        } else {
          $scope.place = 'https://www.yr.no/place/Morocco/Casablanca/Douar_Sidi_Youssef_Ben_Ali/external_box_hour_by_hour.html';
          $scope.placeWindy = 'https://embed.windy.com/embed2.html?lat=33.852&lon=-6.768&detailLat=33.852&detailLon=-6.768&height=430&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1';

          NProgress.done();
        }

        pc.loadForecastGenerale(pc.ForecastGenerale);

      });
    }

    pc.loadForecastGenerale = function(data) {

      //chart generale
      var chart = am4core.create("ForecastGenerale", am4charts.XYChart);
      chart.data = data;
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());


      var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis1.title.text = "";




      var series1 = chart.series.push(new am4charts.LineSeries());
      series1.dataFields.valueY = "TMoy";
      series1.dataFields.dateX = "date";
      series1.name = "T°Moy";
      series1.strokeWidth = 2;
      series1.yAxis = valueAxis1;
      series1.tooltipText = "{name} : [bold font-size: 15]{valueY}°[/]";
      series1.stroke = am4core.color("#de2828");
      series1.propertyFields.strokeDasharray = "dashLength";
      series1.showOnInit = true;
      series1.tooltip.getFillFromObject = false;
      series1.tooltip.background.fill = am4core.color("#de2828");

      var bullet3 = series1.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");


      var series2 = chart.series.push(new am4charts.LineSeries());
      series2.dataFields.valueY = "Tmin";
      series2.dataFields.dateX = "date";
      series2.name = "T°Min";
      series2.strokeWidth = 2;
      series2.yAxis = valueAxis1;
      series2.tooltipText = "{name} : [bold font-size: 15]{valueY}°[/]";
      series2.stroke = am4core.color("#97cf8d");
      series2.tooltip.getFillFromObject = false;
      series2.tooltip.background.fill = am4core.color("#97cf8d");

      var bullet3 = series2.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");

      var series3 = chart.series.push(new am4charts.LineSeries());
      series3.dataFields.valueY = "TMax";
      series3.dataFields.dateX = "date";
      series3.name = "T°Max";
      series3.strokeWidth = 2;
      series3.yAxis = valueAxis1;
      series3.stroke = am4core.color("#f2b330");
      series3.tooltipText = "{name} : [bold font-size: 15]{valueY}°[/]";
      series3.tooltip.getFillFromObject = false;
      series3.tooltip.background.fill = am4core.color("#f2b330");

      var bullet3 = series3.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");




      var series4 = chart.series.push(new am4charts.LineSeries());
      series4.dataFields.valueY = "Pluvio";
      series4.dataFields.dateX = "date";
      series4.name = "Pluviometry";
      series4.strokeWidth = 2;
      series4.yAxis = valueAxis1;
      series4.tooltipText = "{name} : [bold font-size: 15]{valueY}mm[/]";
      series4.stroke = am4core.color("#68b7dc");
      series4.propertyFields.strokeDasharray = "dashLength";
      series4.showOnInit = true;
      series4.tooltip.getFillFromObject = false;
      series4.tooltip.background.fill = am4core.color("#68b7dc");

      var bullet3 = series4.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");



      var series5 = chart.series.push(new am4charts.LineSeries());
      series5.dataFields.valueY = "E0";
      series5.dataFields.dateX = "date";
      series5.name = "E0";
      series5.strokeWidth = 2;
      series5.yAxis = valueAxis1;
      series5.stroke = am4core.color("#f51be3");
      series5.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series5.tooltip.getFillFromObject = false;
      series5.tooltip.background.fill = am4core.color("#f51be3");

      var bullet3 = series5.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");


      var series6 = chart.series.push(new am4charts.LineSeries());
      series6.dataFields.valueY = "Vent";
      series6.dataFields.dateX = "date";
      series6.name = "Vent";
      series6.strokeWidth = 2;
      series6.yAxis = valueAxis1;
      series6.tooltipText = "{name} : [bold font-size: 15]{valueY}Km/h[/]";
      series6.stroke = am4core.color("#213cd9");
      series6.propertyFields.strokeDasharray = "dashLength";
      series6.showOnInit = true;
      series6.tooltip.getFillFromObject = false;
      series6.tooltip.background.fill = am4core.color("#213cd9");

      var bullet3 = series6.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");


      var series7 = chart.series.push(new am4charts.LineSeries());
      series7.dataFields.valueY = "Hyg";
      series7.dataFields.dateX = "date";
      series7.name = "Hyg";
      series7.strokeWidth = 2;
      series7.yAxis = valueAxis1;
      series7.tooltipText = "{name} : [bold font-size: 15]{valueY}[/]";
      series7.stroke = am4core.color("#1bf5ee");
      series7.propertyFields.strokeDasharray = "dashLength";
      series7.showOnInit = true;
      series7.tooltip.getFillFromObject = false;
      series7.tooltip.background.fill = am4core.color("#1bf5ee");

      var bullet3 = series7.bullets.push(new am4charts.CircleBullet());
      bullet3.circle.radius = 3;
      bullet3.circle.strokeWidth = 2;
      bullet3.circle.fill = am4core.color("#fff");




      var indicator;
      var indicatorInterval;

      function showIndicator() {

        if (!indicator) {
          indicator = chart.tooltipContainer.createChild(am4core.Container);
          indicator.background.fill = am4core.color("#fff");
          indicator.background.fillOpacity = 0.8;
          indicator.width = am4core.percent(100);
          indicator.height = am4core.percent(100);

          var indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = "Loading ...";
          indicatorLabel.align = "center";
          indicatorLabel.valign = "middle";
          indicatorLabel.fontSize = 20;
          indicatorLabel.dy = 50;

          var hourglass = indicator.createChild(am4core.Image);
          hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
          hourglass.align = "center";
          hourglass.valign = "middle";
          hourglass.horizontalCenter = "middle";
          hourglass.verticalCenter = "middle";
          hourglass.scale = 0.7;
        }

        indicator.hide(0);
        indicator.show();

        clearInterval(indicatorInterval);
        indicatorInterval = setInterval(function() {
          hourglass.animate([{
            from: 0,
            to: 360,
            property: "rotation"
          }], 2000);
        }, 3000);
      }

      function hideIndicator() {
        indicator.hide();
        clearInterval(indicatorInterval);
      }

      showIndicator();


      // Add cursor
      chart.cursor = new am4charts.XYCursor();

      // Add legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = "top";

      // Add scrollbar
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series1);
      chart.scrollbarX.series.push(series3);
      chart.scrollbarX.parent = chart.bottomAxesContainer;

      chart.events.on('ready', () => {
        hideIndicator()
      });
    }

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#compagne").selectpicker('refresh');
    }, 1000);


    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete)]).then(function(values) {
      pc.compagne_array = values[0].data;
      setTimeout(function() {
        $("#compagne").selectpicker('refresh');
      }, 1000);
      NProgress.done();
    });

    pc.loadData();

    pc.compagne_change = () => {
      if ($scope.compagne) {

        $("#reportrange_tb_technique span").html(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").val(moment($scope.compagne.Date_debut).format('DD/MM/YYYYY') + " - " + moment($scope.compagne.Date_Fin).format('DD/MM/YYYYY'))
        $("#reportrange_tb_technique input").trigger("change");

        pc.obj.DateDebut = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DateFin = moment($scope.compagne.Date_Fin).format('YYYYMMDD');


        pc.loadData();
      }
    }

    $("#reportrange_tb_technique input").change((e) => {
      var periode = $("#reportrange_tb_technique input").val().split(" - ");
      if (periode.length == 1) {
        pc.obj.DateDebut = moment().startOf('year').format('YYYYMMDD');
        pc.obj.DateFin = moment().endOf('year').format('YYYYMMDD');
      } else {
        pc.obj.DateDebut = periode[0];
        pc.obj.DateFin = periode[1];
      }
      pc.loadData();
    });

    async function daterange_tb_technique(from, to) {
      to = moment();
      from = moment().subtract(6, "days");
      var range = {
        'Semaine1': [moment().subtract(6, "days"), moment()],
        '15 jours1': [moment().subtract(14, "days"), moment()],
        '1 mois1': [moment().startOf("month"), moment().endOf("month")],
        'Trimestre1': [moment().subtract(2, 'month').startOf("month"), moment().endOf("month")]
      }

      range[await translatedwords.getTranslatedWord($translate("Semaine"))] = range['Semaine1'];
      range[await translatedwords.getTranslatedWord($translate("15 jours"))] = range['15 jours1'];
      range[await translatedwords.getTranslatedWord($translate("1 mois"))] = range['1 mois1'];
      range[await translatedwords.getTranslatedWord($translate("Trimestre"))] = range['Trimestre1'];
      delete range['Semaine1'];
      delete range['15 jours1'];
      delete range['1 mois1'];
      delete range['Trimestre1'];
      if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function(a, b, c) {
            if (c == "Annuel") {
              $("#reportrange_tb_technique span").html(a.format("YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYY"))
              $("#reportrange_tb_technique input").trigger("change");
            } else {
              $("#reportrange_tb_technique span").html(a.format("DD/MM/YYYY") + " - " + b.format("DD/MM/YYYY"))
              $("#reportrange_tb_technique input").val(a.format("YYYYMMDD") + " - " + b.format("YYYYMMDD"))
              $("#reportrange_tb_technique input").trigger("change");
            }
          },
          b = {
            startDate: moment().subtract(6, "days"),
            endDate: moment(),
            showDropdowns: !0,
            showWeekNumbers: !0,
            timePicker: !1,
            timePickerIncrement: 1,
            timePicker12Hour: !0,
            ranges: range,
            opens: "left",
            buttonClasses: ["btn btn-default"],
            applyClass: "btn-small btn-primary",
            cancelClass: "btn-small",
            format: "DD/MM/YYYY",
            separator: await translatedwords.getTranslatedWord($translate(" à ")),
            locale: {
              applyLabel: await translatedwords.getTranslatedWord($translate("Valider")),
              cancelLabel: await translatedwords.getTranslatedWord($translate("Vider")),
              fromLabel: await translatedwords.getTranslatedWord($translate("De")),
              toLabel: await translatedwords.getTranslatedWord($translate("à")),
              customRangeLabel: await translatedwords.getTranslatedWord($translate("Personnalisée")),
              daysOfWeek: [await translatedwords.getTranslatedWord($translate("Lun")),
                await translatedwords.getTranslatedWord($translate("Mar")),
                await translatedwords.getTranslatedWord($translate("Mer")),
                await translatedwords.getTranslatedWord($translate("Jeu")),
                await translatedwords.getTranslatedWord($translate("Ven")),
                await translatedwords.getTranslatedWord($translate("Sam")),
                await translatedwords.getTranslatedWord($translate("Dim"))
              ],
              monthNames: [await translatedwords.getTranslatedWord($translate("Janvier")),
                await translatedwords.getTranslatedWord($translate("février")),
                await translatedwords.getTranslatedWord($translate("mars")),
                await translatedwords.getTranslatedWord($translate("avril")),
                await translatedwords.getTranslatedWord($translate("mai")),
                await translatedwords.getTranslatedWord($translate("juin")),
                await translatedwords.getTranslatedWord($translate("juillet")),
                await translatedwords.getTranslatedWord($translate("août")),
                await translatedwords.getTranslatedWord($translate("septembre")),
                await translatedwords.getTranslatedWord($translate("octobre")),
                await translatedwords.getTranslatedWord($translate("novembre")),
                await translatedwords.getTranslatedWord($translate("décembre"))
              ],
              firstDay: 1
            }
          };
        $("#reportrange_tb_technique span").html(moment().subtract(6, "days").format("DD/MM/YYYY") + " - " + moment().format("DD/MM/YYYY")), $("#reportrange_tb_technique").daterangepicker(b, a), $("#reportrange_tb_technique").on("show.daterangepicker", function() {

        }), $("#reportrange_tb_technique").on("hide.daterangepicker", function() {

        }), $("#reportrange_tb_technique").on("apply.daterangepicker", function(a, b) {

        }), $("#reportrange_tb_technique").on("cancel.daterangepicker", function(a, b) {

        }), $("#options1").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(b, a)
        }), $("#options2").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").setOptions(optionSet2, a)
        }), $("#destroy").click(function() {
          $("#reportrange_tb_technique").data("daterangepicker").remove()
        })
      }
    }

    setTimeout(function() {
      daterange_tb_technique(null, null)
    }, 100);

  });