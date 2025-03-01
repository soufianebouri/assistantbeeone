'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:TableaudebordTbOrganisationparcelisationCtrl
 * @description
 * # TableaudebordTbOrganisationparcelisationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('TableaudebordTbOrganisationparcelisationCtrl', function($scope, translatedwords, toastr, DTOptionsBuilder, tborganisationparcelisation, BusinessUnit, getsuperficie, gestionPays, TrancheAge, cultureService, VarieteService, portGreffe, campagneagricole, $translatePartialLoader, $window, $translate, DTColumnBuilder, $q, $compile, $state, $cookies, _url, comptageArbre, parcellecultural, domaine, elementcomptage) {
    var pc = this;
    pc.NombreByElement = [];
    pc.ALLParcelle = [];
    pc.IDDOMAINE = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('beeoneAssistant').ferme.IDSociete;
    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Ferme").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#port_greff").selectpicker('refresh');
      $("#age").selectpicker('refresh');
      $("#Region").selectpicker('refresh');
      $("#BusinessUnit").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      DOMAINE: [0],
      CULTURE: [0],
      VARIETE: [0],
      PORTGREFF: [0],
      REGION: [0],
      AGE: [0],
      IDsociete: [0],
      BusinessUnit: [0],
      DATE_DEBUT: 0,
      DATE_FIN: 0
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDDOMAINE), domaine.DomaineByID({
        "IDFermes": pc.IDDOMAINE
      }),
      domaine.getDomaine(),
      campagneagricole.compagneFiltrer(pc.obj),
      cultureService.getCultureFiltrer(pc.obj),

      VarieteService.getVarieteFiltrer(pc.obj),

      portGreffe.getPortGreffe(),
      TrancheAge.getcode(_url),
      gestionPays.getregion(),
      BusinessUnit.getAllBusinessUnit()
    ]).then(function(values) {
      pc.ALLParcelle = values[0].data;
      pc.MyFerme = values[1].data;

      pc.Fermes = values[2].data;
      pc.compagne_array = values[3].data;
      pc.culture_array = values[4].data;
      pc.variete_array = values[5].data;
      pc.port_greffs_array = values[6].data;
      pc.TrancheAges = values[7].data;
      pc.Regions = values[8].data;
      pc.BusinessUnits = values[9].data;

      //pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);
      NProgress.done();
      setTimeout(function() {
        $("#Ferme").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#port_greff").selectpicker('refresh');
        $("#age").selectpicker('refresh');
        $("#Region").selectpicker('refresh');
        $("#BusinessUnit").selectpicker('refresh');
      }, 1000);
    });

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.Ferme_change = function() {
      console.log($scope.Ferme);
      var Ferme = $scope.Ferme;
      if (validateInput(Ferme) || $scope.Ferme.length === 0 || $scope.Ferme.includes(0)) {
        Ferme = [0];
      }
      pc.obj.CULTURE = [0];
      pc.obj.VARIETE = [0];
      pc.obj.DOMAINE = Ferme;


      setTimeout(function() {
        $("#variete").selectpicker('refresh');
        $('#variete').selectpicker('deselectAll');
        $("#culture").selectpicker('refresh');
        $('#culture').selectpicker('deselectAll');
        NProgress.done();
      }, 100);
    };

    pc.compagne_change = () => {
      if ($scope.compagne) {
        var canGo = true;
        angular.forEach(pc.compagne_array, (v, k) => {
          if (canGo && v.ID_compagne == $scope.compagne) {
            canGo = false;
            pc.obj.DATE_DEBUT = moment(v.Date_debut).format('YYYYMMDD');
            pc.obj.DATE_FIN = moment(v.Date_Fin).format('YYYYMMDD');

            $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
            $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
          }
        });
      }
    }


    pc.culture_change = () => {
      NProgress.start();
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.CULTURE = $scope.culture;
        pc.obj.VARIETE = [0];
      } else {
        pc.obj.CULTURE = [0];
      }

      $q.all([VarieteService.getVarieteFiltrer(pc.obj)]).then((values) => {
        pc.variete_array = values[0].data;

        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $('#variete').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });

    }


    pc.variete_change = () => {
      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.VARIETE = $scope.variete;
      } else {
        pc.obj.VARIETE = [0];
      }

    }

    pc.port_greff_change = () => {
      if ($scope.port_greff && $scope.port_greff.length > 0 && !$scope.port_greff.includes(0)) {
        pc.obj.PORTGREFF = $scope.port_greff;
      } else {
        pc.obj.PORTGREFF = [0];
      }
    }

    pc.age_change = () => {
      if ($scope.age && $scope.age.length > 0 && !$scope.age.includes(0)) {
        pc.obj.AGE = $scope.age;
      } else {
        pc.obj.AGE = [0];
      }
    }


    pc.Region_change = function() {

      var Region = $scope.Region;
      if (validateInput(Region) || $scope.Region.length === 0 || $scope.Region.includes(0)) {
        Region = [1, 2];
      }

      pc.obj.REGION = Region;

      NProgress.start();
      $q.all([domaine.getDomaineByRegion({
        REGION: pc.obj.REGION
      })]).then((values) => {
        pc.Fermes = values[0].data;
        pc.obj.DOMAINE = [0];
        setTimeout(function() {
          $("#Ferme").selectpicker('refresh');
          $('#Ferme').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      })


    };


    pc.BusinessUnit_change = () => {
      if ($scope.BusinessUnit && $scope.BusinessUnit.length > 0 && !$scope.BusinessUnit.includes(0)) {
        pc.obj.BusinessUnit = $scope.BusinessUnit;
      } else {
        pc.obj.BusinessUnit = [0];
      }
    }
    pc.repartitionbyvariete = [];
    pc.repartitionbyPortegreffe = [];
    pc.repartitionbyAge = [];
    pc.repartitionbyRegion = [];
    pc.repartitionbyBusinessunit = [];
    pc.Search = async () => {


      if ($scope.compagne) {
        $q.all([tborganisationparcelisation.repartitionbyvariete(pc.obj),
          tborganisationparcelisation.repartitionbyPortegreffe(pc.obj),
          tborganisationparcelisation.repartitionbyAge(pc.obj),
          tborganisationparcelisation.repartitionbyRegion(pc.obj),
          tborganisationparcelisation.repartitionbyBusinessunit(pc.obj),
          tborganisationparcelisation.getFermesForMap(pc.obj),
          tborganisationparcelisation.getParcelleForMap(pc.obj),
          tborganisationparcelisation.getsupByfiltre(pc.obj)
        ]).then(function(values) {
          pc.repartitionbyvariete = values[0].data;
          pc.repartitionbyPortegreffe = values[1].data;
          pc.repartitionbyAge = values[2].data;
          pc.repartitionbyRegion = values[3].data;
          pc.repartitionbyBusinessunit = values[4].data;
          pc.FermesMap = values[5].data;
          pc.ParcellesMap = values[6].data;
          pc.getSup = values[7].data;
          console.log(pc.getSup);
          pc.setInitialMap(pc.ParcellesMap, pc.FermesMap);

          //by variete
          // Themes begin
          /* Set theme(s) */
          am4core.useTheme(am4themes_animated);

          /* Create chart */
          var chart = am4core.create("chart_variete", am4charts.PieChart);

          /* Add data */
          chart.data = pc.repartitionbyvariete;

          /* Create series */
          var series = chart.series.push(new am4charts.PieSeries());
          series.dataFields.value = "Superficie";
          series.dataFields.category = "Variete";

          /* Disable labels */
          series.labels.template.disabled = true;
          series.ticks.template.disabled = true;
          series.legendSettings.itemValueText = "[bold]{Superficie}[/bold] Ha"

          /* Create legend */
          chart.legend = new am4charts.Legend();
          chart.legend.valueLabels.template.align = "left";
          chart.legend.valueLabels.template.textAlign = "end";

          /* Create a separate container to put legend in */
          var legendContainer = am4core.create("legenddiv", am4core.Container);
          legendContainer.width = am4core.percent(100);
          legendContainer.height = am4core.percent(100);
          chart.legend.parent = legendContainer;
          chart.exporting.menu = new am4core.ExportMenu();
          chart.exporting.extraSprites.push({
            "sprite": legendContainer,
            "position": "bottom",
            "marginTop": 20
          });

          //by Portegreffe
          am4core.useTheme(am4themes_animated);

          /* Create chart */
          var chartPortegreffe = am4core.create("chart_portegreffe", am4charts.PieChart);

          /* Add data */
          chartPortegreffe.data = pc.repartitionbyPortegreffe;

          /* Create series */
          var seriesPortegreffe = chartPortegreffe.series.push(new am4charts.PieSeries());
          seriesPortegreffe.dataFields.value = "Superficie";
          seriesPortegreffe.dataFields.category = "Porte_greffe";

          /* Disable labels */
          seriesPortegreffe.labels.template.disabled = true;
          seriesPortegreffe.ticks.template.disabled = true;
          //  seriesPortegreffe.legendSettings.valueText = "[[title]] : [[percents]] %<br/> [[value]] hectare",
          seriesPortegreffe.legendSettings.itemValueText = "[bold]{Superficie}[/bold] Ha"

          /* Create legend */
          chartPortegreffe.legend = new am4charts.Legend();
          chartPortegreffe.legend.valueLabels.template.align = "left";
          chartPortegreffe.legend.valueLabels.template.textAlign = "end";
          /* Create a separate container to put legend in */
          var legendContainerPortegreffe = am4core.create("legenddivPortgref", am4core.Container);
          legendContainerPortegreffe.width = am4core.percent(100);
          legendContainerPortegreffe.height = am4core.percent(100);
          chartPortegreffe.legend.parent = legendContainerPortegreffe;


          chartPortegreffe.exporting.menu = new am4core.ExportMenu();
          chartPortegreffe.exporting.extraSprites.push({
            "sprite": legendContainerPortegreffe,
            "position": "bottom",
            "marginTop": 20
          });

          //by Age
          // Themes begin
          /* Set theme(s) */
          am4core.useTheme(am4themes_animated);

          /* Create chart */
          var chartAge = am4core.create("chart_Age", am4charts.PieChart);

          /* Add data */
          chartAge.data = pc.repartitionbyAge;

          /* Create series */
          var seriesAge = chartAge.series.push(new am4charts.PieSeries());
          seriesAge.dataFields.value = "Superficie";
          seriesAge.dataFields.category = "Age";

          /* Disable labels */
          seriesAge.labels.template.disabled = true;
          seriesAge.ticks.template.disabled = true;
          seriesAge.legendSettings.itemValueText = "[bold]{Superficie}[/bold] Ha"

          /* Create legend */
          chartAge.legend = new am4charts.Legend();
          chartAge.legend.valueLabels.template.align = "left";
          chartAge.legend.valueLabels.template.textAlign = "end";

          /* Create a separate container to put legend in */
          var legendContainerAge = am4core.create("legenddivportegreffe", am4core.Container);
          legendContainerAge.width = am4core.percent(100);
          legendContainerAge.height = am4core.percent(100);
          chartAge.legend.parent = legendContainerAge;
          chartAge.exporting.menu = new am4core.ExportMenu();
          chartAge.exporting.extraSprites.push({
            "sprite": legendContainerAge,
            "position": "bottom",
            "marginTop": 20
          });

          //by Region
          // Themes begin
          /* Set theme(s) */
          am4core.useTheme(am4themes_animated);

          /* Create chart */
          var chartRegion = am4core.create("chart_Region", am4charts.PieChart);

          /* Add data */
          chartRegion.data = pc.repartitionbyRegion;

          /* Create series */
          var seriesRegion = chartRegion.series.push(new am4charts.PieSeries());
          seriesRegion.dataFields.value = "Superficie";
          seriesRegion.dataFields.category = "Region";

          /* Disable labels */
          seriesRegion.labels.template.disabled = true;
          seriesRegion.ticks.template.disabled = true;
          seriesRegion.legendSettings.itemValueText = "[bold]{Superficie}[/bold] Ha"

          /* Create legend */
          chartRegion.legend = new am4charts.Legend();
          chartRegion.legend.valueLabels.template.align = "left";
          chartRegion.legend.valueLabels.template.textAlign = "end";

          /* Create a separate container to put legend in */
          var legendContainerRegion = am4core.create("legenddivRegion", am4core.Container);
          legendContainerRegion.width = am4core.percent(100);
          legendContainerRegion.height = am4core.percent(100);
          chartRegion.legend.parent = legendContainerRegion;
          chartRegion.exporting.menu = new am4core.ExportMenu();
          chartRegion.exporting.extraSprites.push({
            "sprite": legendContainerRegion,
            "position": "bottom",
            "marginTop": 20
          });

          //by Businessunit
          am4core.useTheme(am4themes_animated);

          /* Create chart */
          var chartBusinessunit = am4core.create("chart_Businessunit", am4charts.PieChart);

          /* Add data */
          chartBusinessunit.data = pc.repartitionbyBusinessunit;

          /* Create series */
          var seriesBusinessunit = chartBusinessunit.series.push(new am4charts.PieSeries());
          seriesBusinessunit.dataFields.value = "Superficie";
          seriesBusinessunit.dataFields.category = "Business_unit";

          /* Disable labels */
          seriesBusinessunit.labels.template.disabled = true;
          seriesBusinessunit.ticks.template.disabled = true;
          seriesBusinessunit.legendSettings.itemValueText = "[bold]{Superficie}[/bold] Ha"

          /* Create legend */
          chartBusinessunit.legend = new am4charts.Legend();
          chartBusinessunit.legend.valueLabels.template.align = "left";
          chartBusinessunit.legend.valueLabels.template.textAlign = "end";

          /* Create a separate container to put legend in */
          var legendContainerBusinessunit = am4core.create("legenddivBusinessunit", am4core.Container);
          legendContainerBusinessunit.width = am4core.percent(100);
          legendContainerBusinessunit.height = am4core.percent(100);
          chartBusinessunit.legend.parent = legendContainerBusinessunit;
          chartBusinessunit.exporting.menu = new am4core.ExportMenu();
          chartBusinessunit.exporting.extraSprites.push({
            "sprite": legendContainerBusinessunit,
            "position": "bottom",
            "marginTop": 20
          });
          NProgress.done();
        })
      } else {
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner au moins une campagne agricole")), {
          closeButton: true
        });
      }

    }


    //costum map vars
    var markerGroups = {
      "piege": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var iconnanimg = {
      url: "././images/fermes.png",
      scaledSize: new google.maps.Size(50, 50)
    };



    var shapes = [];
    var IO = {
      OUT: function(arr, //array containg the stored shape-definitions
        map, //map where to draw the shapes
        color_ligne, //couleur de ligne du polygne
        color_calque, //couleur de calque du polygne
        mydata
      ) {
        var goo = google.maps,
          map = map || null,
          shape, tmp;
        if (arr) {
          for (var i = 0; i < arr.length; i++) {
            shape = arr[i];

            switch (shape.type) {
              case 'CIRCLE':
                tmp = new goo.Circle({
                  radius: Number(shape.radius),
                  center: this.pp_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'MARKER':
                tmp = new goo.Marker({
                  position: this.pp_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'RECTANGLE':
                tmp = new goo.Rectangle({
                  bounds: this.bb_.apply(this, shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYLINE':
                tmp = new goo.Polyline({
                  path: this.ll_(shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYGON':
                tmp = new goo.Polygon({
                  paths: this.mm_(shape.geometry),
                  strokeColor: color_ligne,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: color_calque,
                  fillOpacity: 0.50,
                  data: mydata
                });
                break;
            }
            try {
              tmp.setValues({
                map: map,
                id: shape.id
              })
              shapes.push(tmp);
            } catch (e) {

            }

          }
        }
        return shapes;
      },
      l_: function(path, e) {
        path = (path.getArray) ? path.getArray() : path;
        if (e) {
          return google.maps.geometry.encoding.encodePath(path);
        } else {
          var r = [];
          for (var i = 0; i < path.length; ++i) {
            r.push(this.p_(path[i]));
          }
          return r;
        }
      },
      ll_: function(path) {
        if (typeof path === 'string') {
          return google.maps.geometry.encoding.decodePath(path);
        } else {
          var r = [];
          for (var i = 0; i < path.length; ++i) {
            r.push(this.pp_.apply(this, path[i]));
          }
          return r;
        }
      },

      m_: function(paths, e) {
        var r = [];
        paths = (paths.getArray) ? paths.getArray() : paths;
        for (var i = 0; i < paths.length; ++i) {
          r.push(this.l_(paths[i], e));
        }
        return r;
      },
      mm_: function(paths) {
        var r = [];
        for (var i = 0; i < paths.length; ++i) {
          r.push(this.ll_.call(this, paths[i]));

        }
        return r;
      },
      p_: function(latLng) {
        return ([latLng.lat(), latLng.lng()]);
      },
      pp_: function(lat, lng) {
        return new google.maps.LatLng(lat, lng);
      },
      b_: function(bounds) {
        return ([this.p_(bounds.getSouthWest()),
          this.p_(bounds.getNorthEast())
        ]);
      },
      bb_: function(sw, ne) {
        return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
          this.pp_.apply(this, ne));
      },
      t_: function(s) {
        var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
        for (var i = 0; i < t.length; ++i) {
          if (s === google.maps.drawing.OverlayType[t[i]]) {
            return t[i];
          }
        }
      }

    }

    var map,
      markers,
      byId = function(s) {
        return document.getElementById(s)
      },
      clearShapes = function() {
        for (var i = 0; i < shapes.length; ++i) {
          shapes[i].setMap(null);
        }
        shapes = [];
      },
      clearMarkers = function() {
        for (var i = 0; i < markerGroups['piege'].length; i++) {
          markerGroups['piege'][i].setMap(null);
        }
      };
    var markersArray = [];

    map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    new google.maps.event.addListener(map, 'zoom_changed', function() {
      var zoomm = map.getZoom();
      if (zoomm >= 8) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      } else {
        var mapStyles = [{
          featureType: "administrative.country",
          stylers: [{
            visibility: "off"
          }]
        }];
        var mapType = new google.maps.StyledMapType(mapStyles, {
          name: "Maroc"
        });
        //map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.mapTypes.set('maroc', mapType);
        map.setMapTypeId('maroc');
      }
    });


    pc.checklatlng = function(lat, lng) {
      if (lat !== 0 && lng !== 0 && lat != null && lng != null && lat !== "0" && lng !== "0" && lat !== "" && lng !== "")
        return true;
      return false;
    }

    //first loading map
    pc.setInitialMap = function(dataparcelle, dataferme) {

      clearMarkers();
      clearShapes();
      var mydata = [];
      var dataonebyone = {};
      //set center map & zoom
      /*if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 17;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].Coord_X, dataparcelle[0].Coord_Y)) {
        var lllat = dataparcelle[0].Coord_X;
        var lllng = dataparcelle[0].Coord_Y;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }*/
      var lllat = 33.9691409;
      var lllng = -6.9273709;
      var zoooom = 4;
      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);


      angular.forEach(dataparcelle, function(value, key) {
        if (value.LatPosition != 0 && value.LngPosition != 0 && value.LatPosition && value.LngPosition) {
          dataparcelle = {
            'Ref': value.Ref,
            'Sup': value.Sup,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'VarieteNom': value.VarieteNom
          }
        }
        if (value.TokenPolygone !== "") {
          IO.OUT(JSON.parse(value.TokenPolygone), map, value.CouleurCadre, value.CouleurCalque, dataparcelle);
        }
      });


      for (var i = 0; i < dataferme.length; i++) {
        if (dataferme[i].Latitude != 0 && dataferme[i].Latitude != 0 && dataferme[i].Longitude && dataferme[i].Longitude) {
          var point = new google.maps.LatLng(
            parseFloat(dataferme[i].Latitude),
            parseFloat(dataferme[i].Longitude));
          var type = 'piege';
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            type: type,
            icon: iconnanimg,
            label: {
              text: dataferme[i].Nom,
              color: "#ffb700",
              fontSize: "12px",
              fontWeight: "bold"
            },
            title: "Ferme : " + dataferme[i].Nom
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>" + dataferme[i].Nom + "</center>";
          bindInfoWindow(marker, map, infoWindow, html, dataferme[i]);


        }

      }


      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function() {
          var contentString = "name";

          var point = new google.maps.LatLng(
            parseFloat(this.data.lat),
            parseFloat(this.data.lng));
          var REF_Parcelle = this.data.Ref;
          var Sup = this.data.Sup;
          var Variete = this.data.VarieteNom;
          var html = "<center><b>Parcelle culturale</b></center>";
          html += "<table>";
          html += "<tr><td>Référence</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + REF_Parcelle + "</td></tr>";

          html += "<tr><td>Superficie</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Sup + " Ha</td></tr>";

          html += "<tr><td>Variété</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + Variete + "</td></tr>";

          html += "<tr><td>Position</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>(" + this.data.lat + ", " + this.data.lng + ")</td></tr>";

          html += "</table>";


          infoWindow.setContent(html);
          infoWindow.setPosition(point);
          infoWindow.open(map);
        });
      }




      if (map.getZoom() <= 14) {
        var mapStyles = [{
          featureType: "administrative.country",
          stylers: [{
            visibility: "off"
          }]
        }];
        var mapType = new google.maps.StyledMapType(mapStyles, {
          name: "Maroc"
        });
        //map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.mapTypes.set('maroc', mapType);
        map.setMapTypeId('maroc');
      }

      if (map.getZoom() >= 8) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }
    }


    pc.setInitialMap([], []);

    function bindInfoWindow(marker, map, infoWindow, html, mydatasellected) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
    }


    //Fin load Map

    // Data
    var allData = {
      "2002": {
        "7FOUR7": 0,
        "A 28-56": 0,
        "ACHTAR": 0,
        "AFOURER": 0,
        "AGRIA": 0,
        "AGUADILUS BLANCHE": 0,
        "AGUADILUS VIOLET": 0,
        "AIDA": 0,
        "BRUNO": 0,
        "CADOUX": 0,
        "AIN TAOUJDATE": 0,
        "NAVEL LANE LATE": 0,
        "NAVEL NEW HALL	": 0,
        "NAVEL ROBERTSON	": 0,
        "NAVEL U.7": 0,
        "NAVELINA": 0,
        "POMELO": 0,
        "VALENCIA LATE": 0,
        "SALUSTIANA": 0
      }
    };

    /*    async function generateRandomValues() {
      for (let year = 2002; year <= 2024; year++) {
        await new Promise(resolve => {
          setTimeout(() => {
            let data = allData[year.toString()];
            if (data) {
              for (let key in data) {
                if (data.hasOwnProperty(key)) {
                  // Generate a random value between 0 and 100 (inclusive)
                  data[key] = Math.floor(Math.random() * 101);
                }
              }
            } else {
              // If data for the year doesn't exist, create it with random values
              allData[year.toString()] = {};
              let newData = allData[year.toString()];
              for (let key in allData["2002"]) {
                if (allData["2002"].hasOwnProperty(key)) {
                  newData[key] = Math.floor(Math.random() * 101);
                }
              }
            }
            resolve();
          }, 0);
        });
      }
    }

  generateRandomValues().then(() => {

      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      var root = am5.Root.new("race");

      root.numberFormatter.setAll({
        numberFormat: "#a",

        // Group only into M (millions), and B (billions)
        bigNumberPrefixes: [{
            number: 1e6,
            suffix: "M"
          },
          {
            number: 1e9,
            suffix: "B"
          }
        ],

        // Do not use small number prefixes at all
        smallNumberPrefixes: []
      });

      var stepDuration = 4000;


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([am5themes_Animated.new(root)]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      }));


      // We don't want zoom-out button to appear while animating, so we hide it at all
      chart.zoomOutButton.set("forceHidden", true);


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 20,
        inversed: true,
        minorGridEnabled: true
      });
      // hide grid
      yRenderer.grid.template.set("visible", false);

      var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "network",
        renderer: yRenderer
      }));

      var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        strictMinMax: true,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererX.new(root, {})
      }));

      xAxis.set("interpolationDuration", stepDuration / 10);
      xAxis.set("interpolationEasing", am5.ease.linear);


      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        categoryYField: "network"
      }));

      // Rounded corners for columns
      series.columns.template.setAll({
        cornerRadiusBR: 5,
        cornerRadiusTR: 5
      });

      // Make each column to be of a different color
      series.columns.template.adapters.add("fill", function(fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      series.columns.template.adapters.add("stroke", function(stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      // Add label bullet
      series.bullets.push(function() {
        return am5.Bullet.new(root, {
          locationX: 1,
          sprite: am5.Label.new(root, {
            text: "{valueXWorking.formatNumber('#.# a')} Tonne",
            fill: root.interfaceColors.get("alternativeText"),
            centerX: am5.p100,
            centerY: am5.p50,
            populateText: true
          })
        });
      });

      var label = chart.plotContainer.children.push(am5.Label.new(root, {
        text: "2002",
        fontSize: "8em",
        opacity: 0.2,
        x: am5.p100,
        y: am5.p100,
        centerY: am5.p100,
        centerX: am5.p100
      }));

      // Get series item by category
      function getSeriesItem(category) {
        for (var i = 0; i < series.dataItems.length; i++) {
          var dataItem = series.dataItems[i];
          if (dataItem.get("categoryY") == category) {
            return dataItem;
          }
        }
      }

      // Axis sorting
      function sortCategoryAxis() {
        // sort by value
        series.dataItems.sort(function(x, y) {
          return y.get("valueX") - x.get("valueX"); // descending
          //return x.get("valueX") - y.get("valueX"); // ascending
        });

        // go through each axis item
        am5.array.each(yAxis.dataItems, function(dataItem) {
          // get corresponding series item
          var seriesDataItem = getSeriesItem(dataItem.get("category"));

          if (seriesDataItem) {
            // get index of series data item
            var index = series.dataItems.indexOf(seriesDataItem);
            // calculate delta position
            var deltaPosition =
              (index - dataItem.get("index", 0)) / series.dataItems.length;
            // set index to be the same as series data item index
            if (dataItem.get("index") != index) {
              dataItem.set("index", index);
              // set deltaPosition instanlty
              dataItem.set("deltaPosition", -deltaPosition);
              // animate delta position to 0
              dataItem.animate({
                key: "deltaPosition",
                to: 0,
                duration: stepDuration / 2,
                easing: am5.ease.out(am5.ease.cubic)
              });
            }
          }
        });
        // sort axis items by index.
        // This changes the order instantly, but as deltaPosition is set, they keep in the same places and then animate to true positions.
        yAxis.dataItems.sort(function(x, y) {
          return x.get("index") - y.get("index");
        });
      }

      var year = 2002;

      // update data with values each 1.5 sec
      var interval = setInterval(function() {
        year++;

        if (year > 2025) {
          clearInterval(interval);
          clearInterval(sortInterval);
        }

        updateData();
      }, stepDuration);

      var sortInterval = setInterval(function() {
        sortCategoryAxis();
      }, 100);

      function setInitialData() {
        var d = allData[year];

        for (var n in d) {
          series.data.push({
            network: n,
            value: d[n]
          });
          yAxis.data.push({
            network: n
          });
        }
      }

      function updateData() {
        var itemsWithNonZero = 0;

        if (allData[year]) {
          label.set("text", year.toString());

          am5.array.each(series.dataItems, function(dataItem) {
            var category = dataItem.get("categoryY");
            var value = allData[year][category];

            if (value > 0) {
              itemsWithNonZero++;
            }

            dataItem.animate({
              key: "valueX",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear
            });
            dataItem.animate({
              key: "valueXWorking",
              to: value,
              duration: stepDuration,
              easing: am5.ease.linear
            });
          });

          yAxis.zoom(0, itemsWithNonZero / yAxis.dataItems.length);
        }
      }

      setInitialData();
      setTimeout(function() {
        year++;
        updateData();
      }, 50);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);
    });

*/





  });