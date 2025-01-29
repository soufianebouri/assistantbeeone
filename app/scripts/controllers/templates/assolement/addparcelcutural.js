'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AddparcelcuturalCtrl
 * @description
 * # AddparcelcuturalCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AddparcelcuturalCtrl', function($uibModalInstance, translatedwords, data, $base64, $scope, TypeVarieteService, ParcellePhysique, $translatePartialLoader, $translate, $window, parcellecultural, _url) {
    setTimeout(function() {
      jscolor.installByClassName("jscolor");
    }, 1000);


    var pc = this;
    pc.data = data;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.refreshPicker = (t) => {
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, t);
    }

    $scope.loadParcelPhysique = () => {
      if (pc.parcel.IDFermes) {
        pc.data.prcl_physique = [];
        ParcellePhysique.getParcellePhysique(_url, {
          IDFermes: pc.parcel.IDFermes
        }).then(e => {
          pc.data.prcl_physique = e.data;
          pc.refreshPicker(5);
        });
        pc.refreshPicker(10);
      }
    }

    if (pc.data.action == "insert" || pc.data.action == "update") {
      //FOR INSERT & Update MODAL
      pc.errPushInsert = "Erreur : ";
      pc.parcel = {};
      if (pc.data.action == "update") {
        pc.parcel = {
          ...pc.data.updateParcel
        };
        if (pc.parcel.date_arrachage) {
          pc.parcel.date_arrachage = moment(pc.parcel.date_arrachage, 'YYYY-MM-DD').toDate();
        }
        if (pc.parcel.date_plantation) {
          pc.parcel.date_plantation = moment(pc.parcel.date_plantation, 'YYYY-MM-DD').toDate();
        }
        if (pc.parcel.date_prm_recolte) {
          pc.parcel.date_prm_recolte = moment(pc.parcel.date_prm_recolte, 'YYYY-MM-DD').toDate();
        }
        console.log(pc.parcel);
      }

      setTimeout(function() {
        $('#ferme').selectpicker('val', pc.parcel.IDFermes);
        $('#porte_greffe').selectpicker('val', pc.parcel.IDporte);
        $('#variete').selectpicker('val', pc.parcel.IDVariete);
        $('#cycle').selectpicker('val', pc.parcel.IDCycle);
        $('#prcl_physique').selectpicker('val', pc.parcel.IDprcl);
        $(".selectpicker").selectpicker('refresh');
      }, 1000);

    } else if (pc.data.action == "delete") {

      //FOR CONFIRMATION MODAL
      pc.confirmeDelete = function(res) {
        if (res == 1) {
          $uibModalInstance.close('delete');
          return;
        }
        $uibModalInstance.dismiss('cancel delete');
      };

    }

    $scope.verifyParcel = () => {
      var index = 0;
      if (pc.data.action == 'update') {
        if (pc.parcel.Ref.toLowerCase() == pc.data.updateParcel.Ref.toLowerCase() && pc.parcel.IDFermes == pc.data.updateParcel.IDFermes) {
          return false;
        }
      }
      if (((index = pc.data.allParcel.indexOf(pc.parcel.Ref.toLowerCase())) != -1 && (pc.parcel.IDFermes != pc.data.farmsId[index])) || index == -1) {
        return false;
      }
      return true;
    }

    pc.cancel = function() {
      $uibModalInstance.close('cancel create');
    };
    pc.submitForm = (isValid) => {
      if (isValid) {
        pc.errPushInsert = "Erreur : ";
        if (pc.parcel.date_arrachage) {
          pc.parcel.date_arrachageToInsert = moment(pc.parcel.date_arrachage).format('YYYYMMDD');
        } else {
          pc.parcel.date_arrachageToInsert = null;
        }

        if (pc.parcel.date_plantation) {
          pc.parcel.date_plantationToInsert = moment(pc.parcel.date_plantation).format('YYYYMMDD');
        } else {
          pc.parcel.date_plantationToInsert = null;
        }

        if (pc.parcel.date_prm_recolte) {
          pc.parcel.date_prm_recolteToInsert = moment(pc.parcel.date_prm_recolte).format('YYYYMMDD');
        } else {
          pc.parcel.date_prm_recolteToInsert = null;
        }

        if (pc.data.action == "update") {
          console.log(pc.parcel);

          parcellecultural.updateParcellesCulturale(pc.parcel).then(e => {
            if (e.data[0].message == "ajout reussi") { //validate success
              $uibModalInstance.close('insert');
            } else {
              console.log(e.data[0].description);
              pc.errPushInsert += "an error occured " + e.data[0].description;
            }
          }).catch(e => {
            pc.errPushInsert += e.data;
          });
          return;
        }

        parcellecultural.createParcellesCulturale(pc.parcel).then(e => {
          console.log(pc.parcel);
          /*if (e.data[0].message == "ajout reussi") { //validate success
            $uibModalInstance.close('insert');
          } else {
            console.log(e.data[0].description);
            pc.errPushInsert += "an error occured " + e.data[0].description;
          }*/
        }).catch(e => {
          pc.errPushInsert += e.data;
        });
      }
    }


    var IO = {
      //returns array with storable google.maps.Overlay-definitions
      IN: function(arr, //array with google.maps.Overlays
        encoded //boolean indicating whether pathes should be stored encoded
      ) {
        var shapes = [],
          goo = google.maps,
          shape, tmp;

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

        return shapes;
      },
      //returns array with google.maps.Overlays
      OUT: function(arr, //array containg the stored shape-definitions
        map //map where to draw the shapes
      ) {
        var shapes = [],
          goo = google.maps,
          map = map || null,
          shape, tmp;

        for (var i = 0; i < arr.length; i++) {
          shape = arr[i];

          switch (shape.type) {
            case 'CIRCLE':
              tmp = new goo.Circle({
                radius: Number(shape.radius),
                center: this.pp_.apply(this, shape.geometry),
                strokeColor: "#004cf2",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#2faf21",
                fillOpacity: 0.50
              });
              break;
            case 'MARKER':
              tmp = new goo.Marker({
                position: this.pp_.apply(this, shape.geometry),
                strokeColor: "#004cf2",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#27b73a",
                fillOpacity: 0.50
              });
              break;
            case 'RECTANGLE':
              tmp = new goo.Rectangle({
                bounds: this.bb_.apply(this, shape.geometry),
                strokeColor: "#004cf2",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#2faf21",
                fillOpacity: 0.50
              });
              break;
            case 'POLYLINE':
              tmp = new goo.Polyline({
                path: this.ll_(shape.geometry),
                strokeColor: "#004cf2",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#2faf21",
                fillOpacity: 0.50
              });
              break;
            case 'POLYGON':
              tmp = new goo.Polygon({
                paths: this.mm_(shape.geometry),
                strokeColor: "#004cf2",
                strokeOpacity: 1,
                strokeWeight: 1,
                fillColor: "#2faf21",
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
      map = new google.maps.Map(document.getElementById("parcellemap"), {
          center: new google.maps.LatLng(33.9691409, -6.9273709),
          zoom: 4,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }),
        selected_shape = null,
        drawman = new google.maps.drawing.DrawingManager({
          map: map
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
          clearSelection();
          selected_shape = shape;

          selected_shape.set((selected_shape.type ===
            google.maps.drawing.OverlayType.MARKER
          ) ? 'draggable' : 'editable', true);


          byId('save_raw').disabled = false;

          var coordinatesArray = shape.getPath().getArray();

          //                        alert(coordinatesArray[0].lng());
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


          //                            var bounds = new google.maps.LatLngBounds();
          //                            for (var i = 0; i < coordinatesArray.length; i++) {
          //                                bounds.extend(new google.maps.LatLng(coordinatesArray[i][0], coordinatesArray[i][1]));
          //                            }
          //                            var center = bounds.getCenter();
          //                            console.log(center.lat());

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
          document.getElementById("data").value = "";
          selected_shape = "";
          for (var i = 0; i < shapes.length; ++i) {
            shapes[i].setMap(null);
          }
          shapes = [];
          document.getElementById("areaHa").value = 0;
          byId('save_raw').disabled = true;

          document.getElementById('t1').value = '';
          document.getElementById('t2').value = '';


          clearvar = false;

          var mysnackbar = document.getElementById("snackbar");
          document.getElementById("snackbar").innerHTML = "Effacement réussite";
          mysnackbar.className = "show";
          setTimeout(function() {
            mysnackbar.className = mysnackbar.className.replace("show", "");
          }, 3000);

          effacerFermes();
        };

      //            var drawingManager = new google.maps.drawing.DrawingManager();
      //            drawingManager.setOptions({
      //                drawingControl: true,
      //                drawingControlOptions: {
      //                    position: google.maps.ControlPosition.TOP_CENTER,
      //                    drawingModes: [
      //                        google.maps.drawing.OverlayType.CIRCLE,
      //                        google.maps.drawing.OverlayType.POLYGON,
      //                        google.maps.drawing.OverlayType.MARKER
      //                    ]
      //                }
      //            });
      //            drawingManager.setMap(map);

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
          window.alert("Autocomplete's returned place contains no geometry");
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
        icon: 'MapMarker_Marker_Inside_Chartreuse_spsitin.png',
        position: map.getCenter(),
        title: 'Point centre polygone',
        map: map,
        draggable: true
      });

      google.maps.event.addListener(map, 'zoom_changed', function() {
        //                markerCenter.setVisible(false);
        var NewMapCenter = map.getCenter();
        var latitude = NewMapCenter.lat();
        var longitude = NewMapCenter.lng();
        //                var latLng = NewMapCenter.latLng();
        //                markerCenter.setVisible(false);
        markerCenter.setPosition(map.getCenter());
        //                markerCenter.setVisible(true);
        //                alert(map.getCenter());

        var latLng = markerCenter.getPosition();

        //                document.getElementById('t1').value = latLng.lat();
        //                document.getElementById('t2').value = latLng.lng();

      });

      google.maps.event.addListener(markerCenter, 'drag', function() {
        var latLng = markerCenter.getPosition();
      });

      google.maps.event.addListener(map, 'click', function(event) {
        // alert(event.latLng);
        //                markerCenter = new google.maps.Marker({position: event.latLng, map: map});
      });
      google.maps.event.addListener(drawman, 'overlaycomplete', function(e) {
        var shape = e.overlay;
        shape.type = e.type;
        google.maps.event.addListener(shape, 'click', function() {
          setSelection(this);
        });
        setSelection(shape);
        shapes.push(shape);

        marker = shape;
        //                console.log('Polygon', marker.getPosition().lat());
        //                console.log('Polygon', marker.getPosition().lng());
        //                document.getElementById('t1').value = marker.getPosition().lat();
        //                document.getElementById('t2').value = marker.getPosition().lng();
        //                alert(shapes.Polygon.getCenter());


      });

      google.maps.event.addListener(map, 'click', clearSelection);
      google.maps.event.addDomListener(byId('clear_shapes'), 'click', clearShapes);

      google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
        var data = IO.IN(shapes, false);
        byId('data').value = JSON.stringify(data);
        var json = JSON.stringify(data, undefined, 4);



        //var area = google.maps.geometry.spherical.computeArea(selected_shape.getPath());
        var area = 0;
        for (var i = 0; i < shapes.length; ++i) {
          area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
        }
        //document.getElementById("area").value = area.toFixed(2);
        document.getElementById("areaHa").value = (area / 10000).toFixed(2);
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


  });