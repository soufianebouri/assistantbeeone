'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierRecoltearbremapCtrl
 * @description
 * # PalmierdattierRecoltearbremapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierRecoltearbremapCtrl', function($scope, translatedwords, savefilter, DTOptionsBuilder, $translatePartialLoader, $window, $translate, DTColumnBuilder, $q, $compile, $state, $cookies, _url, comptageArbre, recolteArbre, parcellecultural, domaine) {
    var pc = this;
    pc.NombreByElement = [];
    pc.ALLParcelle = [];
    pc.ALLElement = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Element").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "ELEMENT": 0,
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD'),
      "ID": undefined
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    pc.objFerme = {
      "IDFermes": pc.IDDOMAINE
    };


    $q.all([recolteArbre.getformapAllParcelles(pc.obj), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.ALLParcelle = values[0].data;
      pc.MyFerme = values[1].data;
      pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);
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
        savefilter.setFilters(pc.obj);
      }
      //if (pc.obj.CIBLE != 0) {
      pc.rechercher();
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
        savefilter.setFilters(pc.obj);
      }
      //if (pc.obj.CIBLE != 0) {
      pc.rechercher();
      //  }
    };





    //costum map vars
    var markerGroups = {
      "piege": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var iconnanimg = {
      url: "././images/marker-blue-piege.png",
      scaledSize: new google.maps.Size(30, 30)
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

    map = new google.maps.Map(document.getElementById("mapComptage"), {
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var filterDev = document.getElementById('filterDev');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterDev);
    document.getElementById("filterDev").style.display = 'block';








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


    $scope.getArbreByParcelle = (ID) => {
      pc.obj.ID = ID;
      var mydata = [];
      //clear markers
      clearMarkers();
      //clear data
      $q.all([recolteArbre.getformapbyparcelle(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};

        pc.arbredata = values[0].data;

        for (var i = 0; i < shapes.length; i++) {
          google.maps.event.addListener(shapes[i], 'click', function(event) {
            $scope.getArbreByParcelle(this.data.ID);
            var sup = 0;
            try {
              sup = this.data.Sup.toFixed(2);
            } catch (e) {
              sup = 0;
            }
            var datePlant = (this.data.Dat_Plant) ? moment(this.data.Dat_Plant).format('DD/MM/YYYY') : "";
            var point = new google.maps.LatLng(
              parseFloat(this.data.lat),
              parseFloat(this.data.lng));


            var html = "<center><b>Parcelle culturale</b></center><br/>";
            html += "<center>" + this.data.status + "</center>";
            html += "<table class='w3-striped w3-bordered'>";
            html += "<tr><td>Référence</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + this.data.Ref + "</td></tr>";

            html += "<tr><td>Superficie</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + sup + " Ha</td></tr>";


            html += "<tr><td>Nbre de plants</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + this.data.Nbre_plant + "</td></tr>";

            html += "<tr><td>Date de plantation</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + datePlant + "</td></tr>";

            html += "</table>";
            if (this.data.nbrligne > 0) {
              html += "<br/><center><b>Infos récolte</b></center><br/>";
              html += "<table class='w3-striped w3-bordered' width='100%'>";
              html += "<tr><td>Qté récoltée (t)</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
              html += "<td>" + ((this.data.qterecoltetotal) ? this.data.qterecoltetotal.toFixed(1) : 0) + "</td></tr>";
              html += "<tr><td>Arbres récoltés</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
              html += "<td>" + this.data.nbrArbre + "</td></tr>";
              html += "</table>";
            }
            infoWindow.setContent(html);
            infoWindow.setPosition(point);
            infoWindow.open(map);

          });
        }


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
              'qteRecolte': value.qteRecolte,
              'type': 'piege'
            }
            mydata.push(dataonebyone);
          }
        });

        for (var i = 0; i < mydata.length; i++) {
          var type = mydata[i].type;
          var qteRecolte = mydata[i].qteRecolte;
          var Code_Arbre = mydata[i].Code_Arbre;
          if (qteRecolte == null || qteRecolte == 'null') {
            qteRecolte = ' ';
          } else {
            qteRecolte = qteRecolte.toFixed(1).toString();
          }
          var point = new google.maps.LatLng(
            parseFloat(mydata[i].lat),
            parseFloat(mydata[i].lng));

          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: iconnanimg,
            type: type,
            label: {
              text: qteRecolte,
              color: "#000000",
              fontSize: "11px",
              fontWeight: "bold"
            },
            title: "Arbre : " + Code_Arbre
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>Arbre : " + Code_Arbre + "</center>";
          bindInfoWindow(marker, map, infoWindow, html, mydata[i], 0);



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


    //rechercher
    pc.rechercher = function() {
      var mydata = [];
      //clear markers
      clearMarkers();
      //clear shapes
      //clearShapes();
      if (infoWindow) {
        infoWindow.close()
      };


      $q.all([recolteArbre.getformapAllParcelles(pc.obj)]).then(function(values) {
        pc.ALLParcelle = values[0].data;
        clearShapes();
        angular.forEach(pc.ALLParcelle, function(value, key) {
          pc.ALLParcelle = {
            'Ref': value.Ref,
            'Sup': value.Sup,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'Nbre_plant': value.Nbre_plant,
            'Dat_Plant': value.Dat_Plant,
            'ID': value.ID,
            'status': (value.nbrLigne == 0) ? '<span class="badge-red_withe">Pas de récolte</span>' : '<span class="badge-orange_withe">En cours de récolte</span>',
            'nbrligne': value.nbrLigne,
            'qterecoltetotal': value.qterecoltetotal,
            'nbrArbre': value.nbrarbre
          }
          if (value.TokenPolygone !== "") {
            if (value.nbrLigne === 0) {
              IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", "#ff1c1c", pc.ALLParcelle);
            } else if (value.nbrLigne > 0) {
              IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", "#fa8f02", pc.ALLParcelle);
            }
          }
        });


        for (var i = 0; i < shapes.length; i++) {
          google.maps.event.addListener(shapes[i], 'click', function(event) {

            $scope.getArbreByParcelle(this.data.ID);
            var sup = 0;
            try {
              sup = this.data.Sup.toFixed(2);
            } catch (e) {
              sup = 0;
            }
            var datePlant = (this.data.Dat_Plant) ? moment(this.data.Dat_Plant).format('DD/MM/YYYY') : "";
            var point = new google.maps.LatLng(
              parseFloat(this.data.lat),
              parseFloat(this.data.lng));
            var html = "<center><b>Parcelle culturale </b></center><br/>";
            html += "<center>" + this.data.status + "</center>";
            html += "<table class='w3-striped w3-bordered'>";
            html += "<tr><td>Référence</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + this.data.Ref + "</td></tr>";

            html += "<tr><td>Superficie</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + sup + " Ha</td></tr>";

            html += "<tr><td>Nbre de plants</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + this.data.Nbre_plant + "</td></tr>";

            html += "<tr><td>Date de plantation</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + datePlant + "</td></tr>";


            html += "</table>";
            if (this.data.nbrligne > 0) {
              html += "<br/><center><b>Infos récolte</b></center><br/>";
              html += "<table class='w3-striped w3-bordered' width='100%'>";
              html += "<tr><td>Qté récoltée (t)</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
              html += "<td>" + ((this.data.qterecoltetotal) ? this.data.qterecoltetotal.toFixed(1) : 0) + "</td></tr>";
              html += "<tr><td>Arbres récoltés</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
              html += "<td>" + this.data.nbrArbre + "</td></tr>";
              html += "</table>";
            }

            infoWindow.setContent(html);
            infoWindow.setPosition(point);
            infoWindow.open(map);
          });
        }

        NProgress.done();
      });
      if (pc.obj.ID) {
        //clear data
        $q.all([comptageArbre.getformapbyparcelle(pc.obj)]).then(function(values) {
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
                'qteRecolte': value.qteRecolte,
                'type': 'piege'
              }
              mydata.push(dataonebyone);
            }
          });

          for (var i = 0; i < mydata.length; i++) {
            var type = mydata[i].type;
            var Code_Arbre = mydata[i].Code_Arbre;

            var point = new google.maps.LatLng(
              parseFloat(mydata[i].lat),
              parseFloat(mydata[i].lng));
            var qteRecolte = mydata[i].qteRecolte;
            if (qteRecolte == null || qteRecolte == 'null') {
              qteRecolte = ' ';
            } else {
              qteRecolte = qteRecolte.toFixed(1).toString();
            }
            var marker = new google.maps.Marker({
              map: map,
              position: point,
              icon: iconnanimg,
              type: type,
              label: {
                text: qteRecolte,
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
            bindInfoWindow(marker, map, infoWindow, html, mydata[i], 0);



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
            //map = new google.maps.Map(document.getElementById("mapComptage"), mapOptions);
            map.mapTypes.set('maroc', mapType);
            map.setMapTypeId('maroc');
          }

          if (map.getZoom() >= 8) {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
          }


          NProgress.done();
        });

      } else {}


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
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
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
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);



      angular.forEach(dataparcelle, function(value, key) {
        dataparcelle = {
          'Ref': value.Ref,
          'Sup': value.Sup,
          'lat': value.LatPosition,
          'lng': value.LngPosition,
          'Nbre_plant': value.Nbre_plant,
          'Dat_Plant': value.Dat_Plant,
          'ID': value.ID,
          'status': (value.nbrLigne == 0) ? '<span class="badge-red_withe">Pas de récolte</span>' : '<span class="badge-orange_withe">En cours de récolte</span>',
          'nbrligne': value.nbrLigne,
          'qterecoltetotal': value.qterecoltetotal,
          'nbrArbre': value.nbrarbre
        }

        if (value.TokenPolygone !== "") {
          if (value.nbrLigne === 0) {
            IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", "#ff1c1c", dataparcelle);
          } else if (value.nbrLigne > 0) {
            IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", "#fa8f02", dataparcelle);
          }
        }
      });

      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function(event) {
          $scope.getArbreByParcelle(this.data.ID);
          var sup = 0;
          try {
            sup = this.data.Sup.toFixed(2);
          } catch (e) {
            sup = 0;
          }
          var datePlant = (this.data.Dat_Plant) ? moment(this.data.Dat_Plant).format('DD/MM/YYYY') : "";
          var point = new google.maps.LatLng(
            parseFloat(this.data.lat),
            parseFloat(this.data.lng));
          var html = "<center><b>Parcelle culturale</b></center><br/>";
          html += "<center>" + this.data.status + "</center>";
          html += "<table class='w3-striped w3-bordered'>";
          html += "<tr><td>Référence</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + this.data.Ref + "</td></tr>";

          html += "<tr><td>Superficie</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + sup + " Ha</td></tr>";

          html += "<tr><td>Nbre de plants</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + this.data.Nbre_plant + "</td></tr>";

          html += "<tr><td>Date de plantation</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
          html += "<td>" + datePlant + " </td></tr>";

          html += "</table>";
          if (this.data.nbrligne > 0) {
            html += "<br/><center><b>Infos récolte</b></center><br/>";
            html += "<table class='w3-striped w3-bordered' width='100%'>";
            html += "<tr><td>Qté récoltée (t)</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + ((this.data.qterecoltetotal) ? this.data.qterecoltetotal.toFixed(1) : 0) + "</td></tr>";
            html += "<tr><td>Arbres récoltés</td><td>&nbsp;&nbsp;&nbsp;&nbsp</td>";
            html += "<td>" + this.data.nbrArbre + "</td></tr>";
            html += "</table>";
          }


          infoWindow.setContent(html);
          infoWindow.setPosition(point);
          infoWindow.open(map);


        });
      }


      for (var i = 0; i < mydata.length; i++) {
        var type = mydata[i].type;
        var Code_Arbre = mydata[i].Code_Arbre;

        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].lng));
        var qteRecolte = mydata[i].qteRecolte;
        if (qteRecolte == null || qteRecolte == 'null') {
          qteRecolte = ' ';
        } else {
          qteRecolte = qteRecolte.toFixed(1).toString();
        }
        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: iconnanimg,
          type: type,
          label: {
            text: qteRecolte,
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
        bindInfoWindow(marker, map, infoWindow, html, mydata[i], 0);



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
        //map = new google.maps.Map(document.getElementById("mapComptage"), mapOptions);
        map.mapTypes.set('maroc', mapType);
        map.setMapTypeId('maroc');
      }

      if (map.getZoom() >= 8) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }


    }



    pc.getNombreComptage = function(ALLParcelle, ref) {

    }

    function bindInfoWindow(marker, map, infoWindow, html, mydatasellected, mynumber) {

      google.maps.event.addListener(marker, 'click', function() {

        var html = "<table border='0' class='w3-striped w3-bordered'>";

        html += "<tr><td colspan='2'><br/><b><center>Info Arbre</center></b><br/></td></tr>";
        html += "<tr><td>Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.Code_Arbre + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "<tr><td>Qté récoltée (Kg)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + ((mydatasellected.qteRecolte) ? mydatasellected.qteRecolte.toFixed(1) : 0) + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "</table>";

        infoWindow.setContent(html);
        infoWindow.open(map, marker);

      });
    }


    //Fin load Map
  });