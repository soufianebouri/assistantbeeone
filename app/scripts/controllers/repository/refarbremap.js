'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRefarbremapCtrl
 * @description
 * # RepositoryRefarbremapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRefarbremapCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, Arbre, DTColumnBuilder, $q, $compile, $state, $cookies, Cible, _url, comptagedesravageurmap, domaine, campagneagricole, $filter) {
    var pc = this;
    pc.ALLRefTraitement = [];
    pc.ALLParcelle = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;

    pc.objFerme = {
      "IDFermes": pc.IDDOMAINE
    };

    NProgress.start();
    $q.all([Arbre.getArbre(_url, pc.IDDOMAINE), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.ALLArbre = values[0].data;
      pc.MyFerme = values[1].data;
      NProgress.done();
      NProgress.remove();
      pc.setInitialMap(pc.ALLArbre, pc.MyFerme);
      NProgress.done();
    });

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    //costum map vars
    var markerGroups = {
      "parcelle": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var customIcons = {
      ferme: {
        icon: "././images/parcelle.png"
      }
    };

    var iconnanimg = {
      url: "././images/yellow-circle.png",
      scaledSize: new google.maps.Size(6, 6)
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
        for (var i = 0; i < markerGroups['parcelle'].length; i++) {
          markerGroups['parcelle'][i].setMap(null);
        }
      };
    var markersArray = [];

    const styles = {
      default: [],
      hide: [{
          featureType: "poi.business",
          stylers: [{
            visibility: "off"
          }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{
            visibility: "off"
          }],
        },
      ],
    };

    map = new google.maps.Map(document.getElementById("map"), {
      mapTypeControl: false,
      heading: 90,
      tilt: 45,
      scrollwheel: true,
      draggable: true,
      mapId: "90f87356969d889c",
      //mapTypeId: 'satellite',
      panControl: false,
      scaleControl: false,
      streetViewControl: false,

    });

    /*  map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,

        scrollwheel: true,
        panControl: true,
        draggable: true,


        heading: 90,
        tilt: 45,


        rotateControl: true,
        rotateControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
      });*/

    map.setOptions({
      styles: styles["hide"]
    });

    const buttons = [
      ["⇐", "rotate", 5, google.maps.ControlPosition.LEFT_CENTER],
      ["⇒", "rotate", -5, google.maps.ControlPosition.RIGHT_CENTER],
      ["⇑", "tilt", 5, google.maps.ControlPosition.TOP_CENTER],
      ["⇓", "tilt", -5, google.maps.ControlPosition.BOTTOM_CENTER],
    ];

    buttons.forEach(([text, mode, amount, position]) => {
      const controlDiv = document.createElement("div");
      const controlUI = document.createElement("button");

      controlUI.classList.add("ui-button");
      controlUI.innerText = `${text}`;
      controlUI.addEventListener("click", () => {
        adjustMap(mode, amount);
      });
      controlDiv.appendChild(controlUI);
      map.controls[position].push(controlDiv);
    });

    const adjustMap = function(mode, amount) {
      switch (mode) {
        case "tilt":
          map.setTilt(map.getTilt() + amount);
          break;
        case "rotate":
          map.setHeading(map.getHeading() + amount);
          break;
        default:
          break;
      }
    };




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
    pc.setInitialMap = function(dataparbre, dataferme) {
      var mydata = [];
      var dataonebyone = {};

      $scope.firstLat = 0;
      $scope.firstLng = 0;
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude !== 0, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 17;
      } else if (dataparbre.length > 0 && pc.checklatlng(dataparbre[0].Coord_X !== 0, dataparbre[0].Coord_Y)) {
        var lllat = dataparbre[0].Coord_X;
        var lllng = dataparbre[0].Coord_Y;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);
      if (dataferme.length > 0) {
        if (dataferme[0].Polygone_Ferme !== "") {
          IO.OUT(JSON.parse(dataferme[0].Polygone_Ferme), map, dataferme[0].CouleurCadre, '', dataonebyone);
        }
      }


      angular.forEach(dataparbre, function(value, key) {
        if (value.Coord_X !== 0 && value.Coord_Y !== 0 && value.Coord_Y != null && value.Coord_X != null) {
          dataonebyone = {
            'Code_Arbre': value.Code_Arbre,
            'Coord_X': value.Coord_X,
            'Coord_Y': value.Coord_Y,
            'Variete': value.Variete
          }

          mydata.push(dataonebyone);



        }

      });



      for (var i = 0; i < mydata.length; i++) {

        var type = mydata[i].type;

        var Code_Arbre = mydata[i].Code_Arbre;

        var Variete = mydata[i].Variete;
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].Coord_X),
          parseFloat(mydata[i].Coord_Y));
        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: iconnanimg,
          type: type,
          title: "Arbre : " + Code_Arbre
        });

        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);

        var html = "<li>Arbre : " + Code_Arbre + "</li>";
        html += "<li>Variete :" + Variete + "</li>";
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


    function bindInfoWindow(marker, map, infoWindow, html) {
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);

      });
    }


    //Fin load Map
  });