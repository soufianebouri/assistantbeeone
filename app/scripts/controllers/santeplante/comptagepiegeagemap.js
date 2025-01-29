'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SantedelaplanteComptagepiegeagemapCtrl
 * @description
 * # SantedelaplanteComptagepiegeagemapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SantedelaplanteComptagepiegeagemapCtrl', function($scope, DTOptionsBuilder, translatedwords, $window, DTColumnBuilder, $translatePartialLoader, $translate, $q, $compile, $state, $cookies, Cible, _url, comptagedespiegesmap, ParcellePhysique, domaine) {
    var pc = this;
    pc.cibles = [];
    pc.ALLInsects = [];
    pc.ALLParcelle = [];
    pc.ALLParcelleCulturaleRef = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Cible").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "CIBLE": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    pc.objFerme = {
      "IDFermes": pc.IDDOMAINE
    };

    setTimeout(() => {
      NProgress.done();
      NProgress.remove();
    }, 5000)
    $q.all([Cible.getCible(_url), comptagedespiegesmap.getInsectsByCible(pc.obj), ParcellePhysique.getAllParcellePhysique(_url, pc.IDDOMAINE), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.cibles = values[0].data;
      pc.InsectsByCible = values[1].data;
      pc.ALLParcelle = values[2].data;
      pc.MyFerme = values[3].data;
      pc.setInitialMap(pc.InsectsByCible, pc.ALLParcelle, pc.MyFerme);

      setTimeout(function() {
        $("#Cible").selectpicker('refresh');
      }, 1000);
    });


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
      $("#ref").html("");
      $("#superficie").html("");
      $("#Code").html("");
      $("#PositionPiege").html("");
      $("#CibleObs").html("");
      $("#Position").html("");
      $("#Nombreinsectes").html("");
      $("#alerte").html("");
      $("#Nombreinsectes").html("");
      $("#CibleObs").html("");
      $("#PositionPiege").html("");
      $("#Code").html("");
      //  }
    };

    //by cible
    $scope.cible_change = function() {
      if ($scope.cible.cible === null || $scope.cible.cible === "" || $scope.cible.cible === undefined || $scope.cible.cible === 0 || $scope.cible.cible === "0" || !$scope.cible.cible || $scope.cible.cible.length === 0) {
        $scope.cible_sel = 0;
      } else {
        $scope.cible_sel = $scope.cible.cible;
        pc.obj.CIBLE = $scope.cible_sel;
      }
      if ($scope.cible_sel != 0) {
        pc.rechercher();
        $("#ref").html("");
        $("#superficie").html("");
        $("#variete").html("");
        $("#Position").html("");
        $("#Nombreinsectes").html("");
        $("#Moyeninsectes").html("");
        $("#alerte").html("");
        $("#Nombreinsectes").html("");
        $("#CibleObs").html("");
        $("#PositionPiege").html("");
        $("#Code").html("");
      }

    };



    //costum map vars
    var markerGroups = {
      "piege": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var icon = {
      url: "././images/marker-blue-piege.png", // url
      scaledSize: new google.maps.Size(50, 50)
    };

    var iconDanger = {
      url: "././images/marker-red-danger.png", // url
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


    var details = document.getElementById('details');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(details);
    document.getElementById("details").style.display = 'block';

    var nbrPiegeView = document.getElementById('nbrPiegeView');
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(nbrPiegeView);
    document.getElementById("nbrPiegeView").style.display = 'block';

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

    $scope.nbrPiege = 0;
    //rechercher
    pc.rechercher = function() {
      var mydata = [];
      //clear markers
      clearMarkers();

      //clear shapes
      //clearShapes();

      //clear data
      $q.all([comptagedespiegesmap.getInsectsByCible(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};


        pc.ALLInsects = values[0].data;
        $scope.firstLat = 0;
        $scope.firstLng = 0;

        angular.forEach(pc.ALLInsects, function(value, key) {

          if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {
            $scope.firstLat = value.LatPosition;
            $scope.firstLng = value.LngPosition;
            dataonebyone = {
              'ref': value.ref,
              'sup': value.sup,
              'Coord_X': value.Coord_X,
              'Coord_Y': value.Coord_Y,
              'Code_Piege': value.Code_Piege,
              'alerte': value.alerte,
              'lat': value.LatPosition,
              'lng': value.LngPosition,
              'type': 'piege',
              'nbrinsect': value.nbrinsect,
              'cible': value.Cible
            }
            mydata.push(dataonebyone);
          }
        });

        $scope.nbrPiege = mydata.length;
        for (var i = 0; i < mydata.length; i++) {
          var type = mydata[i].type;
          var nbrinsect = mydata[i].nbrinsect;
          var Code_Piege = mydata[i].Code_Piege;
          var point = new google.maps.LatLng(
            parseFloat(mydata[i].lat),
            parseFloat(mydata[i].lng));
          var Alerte = mydata[i].alerte;
          var iconMarker = icon;
          if (parseInt(Alerte) > 0) {
            iconMarker = iconDanger;
          }

          if (nbrinsect == null || nbrinsect == 'null') {
            nbrinsect = ' ';
          } else {
            nbrinsect = nbrinsect.toString();
          }
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconMarker,
            type: type,
            label: {
              text: nbrinsect,
              color: "green",
              fontSize: "15px",
              fontWeight: "bold"
            },
            title: "Piège : " + Code_Piege
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>Parcelle : " + Code_Piege + "</center>";
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
        NProgress.remove();
      });


    }

    pc.checklatlng = function(lat, lng) {
      if (lat !== 0 && lng !== 0 && lat != null && lng != null && lat !== "0" && lng !== "0" && lat !== "" && lng !== "")
        return true;
      return false;
    }

    //first loading map
    pc.setInitialMap = function(datapiege, dataparcelle, dataferme) {
      var mydata = [];
      var dataonebyone = {};
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 15;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].Coord_X, dataparcelle[0].Coord_Y)) {
        var lllat = dataparcelle[0].Coord_X;
        var lllng = dataparcelle[0].Coord_Y;
        var zoooom = 15;
      } else if (datapiege.length > 0 && pc.checklatlng(datapiege[0].LatPosition, datapiege[0].LngPosition)) {
        var lllat = datapiege[0].LatPosition;
        var lllng = datapiege[0].LngPosition;
        var zoooom = 15;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);

      angular.forEach(datapiege, function(value, key) {
        if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {
          dataonebyone = {
            'ref': value.ref,
            'sup': value.sup,
            'Coord_X': value.Coord_X,
            'Coord_Y': value.Coord_Y,
            'Code_Piege': value.Code_Piege,
            'alerte': value.alerte,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'type': 'piege',
            'nbrinsect': value.nbrinsect,
            'cible': value.Cible
          }
          mydata.push(dataonebyone);
        }
      });

      angular.forEach(dataparcelle, function(value, key) {
        dataparcelle = {
          'Ref': value.Ref,
          'Sup': value.Sup,
          'lat': value.Coord_X,
          'lng': value.Coord_Y
        }
        if (value.TokenPolygone !== "") {
          IO.OUT(JSON.parse(value.TokenPolygone), map, "#c4bf7d", "#8eb2a0", dataparcelle);
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0", dataparcelle);
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

      $scope.nbrPiege = mydata.length;
      for (var i = 0; i < mydata.length; i++) {
        var type = mydata[i].type;
        var nbrinsect = mydata[i].nbrinsect;
        var Code_Piege = mydata[i].Code_Piege;
        var Alerte = mydata[i].alerte;
        var iconMarker = icon;
        if (parseInt(Alerte) > 0) {
          iconMarker = iconDanger;
        }

        if (nbrinsect == null || nbrinsect == 'null') {
          nbrinsect = ' ';
        } else {
          nbrinsect = nbrinsect.toString();
        }
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].lng));

        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: iconMarker,
          type: type,
          label: {
            text: nbrinsect,
            color: "green",
            fontSize: "15px",
            fontWeight: "bold"
          },
          title: "Piège : " + Code_Piege
        });
        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);

        var html = "<center>Parcelle : " + Code_Piege + "</center>";
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
        $("#ref").html("");
        $("#superficie").html("");
        $("#Position").html("");
        $("#Code").html("");
        $("#PositionPiege").html("");
        $("#Nombreinsectes").html("");
        $("#CibleObs").html("");
        $("#alerte").html("");
        //insert
        $("#ref").html(mydatasellected.ref);
        $("#superficie").html(mydatasellected.sup.toFixed(2) + " Ha");
        $("#Position").html("(" + mydatasellected.Coord_X + " , " + mydatasellected.Coord_Y + ")");
        $("#Code").html(mydatasellected.Code_Piege);
        $("#PositionPiege").html("(" + mydatasellected.lat + " , " + mydatasellected.lng + ")");
        $("#Nombreinsectes").html(mydatasellected.nbrinsect);
        $("#CibleObs").html(mydatasellected.cible);

        if (parseInt(mydatasellected.alerte) == 0 && (mydatasellected.alerte != null || mydatasellected.alerte || mydatasellected.alerte != 'null')) {
          $("#alerte").html("<span class='badge-green_withe_size'>Normale</span>");
        } else if (parseInt(mydatasellected.alerte) > 0 && (mydatasellected.alerte != null || mydatasellected.alerte || mydatasellected.alerte != 'null')) {
          $("#alerte").html("<span class='badge-red_withe_size'>Danger</span>");
        } else {
          $("#alerte").html("");
        }


      });
    }


    //Fin load Map
  });