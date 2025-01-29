'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SocietefermesGestiondesfermesCtrl
 * @description
 * # SocietefermesGestiondesfermesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SocietefermesGestiondesfermesCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    domaine,
    $cookies,
    $mdDialog,
    BusinessUnit,
    activitesfermes,
    toastr,
    gestiondessocietes,
    gestionPays
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.parcel = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        domaine.getListDomaine().then(result => {
          console.log(result.data);
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withScroller()

      .withOption('responsive', true)

      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date_Creatio_Ferme').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Creatio_Ferme) {
          return moment(full.Date_Creatio_Ferme).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Code"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Nom"))),
      DTColumnBuilder.newColumn('Societe').withTitle(translatedwords.getTranslatedWord($translate("Société"))),
      DTColumnBuilder.newColumn('Superficie').withTitle(translatedwords.getTranslatedWord($translate("Superficie"))).renderWith(function(data, type, full, meta) {
        if (full.Superficie) {
          return '<p align="right">' + full.Superficie.toFixed(2) + '</p>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Adresse').withTitle(translatedwords.getTranslatedWord($translate("Adresse"))),
      DTColumnBuilder.newColumn('Gerant').withTitle(translatedwords.getTranslatedWord($translate("Gérant"))),
      DTColumnBuilder.newColumn('Fax').withTitle(translatedwords.getTranslatedWord($translate("Fax"))),
      DTColumnBuilder.newColumn('Tel').withTitle(translatedwords.getTranslatedWord($translate("Tél"))),
      DTColumnBuilder.newColumn('Business_unit').withTitle(translatedwords.getTranslatedWord($translate("Producteur"))),
      DTColumnBuilder.newColumn('Pays').withTitle(translatedwords.getTranslatedWord($translate("Pays"))),
      DTColumnBuilder.newColumn('Region').withTitle(translatedwords.getTranslatedWord($translate("Région"))),
      DTColumnBuilder.newColumn('Zone').withTitle(translatedwords.getTranslatedWord($translate("Zone"))),
      DTColumnBuilder.newColumn('Latitude').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))).renderWith(function(data, type, full, meta) {
        if (full.Latitude && full.Latitude != 0) {
          return full.Latitude;
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Longitude').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))).renderWith(function(data, type, full, meta) {
        if (full.Longitude && full.Longitude != 0) {
          return full.Longitude;
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('SuperficieTracer').withTitle(translatedwords.getTranslatedWord($translate("Superficie traçer"))).renderWith(function(data, type, full, meta) {
        if (full.SuperficieTracer) {
          return '<p align="right">' + full.SuperficieTracer.toFixed(2) + '</p>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('CouleurCalque').withTitle(translatedwords.getTranslatedWord($translate("Couleur Calque"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCalque) {
          return '<h1 style="background: ' + full.CouleurCalque + ';width: 100%;height: 20px;border-style:solid;border-color: ' + full.CouleurCalque + ';border-width: 12px;">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('CouleurCadre').withTitle(translatedwords.getTranslatedWord($translate("Couleur Cadre"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCadre) {
          return '<h1 style="background: ' + full.CouleurCadre + ';width: 100%;height: 20px;border-style:solid;border-color: ' + full.CouleurCadre + ';border-width: 12px;">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').notSortable().renderWith(actionsHtml).withClass('nowraptd all')
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function createdRow(row, data, dataIndex) {
      //Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      return "<button class='btn btn-warning btn-xs' title='Modifier' ng-click='pc.edit(" + JSON.stringify(data) + ")'><i class='fa fa-edit'></i></button>" +
        "&nbsp;<button class='btn btn-danger btn-xs'	title='Supprimer'  ng-click='pc.delete(" + data.IDFermes + ")'><i class='fa fa-trash'></i></button>";
    }

    //Add
    pc.Add = function() {

      $scope.BusinessUnitData = BusinessUnit.getAllBusinessUnit().then(result => {
        return result.data;
      });
      $scope.allactivitesfermes = activitesfermes.getAll().then(result => {
        return result.data;
      });

      $scope.allsocietess = gestiondessocietes.getSociete().then(result => {
        return result.data;
      });

      $scope.allPays = gestionPays.getPays(_url).then(result => {
        return result.data;
      });
      $scope.allRegion = gestionPays.getregion().then(result => {
        return result.data;
      });
      $scope.allZone = gestionPays.getzone().then(result => {
        return result.data;
      });

      $scope.showAdvancedAdd("ev", $scope.BusinessUnitData, $scope.allactivitesfermes, $scope.allsocietess, $scope.allPays, $scope.allRegion, $scope.allZone);
    }

    $scope.showAdvancedAdd = function(ev, BusinessUnitData, allactivitesfermes, allsocietess, allPays, allRegion, allZone) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/societeferme/AddFerme.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            BusinessUnitData: BusinessUnitData,
            allactivitesfermes: allactivitesfermes,
            allsocietess: allsocietess,
            allPays: allPays,
            allRegion: allRegion,
            allZone: allZone
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };


    function DialogControllerAdd($scope, $mdDialog, BusinessUnitData, allactivitesfermes, allsocietess, allPays, allRegion, allZone) {
      $scope.BusinessUnitData = BusinessUnitData;
      $scope.allactivitesfermes = allactivitesfermes;
      $scope.allsocietess = allsocietess;
      $scope.allPays = allPays;
      $scope.allRegion = allRegion;
      $scope.allZone = allZone;
      $scope.Latitude = 0;
      $scope.Longitude = 0;
      $scope.Calque = "#FFFFFF";
      $scope.Cadre = "#FFFFFF";
      $scope.suptracertracer = 0;
      $scope.isTraced = false;
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
      }
      $scope.setsearchID_Region = function() {
        $scope.searchID_Region = $scope.Region;
      }

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.Nom && $scope.Code && $scope.Superficie && $scope.societe) {
          if ($scope.isTraced) {
            pc.objAdd = {
              "datedecreation": moment().format('YYYYMMDD'),
              "Nom": $scope.Nom,
              "Code": $scope.Code,
              "Gerant": ($scope.Gerant) ? $scope.Gerant : "",
              "Ville": ($scope.Ville) ? $scope.Ville : "",
              "Superficie": $scope.Superficie,
              "Fax": ($scope.Fax) ? $scope.Fax : "",
              "Tel": ($scope.Tel) ? $scope.Tel : "",
              "statutfoncier": ($scope.statutfoncier) ? $scope.statutfoncier : "0",
              "Adresse": ($scope.Adresse) ? $scope.Adresse : "",
              "busnessunit": $scope.busnessunit,
              "activite": $scope.activite,
              "societe": $scope.societe,
              "Altitude": $scope.Altitude,
              "suptracertracer": document.getElementById('areaHa').value,
              "Calque": document.getElementById('Calque').value,
              "Cadre": document.getElementById('Cadre').value,
              "Latitude": document.getElementById('t1').value,
              "Longitude": document.getElementById('t2').value,
              "tokenpolygone": document.getElementById('data').value,
              "Pays": $scope.Pays,
              "Region": $scope.Region,
              "Zone": $scope.Zone
            }
          } else {
            pc.objAdd = {
              "datedecreation": moment().format('YYYYMMDD'),
              "Nom": $scope.Nom,
              "Code": $scope.Code,
              "Gerant": ($scope.Gerant) ? $scope.Gerant : "",
              "Ville": ($scope.Ville) ? $scope.Ville : "",
              "Superficie": $scope.Superficie,
              "Fax": ($scope.Fax) ? $scope.Fax : "",
              "Tel": ($scope.Tel) ? $scope.Tel : "",
              "statutfoncier": ($scope.statutfoncier) ? $scope.statutfoncier : "0",
              "Adresse": ($scope.Adresse) ? $scope.Adresse : "",
              "busnessunit": $scope.busnessunit,
              "activite": $scope.activite,
              "societe": $scope.societe,
              "Altitude": $scope.Altitude,
              "suptracertracer": 0,
              "Calque": document.getElementById('Calque').value,
              "Cadre": document.getElementById('Cadre').value,
              "Latitude": 0,
              "Longitude": 0,
              "tokenpolygone": "",
              "Pays": $scope.Pays,
              "Region": $scope.Region,
              "Zone": $scope.Zone
            }
          }


          if ($scope.save_rawClick) {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
              closeButton: true
            });
          } else {
            domaine.AddFerme(pc.objAdd).then(async e => {
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
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Cette ferme existe déjà !!")), {
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
            }).catch(async e => {
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
        map = new google.maps.Map(document.getElementById("parcellemap"), {
            center: new google.maps.LatLng(33.9691409, -6.9273709),
            zoom: 4,
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
            document.getElementById("areaHa").value = 0;
            byId('save_raw').disabled = true;

            document.getElementById('t1').value = '0';
            document.getElementById('t2').value = '0';


            clearvar = false;

          };

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
          document.getElementById("areaHa").value = (area / 10000).toFixed(2);
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

    //Edit
    pc.edit = function(data) {

      $scope.BusinessUnitData = BusinessUnit.getAllBusinessUnit().then(result => {
        return result.data;
      });
      $scope.allactivitesfermes = activitesfermes.getAll().then(result => {
        return result.data;
      });
      $scope.allPays = gestionPays.getPays(_url).then(result => {
        return result.data;
      });
      $scope.allRegion = gestionPays.getregion().then(result => {
        return result.data;
      });
      $scope.allZone = gestionPays.getzone().then(result => {
        return result.data;
      });

      $scope.showAdvanced("ev", data, $scope.BusinessUnitData, $scope.allactivitesfermes, $scope.allPays, $scope.allRegion, $scope.allZone);

    }

    $scope.showAdvanced = function(ev, data, BusinessUnitData, allactivitesfermes, allPays, allRegion, allZone) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/societeferme/EditFerme.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: data,
            BusinessUnitData: BusinessUnitData,
            allactivitesfermes: allactivitesfermes,
            allPays: allPays,
            allRegion: allRegion,
            allZone: allZone
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog, data, BusinessUnitData, allactivitesfermes, allPays, allRegion, allZone) {
      $scope.data = data;
      $scope.BusinessUnitData = BusinessUnitData;
      $scope.allactivitesfermes = allactivitesfermes;
      $scope.allPays = allPays;
      $scope.allRegion = allRegion;
      $scope.allZone = allZone;
      $scope.searchID_Pays = $scope.data.ID_Pays;
      $scope.searchID_Region = $scope.data.ID_Region;
      $scope.IsearchID_Pays = false;
      $scope.IsearchID_Region = false;

      $scope.suptracertracer = ($scope.data.SuperficieTracer) ? $scope.data.SuperficieTracer : 0;
      $scope.Latitude = ($scope.data.Latitude) ? parseFloat($scope.data.Latitude) : 0;
      $scope.Longitude = ($scope.data.Longitude) ? parseFloat($scope.data.Longitude) : 0;
      $scope.Altitude = ($scope.data.Altitude) ? parseFloat($scope.data.Altitude) : null;
      $scope.Calque = ($scope.data.CouleurCalque) ? $scope.data.CouleurCalque : "#FFFFFF";
      $scope.Cadre = ($scope.data.CouleurCadre) ? $scope.data.CouleurCadre : "#FFFFFF";

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
      $scope.onUpdate = () => {
        if (!$scope.statutfoncier) {
          $scope.statutfoncier = $scope.data.statut_foncier;
        }
        if (!$scope.busnessunit) {
          $scope.busnessunit = $scope.data.IDBusiness_unit;
        }
        if (!$scope.activite) {
          $scope.activite = $scope.data.IDActivites_Fermes;
        }
        if (!$scope.Pays) {
          $scope.Pays = $scope.data.ID_Pays;
        }
        if (!$scope.Region && !$scope.IsearchID_Pays) {
          $scope.Region = $scope.data.ID_Region;
        }
        if (!$scope.Zone && !$scope.IsearchID_Region) {
          $scope.Zone = $scope.data.ID_Zone;
        }
      }


      $scope.Modifier = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.Code && $scope.data.Nom && $scope.data.Superficie) {
          pc.objEdit = {
            "isTraced": $scope.isTracedEdit,
            "IDFERME": $scope.data.IDFermes,
            "Code": $scope.data.Code,
            "Gerant": ($scope.data.Gerant) ? $scope.data.Gerant : "",
            "Nom": $scope.data.Nom,
            "Ville": ($scope.data.Ville) ? $scope.data.Ville : "",
            "Superficie": $scope.data.Superficie,
            "Fax": ($scope.data.Fax) ? $scope.data.Fax : "",
            "Tel": ($scope.data.Tel) ? $scope.data.Tel : "",
            "statutfoncier": ($scope.statutfoncier) ? $scope.statutfoncier : "0",
            "Adresse": ($scope.data.Adresse) ? $scope.data.Adresse : "",
            "busnessunit": $scope.busnessunit,
            "activite": $scope.activite,
            "Altitude": $scope.Altitude,
            "suptracertracer": document.getElementById('areaHa').value,
            "Latitude": document.getElementById('t1').value,
            "Longitude": document.getElementById('t2').value,
            "Calque": document.getElementById('Calque').value,
            "Cadre": document.getElementById('Cadre').value,
            "tokenpolygone": document.getElementById('data').value,
            "Pays": $scope.Pays,
            "Region": $scope.Region,
            "Zone": $scope.Zone
          }

          if ($scope.save_rawClick) {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Veullez enregistrer les points de polygone!")), {
              closeButton: true
            });
          } else {

            domaine.EditFerme(pc.objEdit).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Cette ferme existe déjà !!")), {
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
            }).catch(async e => {
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
        if (!$scope.Latitude || !$scope.Longitude || $scope.Latitude == 0 || $scope.Longitude == 0 || $scope.Latitude == "" || $scope.Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.Latitude;
          var longF = $scope.Longitude;
          var zoooom = 14;
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


        if ($scope.data.Polygone_Ferme !== "" && pc.IsJsonString($scope.data.Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.data.Polygone_Ferme), map, $scope.Calque, $scope.Cadre);
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

        google.maps.event.addDomListener(byId('save_raw'), 'click', function() {
          $scope.isTracedEdit = true;
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

      pc.IsJsonString = function(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

    }

    //Delete
    pc.delete = async function(data) {
      $scope.IDFerme = data;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            domaine.DeleteFerme({
              "IDFerme": $scope.IDFerme
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

  });