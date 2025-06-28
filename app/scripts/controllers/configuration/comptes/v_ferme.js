'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ConfigurationComptesVFermeCtrl
 * @description
 * # ConfigurationComptesVFermeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ConfigurationComptesVFermeCtrl',
    function (
      $q,
      $scope,
      toastr,
      $timeout,
      _url,
      $window,
      $translatePartialLoader,
      $translate,
      _version,
      DTOptionsBuilder,
      $compile,
      DTColumnBuilder,
      DTDefaultOptions,
      societe,$cookies,$mdDialog,
      ferme
    ) {
      var vm = this;
      vm._version = _version;

      vm.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
      vm.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;

      $translatePartialLoader.addPart("conduitetechnique");
      $translate.use($window.localStorage.getItem("lang").toLowerCase());
      $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

      $scope.fileName = "Aucun fichier choisi";
      $scope.uploadFile = function (element) {
        var file = element.files[0];
        if (file) {
          $scope.fileName = file.name;
          $scope.$apply();
        }
      };



      vm.currect_step = 1;
      vm.stepUrl = "views/configuration/comptes/v_societe.html";
      vm.step = async function (params, stepUrl) {
        vm.currect_step = params;
        vm.stepUrl = stepUrl
      };

      $scope.uploadFile = function (event) {
        var file = event.target.files[0];
        if (file) {
          $scope.fileName = file.name;
          $scope.$apply();
        }
      };

      $scope.isDragging = false;

      // Trigger file input when clicking on the card
      $scope.triggerFileInput = function () {
        document.getElementById("fileInput").click();
      };

      let allowedExtensions = ["xls", "xlsx"];
      vm.jsonData = [];
      // Handle file selection (when clicked)
      $scope.onFileSelected = function (file) {
        if (file) {
          // Get file extension (convert to lowercase for case-insensitive check)
          let fileExtension = file.name.split(".").pop().toLowerCase();

          // Allowed extensions

          if (allowedExtensions.includes(fileExtension)) {




            let reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = async function (e) {
              let data = e.target.result;
              let workbook = XLSX.read(data, { type: "binary" });

              // Assuming the first sheet contains the data
              let sheetName = workbook.SheetNames[0];
              let sheet = workbook.Sheets[sheetName];

              // Convert sheet to JSON

              vm.jsonData = XLSX.utils.sheet_to_json(sheet, {
                defval: "",  // Ensures empty cells are included
                raw: true    // Keeps data as-is without automatic conversion
            });

              let {status, message} = await $scope.checkExcelHeaders(vm.jsonData)

              vm.jsonData = await  vm.transformExcelData(vm.jsonData);

              if(status){





                   //infos
            vm.isFileSelected = true;
            vm.fileName = file.name;

            if (file.size >= 1024 * 1024) {
              vm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
            } else {
              vm.fileSize = (file.size / 1024).toFixed(2) + " KB";
            }

              }else{
                vm.isFileSelected = false;
                toastr.clear();
                toastr.warning(message, {
                closeButton: true,
               });
              }

             /* $scope.$apply(() => {
                  $scope.excelData = jsonData; // Store JSON data in scope
              });*/



          };

          reader.onerror = function (error) {


              vm.isFileSelected = false;
              toastr.clear();
              toastr.warning("Error reading file", {
              closeButton: true,
            });
          };




          } else {
            vm.isFileSelected = false;
            toastr.clear();
            toastr.warning("Only XLS and XLSX files are allowed.", {
              closeButton: true,
            });
          }
        } else {
          vm.isFileSelected = false;
        }
      };

      vm.delete_file = function () {
        vm.isFileSelected = false;
        vm.resetErrExcel();
        vm.jsonData = [];
      };

      // Handle drag events
      $scope.onDragOver = function (event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.isDragging = true;
        $scope.$apply();
      };

      $scope.onDragLeave = function (event) {
        $scope.isDragging = false;
        $scope.$apply();
      };

      // Handle file drop
      $scope.onDrop = function (file) {
        $scope.isDragging = false;
        if (file.length > 0) {
          vm.isFileSelected = true;
          vm.fileName = file.name;
          if (file.size >= 1024 * 1024) {
            // If size is 1MB or more, show in MB
            vm.fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
          } else {
            // Otherwise, show in KB
            vm.fileSize = (file.size / 1024).toFixed(2) + " KB";
          }
        } else {
          vm.isFileSelected = false;
        }
      };





      /** Table */

      vm.dtInstance = {};
      vm.selected = {};
      vm.selectAll = false;
      vm.societes = {};

      //get data and refresh datatable
      vm.data_societe = [];
NProgress.start();
      $q.all([
        ferme.get_all(),
        societe.get_all()
      ]).then((values) => {
        vm.data_societe = values[0].data;
        vm.data_societe_all = values[1].data;
        vm.old_items = vm.data_societe.length;
        vm.dtInstance.reloadData();
          NProgress.done();
      }).catch((error) => {
          NProgress.done();
        if (error && error.message) {
          console.error("Error message:", error.message);
          toastr.clear();
          toastr.error("Error message:", error.message, {
            closeButton: true
          });
        } else {
          console.error("Connot acces to the server, call our support team", error);
          toastr.clear();
          toastr.error("Connot acces to the server, call our support team", error, {
            closeButton: true
          });
        }
      });



      vm.validateCoordinates = async function () {
        let isValidCoordinates = true;
        let messageCoordinates = ''

        if (vm.formData.Latitude === undefined ) {
          isValidCoordinates = true;
        }

        if ( vm.formData.Longitude === undefined) {
          isValidCoordinates = true;
        }

        if (vm.formData.Latitude < -90 || vm.formData.Latitude > 90) {
          isValidCoordinates = false;
          messageCoordinates = 'Latitude should be between -90 and 90'
        }

        if (vm.formData.Longitude < -180 || vm.formData.Longitude > 180) {
          isValidCoordinates = false;
          messageCoordinates = 'Longitude should be between -180 and 180'
        }

        return {
          isValidCoordinates,
          messageCoordinates
        };
    };



      vm.modifier = async function  () {

          if(await vm.validateFormData()){

            NProgress.start()   ;


            ferme.edit(vm.formData).then(async e => {
                //validate success


                let index = vm.data_societe.findIndex(item => item.IDFermes === e.data.inserted_data.IDFermes);

                if (index !== -1) {
                  // Update the existing object
                  vm.data_societe[index] = e.data.inserted_data;
                } else {
                  // If not found, add it to the list (optional)
                  vm.data_societe.push(e.data.inserted_data);
                }

                toastr.clear();
                toastr.success("Ferme bien modifiée.", {
                  closeButton: true
                });
                NProgress.done();
                vm.dtInstance.reloadData();
                vm.reset();
                await $scope.undoSelect()

            }).catch(async e => {
              NProgress.done();
              toastr.clear();
              toastr.error(e.data.message, {
                closeButton: true
              });
            });
          }
      };


      vm.validateFormData = async function() {

            let rules = {
                Code: "Référence ferme is required.",
                Nom: "Nom de la is required.",
                societe: "Société is required.",
                Superficie: (value) => value > 0 ? null : "Superficie must be greater than 0.",
                Date_Creatio_Ferme: "Date de création de la ferme is required."
            };


            for (let key in rules) {
                if (vm.formData[key] === null || vm.formData[key] === undefined || vm.formData[key] === '') {
                    toastr.clear();
                    toastr.warning(typeof rules[key] === "function" ? rules[key](vm.formData[key]) : rules[key], {
                      closeButton: true
                    });

                    return false;
                }
            }

            let {isValidCoordinates,
              messageCoordinates} = await vm.validateCoordinates();
            if (!isValidCoordinates) {
              toastr.clear();
                    toastr.warning(messageCoordinates, {
                    closeButton: true
              });
              return false;
            }
            return true;
       };

      vm.ajouter = async function  () {
        toastr.clear();
          if(await vm.validateFormData()){

            NProgress.start()


            ferme.add(vm.formData).then(async e => {
                //validate success

                vm.data_societe.unshift(e.data.inserted_data);


                toastr.clear();
                toastr.success("Ferme bien ajoutée.", {
                  closeButton: true
                });
                await $scope.undoSelect()
                NProgress.done();
                vm.dtInstance.reloadData();
                vm.reset();
            }).catch(async e => {
              NProgress.done();
              toastr.clear();
              toastr.error(e.data.message, {
                closeButton: true
              });
            });

          }


      };


        vm.multiDelete = async function() {

          let { selectedIds, newItemCount } = await $scope.getSelectedIDs(vm.data_societe);

          toastr.clear();
          toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {

              $("#confirmationRevertYes").click(function() {
                NProgress.start()
                ferme.multidelete({
                  IDs : selectedIds
                }).then(async function(result) {

                  vm.data_societe = vm.data_societe.filter(item => !selectedIds.includes(item.IDFermes));


                  await $scope.undoSelect()
                  toastr.clear();
                  toastr.success("Suppression réussie", {
                    closeButton: true
                  });
                  NProgress.done();
                  vm.dtInstance.reloadData();

                }).catch(async e => {
                  NProgress.done();
                  toastr.clear();
                  toastr.error(e.data.message, {
                    closeButton: true
                  });
                });
              });
            }
          });

        }


      vm.polygoneAction = async function(data) {

        $scope.showAdvanced("ev", data);


      }

      $scope.showAdvanced = function(ev, data) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/configuration/comptes/polygone/v_polygone_ferme.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

      function DialogController($scope, $mdDialog, data) {

        $scope.annuler = function() {
          $mdDialog.cancel();
        };


      $scope.data = data;

      $scope.tokenpolygone = data.Polygone_Ferme;
      $scope.Latitude = ($scope.data.Latitude) ? parseFloat($scope.data.Latitude) : 0;
      $scope.Longitude = ($scope.data.Longitude) ? parseFloat($scope.data.Longitude) : 0;
      $scope.areaHa = ($scope.data.SuperficieTracer) ? parseFloat($scope.data.SuperficieTracer) : 0;

      $scope.isTracedEdit = false;
      $scope.save_rawClick = false;
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.setsearchID_Pays = function() {
        $scope.searchID_Pays = $scope.Pays;
        $scope.searchID_Region = null;
        $scope.Region = null;
        $scope.Zone = null;
        $scope.IsearchID_Pays = true;
      }
      $scope.setsearchID_Region = function() {
        $scope.searchID_Region = $scope.Region;
        $scope.IsearchID_Region = true;
      }


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
        if (!$scope.Latitude || !$scope.Longitude || $scope.Latitude == 0 || $scope.Longitude == 0 || $scope.Latitude == "" || $scope.Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.Latitude;
          var longF = $scope.Longitude;
          var zoooom = 15;
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
            document.getElementById("areaHa").value = ($scope.data.SuperficieTracer) ? $scope.data.SuperficieTracer : 0;
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = ($scope.data.Latitude) ? $scope.data.Latitude : 0;
            document.getElementById('t2').value = ($scope.data.Longitude) ? $scope.data.Longitude : 0;


            clearvar = false;

          };


          if ($scope.data.Polygone_Ferme && $scope.IsJsonString($scope.data.Polygone_Ferme)) {
            // Clear old shapes first
            for (var i = 0; i < shapes.length; ++i) {
              shapes[i].setMap(null);
            }
            shapes = [];
          
            // Draw new ones from Polygone_Ferme and keep reference
            var newShapes = IO.OUT(JSON.parse($scope.data.Polygone_Ferme), map, "#C2E699", "#31A354");
            shapes = shapes.concat(newShapes);
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


        google.maps.event.addListener(drawman, 'overlaycomplete', function(event) {
          if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            var polygon = event.overlay;
            shapes.push(polygon); // Assuming 'shapes' is an array of polygons

            $scope.isTracedEdit = true;
            $scope.save_rawClick = false;

            // Prepare GeoJSON or custom JSON from polygon shapes
            var data = IO.IN(shapes, false);
            byId('data').value = JSON.stringify(data);
            var json = JSON.stringify(data, undefined, 4);

            // Calculate total area in hectares
            var area = 0;
            for (var i = 0; i < shapes.length; ++i) {
              area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
            }
            document.getElementById("areaHa").value = (area / 10000).toFixed(2);

            clearvar = true;

            console.log(document.getElementById('t1').value);
            console.log(document.getElementById('t2').value);
            console.log(document.getElementById('data').value);

            // Optional: disable drawing mode after drawing
            drawman.setDrawingMode(null);
          }
        });

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {

          NProgress.start()

          ferme.polygone({
            Latitude : document.getElementById('t1').value,
            Longitude : document.getElementById('t2').value,
            IDFermes : data.IDFermes,
            Polygone_Ferme : document.getElementById('data').value,
            SuperficieTracer : document.getElementById('areaHa').value
          }).then(async e => {
            //validate success


            let index = vm.data_societe.findIndex(item => item.IDFermes === e.data.inserted_data.IDFermes);

            if (index !== -1) {
              // Update the existing object
              vm.data_societe[index] = e.data.inserted_data;
            } else {
              // If not found, add it to the list (optional)
              vm.data_societe.push(e.data.inserted_data);
            }

            toastr.clear();
            toastr.success("Ferme bien tracée.", {
              closeButton: true
            });
            NProgress.done();
            vm.dtInstance.reloadData();
                        $mdDialog.cancel();

        }).catch(async ee => {
          NProgress.done();
          toastr.clear();
          toastr.error(ee.data.message, {
            closeButton: true
          });
        });


        /*  $scope.isTracedEdit = true;
          $scope.save_rawClick = false;
          var data = IO.IN(shapes, false);
          byId('data').value = JSON.stringify(data);
          var json = JSON.stringify(data, undefined, 4);
          var area = 0;
          for (var i = 0; i < shapes.length; ++i) {
            area += google.maps.geometry.spherical.computeArea(shapes[i].getPath());
          }
          document.getElementById("areaHa").value = (area / 10000).toFixed(2);
          clearvar = true;

            console.log(document.getElementById('t1').value)
            console.log(document.getElementById('t2').value)
            console.log(document.getElementById('data').value)
*/
        });


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
          map.mapTypes.set('maroc', mapType);
          map.setMapTypeId('maroc');
        }

        if (map.getZoom() >= 8) {
          map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        }
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

      function CenterControl(controlDiv, map) {}


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

      $scope.IsJsonString = function(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

    }


      vm.delete = async function(data) {

        toastr.clear();
        toastr.error("<button type='button' id='confirmationRevertYes' class='btn btn-danger' style='float : right;'>Je confirme </button>", "Veuillez confirmer !", {
          closeButton: true,
          allowHtml: true,
          onShown: function(toast) {
            $("#confirmationRevertYes").click(function() {
              NProgress.start()
              ferme.delete(data).then(async function(result) {

                vm.data_societe = vm.data_societe.filter(item => item.IDFermes !== data.IDFermes);


                await $scope.undoSelect()
                toastr.clear();
                toastr.success("Suppression réussie", {
                  closeButton: true
                });
                NProgress.done();
                vm.dtInstance.reloadData();

              }).catch(async e => {
                NProgress.done();
                toastr.clear();
                toastr.error(e.data.message, {
                  closeButton: true
                });
              });
            });
          }
        });

      }



      $scope.check_all_data_input = async function(){
        var isDuplicate = vm.data_societe.some(function(societe) {
          return societe.Code === vm.formData.Code;
      });

      if (isDuplicate) {

        toastr.clear();
        toastr.warning("Raison Sociale already esist!", {
          closeButton: true,
        });
          return false
      } else {
          return true;
      }
      }

      $scope.check_all_data_input_edit = async function(){
        var isDuplicate = vm.data_societe.some(function(societe) {
          return (societe.Rais_Social === vm.formData.Rais_Social && societe.IDFermes != vm.formData.IDFermes);
      });

      if (isDuplicate) {

        toastr.clear();
        toastr.warning("Raison Sociale already esist!", {
          closeButton: true,
        });
          return false
      } else {
          return true;
      }
      }



      vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
        //var defer = $q.defer();
        return $q.resolve(vm.data_societe);
      })
        .withOption("createdRow", createdRow)
        .withDOM("<lf<t>ip>")
        .withPaginationType("simple_numbers")
        .withOption("pageLength", 5)  // Default number of items per page
         .withOption("lengthMenu", [5, 10, 20, 50, 100])  // Options for page length
        .withOption("responsive", true)
      /*  .withOption('scrollX', false) // Add this line
         .withOption('autoWidth', false)
        .withDisplayLength(5)
        .withScroller(false)*/
        .withOption("order", [])
        .withButtons([
          {
            extend: "copy",
            className: "pull-left pointer",
            text: "COPY",
            titleAttr: "Copie",
          },
          {
            extend: "excel",
            text: "EXCEL",
            titleAttr: "EXCEL",
            title: 'Liste Des Fermes'
          },
        ]);



        function actionsHtml(data, type, full, meta) {
            vm.societes[data.IDFermes] = data;
            var editbtn =
            '<button class="btnEdit_tb" ng-click="vm.edit(vm.societes[' +
            data.IDFermes +
            '])"><img src="././images/main_configuration/edit.svg" alt="edit"></button>&nbsp;&nbsp;&nbsp;';

          var deletebtn =
            '<button class="btnEdit_tb" ng-click="vm.delete(vm.societes[' +
            data.IDFermes +
            '])"><img src="././images/main_configuration/delete.svg" alt="delete"></button>';

            data.Polygone_Ferme = (data.Polygone_Ferme !== "0") ? data.Polygone_Ferme : null;
            data.Polygone_Ferme = (data.Polygone_Ferme) ? data.Polygone_Ferme : null;

            const hasPolygon = !!data.Polygone_Ferme;
            const imgSrc = hasPolygon
              ? '././images/main_configuration/polygone_done.svg'
              : '././images/main_configuration/no_polygone.svg';

            const polygonebtn = `
              <button class="btnEdit_tb" ng-click="vm.polygoneAction(vm.societes[${data.IDFermes}])">
                <img src="${imgSrc}" alt="polygon">
              </button>
            `;


        return polygonebtn + "&nbsp;" + editbtn + deletebtn;
        }

        vm.edit = function (data) {
          vm.formData = data;

          vm.formData.Latitude = parseFloat(vm.formData.Latitude || 0);  // or set a default value
          vm.formData.Longitude = parseFloat(vm.formData.Longitude || 0);
          vm.formData.Date_Creatio_Ferme = (vm.formData.Date_Creatio_Ferme) ? new Date(moment(vm.formData.Date_Creatio_Ferme).format("YYYY-MM-DD")) : null;

          vm.formData.societe = vm.data_societe_all.find(societe => societe.ID === vm.formData.ID_societe);

          toastr.clear();
            toastr.success(`The form for editing has been filled out and is ready for modification: ${vm.formData.Nom}. 👆`, {
            closeButton: true
          });

        }





        $scope.allSelected = false; // Tracks "Select All" state

      // Toggle all checkboxes
      vm.toggleAllSelection = function() {
        $scope.allSelected = (!$scope.allSelected) ? true : false;
        vm.data_societe.forEach(societe => {
            societe.selected = $scope.allSelected; // Toggle selection
        });
        vm.dtInstance.reloadData();
    };

    // Expose function globally
    window.toggleAllSelection = function() {
        $scope.$apply(function() {
            vm.toggleAllSelection();
        });
    };


    $scope.undoSelect = async function(){
      vm.data_societe = vm.data_societe.map(societe => {
         return { ...societe, selected: false }; // Toggle selection
     });
    }
    $scope.getSelectedIDs = async function(data) {
      let selectedItems = data.filter(item => item.selected === true); // Get selected items

      let selectedIds = selectedItems.map(item => item.IDFermes); // Extract IDs
      let newItemCount =0 // Count `newItem === true`

      return {
        selectedIds,  // Array of selected IDs
        newItemCount  // Count of new items
      };
    };


      $scope.toggleSelection = function (id) {
        let found = false;
        vm.data_societe = vm.data_societe.map(societe => {
            if (societe.IDFermes === id) {
                found = true;
                return { ...societe, selected: !societe.selected }; // Toggle selection
            }
            return societe;
        });
        /* if (!found) {
              vm.data_societe.push({ id_sco_temp: id, selected: true });
          }    */
    };

      function checkboxHtml(data, type, full, meta) {
          return `<input type="checkbox" ng-checked="data.selected" ng-click="toggleSelection(${data.IDFermes})">`;
      }


      vm.updateSelectedCount = function () {
        return vm.data_societe.filter(societe => societe.selected).length;
      };


      vm.dtColumns = [
        DTColumnBuilder.newColumn(null)
          .withTitle(
            '#'// '<input type="checkbox" ng-model="vm.allSelected" onclick="toggleAllSelection()">'
          ).renderWith(checkboxHtml).notSortable().withOption("width", "15px"),
        DTColumnBuilder.newColumn("Rais_Social").withTitle("Société").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Code").withTitle("Référence").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Nom").withTitle("Nom").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Superficie").withTitle("Superficie").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Date_Creatio_Ferme").withTitle("Date De Création").renderWith(function(data, type, full, meta) {
          if(full.Date_Creatio_Ferme)
          return moment(full.Date_Creatio_Ferme).format('DD/MM/YYYY');
          return ''
        }).withOption("width", "100px"),
        DTColumnBuilder.newColumn("Adresse").withTitle("Adresse").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Gerant").withTitle("Gérant").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Ville").withTitle("Ville").withOption("width", "100px"),
        DTColumnBuilder.newColumn("statut_foncier").withTitle("Statut Foncier").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Fax").withTitle("Fax").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Tel").withTitle("Téléphone").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Latitude").withTitle("Latitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Longitude").withTitle("Longitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn("Altitude").withTitle("Altitude").withOption("width", "100px"),
        DTColumnBuilder.newColumn(null).withTitle("Actions").renderWith(actionsHtml).withClass("nowraptd all").notSortable(),
      ];


      DTDefaultOptions.setLoadingTemplate(
        '<center><img src="././images/loading.gif"/></center>'
      );

     vm.reset = function () {

      vm.formData =  {
        Code: null,
        Nom: null,
        societe: null,
        Superficie: null,
        Date_Creatio_Ferme: null,
        Gerant: null,
        Adresse: null,
        Ville: null,
        Fax: null,
        Tel: null,
        statut_foncier: null,
        Latitude: null,
        Longitude: null,
        Altitude: null,
        ID : null,
        newItem : true
      }
     }
     vm.reset()




      vm.howto = true;

      function createdRow(row, data, dataIndex) {
        // Add row highlighting first
        /*if (data.newItem) {
          angular.element(row).addClass('new-row');
        }*/

        // Then handle Angular compilation
        $compile(angular.element(row).contents())($scope);
      }


      /** Step1 excel*/

      vm.headers = [
        "Référence","Nom","Société",
        "Superficie","Date De Création","Gérant",
        "Adresse","Ville","Fax",
        "Téléphone","Statut Foncier","Latitude",
        "Longitude","Altitude"];

        vm.exportToExcel = function () {
           let headers=  vm.headers
            var ws_data = [headers]
            var ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Create workbook
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Fermes");

            // Write the file and trigger download
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            var blob = new Blob([wbout], { type: "application/octet-stream" });

            saveAs(blob, "Canvas Fermes.xlsx");
        };


        $scope.checkExcelHeaders = async function (data) {
          if(data.length>0){
              // Define required headers
              var requiredHeaders = vm.headers

              // Extract headers from the first row of the data
              var fileHeaders = Object.keys(data[0] || {});


              // Check if all required headers are present
              var isValid = requiredHeaders.every(header => fileHeaders.includes(header));
              if(isValid){
                return {
                  status : true
                }
              }else{
                return {
                  status : false,
                  message : "Invalid file format! Please ensure all required headers are present."
                };
              }
          }else{
            return {
              status : false,
              message : "file is emplty!."
            };
          }


      };

      vm.cleanJsonKeys = async function (data) {
        return data.map(item => ({
          Code: item["Référence"] || null,
          Nom: item["Nom"] || null,
          societe: item["Société"] || null,
          Superficie: item["Superficie"] || null,
          Date_Creatio_Ferme: item["Date De Création"] ? XLSX.SSF.format("yyyy-mm-dd", item["Date De Création"]) : null,
          Gerant: item["Gérant"] || null,
          Adresse: item["Adresse"] || null,
          Ville : item["Ville"] || null,
          Fax: item["Fax"] || null,
          Tel: item["Téléphone"] || null,
          statut_foncier: item["Statut Foncier"] || null,
          Latitude: item["Latitude"] || null,
          Longitude: item["Longitude"] || null,
          Altitude: item["Altitude"] || null
        }));
      };



      vm.transformExcelData = async function (data) {
        return await vm.cleanJsonKeys(data);
      };


      vm.checkDuplicate__column_code = async function (newData, oldData) {


        // Ensure `seen` set is cleared each time the function is called
        let seen = new Set();
        let rowIndex = 2;  // To keep track of the row number

        // Add old data "" values to the set
        oldData.forEach(item => {
            if (item.Code) {
                seen.add(item.Code.toLowerCase()); // Convert to lowercase for case-insensitive check
            }
        });



        // Check for duplicates in new data
        for (let item of newData) {
            if (item.Code) {
                let lowerCaseName = item.Code.toLowerCase();



                if (seen.has(lowerCaseName)) {
                    return {
                        status: false,
                        message: `Duplicate Rférence found in row ${rowIndex}: ${item.Code}`
                    };
                }

                seen.add(lowerCaseName);
            }
            rowIndex++;
        }

        return {
            status: true
        }; // No duplicates found
      };

      vm.checkDuplicate__column_name = async function (newData, oldData) {


        // Ensure `seen` set is cleared each time the function is called
        let seen = new Set();
        let rowIndex = 2;  // To keep track of the row number

        // Add old data "" values to the set
        oldData.forEach(item => {
            if (item.Nom) {
                seen.add(item.Nom.toLowerCase()); // Convert to lowercase for case-insensitive check
            }
        });



        // Check for duplicates in new data
        for (let item of newData) {
            if (item.Nom) {
                let lowerCaseName = item.Nom.toLowerCase();



                if (seen.has(lowerCaseName)) {
                    return {
                      status_name: false,
                      message_name: `Duplicate Nom found in row ${rowIndex}: ${item.Nom}`
                    };
                }

                seen.add(lowerCaseName);
            }
            rowIndex++;
        }

        return {
          status_name: true
        }; // No duplicates found
      };



    vm.resetErrExcel = function(){
      vm.errData = {
        err : false
      }
    }




      vm.integer = async function(){


        if(vm.jsonData.length>0){

          let { status , message} = await vm.checkDuplicate__column_code(vm.jsonData, vm.data_societe);




          if(status){
            let { status_name , message_name} = await vm.checkDuplicate__column_name(vm.jsonData, vm.data_societe);

            if(status_name){
              /**Create en masse */

            NProgress.start()


            ferme.multiadd({
              fermes :vm.jsonData
            }).then(async e => {
                //validate success

                vm.data_societe.unshift(...e.data.inserted_data);



                toastr.clear();
                toastr.success(e.data.message, {
                  closeButton: true
                });
                await $scope.undoSelect()
                NProgress.done();
                vm.dtInstance.reloadData();
                vm.reset();
                vm.isFileSelected = false;
                vm.jsonData = [];
                vm.errData = {
                  err : false
                }
            }).catch(async e => {
              NProgress.done();
              toastr.clear();
              toastr.error(e.data.message, {
                closeButton: true
              });
              vm.errData = {
                err : true,
                message : e.data.message
              }
            });


            }else{
              vm.errData = {
                err : true,
                status : status_name,
                message : message_name
              }
              toastr.clear();
              toastr.warning(message_name, {
              closeButton: true,
            });
            }



          }else{
            vm.errData = {
              err : true,
              status : status,
              message : message
            }
            toastr.clear();
            toastr.warning(message, {
            closeButton: true,
          });
          }




        }else{
          toastr.clear();
          toastr.warning("Upload your file!", {
          closeButton: true,
         });
        }
      }

      /** */
      /*function actionsHtml(data, type, full, meta) {
        vm.societes[data.id_sco_temp] = data;
        var editbtn =
          '<button class="btnEdit_tb"  ng-click="vm.edit(vm.societes[' +
          data.id_sco_temp +
          '])"><img src="././images/main_configuration/edit.svg" alt="time"</button>&nbsp;';
        var deletebtn =
          '<button class="btnEdit_tb"  ng-click="vm.delete(vm.societes[' +
          data.id_sco_temp +
          '])" )"=""><img src="././images/main_configuration/delete.svg" alt="time"</button>';
        return editbtn + "" + deletebtn;
      }*/

        /**chat */
         // Initialize messages array
    $scope.messages = [{
      timestamp : new Date(),
      role: 'BeeOne assistant',
      content: 'Hello 👋! How can I assist you today?',
      wait:false
    }];

    $scope.newMessage = '';

    // Format timestamp
    $scope.formatTime = function(date) {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    // Format date
    $scope.formatDate = function(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    function scrollToBottom() {
      $timeout(function() {
        var chatMessages = document.querySelector('.chat_loop-container');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }

    // Send message function
    $scope.sendMessage = function() {
      if ($scope.newMessage.trim()) {
        const now = new Date();
        // Add user message
        $scope.messages.push({
          timestamp: now,
          role: 'user',
          content: $scope.newMessage.trim(),
          wait:false
        });

        $scope.messages.push({
          role: 'BeeOne assistant',
          content: 'thinking....',
          wait:true
       });

       const icons = ['🔜', '🕐', '🛠️', '📢', '🎬', '🎉', '👀', '🚧', '⌛', '🏗️'];
       let lastMessage = $scope.messages[$scope.messages.length - 1];
       let randomIcon = icons[Math.floor(Math.random() * icons.length)];
       setTimeout(() => {
        lastMessage.timestamp= new Date(now.getTime() + 1000), // 1 second later
        lastMessage.wait = false;
        lastMessage.content = `Task in progress stay tonned ${randomIcon}`;
        $scope.$apply(); // Apply changes to update the UI
        }, 2000);





        // Clear input
        $scope.newMessage = '';
        scrollToBottom();
      }
    };
    scrollToBottom();
    // Handle Enter key press
    $scope.handleKeyPress = function(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        $scope.sendMessage();
      }
    };

      /**** Step 1 *****/

      /**** Step 2 *****/

      /**** Step 3 *****/
    }
  );
