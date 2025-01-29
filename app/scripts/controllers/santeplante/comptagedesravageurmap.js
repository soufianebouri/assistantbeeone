'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteComptagedesravageurmapCtrl
 * @description
 * # SanteplanteComptagedesravageurmapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteComptagedesravageurmapCtrl', function($scope, translatedwords, DTOptionsBuilder, $window, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, $state, $cookies, Cible, _url, comptagedesravageurmap, domaine) {
    var pc = this;
    pc.cibles = [];
    pc.ALLAVGinsects = [];
    pc.ALLParcelle = [];
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


    $q.all([Cible.getCible(_url), comptagedesravageurmap.getAVGinsectsByCible(pc.obj), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.cibles = values[0].data;
      pc.AVGinsectsByCible = values[1].data;
      pc.MyFerme = values[2].data;
      pc.setInitialMap(pc.AVGinsectsByCible, pc.MyFerme);
      NProgress.done();
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
      $("#variete").html("");
      $("#Position").html("");
      $("#Nombreinsectes").html("");
      $("#Moyeninsectes").html("");
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
      }

    };



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

    var icon = {
      url: "././images/marker-green-parcelle.png", // url
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
        for (var i = 0; i < markerGroups['parcelle'].length; i++) {
          markerGroups['parcelle'][i].setMap(null);
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


    var details = document.getElementById('details');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(details);
    document.getElementById("details").style.display = 'block';

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
      clearShapes();

      //clear data
      $q.all([comptagedesravageurmap.getAVGinsectsByCible(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};

        pc.ALLAVGinsects = values[0].data;

        angular.forEach(pc.ALLAVGinsects, function(value, key) {
          if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {
            dataonebyone = {
              'REF_Parcelle': value.Ref,
              'lat': value.LatPosition,
              'lng': value.LngPosition,
              'type': 'parcelle',
              'label': value.moyeninsect,
              'nbrinsect': value.nbrinsect,
              'sup': value.sup,
              'Variete': value.Variete,
              'LngPosition': value.LngPosition,
              'LatPosition': value.LatPosition,
              'Cible': value.Cible,
              'Num_Arbre': value.Num_Arbre
            }
            mydata.push(dataonebyone);

            if (value.TokenPolygone !== "") {
              IO.OUT(JSON.parse(value.TokenPolygone), map, "#c4bf7d", "#8eb2a0", dataonebyone);
            } else {
              IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0", dataonebyone);
            }
          }
        });


        for (var i = 0; i < shapes.length; i++) {
          google.maps.event.addListener(shapes[i], 'click', function() {
            //clear
            $("#ref").html("");
            $("#superficie").html("");
            $("#variete").html("");
            $("#Position").html("");
            $("#Nombreinsectes").html("");
            $("#Moyeninsectes").html("");
            //insert
            $("#ref").html(this.data.REF_Parcelle);
            $("#superficie").html(this.data.sup.toFixed(2) + " Ha");
            $("#variete").html(this.data.Variete);
            $("#Position").html("(" + this.data.lat + " , " + this.data.lng + ")");
            $("#Nombreinsectes").html(this.data.nbrinsect);
            $("#Moyeninsectes").html(this.data.label);
          });
        }



        for (var i = 0; i < mydata.length; i++) {
          var name = mydata[i].name;
          var type = mydata[i].type;
          var nbrinsect = mydata[i].nbrinsect;
          if (nbrinsect == null || nbrinsect == 'null') {
            nbrinsect = ' ';
          } else {
            nbrinsect = nbrinsect.toString();
          }
          var REF_Parcelle = mydata[i].REF_Parcelle;
          var point = new google.maps.LatLng(
            parseFloat(mydata[i].lat),
            parseFloat(mydata[i].lng));

          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: icon,
            type: type,
            label: {
              text: nbrinsect,
              color: "green",
              fontSize: "15px",
              fontWeight: "bold"
            },
            title: "Parcelle : " + REF_Parcelle
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>Parcelle : " + REF_Parcelle + "</center>";
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
    pc.setInitialMap = function(dataparcelle, dataferme) {
      var mydata = [];
      var dataonebyone = {};
      $scope.firstLat = 0;
      $scope.firstLng = 0;
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude !== 0, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 15;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].LatPosition !== 0, dataparcelle[0].LngPosition)) {
        var lllat = dataparcelle[0].LatPosition;
        var lllng = dataparcelle[0].LngPosition;
        var zoooom = 15;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);

      angular.forEach(dataparcelle, function(value, key) {
        if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {

          dataonebyone = {
            'REF_Parcelle': value.Ref,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'type': 'parcelle',
            'label': value.moyeninsect,
            'nbrinsect': value.nbrinsect,
            'sup': value.sup,
            'Variete': value.Variete,
            'LngPosition': value.LngPosition,
            'LatPosition': value.LatPosition,
            'Cible': value.Cible,
            'Num_Arbre': value.Num_Arbre
          }
          mydata.push(dataonebyone);

          if (value.TokenPolygone !== "") {
            IO.OUT(JSON.parse(value.TokenPolygone), map, "#c4bf7d", "#8eb2a0", dataonebyone);
          }

        }

      });

      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function() {
          //clear
          $("#ref").html("");
          $("#superficie").html("");
          $("#variete").html("");
          $("#Position").html("");
          $("#Nombreinsectes").html("");
          $("#Moyeninsectes").html("");
          //insert
          $("#ref").html(this.data.REF_Parcelle);
          $("#superficie").html(this.data.sup.toFixed(2) + " Ha");
          $("#variete").html(this.data.Variete);
          $("#Position").html("(" + this.data.lat + " , " + this.data.lng + ")");
          $("#Nombreinsectes").html(this.data.nbrinsect);
          $("#Moyeninsectes").html(this.data.label);
        });
      }

      for (var i = 0; i < mydata.length; i++) {
        var name = mydata[i].name;
        var type = mydata[i].type;
        var nbrinsect = mydata[i].nbrinsect;
        if (nbrinsect == null || nbrinsect == 'null') {
          nbrinsect = ' ';
        } else {
          nbrinsect = nbrinsect.toString();
        }
        var REF_Parcelle = mydata[i].REF_Parcelle;
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].lng));

        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: icon,
          type: type,
          label: {
            text: nbrinsect,
            color: "green",
            fontSize: "15px",
            fontWeight: "bold"
          },
          title: "Parcelle : " + REF_Parcelle
        });
        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);

        var html = "<center>Parcelle culturale : " + REF_Parcelle + "</center>";
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
        $("#variete").html("");
        $("#Position").html("");
        $("#Nombreinsectes").html("");
        $("#Moyeninsectes").html("");
        //insert
        $("#ref").html(mydatasellected.REF_Parcelle);
        $("#superficie").html(mydatasellected.sup.toFixed(2) + " Ha");
        $("#variete").html(mydatasellected.Variete);
        $("#Position").html("(" + mydatasellected.lat + " , " + mydatasellected.lng + ")");
        $("#Nombreinsectes").html(mydatasellected.nbrinsect);
        $("#Moyeninsectes").html(mydatasellected.label);
      });
    }


    //Fin load Map
  });