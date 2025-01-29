'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesEclaircissagedesregimesmapCtrl
 * @description
 * # OperationsclesEclaircissagedesregimesmapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesEclaircissagedesregimesmapCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, DTColumnBuilder, $window, $q, $compile, $state, $cookies, _url, eclaircissagedesregimes, parcellecultural, domaine) {
    var pc = this;
    pc.NombreEclaircis = [];
    pc.ALLParcelle = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    pc.objFerme = {
      "IDFermes": pc.IDDOMAINE
    };


    $q.all([eclaircissagedesregimes.getformap(pc.obj), parcellecultural.getParcelleCulturalByFerme(pc.IDDOMAINE), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.NombreEclaircis = values[0].data;
      pc.ALLParcelle = values[1].data;
      pc.MyFerme = values[2].data;
      pc.setInitialMap(pc.NombreEclaircis, pc.ALLParcelle, pc.MyFerme);
      NProgress.done();
    });


    //by date_fin
    $scope.date_debut_change = function() {
      if ($scope.debut === null || $scope.debut === "" || $scope.debut === undefined || $scope.debut === 0 || $scope.debut === "0" || !$scope.debut || $scope.debut.length === 0) {
        $scope.debut_sel = 0;
      } else {
        $scope.debut_sel = $scope.debut;
        $scope.debut_sel = moment($scope.debut_sel).format('YYYYMMDD');
        pc.obj.DATE_DEBUT = $scope.debut_sel;
      }
      //if (pc.obj.CIBLE != 0) {
      pc.rechercher();
      $("#Position").html("");
      $("#superficie").html("");
      $("#ref").html("");
      $("#Code").html("");
      $("#PositionArbre").html("");
      //  }
    };


    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
        $scope.date_fin_sel = moment($scope.date_fin_sel).format('YYYYMMDD');
        pc.obj.DATE_FIN = $scope.date_fin_sel;
      }
      //if (pc.obj.CIBLE != 0) {
      pc.rechercher();
      $("#Position").html("");
      $("#superficie").html("");
      $("#ref").html("");
      $("#Code").html("");
      $("#PositionArbre").html("");
      //  }
    };



    //costum map vars
    var markerGroups = {
      "piege": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var iconnanimg = {
      url: "././images/yellow-circle.png",
      scaledSize: new google.maps.Size(5, 5)
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
            tmp.setValues({
              map: map,
              id: shape.id
            })
            shapes.push(tmp);
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

    var filterDev = document.getElementById('filterDev');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterDev);
    document.getElementById("filterDev").style.display = 'block';


    var infoparcelle = document.getElementById('infoparcelle');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(infoparcelle);
    document.getElementById("infoparcelle").style.display = 'block';

    var infoparcelle = document.getElementById('infoPiege');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(infoparcelle);
    document.getElementById("infoPiege").style.display = 'block';

    var legend = document.getElementById('legend');
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legend);
    document.getElementById("legend").style.display = 'block';

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

    //rechercher
    pc.rechercher = function() {
      var mydata = [];
      //clear markers
      clearMarkers();

      //clear shapes
      //clearShapes();

      //clear data
      $q.all([eclaircissagedesregimes.getformap(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};

        pc.arbredata = values[0].data;
        $scope.firstLat = 0;
        $scope.firstLng = 0;

        angular.forEach(pc.arbredata, function(value, key) {
          if (value.Coord_X !== 0 && value.Coord_Y !== 0 && value.Coord_X != null && value.Coord_Y != null) {
            $scope.firstLat = value.Coord_X;
            $scope.firstLng = value.Coord_Y;
            dataonebyone = {
              'Code_Arbre': value.Code_Arbre,
              'lat': value.Coord_X,
              'lng': value.Coord_Y,
              'type': 'piege',
              'latPosition': value.latPosition,
              'lngPosition': value.lngPosition,
              'sup': value.sup,
              'ref': value.ref
            }
            mydata.push(dataonebyone);
          }
        });

        for (var i = 0; i < mydata.length; i++) {
          var type = mydata[i].type;
          var sumnombre = ' ';
          var Code_Arbre = mydata[i].Code_Arbre;

          var point = new google.maps.LatLng(
            parseFloat(mydata[i].lat),
            parseFloat(mydata[i].lng));

          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconnanimg,
            type: type,
            label: {
              text: sumnombre,
              color: "#000000",
              fontSize: "12px",
              fontWeight: "bold"
            },
            title: "Arbre : " + Code_Arbre
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>Arbre : " + Code_Arbre + "</center>";
          bindInfoWindow(marker, map, infoWindow, html, mydata[i]);



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


        NProgress.done();
      });


    }

    pc.checklatlng = function(lat, lng) {
      if (lat !== 0 && lng !== 0 && lat != null && lng != null && lat !== "0" && lng !== "0" && lat !== "" && lng !== "")
        return true;
      return false;
    }

    //first loading map
    pc.setInitialMap = function(dataarbre, dataparcelle, dataferme) {
      var mydata = [];
      var dataonebyone = {};
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 17;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].Coord_X, dataparcelle[0].Coord_Y)) {
        var lllat = dataparcelle[0].Coord_X;
        var lllng = dataparcelle[0].Coord_Y;
        var zoooom = 17;
      } else if (dataarbre.length > 0 && pc.checklatlng(dataarbre[0].Coord_X, dataarbre[0].Coord_Y)) {
        var lllat = dataarbre[0].Coord_X;
        var lllng = dataarbre[0].Coord_Y;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);

      angular.forEach(dataarbre, function(value, key) {
        if (value.Coord_X !== 0 && value.Coord_Y !== 0 && value.Coord_X != null && value.Coord_Y != null) {
          dataonebyone = {
            'Code_Arbre': value.Code_Arbre,
            'lat': value.Coord_X,
            'lng': value.Coord_Y,
            'type': 'piege',
            'latPosition': value.latPosition,
            'lngPosition': value.lngPosition,
            'sup': value.sup,
            'ref': value.ref
          }
          mydata.push(dataonebyone);
        }
      });

      angular.forEach(dataparcelle, function(value, key) {
        dataparcelle = {
          'Ref': value.Ref,
          'Sup': value.Sup,
          'lat': value.LatPosition,
          'lng': value.LngPosition
        }
        if (value.TokenPolygone !== "") {
          IO.OUT(JSON.parse(value.TokenPolygone), map, "#c4bf7d", "#8eb2a0", dataparcelle);
        }
      });

      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function() {
          //clear
          $("#ref").html("");
          $("#superficie").html("");
          $("#Position").html("");
          //insert
          $("#ref").html(this.data.Ref);
          $("#superficie").html(this.data.Sup.toFixed(2) + " Ha");
          $("#Position").html("(" + this.data.lat + " , " + this.data.lng + ")");
        });
      }


      for (var i = 0; i < mydata.length; i++) {
        var type = mydata[i].type;
        var sumnombre = ' ';
        var Code_Arbre = mydata[i].Code_Arbre;
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].lng));

        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: iconnanimg,
          type: type,
          label: {
            text: sumnombre,
            color: "#000000",
            fontSize: "12px",
            fontWeight: "bold"
          },
          title: "Arbre : " + Code_Arbre
        });
        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);

        var html = "<center>Arbre : " + Code_Arbre + "</center>";
        bindInfoWindow(marker, map, infoWindow, html, mydata[i]);



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


    function bindInfoWindow(marker, map, infoWindow, html, mydatasellected) {
      google.maps.event.addListener(marker, 'click', function() {
        //clear
        $("#Position").html("");
        $("#superficie").html("");
        $("#ref").html("");
        $("#Code").html("");
        $("#PositionArbre").html("");
        //insert
        $("#Position").html("(" + mydatasellected.lngPosition + " , " + mydatasellected.latPosition + ")");
        $("#superficie").html(mydatasellected.sup.toFixed(2) + " Ha");
        $("#ref").html(mydatasellected.ref);
        $("#Code").html(mydatasellected.Code_Arbre);
        $("#PositionArbre").html("(" + mydatasellected.lat + " , " + mydatasellected.lng + ")");
      });
    }


    //Fin load Map
  });