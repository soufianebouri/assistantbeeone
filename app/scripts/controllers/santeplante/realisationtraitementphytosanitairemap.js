'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteRealisationtraitementphytosanitairemapCtrl
 * @description
 * # SanteplanteRealisationtraitementphytosanitairemapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteRealisationtraitementphytosanitairemapCtrl', function($scope, translatedwords, $window, $translatePartialLoader, $translate, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, $cookies, Cible, _url, comptagedesravageurmap, domaine, campagneagricole, realisationtraitementphytosanitaire, $filter) {
    var pc = this;
    pc.ALLRefTraitement = [];
    pc.ALLParcelle = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSOCIETE = $cookies.getObject('globals').ferme.IDSociete;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#NTraitement").selectpicker('refresh');
    }, 1000);
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "IDSOCIETE": pc.IDSOCIETE,
      "IDtraitement": 0,
      "Ntraitement": "",
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    pc.objFerme = {
      "IDFermes": pc.IDDOMAINE
    };

    $q.all([campagneagricole.getCampagneByDateNow(pc.obj), domaine.DomaineByID(pc.objFerme)]).then(function(values) {
      pc.currentCampagneagricole = values[0].data;
      pc.MyFerme = values[1].data;

      //get currentCampagneagricole
      if (pc.currentCampagneagricole.length > 0) {
        pc.obj.DATE_DEBUT = moment(pc.currentCampagneagricole[0].Date_debut).format('YYYYMMDD');
        pc.obj.DATE_FIN = moment(pc.currentCampagneagricole[0].Date_Fin).format('YYYYMMDD');

        //check all ordres by currentCampagneagricole
        $q.all([realisationtraitementphytosanitaire.getRefTraitement(pc.obj)]).then(function(values) {
          pc.ALLRefTraitement = values[0].data;
          if (pc.ALLRefTraitement.length > 0) {
            pc.obj.IDtraitement = pc.ALLRefTraitement[pc.ALLRefTraitement.length - 1].IDTraitement;
            pc.obj.Ntraitement = 'N° ' + pc.ALLRefTraitement[pc.ALLRefTraitement.length - 1].Ref_traitement;
            setTimeout(function() {
              $(".selectpicker").selectpicker();
              $("#NTraitement").selectpicker('refresh');
            }, 1000);
            //check all parcelle
            $q.all([realisationtraitementphytosanitaire.getByFiltreMap(pc.obj)]).then(function(values) {
              pc.ALLParcelle = values[0].data;

              pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);
              NProgress.done();
            });

          } else {
            pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);
            NProgress.done();
          }
          setTimeout(function() {
            $("#NTraitement").selectpicker('refresh');
          }, 1000);

        });
      } else {
        pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);
        NProgress.done();
      }
    });

    //by ntraitement
    $scope.ntraitement_change = function() {
      if ($scope.ntraitement.ntraitement === null || $scope.ntraitement.ntraitement === "" || $scope.ntraitement.ntraitement === undefined || $scope.ntraitement.ntraitement === 0 || $scope.ntraitement.ntraitement === "0" || !$scope.ntraitement.ntraitement || $scope.ntraitement.ntraitement.length === 0) {
        $scope.ntraitement_sel = 0;
      } else {
        $scope.ntraitement_sel = $scope.ntraitement.ntraitement.IDTraitement;
        $scope.Ntraitement = $scope.ntraitement.ntraitement.Ref_traitement;
        pc.obj.IDtraitement = $scope.ntraitement_sel;
        pc.obj.Ntraitement = $scope.Ntraitement;
      }

      if ($scope.ntraitement_sel != 0) {
        pc.rechercher();
        $("#ref").html("");
        $("#superficie").html("");
        $("#variete").html("");
        $("#Position").html("");
        $("#Statut").html("");
        $("#Superficietraitee").html("");
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

    var parcelletraiter = {
      url: "././images/marker-green-parcelle.png", // url
      scaledSize: new google.maps.Size(60, 50)
    };

    var parcelleencourstraiter = {
      url: "././images/marker-orange.png", // url
      scaledSize: new google.maps.Size(60, 50)
    };

    var parcellenonencoretraiter = {
      url: "././images/marker-red-danger.png", // url
      scaledSize: new google.maps.Size(60, 50)
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
      clearShapes();

      //clear data
      $q.all([realisationtraitementphytosanitaire.getByFiltreMap(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};

        pc.ALLParcelle = values[0].data;

        angular.forEach(pc.ALLParcelle, function(value, key) {
          if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {

            $scope.PourcentageSup = (parseFloat(value.Sup_traiter) / parseFloat(value.Sup)) * 100;
            $scope.PourcentageSup = (!isNaN($scope.PourcentageSup) && $scope.PourcentageSup != Infinity) ? parseInt($scope.PourcentageSup) : 0;

            if ($scope.PourcentageSup == 100 || value.VALIDE) {
              $scope.statut = 'Parcelle traitée entièrement';
              $scope.color = '#8bc980';
              $scope.Etat = 1;
              $scope.Sup_traiter = (value.Sup) ? value.Sup.toFixed(2) : 0;
              $scope.PourcentageSup = 100;
            } else if (value.IDTRAITEMENT_traite && !value.VALIDE) {
              $scope.statut = 'Parcelle en cours de traitement';
              $scope.color = '#f2b531';
              $scope.Etat = 2;
              $scope.Sup_traiter = (value.Sup_traiter) ? value.Sup_traiter.toFixed(2) : 0;
            } else {
              $scope.statut = 'Parcelle non encore commencée';
              $scope.color = '#ff0101';
              $scope.Etat = 3;
              $scope.Sup_traiter = 0;
              $scope.PourcentageSup = 0;
            }

            dataonebyone = {
              'Ref_traitement': value.Ref_traitement,
              'VALIDE': value.VALIDE,
              'IDTRAITEMENT_traite': value.IDTRAITEMENT_traite,
              'sup': (value.Sup) ? value.Sup.toFixed(2) : 0,
              'Sup_traiter': $scope.Sup_traiter,
              'REF_Parcelle': value.Ref,
              'lat': value.LatPosition,
              'lng': value.LngPosition,
              'Variete': value.Variete,
              'type': 'parcelle',
              'pourcentageSup': $scope.PourcentageSup,
              "statut": $scope.statut,
              "Etat": $scope.Etat,
              "color": $scope.color
            }

            mydata.push(dataonebyone);

            if (value.TokenPolygone !== "") {
              IO.OUT(JSON.parse(value.TokenPolygone), map, dataonebyone.color, dataonebyone.color, dataonebyone);
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
            $("#Statut").html("");
            $("#Superficietraitee").html("");
            //insert
            $("#ref").html(this.data.REF_Parcelle);
            $("#superficie").html(this.data.sup + " Ha");
            $("#variete").html(this.data.Variete);
            $("#Position").html("(" + this.data.lat + " , " + this.data.lng + ")");
            $("#Statut").html(this.data.statut);
            if (this.data.Etat == 3)
              $("#Superficietraitee").html("0 Ha");
            if (this.data.Etat == 2 || this.data.Etat == 1)
              $("#Superficietraitee").html(this.data.Sup_traiter + " Ha");
          });
        }

        for (var i = 0; i < mydata.length; i++) {
          var Etat = mydata[i].Etat;
          if (Etat == 1) {
            var icon = parcelletraiter;
          }

          if (Etat == 2) {
            var icon = parcelleencourstraiter;
          }

          if (Etat == 3) {
            var icon = parcellenonencoretraiter;
          }

          var type = mydata[i].type;

          var pourcentageSup = mydata[i].pourcentageSup;
          if (pourcentageSup == null || pourcentageSup == 'null') {
            pourcentageSup = ' ';
          } else {
            pourcentageSup = pourcentageSup.toString() + '%';
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
              text: pourcentageSup,
              color: "green",
              fontSize: "14px",
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
        var zoooom = 17;
      } else if (dataparcelle.length > 0 && pc.checklatlng(dataparcelle[0].LatPosition !== 0, dataparcelle[0].LngPosition)) {
        var lllat = dataparcelle[0].LatPosition;
        var lllng = dataparcelle[0].LngPosition;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);

      angular.forEach(dataparcelle, function(value, key) {
        if (value.LatPosition !== 0 && value.LngPosition !== 0 && value.LngPosition != null && value.LatPosition != null) {

          $scope.PourcentageSup = (parseFloat(value.Sup_traiter) / parseFloat(value.Sup)) * 100;
          $scope.PourcentageSup = (!isNaN($scope.PourcentageSup) && $scope.PourcentageSup != Infinity) ? parseInt($scope.PourcentageSup) : 0;

          if ($scope.PourcentageSup == 100 || value.VALIDE) {
            $scope.statut = 'Parcelle traitée entièrement';
            $scope.color = '#8bc980';
            $scope.Etat = 1;
            $scope.Sup_traiter = (value.Sup) ? value.Sup.toFixed(2) : 0;
            $scope.PourcentageSup = 100;
          } else if (value.IDTRAITEMENT_traite && !value.VALIDE) {
            $scope.statut = 'Parcelle en cours de traitement';
            $scope.color = '#f2b531';
            $scope.Etat = 2;
            $scope.Sup_traiter = (value.Sup_traiter) ? value.Sup_traiter.toFixed(2) : 0;
          } else {
            $scope.statut = 'Parcelle non encore commencée';
            $scope.color = '#ff0101';
            $scope.Etat = 3;
            $scope.Sup_traiter = 0;
            $scope.PourcentageSup = 0;
          }

          dataonebyone = {
            'Ref_traitement': value.Ref_traitement,
            'VALIDE': value.VALIDE,
            'IDTRAITEMENT_traite': value.IDTRAITEMENT_traite,
            'sup': (value.Sup) ? value.Sup.toFixed(2) : 0,
            'Sup_traiter': $scope.Sup_traiter,
            'REF_Parcelle': value.Ref,
            'lat': value.LatPosition,
            'lng': value.LngPosition,
            'Variete': value.Variete,
            'type': 'parcelle',
            'pourcentageSup': $scope.PourcentageSup,
            "statut": $scope.statut,
            "Etat": $scope.Etat,
            "color": $scope.color
          }

          mydata.push(dataonebyone);

          if (value.TokenPolygone !== "") {
            IO.OUT(JSON.parse(value.TokenPolygone), map, dataonebyone.color, dataonebyone.color, dataonebyone);
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
          $("#Statut").html("");
          $("#Superficietraitee").html("");
          //insert
          $("#ref").html(this.data.REF_Parcelle);
          $("#superficie").html(this.data.sup + " Ha");
          $("#variete").html(this.data.Variete);
          $("#Position").html("(" + this.data.lat + " , " + this.data.lng + ")");
          $("#Statut").html(this.data.statut);
          if (this.data.Etat == 3)
            $("#Superficietraitee").html("0 Ha");
          if (this.data.Etat == 2 || this.data.Etat == 1)
            $("#Superficietraitee").html(this.data.Sup_traiter + " Ha");
        });
      }

      for (var i = 0; i < mydata.length; i++) {
        var Etat = mydata[i].Etat;
        if (Etat == 1) {
          var icon = parcelletraiter;
        }

        if (Etat == 2) {
          var icon = parcelleencourstraiter;
        }

        if (Etat == 3) {
          var icon = parcellenonencoretraiter;
        }

        var type = mydata[i].type;

        var pourcentageSup = mydata[i].pourcentageSup;
        if (pourcentageSup == null || pourcentageSup == 'null') {
          pourcentageSup = ' ';
        } else {
          pourcentageSup = pourcentageSup.toString() + '%';
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
            text: pourcentageSup,
            color: "green",
            fontSize: "14px",
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
        $("#Statut").html("");
        $("#Superficietraitee").html("");
        //insert
        $("#ref").html(mydatasellected.REF_Parcelle);
        $("#superficie").html(mydatasellected.sup + " Ha");
        $("#variete").html(mydatasellected.Variete);
        $("#Position").html("(" + mydatasellected.lat + " , " + mydatasellected.lng + ")");
        $("#Statut").html(mydatasellected.statut);
        if (mydatasellected.Etat == 3)
          $("#Superficietraitee").html("0 Ha");
        if (mydatasellected.Etat == 2 || mydatasellected.Etat == 1)
          $("#Superficietraitee").html(mydatasellected.Sup_traiter + " Ha");
      });
    }


    //Fin load Map
  });