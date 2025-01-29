'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AssolementParcelPhysiqueCtrl
 * @description
 * # AssolementParcelPhysiqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AssolementParcelPhysiqueCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    TypeVarieteService,
    ParcellePhysique,
    domaine,
    $cookies,
    $mdDialog,
    toastr
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.parcel = {};
    pc.idTypeVariete = -1;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ParcellePhysique.getAllParcellePhysique(_url, pc.IDFerme).then(result => {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle / Serre"))),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('Sup').withTitle(translatedwords.getTranslatedWord($translate("Superficie"))).withOption('width', '10%').renderWith(function(data, type, full, meta) {
        if (full.Sup) {
          return '<p align="right">' + full.Sup.toFixed(2) + '</p>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type"))).renderWith(function(data, type, full, meta) {
        if (full.Type == "1") {
          return '<span class="badge-orange_withe">Plein champ</span>';
        }
        return '<span class="badge-green_withe">Sous serre</span>';
      }),
      DTColumnBuilder.newColumn('Coord_X').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))).renderWith(function(data, type, full, meta) {
        if (full.Coord_X && full.Coord_X != 0) {
          return full.Coord_X;
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Coord_Y').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))).renderWith(function(data, type, full, meta) {
        if (full.Coord_Y && full.Coord_Y != 0) {
          return full.Coord_Y;
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '10%').withClass('nowraptd all').notSortable()
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add
    pc.Add = function() {
      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.showAdvancedAdd("ev", $scope.fermes);

    }

    $scope.showAdvancedAdd = function(ev, fermes) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/parcellephysique/AddParcellePhysique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog, fermes) {
      $scope.fermes = fermes;
      $scope.Latitude = 0;
      $scope.Longitude = 0;
      $scope.isTraced = false;
      $scope.save_rawClick = false;
      $scope.Type = "Sous serre";
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.ref && $scope.Reference && $scope.Superficie) {

          if ($scope.isTraced) {
            pc.objAdd = {
              "IDFermes": pc.IDFerme,
              "Ref": $scope.ref,
              "Reference": $scope.Reference,
              "Superficie": $scope.Superficie,
              "Type": ($scope.Type == 'Sous serre') ? 0 : 1,
              "IDNature_sol": 0,
              "Coord_X": document.getElementById('t1').value,
              "Coord_Y": document.getElementById('t2').value,
              "tokenpolygone": document.getElementById('data').value
            }
          } else {
            pc.objAdd = {
              "IDFermes": pc.IDFerme,
              "Ref": $scope.ref,
              "Reference": $scope.Reference,
              "Superficie": $scope.Superficie,
              "Type": ($scope.Type == 'Sous serre') ? 0 : 1,
              "IDNature_sol": 0,
              "Coord_X": 0,
              "Coord_Y": 0,
              "tokenpolygone": ""
            }
          }


          if ($scope.save_rawClick) {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
              closeButton: true
            });
          } else {
            ParcellePhysique.createParcellePhysique(_url, pc.objAdd).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                if (e.data[0].description.includes("WDIDX_Parcelle_RefIDFermes")) {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Cette parcelle existe déjà dans la ferme choisi !")), {
                    closeButton: true
                  });
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
                NProgress.done();
              }
            }).catch(e => {
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          }
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      };


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };



      var IO = {
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
        OUT: function(arr, //array containg the stored shape-definitions
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

      var infoWindow = new google.maps.InfoWindow();

      var map;
      var selected_shape;
      var clearvar;
      var shapes = [];
      var drawman;
      var byId;
      var clearSelection;
      var setSelection;
      var clearShapes;

      function initMap() {
        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 16;
        }
        map = new google.maps.Map(document.getElementById("parcellemap"), {
            center: new google.maps.LatLng(latF, longF),
            zoom: zoooom,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }),
          selected_shape = null,
          drawman = new google.maps.drawing.DrawingManager({
            map: map,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ]
            },
            polygonOptions: {
              editable: false
            }
          }),
          byId = function(s) {
            return document.getElementById(s)
          },
          clearSelection = function() {
            if (selected_shape) {
              selected_shape.set((selected_shape.type ===
                google.maps.drawing.OverlayType.MARKER
              ) ? 'draggable' : 'editable', false);
              selected_shape = null;
            }
          },
          setSelection = function(shape) {
            $scope.save_rawClick = true;
            clearSelection();
            selected_shape = shape;

            selected_shape.set((selected_shape.type ===
              google.maps.drawing.OverlayType.MARKER
            ) ? 'draggable' : 'editable', true);


            byId('save_raw').disabled = false;

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

            document.getElementById('t1').value = (minX + maxX) / 2;
            document.getElementById('t2').value = (minY + maxY) / 2;

            var negativeSpace = new google.maps.Polygon({
              path: shape.getPath().getArray(),
              strokeWeight: 0,
              strokeOpacity: 0,
              fillOpacity: 0,
              clickable: false,
              map: map
            });

          },
          clearShapes = function() {
            drawman.setOptions({
              drawingControl: true
            });
            $scope.save_rawClick = false;
            $scope.isTraced = false;
            document.getElementById("data").value = "";
            selected_shape = "";
            for (var i = 0; i < shapes.length; ++i) {
              shapes[i].setMap(null);
            }
            shapes = [];
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = '0';
            document.getElementById('t2').value = '0';


            clearvar = false;


          };


        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }

        var infoWindow = new google.maps.InfoWindow();


        var input = document.getElementById('searchTextField');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(9);
          }

        });


        var markerCenter = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          },
          position: map.getCenter(),
          map: map
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          var NewMapCenter = map.getCenter();
          var latitude = NewMapCenter.lat();
          var longitude = NewMapCenter.lng();
          markerCenter.setPosition(map.getCenter());
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(markerCenter, 'drag', function() {
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(map, 'click', function(event) {

        });
        google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
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

          marker = shape;


        });

        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(byId('clear_shapes'), 'click', clearShapes);

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
          $scope.isTraced = true;
          $scope.save_rawClick = false;
          var data = IO.IN(shapes, false);
          byId('data').value = JSON.stringify(data);
          var json = JSON.stringify(data, undefined, 4);



          //var area = google.maps.geometry.spherical.computeArea(selected_shape.getPath());
          var area = 0;
          for (var i = 0; i < shapes.length; ++i) {
            area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
          }
          //document.getElementById("area").value = area.toFixed(2);

          clearvar = true;

          //                    var coordinatesArray1 = selected_shape.getPath().getArray();
          //                    alert(coordinatesArray1);


        });
        //         downloadUrl("markers.xml", function (data) {

        // var xml = data.responseXML;

        // });

        /*  google.maps.event.addListener(map, 'zoom_changed', function() {
         var zoomm = map.getZoom();
         markermine.setVisible(zoomm <= 15);
         //markerview.setVisible(zommm === 15);
         });*/


        if (map.getZoom() <= 14) {
          //document.getElementById("hotelCheckbox").checked = true;
          // toggleGroup('numbred1');


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
          //alert("d");
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        //restaurantes
        new google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoomm = map.getZoom();









          if (zoomm >= 8) {
            //alert("d");
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


        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


      }

      setTimeout(function() {
        initMap();
      }, 1000);




      google.maps.Polygon.prototype.my_getBounds = function() {
        var bounds = new google.maps.LatLngBounds()
        this.getPath().forEach(function(element, index) {
          bounds.extend(element);
        })
        return bounds;
      }


      function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }



      function decodeLevelss(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
          var level = encodedLevelsString.charCodeAt(i) - 63;
          decodedLevels.push(level);
        }
        return decodedLevels;
      }









      function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(map, marker);

        });
      }

      function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing() {}




      function xmlParse(str) {
        if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
          var doc = new ActiveXObject('Microsoft.XMLDOM');
          doc.loadXML(str);
          return doc;
        }

        if (typeof DOMParser != 'undefined') {
          return (new DOMParser()).parseFromString(str, 'text/xml');
        }

        return createElement('div', null);
      }

      function CenterControl(controlDiv, map) {

      }


      function showRegionByPays(str) {
        if (str === "") {
          document.getElementById("idRegionnn").innerHTML = "";
          return;
        }
        if (window.XMLHttpRequest) {
          // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "ParamerageListeRegionByPays.jsp?q=" + str, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("idRegionnn").innerHTML = xmlhttp.responseText;
          }
        }

      }


    }

    //edit
    pc.edit = function(data) {
      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.showAdvancedEdit("ev", $scope.fermes, data);

    }

    $scope.showAdvancedEdit = function(ev, fermes, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/parcellephysique/EditParcellePhysique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, fermes, data) {
      $scope.fermes = fermes;
      $scope.data = data;
      $scope.Latitude = ($scope.data.Coord_X) ? parseFloat($scope.data.Coord_X) : 0;
      $scope.Longitude = ($scope.data.Coord_Y) ? parseFloat($scope.data.Coord_Y) : 0;
      $scope.isTracedEdit = false;
      $scope.save_rawClick = false;
      $scope.Type = ($scope.data.Type == 0) ? "Sous serre" : "Plein champ";
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);

      $scope.Modifier = async function() {
        toastr.clear();
        if ($scope.data.Ref && $scope.data.Reference && $scope.data.Sup) {

          pc.objEdit = {
            "isTraced": $scope.isTracedEdit,
            "IDParcellePhysique": $scope.data.ID,
            "IDFermes": pc.IDFerme,
            "Ref": $scope.data.Ref,
            "Reference": $scope.data.Reference,
            "Type": ($scope.Type == 'Sous serre') ? 0 : 1,
            "Sup": $scope.data.Sup,
            "Coord_X": document.getElementById('t1').value,
            "Coord_Y": document.getElementById('t2').value,
            "tokenpolygone": document.getElementById('data').value
          }




          if ($scope.save_rawClick) {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
              closeButton: true
            });
          } else {
            ParcellePhysique.updateParcellePhysique(_url, pc.objEdit).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                if (e.data[0].description.includes("WDIDX_Parcelle_RefIDFermes")) {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Cette parcelle existe déjà dans la ferme choisi !")), {
                    closeButton: true
                  });
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
                NProgress.done();
              }
            }).catch(e => {
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          }
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      };


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };



      var IO = {
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
        OUT: function(arr, //array containg the stored shape-definitions
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

      var infoWindow = new google.maps.InfoWindow();

      var map;
      var selected_shape;
      var clearvar;
      var shapes = [];
      var drawman;
      var byId;
      var clearSelection;
      var setSelection;
      var clearShapes;

      function initMap() {
        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 16;
        }

        if ($scope.data.Coord_X && $scope.data.Coord_Y && $scope.data.Coord_X != 0 && $scope.data.Coord_Y != 0 && $scope.data.Coord_X != "" && $scope.data.Coord_Y != "") {
          var latF = $scope.data.Coord_X;
          var longF = $scope.data.Coord_Y;
          var zoooom = 16;
        }
        map = new google.maps.Map(document.getElementById("parcellemap"), {
            center: new google.maps.LatLng(latF, longF),
            zoom: zoooom,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }),
          selected_shape = null,
          drawman = new google.maps.drawing.DrawingManager({
            map: map,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ]
            },
            polygonOptions: {
              editable: false
            }
          }),
          byId = function(s) {
            return document.getElementById(s)
          },
          clearSelection = function() {
            if (selected_shape) {
              selected_shape.set((selected_shape.type ===
                google.maps.drawing.OverlayType.MARKER
              ) ? 'draggable' : 'editable', false);
              selected_shape = null;
            }
          },
          setSelection = function(shape) {
            $scope.save_rawClick = true;
            clearSelection();
            selected_shape = shape;

            selected_shape.set((selected_shape.type ===
              google.maps.drawing.OverlayType.MARKER
            ) ? 'draggable' : 'editable', true);


            byId('save_raw').disabled = false;

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

            document.getElementById('t1').value = (minX + maxX) / 2;
            document.getElementById('t2').value = (minY + maxY) / 2;

            var negativeSpace = new google.maps.Polygon({
              path: shape.getPath().getArray(),
              strokeWeight: 0,
              strokeOpacity: 0,
              fillOpacity: 0,
              clickable: false,
              map: map
            });

          },
          clearShapes = function() {
            drawman.setOptions({
              drawingControl: true
            });
            $scope.save_rawClick = false;
            $scope.isTracedEdit = false;
            document.getElementById("data").value = "";
            selected_shape = "";
            for (var i = 0; i < shapes.length; ++i) {
              shapes[i].setMap(null);
            }
            shapes = [];
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = ($scope.data.Coord_X) ? $scope.data.Coord_X : 0;
            document.getElementById('t2').value = ($scope.data.Coord_Y) ? $scope.data.Coord_Y : 0;


            clearvar = false;
          };


        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }

        if ($scope.data.TokenPolygone != "" && $scope.data.TokenPolygone && pc.IsJsonString($scope.data.TokenPolygone)) {
          IO.OUT(JSON.parse($scope.data.TokenPolygone), map, "#4cff24", "#fffa6e");
        }


        var infoWindow = new google.maps.InfoWindow();


        var input = document.getElementById('searchTextField');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function() {
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            //window.alert("Autocomplete's returned place contains no geometry");
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(9);
          }

        });


        var markerCenter = new google.maps.Marker({
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
          },
          position: map.getCenter(),
          map: map
        });

        google.maps.event.addListener(map, 'zoom_changed', function() {
          var NewMapCenter = map.getCenter();
          var latitude = NewMapCenter.lat();
          var longitude = NewMapCenter.lng();
          markerCenter.setPosition(map.getCenter());
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(markerCenter, 'drag', function() {
          var latLng = markerCenter.getPosition();
        });

        google.maps.event.addListener(map, 'click', function(event) {

        });
        google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
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

          marker = shape;


        });

        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(byId('clear_shapes'), 'click', clearShapes);

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
          $scope.isTracedEdit = true;
          $scope.save_rawClick = false;
          var data = IO.IN(shapes, false);
          byId('data').value = JSON.stringify(data);
          var json = JSON.stringify(data, undefined, 4);



          //var area = google.maps.geometry.spherical.computeArea(selected_shape.getPath());
          var area = 0;
          for (var i = 0; i < shapes.length; ++i) {
            area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
          }
          //document.getElementById("area").value = area.toFixed(2);

          clearvar = true;

          //                    var coordinatesArray1 = selected_shape.getPath().getArray();
          //                    alert(coordinatesArray1);


        });
        //         downloadUrl("markers.xml", function (data) {

        // var xml = data.responseXML;

        // });

        /*  google.maps.event.addListener(map, 'zoom_changed', function() {
         var zoomm = map.getZoom();
         markermine.setVisible(zoomm <= 15);
         //markerview.setVisible(zommm === 15);
         });*/


        if (map.getZoom() <= 14) {
          //document.getElementById("hotelCheckbox").checked = true;
          // toggleGroup('numbred1');


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
          //alert("d");
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
        //restaurantes
        new google.maps.event.addListener(map, 'zoom_changed', function() {
          var zoomm = map.getZoom();









          if (zoomm >= 8) {
            //alert("d");
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


        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


      }

      setTimeout(function() {
        initMap();
      }, 1000);




      google.maps.Polygon.prototype.my_getBounds = function() {
        var bounds = new google.maps.LatLngBounds()
        this.getPath().forEach(function(element, index) {
          bounds.extend(element);
        })
        return bounds;
      }


      function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      }



      function decodeLevelss(encodedLevelsString) {
        var decodedLevels = [];

        for (var i = 0; i < encodedLevelsString.length; ++i) {
          var level = encodedLevelsString.charCodeAt(i) - 63;
          decodedLevels.push(level);
        }
        return decodedLevels;
      }









      function bindInfoWindow(marker, map, infoWindow, html) {
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(html);
          infoWindow.open(map, marker);

        });
      }

      function downloadUrl(url, callback) {
        var request = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();

        request.onreadystatechange = function() {
          if (request.readyState === 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing() {}




      function xmlParse(str) {
        if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
          var doc = new ActiveXObject('Microsoft.XMLDOM');
          doc.loadXML(str);
          return doc;
        }

        if (typeof DOMParser != 'undefined') {
          return (new DOMParser()).parseFromString(str, 'text/xml');
        }

        return createElement('div', null);
      }

      function CenterControl(controlDiv, map) {

      }


      function showRegionByPays(str) {
        if (str === "") {
          document.getElementById("idRegionnn").innerHTML = "";
          return;
        }
        if (window.XMLHttpRequest) {
          // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET", "ParamerageListeRegionByPays.jsp?q=" + str, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("idRegionnn").innerHTML = xmlhttp.responseText;
          }
        }

      }


    }

    //delete
    pc.delete = async function(c) {
      pc.idParcel = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ParcellePhysique.deleteParcellePhysique(_url, {
              ID: pc.idParcel
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    pc.IsJsonString = function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.parcel[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.parcel[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.parcel[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }



  });