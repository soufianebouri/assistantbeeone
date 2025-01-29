'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRefarbregeneratetreeCtrl
 * @description
 * # RepositoryRefarbregeneratetreeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRefarbregeneratetreeCtrl', function($scope, uuid, suiviressourceshydriques, translatedwords, campagneagricole, Arbre, ressourcesHydriques, savefilter, DTOptionsBuilder, $translatePartialLoader, toastr, $window, $translate, DTColumnBuilder, $q, $compile, $state, $cookies, _url, comptageArbre, recolteArbre, parcellecultural, domaine) {
    var pc = this;
    pc.NombreByElement = [];
    pc.ALLParcelle = [];
    pc.ALLElement = [];
    pc.IDDOMAINE = $cookies.getObject('globals').ferme.IDFerme;

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 100);

    pc.obj = {
      parcelle: null,
      areaHa: null,
      fullpolygone: null,
      lat: null,
      lng: null,
      polygone: null,
      arbres: null,
      parcelleref: null,
      oldarbre: null,
      line_number: null,
      tree_number: null
    };


    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    $q.all([parcellecultural.ShowByDomaineEncours(pc.IDDOMAINE),
      domaine.DomaineByID({
        "IDFermes": pc.IDDOMAINE
      })
    ]).then(function(values) {
      pc.ALLParcelle = values[0].data;
      pc.MyFerme = values[1].data;
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Parcelle").selectpicker('refresh');
      }, 100);
      pc.setInitialMap(pc.MyFerme);
      NProgress.done();
    });

    $scope.hidetrees = false;
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelle;
      $scope.hidetrees = false;
      for (var i = 0; i < markerGroups['old'].length; i++) {
        markerGroups['old'][i].setMap(null);
      }
      if (validateInput(parcelle) || $scope.parcelle.length === 0) {
        pc.obj.parcelle = {};
      }

      if (parcelle) {
        pc.rechercher(parcelle, pc.MyFerme);

        pc.obj.parcelle = parcelle;
        try {
          pc.obj.areaHa = parcelle.SuperficieTracer;
          pc.obj.fullpolygone = JSON.parse(parcelle.TokenPolygone);
          pc.obj.lat = parcelle.LatPosition;
          pc.obj.lng = parcelle.LngPosition;
          pc.obj.parcelleref = parcelle.Ref;
          pc.obj.polygone = JSON.parse(parcelle.TokenPolygone)[0].geometry[0];
        } catch (e) {

        }

        Arbre.getAllArbreByIdParcelwithSig({
          IDParcelle: pc.obj.parcelle.ID
        }).then(async e => {
          $scope.oldParcelle = e.data;
          pc.obj.oldarbre = $scope.oldParcelle;
          NProgress.done();
        }).catch(async e => {
          NProgress.done();
          myFunction("Connexion au service perdu, réessayer ultérieurement");
        });



      }
    };


    //costum map vars
    var markerGroups = {
      "piege": [],
      "old": [],
      "new": []
    };

    var infoWindow = new google.maps.InfoWindow();

    var imgold = {
      url: "././images/fermedd.png",
      scaledSize: new google.maps.Size(30, 30)
    };

    var imgNew = {
      url: "././images/fermes.png",
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

    };


    var IO2 = {
      //returns array with storable google.maps.Overlay-definitions
      IN: function(arr, //array with google.maps.Overlays
        encoded //boolean indicating whether pathes should be stored encoded
      ) {
        var shapes = [],
          goo = google.maps,
          shape, tmp;
        if (arr) {
          for (var i = 0; i < arr.length; i++) {
            shape = arr[i];
            tmp = {
              type: this.t_(shape.type),
              id: shape.id || i + 1
            };


            switch (tmp.type) {
              case 'CIRCLE':
                tmp.radius = shape.getRadius();
                tmp.geometry = this.p_(shape.getCenter());
                break;
              case 'MARKER':
                tmp.geometry = this.p_(shape.getPosition());
                break;
              case 'RECTANGLE':
                tmp.geometry = this.b_(shape.getBounds());
                break;
              case 'POLYLINE':
                tmp.geometry = this.l_(shape.getPath(), encoded);
                break;
              case 'POLYGON':
                tmp.geometry = this.m_(shape.getPaths(), encoded);

                break;
            }
            shapes.push(tmp);
          }
        }
        return shapes;
      },
      //returns array with google.maps.Overlays
      OUT2: function(arr, //array containg the stored shape-definitions
        map, cadre, calque //map where to draw the shapes
      ) {
        var shapes = [],
          goo = google.maps,
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
                  strokeColor: calque,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: cadre,
                  fillOpacity: 0.50
                });
                break;
              case 'MARKER':
                tmp = new goo.Marker({
                  position: this.pp_.apply(this, shape.geometry),
                  strokeColor: calque,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: cadre,
                  fillOpacity: 0.50
                });
                break;
              case 'RECTANGLE':
                tmp = new goo.Rectangle({
                  bounds: this.bb_.apply(this, shape.geometry),
                  strokeColor: calque,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: cadre,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYLINE':
                tmp = new goo.Polyline({
                  path: this.ll_(shape.geometry),
                  strokeColor: calque,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: cadre,
                  fillOpacity: 0.50
                });
                break;
              case 'POLYGON':
                tmp = new goo.Polygon({
                  paths: this.mm_(shape.geometry),
                  strokeColor: calque,
                  strokeOpacity: 1,
                  strokeWeight: 1,
                  fillColor: cadre,
                  fillOpacity: 0.50
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
      markers, selected_shape, drawman, clearSelection, setSelection,
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
      }),
      selected_shape = null,
      drawman = new google.maps.drawing.DrawingManager({
        map: map,
        drawingControl: false,
        //drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControlOptions: {
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE
          ]
        },
        polygonOptions: {
          fillColor: '#ff6e6e',
          fillOpacity: '0.0',
          strokeColor: '#ff6e6e'
        },
        polylineOptions: {
          fillColor: '#ff6e6e',
          fillOpacity: '0.0',
          strokeColor: '#ff6e6e'
        }
      }),
      clearSelection = function() {
        if (selected_shape) {
          selected_shape.set((selected_shape.type ===
            google.maps.drawing.OverlayType.MARKER
          ) ? 'draggable' : 'editable', false);
          selected_shape = null;
        }
      },
      setSelection = function(shape) {
        clearSelection();
        selected_shape = shape;

        selected_shape.set((selected_shape.type ===
          google.maps.drawing.OverlayType.MARKER
        ) ? 'draggable' : 'editable', true);


        var coordinatesArray = shape.getPath().getArray();
        var minX = coordinatesArray[0].lat();
        var maxX = coordinatesArray[0].lat();
        var minY = coordinatesArray[0].lng();
        var maxY = coordinatesArray[0].lng();
        for (var i = 0; i < coordinatesArray.length; i++) {

          minX = (coordinatesArray[i].lat() < minX || minX === null) ? coordinatesArray[i].lat() : minX;
          maxX = (coordinatesArray[i].lat() > maxX || maxX === null) ? coordinatesArray[i].lat() : maxX;
          minY = (coordinatesArray[i].lng() < minY || minY === null) ? coordinatesArray[i].lng() : minY;
          maxY = (coordinatesArray[i].lng() > maxY || maxY === null) ? coordinatesArray[i].lng() : maxY;
        }

        /*  document.getElementById('t1').value = (minX + maxX) / 2;
          document.getElementById('t2').value = (minY + maxY) / 2;*/

        pc.obj.lat = (minX + maxX) / 2;
        pc.obj.lng = (minY + maxY) / 2;


        var negativeSpace = new google.maps.Polygon({
          path: shape.getPath().getArray(),
          strokeWeight: 0,
          strokeOpacity: 0,
          fillOpacity: 0,
          clickable: false,
          map: map
        });


      };

    /**************************/

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

    $scope.Retracer = function() {
      $scope.HideOldTree();
      document.getElementById('annuler').style.visibility = "visible";
      $scope.HideNewTree();
      drawman.setOptions({
        drawingControl: true
      });
      drawman.setDrawingMode(
        google.maps.drawing.OverlayType.POLYGON
      );
    }

    $scope.annuler = function() {
      /*clear shape and distance here*/
      $scope.HideNewTree();
      $scope.HideOldTree();
      $scope.distance = undefined;
      $scope.line_number = undefined;
      $scope.tree_number = undefined;
      drawman.setOptions({
        drawingControl: false
      });

      clearShapes();
    }


    $scope.ShowOldTree = function() {
      $scope.hidetrees = true;
      markerGroups['old'] = [];
      var mydata = pc.obj.oldarbre;
      for (var i = 0; i < mydata.length; i++) {
        var type = 'old';
        var point = new google.maps.LatLng(
          parseFloat(mydata[i].lat),
          parseFloat(mydata[i].long));


        var marker = new google.maps.Marker({
          map: map,
          position: point,
          icon: imgold,
          type: type,
          title: mydata[i].Code_Arbre
        });
        if (!markerGroups[type])
          markerGroups[type] = [];
        markerGroups[type].push(marker);


        var html = "<B>Code arbre </B>: " + mydata[i].Code_Arbre;
        bindInfoWindow(marker, map, infoWindow, html, mydata[i], 0);

      }

    }


    $scope.HideOldTree = function() {

      $scope.hidetrees = false;
      for (var i = 0; i < markerGroups['old'].length; i++) {
        markerGroups['old'][i].setMap(null);
      }
    }

    $scope.HideNewTree = function() {
      $scope.hidetrees = false;
      for (var i = 0; i < markerGroups['new'].length; i++) {
        markerGroups['new'][i].setMap(null);
      }
      markerGroups['new'] = [];
    }


    $scope.valider = function() {
      myFunctionLoad();
      if (markerGroups['new'].length > 0) {
        //if api ok then

        var newArbre = [];
        for (var i = 0; i < markerGroups['new'].length; i++) {
          markerGroups['new'][i].icon = imgold;
          pc.obj.oldarbre.push({
            lat: markerGroups['new'][i].getPosition().lat(),
            long: markerGroups['new'][i].getPosition().lng(),
            Code_Arbre: markerGroups['new'][i].title,
            line: markerGroups['new'][i].line
          });
          newArbre.push({
            lat: markerGroups['new'][i].getPosition().lat(),
            long: markerGroups['new'][i].getPosition().lng(),
            Code_Arbre: markerGroups['new'][i].title,
            line: markerGroups['new'][i].line,
            qrCode: uuid.v4()
          })

          markerGroups['old'].push(markerGroups['new'][i]);
        }

        Arbre.creategeneratedtrees({
          newArbre: newArbre,
          parcelle: pc.obj.parcelle.ID,
          dateplantaion: (pc.obj.parcelle.Dat_Plant) ? moment(pc.obj.parcelle.Dat_Plant).format('YYYYMMDD') : null,
          ID_Ferme: pc.IDFerme,
          DateCreated: moment().format('YYYYMMDD'),
          CreatedBy: pc.UserName
        }).then(async e => {
          if (e.data[0].message == "ajout reussi") {
            myFunctionStopload();
            myFunctionDone("Ajout reussi");
            for (var i = 0; i < markerGroups['new'].length; i++) {
              markerGroups['new'][i].setMap(null);
            }

            $scope.HideNewTree();
            $scope.ShowOldTree();

            $scope.hidetrees = true;


          } else {
            $scope.progress = false;
            myFunctionStopload();
            myFunction("An error occured " + e.data[0].description);
            NProgress.done();
          }
        }).catch(async e => {
          $scope.progress = false;
          console.log(e);
          myFunctionStopload();
          myFunction("An error occured");
        });




      } else {
        myFunctionStopload();
        myFunction("No trees found");
      }


    }




    function myFunction(txt) {
      var x = document.getElementById("snackbar");
      x.className = "show";
      x.innerHTML = txt;
      setTimeout(function() {
        x.className = x.className.replace("show", "");
      }, 3000);
    }

    function myFunctionDone(txt) {
      var x = document.getElementById("snackbardone");
      x.className = "show";
      x.innerHTML = txt;
      setTimeout(function() {
        x.className = x.className.replace("show", "");
      }, 3000);
    }

    function myFunctionLoad() {
      var x = document.getElementById("snackbarload");
      x.className = "show";
    }

    function myFunctionStopload() {
      var x = document.getElementById("snackbarload");
      x.className = x.className.replace("show", "");
    }

    $scope.Get_trees = async function() {

      if ($scope.distance > 0 && $scope.line_number > 0 && $scope.tree_number > 0) {
        if (pc.obj.polygone.length == 0) {
          myFunction("Please draw your polygon");
        } else {
          NProgress.start();
          myFunctionLoad();
          Arbre.generateTrees({
            polygon: pc.obj.polygone,
            distance: $scope.distance,
            tree_distance: $scope.line_number,
            row_distance: $scope.line_number,
            tree_number: $scope.tree_number,
            plot: pc.obj.parcelleref,
            language: $window.localStorage.getItem("lang").toLowerCase()
          }).then(async e => {
            $scope.generatedArbres = e.data.data;
            document.getElementById('valider').style.visibility = "visible";
            $scope.HideNewTree();
            $scope.newlatitude = $scope.generatedArbres.latitude;
            $scope.newlongitude = $scope.generatedArbres.longitude;
            $scope.newtree = $scope.generatedArbres.label;
            $scope.newLine = $scope.generatedArbres.line;

            for (var i = 0; i < $scope.newtree.length; i++) {
              var type = 'new';
              var point = new google.maps.LatLng(
                parseFloat($scope.newlatitude[i]),
                parseFloat($scope.newlongitude[i]));


              var marker = new google.maps.Marker({
                map: map,
                store_id: i,
                position: point,
                icon: imgNew,
                type: type,
                draggable: true,
                title: ($scope.newtree[i]) ? $scope.newtree[i].toString() : '1',
                line: $scope.newLine[i],
                lat: $scope.newlatitude[i],
                long: $scope.newlongitude[i]
              });
              if (!markerGroups[type])
                markerGroups[type] = [];
              markerGroups[type].push(marker);


              var html = "<B>Code arbre </B>: " + $scope.newtree[i];
              bindInfoWindowMarker(marker, map, infoWindow, html, $scope.newtree[i], $scope.newlatitude[i], $scope.newlongitude[i], i);

            }
            if ($scope.generatedArbres.status == 200) {
              myFunctionStopload();
              //myFunctionDone(markerGroups["new"].length + " tree(s) found");
              myFunctionDone($scope.generatedArbres.message);
            } else {
              myFunctionStopload();
              myFunction($scope.generatedArbres.message);
            }

            NProgress.done();
          }).catch(async e => {

            NProgress.done();
            myFunctionStopload();
            myFunction("An error has occured during the generation process, please contact your application administrator");
          });
        }
      } else {
        if (!$scope.distance) {
          myFunction("Distance is required");
        } else if (!$scope.line_number) {
          myFunction("Line number is required");
        } else if (!$scope.tree_number) {
          myFunction("Tree number is required");
        }
      }
    }


    document.getElementById('genrate_tree').style.visibility = "hidden";
    document.getElementById('distance_id').style.visibility = "hidden";
    document.getElementById('line_number').style.visibility = "hidden";
    document.getElementById('tree_number').style.visibility = "hidden";

    document.getElementById('annuler').style.visibility = "hidden";
    document.getElementById('valider').style.visibility = "hidden";

    //rechercher
    pc.rechercher = function(dataparcelle, dataferme) {
      var mydata = [];
      clearMarkers();
      clearShapes();
      if (infoWindow) {
        infoWindow.close()
      };

      //clear data

      var mydata = [];
      var dataonebyone = {};

      $scope.firstLat = 0;
      $scope.firstLng = 0;


      if (pc.checklatlng(dataparcelle.LatPosition, dataparcelle.LngPosition)) {
        $scope.new_tracage = true;
        var lllat = dataparcelle.LatPosition;
        var lllng = dataparcelle.LngPosition;
        var zoooom = 19;
        map.setCenter(new google.maps.LatLng(lllat, lllng));
        map.setZoom(zoooom);
      } else {
        $scope.new_tracage = true;
        if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
          var lllat = dataferme[0].Latitude;
          var lllng = dataferme[0].Longitude;
          var zoooom = 17;
        } else {
          var lllat = 33.9691409;
          var lllng = -6.9273709;
          var zoooom = 4;
        }
        map.setCenter(new google.maps.LatLng(lllat, lllng));
        map.setZoom(zoooom);
      }

      if (dataparcelle.TokenPolygone !== "") {
        if (dataparcelle.CouleurCalque) {
          IO.OUT(JSON.parse(dataparcelle.TokenPolygone), map, "#ffffff", dataparcelle.CouleurCalque, dataparcelle);
        } else {
          IO.OUT(JSON.parse(dataparcelle.TokenPolygone), map, "#ffffff", "#4cd90b", dataparcelle);
        }
        try {
          if (JSON.parse(dataparcelle.TokenPolygone)[0].geometry[0].length > 0 && pc.checklatlng(dataparcelle.LatPosition, dataparcelle.LngPosition)) {

            document.getElementById('genrate_tree').style.visibility = "visible";
            document.getElementById('distance_id').style.visibility = "visible";
            document.getElementById('line_number').style.visibility = "visible";
            document.getElementById('tree_number').style.visibility = "visible";
          } else {
            document.getElementById('genrate_tree').style.visibility = "hidden";
            document.getElementById('distance_id').style.visibility = "hidden";
            document.getElementById('line_number').style.visibility = "hidden";
            document.getElementById('tree_number').style.visibility = "hidden";
          }
        } catch (e) {
          document.getElementById('genrate_tree').style.visibility = "hidden";
          document.getElementById('distance_id').style.visibility = "hidden";
          document.getElementById('line_number').style.visibility = "hidden";
          document.getElementById('tree_number').style.visibility = "hidden";
        }
      } else {
        document.getElementById('genrate_tree').style.visibility = "hidden";
        document.getElementById('distance_id').style.visibility = "hidden";
        document.getElementById('line_number').style.visibility = "hidden";
        document.getElementById('tree_number').style.visibility = "hidden";
      }

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
            parseFloat(this.data.LatPosition),
            parseFloat(this.data.LngPosition));
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
          html += "</table><br/>";



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



    pc.checklatlng = function(lat, lng) {
      if (lat !== 0 && lng !== 0 && lat != null && lng != null && lat !== "0" && lng !== "0" && lat !== "" && lng !== "")
        return true;
      return false;
    }

    //first loading map
    pc.setInitialMap = function(dataferme) {
      var mydata = [];
      var dataonebyone = {};
      //set center map & zoom
      if (dataferme.length > 0 && pc.checklatlng(dataferme[0].Latitude, dataferme[0].Longitude)) {
        var lllat = dataferme[0].Latitude;
        var lllng = dataferme[0].Longitude;
        var zoooom = 17;
      } else {
        var lllat = 33.9691409;
        var lllng = -6.9273709;
        var zoooom = 4;
      }

      map.setCenter(new google.maps.LatLng(lllat, lllng));
      map.setZoom(zoooom);


      google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
        clearShapes();
        drawman.setOptions({
          drawingControl: false
        });
        drawman.setDrawingMode(null);
        var shape = e.overlay;
        shape.type = e.type;
        google.maps.event.addListener(shape, 'click', function() {
          setSelection(this);
        });
        setSelection(shape);
        shapes.push(shape);


        var data = IO2.IN(shapes, false);



        var json = JSON.stringify(data, undefined, 4);
        var area = 0;
        for (var i = 0; i < shapes.length; ++i) {
          area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
        }
        var areaHa = (area / 10000).toFixed(2);


        pc.obj.fullpolygone = data;
        if (data[0].type == 'POLYLINE') {
          pc.obj.polygone = data[0].geometry;

        } else {
          pc.obj.polygone = data[0].geometry[0];

        }
        pc.obj.areaHa = areaHa;



        document.getElementById('genrate_tree').style.visibility = "visible";
        document.getElementById('distance_id').style.visibility = "visible";
        document.getElementById('line_number').style.visibility = "visible";
        document.getElementById('tree_number').style.visibility = "visible";

      });

      if (dataferme[0].Polygone_Ferme !== "") {
        if (dataferme[0].CouleurCalque) {
          IO.OUT(JSON.parse(dataferme[0].Polygone_Ferme), map, "#ffffff", dataferme[0].CouleurCalque, dataferme[0]);
        } else {
          IO.OUT(JSON.parse(dataferme[0].Polygone_Ferme), map, "#ffffff", "#4cd90b", dataferme[0]);
        }
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
        var htmls = html;
        infoWindow.setContent(htmls);
        infoWindow.open(map, marker);

      });
    }

    window.DeleteMarker = function(lat, lng, mynumber) {
      //Find and remove the marker from the Array
      for (var i = 0; i < markerGroups['new'].length; i++) {
        if ((markerGroups['new'][i].getPosition().lat() == lat && markerGroups['new'][i].getPosition().lng() == lng) || markerGroups['new'][i].get('store_id') == mynumber) {
          //Remove the marker from Map
          markerGroups['new'][i].setMap(null);

          //Remove the marker from array.
          markerGroups['new'].splice(i, 1);
          //delete markerGroups['new'][i];
          return;
        }
      }

    };

    function bindInfoWindowMarker(marker, map, infoWindow, html, code, lat, lng, mynumber) {

      google.maps.event.addListener(marker, 'click', function() {
        var content = "<B>Code arbre </B>: " + code;
        content += "<br /><br /><center><input type='button' class='btn btn-danger btn-sm' onclick='DeleteMarker(" + lat + ", " + lng + ", " + marker.get('store_id') + ");' value='Delete' /></center>";

        var infoWindow = new google.maps.InfoWindow({
          content: content
        });
        infoWindow.open(map, marker);
      });
    }




    //Fin load Map
  });