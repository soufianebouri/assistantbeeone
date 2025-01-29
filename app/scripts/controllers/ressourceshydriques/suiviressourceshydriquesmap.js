'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RessourceshydriquesSuiviressourceshydriquesmapCtrl
 * @description
 * # RessourceshydriquesSuiviressourceshydriquesmapCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RessourceshydriquesSuiviressourceshydriquesmapCtrl', function($scope, suiviressourceshydriques, translatedwords, campagneagricole, ressourcesHydriques, savefilter, DTOptionsBuilder, $translatePartialLoader, $window, $translate, DTColumnBuilder, $q, $compile, $state, $cookies, _url, comptageArbre, recolteArbre, parcellecultural, domaine) {
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
      $("#Type").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#Mois").selectpicker('refresh');
    }, 1000);

    pc.obj = {
      "DOMAINE": pc.IDDOMAINE,
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD'),
      "Mois": undefined,
      "Year": undefined,
      "Type": [1, 2]
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.Types = [{
      Type: 1,
      Name: "Eaux souterraines"
    }, {
      Type: 2,
      Name: "Eaux de surface"
    }];

    $q.all([suiviressourceshydriques.getForMapParcelles(pc.obj),
      domaine.DomaineByID({
        "IDFermes": pc.IDDOMAINE
      }), campagneagricole.getall()
    ]).then(function(values) {
      pc.ALLParcelle = values[0].data;
      pc.MyFerme = values[1].data;
      pc.compagne_array = values[2].data;
      NProgress.done();
      pc.setInitialMap(pc.ALLParcelle, pc.MyFerme);

      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Type").selectpicker('refresh');
        $("#compagne").selectpicker('refresh');
        $("#Mois").selectpicker('refresh');
      }, 100);

    });


    $scope.allmoiscampagne = [];
    pc.compagne_change = () => {
      try {
        $scope.allmoiscampagne = [];
        pc.obj.Mois = undefined;
        pc.obj.Year = undefined;
        pc.obj.DATE_DEBUT = moment($scope.compagne.Date_debut).format('YYYYMMDD');
        pc.obj.DATE_FIN = moment($scope.compagne.Date_Fin).format('YYYYMMDD');

        $scope.dateStart = moment($scope.compagne.Date_debut, "YYYY-MM-DD");
        $scope.dateEnd = moment($scope.compagne.Date_Fin, "YYYY-MM-DD");
        while ($scope.dateEnd > $scope.dateStart || $scope.dateStart.format('M') === $scope.dateEnd.format('M')) {
          $scope.allmoiscampagne.push($scope.dateStart.format('YYYY-M'));
          $scope.dateStart.add(1, 'month');
        }
        setTimeout(function() {
          $("#Mois").selectpicker('refresh');
          $('#Mois').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
        pc.rechercher();
      } catch (e) {}
    }

    pc.Mois_change = function() {
      pc.obj.Mois = [];
      pc.obj.Year = [];
      if ($scope.mois.mois.length === 0 || $scope.mois.mois === 0 || String($scope.mois.mois) === "0") {
        pc.obj.Mois = undefined;
        pc.obj.Year = undefined;
      } else {

        $scope.mois.mois.forEach(function(item) {
          pc.obj.Year.push(item.split('-')[0]);
          pc.obj.Mois.push(item.split('-')[1]);
        });

      }
      pc.rechercher();
    };

    pc.type_change = function() {
      var Type = $scope.Type;
      if (validateInput(Type) || $scope.Type.length === 0 || $scope.Type.includes(0)) {
        Type = [0];
      }
      pc.obj.Type = Type;
      pc.rechercher();
    };


    //costum map vars
    var markerGroups = {
      "piege": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var iconnanimg1 = {
      url: "././images/Eaux_souterraines.svg",
      scaledSize: new google.maps.Size(30, 30)
    };

    var iconnanimg2 = {
      url: "././images/Eaux_de_surface.svg",
      scaledSize: new google.maps.Size(30, 30)
    };

    var iconnanimg1red = {
      url: "././images/Eaux_souterraines_red.svg",
      scaledSize: new google.maps.Size(30, 30)
    };

    var iconnanimg2red = {
      url: "././images/Eaux_de_surface_red.svg",
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
            try {
              tmp.setValues({
                map: map,
                id: shape.id
              })
              shapes.push(tmp);
            } catch (e) {}

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



    //rechercher
    pc.rechercher = function() {
      var mydata = [];
      clearMarkers();
      if (infoWindow) {
        infoWindow.close()
      };


      //clear data
      $q.all([suiviressourceshydriques.getIndecateursFormap(pc.obj)]).then(function(values) {
        var mydata = [];
        var dataonebyone = {};



        pc.ressources_hydriques = values[0].data;


        $scope.firstLat = 0;
        $scope.firstLng = 0;



        angular.forEach(pc.ressources_hydriques, function(value, key) {
          if (value.Latitude !== 0 && value.Longitude !== 0 && value.Latitude != null && value.Longitude != null) {
            $scope.firstLat = value.Latitude;
            $scope.firstLng = value.Longitude;
            dataonebyone = {
              'ressources_hydriques': value.ReferenceRessourceHydrique,
              'lat': value.Latitude,
              'lng': value.Longitude,
              'Typeressources_hydriques': (value.Type == '1' || value.Type == 1) ? 'Eaux souterraines' : 'Eaux de surface',
              'Typeressources_hydriquesInt': value.Type,
              'Volume': value.Volume,
              'Dureefonctionnement': value.Dureefonctionnement,
              'Debit': value.Debit,
              'type': 'piege'
            }
            mydata.push(dataonebyone);
          }
        });

        for (var i = 0; i < mydata.length; i++) {
          var type = mydata[i].type;
          var ressources_hydriques = mydata[i].ressources_hydriques;

          var point = new google.maps.LatLng(
            parseFloat(mydata[i].lat),
            parseFloat(mydata[i].lng));

          map.setCenter(point)
          var Volume = mydata[i].Volume;
          if (Volume == null || Volume == 'null') {
            Volume = '-';
          } else {
            Volume = Volume.toFixed(1).toString();
          }

          var Dureefonctionnement = mydata[i].Dureefonctionnement;
          if (Dureefonctionnement == null || Dureefonctionnement == 'null') {
            Dureefonctionnement = '-';
          } else {
            Dureefonctionnement = Dureefonctionnement.toFixed(1).toString();
          }

          var Debit = mydata[i].Debit;
          if (Debit == null || Debit == 'null') {
            Debit = '-';
          } else {
            Debit = Debit.toFixed(1).toString();
          }


          var marker_icon = '';


          if (mydata[i].Volume == 0 || mydata[i].Debit == 0 || mydata[i].Dureefonctionnement == 0 || !mydata[i].Volume || !mydata[i].Debit || !mydata[i].Dureefonctionnement) {


            if (mydata[i].Typeressources_hydriquesInt == 1 || mydata[i].Typeressources_hydriquesInt == '1') {
              marker_icon = iconnanimg1red;
            } else {
              marker_icon = iconnanimg2red;
            }
          } else {
            if (mydata[i].Typeressources_hydriquesInt == 1 || mydata[i].Typeressources_hydriquesInt == '1') {
              marker_icon = iconnanimg1;
            } else {
              marker_icon = iconnanimg2;
            }
          }


          mydata[i].Volume = Volume;
          mydata[i].Dureefonctionnement = Dureefonctionnement;
          mydata[i].Debit = Debit;
          var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: marker_icon,
            type: type,
            title: "Ressources hydriques : " + ressources_hydriques
          });
          if (!markerGroups[type])
            markerGroups[type] = [];
          markerGroups[type].push(marker);

          var html = "<center>Ressources hydriques : " + ressources_hydriques + "</center>";
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
          'Dat_Plant': value.Dat_Plant
        }

        if (value.TokenPolygone !== "") {
          if (value.CouleurCalque) {
            IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", value.CouleurCalque, dataparcelle);
          } else {
            IO.OUT(JSON.parse(value.TokenPolygone), map, "#ffffff", "#4cd90b", dataparcelle);
          }
        }
      });

      for (var i = 0; i < shapes.length; i++) {
        google.maps.event.addListener(shapes[i], 'click', function(event) {
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
        //map = new google.maps.Map(document.getElementById("mapComptage"), mapOptions);
        map.mapTypes.set('maroc', mapType);
        map.setMapTypeId('maroc');
      }

      if (map.getZoom() >= 8) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }


    }

    function bindInfoWindow(marker, map, infoWindow, html, mydatasellected, mynumber) {

      google.maps.event.addListener(marker, 'click', function() {

        var html = "<table border='0' class='w3-striped w3-bordered'>";

        html += "<tr><td colspan='2'><br/><b><center>Info Ressources hydriques</center></b><br/></td></tr>";
        html += "<tr><td>Référence&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.ressources_hydriques + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "<tr><td>Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.Typeressources_hydriques + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "<tr><td>Volume (m3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.Volume + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "<tr><td>Durée de fonctionnement (h)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.Dureefonctionnement + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "<tr><td>Débit (m3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td>" + mydatasellected.Debit + "&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>";
        html += "</table>";

        infoWindow.setContent(html);
        infoWindow.open(map, marker);

      });
    }


    //Fin load Map
  });