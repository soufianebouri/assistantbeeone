'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRefarbreCtrl
 * @description
 * # RepositoryRefarbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRefarbreCtrl', function($scope, $translatePartialLoader, $translate, $window, $http,
    $compile,
    _url, $state,
    DTOptionsBuilder,
    DTColumnBuilder, translatedwords,
    $q,
    Arbre,
    $filter,
    DTDefaultOptions,
    $cookies,
    $mdDialog,
    toastr,
    domaine,
    parcellecultural,
    uuid
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    $scope.arbre = {};

    pc.IDFERME = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      IDferme: pc.IDFERME,
      page: {
        page: 0,
        pages: 0,
        start: 0,
        end: 10,
        length: 10,
        recordsTotal: 0,
        recordsDisplay: 0,
        serverSide: true
      },
      searchText: '',
      columnlastSort: [0, 'asc']
    };


    function GetDataToExport() {
      var jsonResult = $.ajax({
        url: Arbre.getURLALLTreesByFiltre(),
        data: pc.obj,
        method: 'POST',
        success: function(result) {},
        async: false
      });
      var exportBody = jsonResult.responseJSON;
      return exportBody.map(function(el) {
        return Object.keys(el).map(function(key) {
          if (key == 'Statut') {
            return (el[key]) ? 'Archivée' : 'En cours'
          } else if (key == 'Date_Plantation') {
            return moment(el[key]).format('DD/MM/YYYY')
          } else {
            return el[key]
          }
        });
      });
    }

    pc.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('ajax', function(data, callback, settings, cols) {
        // make an ajax request using data.start and data.length
        //if (settings.aoData.length > 0) {
        var api = this.api();
        var pgNo = api.page.info();

        var currPg = pgNo.page;
        var totalPg = pgNo.pages;
        // get the label where i need to print the page number details
        var myEl = angular.element(document.querySelector('#pgNoDetail'));
        pc.obj.page = pgNo;

        var columnlastSort = settings.aaSorting[0];
        pc.obj.columnlastSort = (columnlastSort != 0) ? columnlastSort : [0, 'asc'];

        //  }

        pc.obj.searchText = document.querySelector('.dataTables_filter input').value;
        NProgress.start();
        $http({
          method: 'POST',
          url: Arbre.getTreesForDatatable(),
          data: pc.obj
        }).then(function(res) {
          callback({
            recordsTotal: res.data.recordsTotal,
            recordsFiltered: res.data.recordsFiltered,
            data: res.data.data
          });
          NProgress.done();
        });

      })
      .withDataProp('data')
      .withOption('processing', false) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10)
      .withOption('lengthMenu', [10, 50, 100, 200])
      .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
      .withScroller()
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-object-group'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            $state.go("refarbregeneratetree");
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Generate trees"))
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL',
          customizeData: function(d) {
            var exportBody = GetDataToExport();
            d.body.length = 0;
            d.body.push.apply(d.body, exportBody);
            NProgress.done();
          }
        }, {
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go("refarbremap");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        }, {
          text: "<i class='fa fa-qrcode'></i>",
          action: function(e, dt, node, config) {
            $state.go("refarbreqrcode");
          },
          titleAttr: "QR CODE"
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Code_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Code Arbre"))),
      DTColumnBuilder.newColumn('Date_Plantation').withTitle(translatedwords.getTranslatedWord($translate("Date de plantation"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Plantation)
          return moment(full.Date_Plantation).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('NumLotPepiniere').withTitle(translatedwords.getTranslatedWord($translate("Num de lot pépinière"))),
      DTColumnBuilder.newColumn('QR_CODE').withTitle(translatedwords.getTranslatedWord($translate("QR Code"))).renderWith(function(data, type, full, meta) {
        if (full.QR_CODE)
          return full.QR_CODE
        return "";
      }),
      DTColumnBuilder.newColumn('Coord_X').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))),
      DTColumnBuilder.newColumn('Coord_Y').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))),
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Statut').withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        if (full.Statut)
          return '<span class="badge-red_withe">Archivée</span>';
        return '<span class="badge-green_withe">En cours</span>';
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Créer par"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '5%').notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];

    function actionsHtml(data, type, full, meta) {
      $scope.arbre[data.ID] = data;

      return '<button class="btn btn-warning btn-xs" title="Modifier"  onclick="angular.element(this).scope().edit(angular.element(this).scope().arbre[' + data.ID + '])" >' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" onclick="angular.element(this).scope().delete(' + full.ID + ')"><i class="fa fa-trash-o"></i></button>';
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add
    pc.Add = function() {

      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.ParcelleCultural = parcellecultural.ShowByDomaineEncours(pc.IDFerme).then(result => {
        return result.data;
      });
      $scope.showAdvancedAdd("ev", $scope.fermes, $scope.ParcelleCultural);
    }

    $scope.showAdvancedAdd = function(ev, fermes, ParcelleCultural) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/arbre/AddArbre.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes,
            ParcelleCultural: ParcelleCultural
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    pc.generateCode = (qrcode) => {
      setTimeout(function() {
        $("#QrCodeImg").html("");
        new QRCode("QrCodeImg", {
          text: qrcode,
          width: 50,
          height: 50,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }, 1000);
    }

    function DialogControllerAdd($scope, $mdDialog, fermes, ParcelleCultural) {
      $scope.fermes = fermes;
      $scope.ParcellesCultural = ParcelleCultural;
      $scope.Latitude = 0;
      $scope.Longitude = 0;
      $scope.qrcode = uuid.v4();
      $scope.progress = false;
      $scope.$watch('qrcode', function(n) {
        pc.generateCode($scope.qrcode);
      });


      $scope.letmeclick = true;

      $scope.statutArchive = 0;

      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.culturale && $scope.code && $scope.qrcode && $scope.dateplantation) {

          pc.objAdd = {
            "ID_Ferme": pc.IDFerme,
            "Code_Arbre": $scope.code,
            "ID_ParcelleCulturale": $scope.culturale.ID,
            "QR_CODE": $scope.qrcode,
            "NumLotPepiniere": ($scope.NumLotPepiniere) ? $scope.NumLotPepiniere : "",
            "Coord_X": document.getElementById('t1').value,
            "Coord_Y": document.getElementById('t2').value,
            "DateCreated": moment().format('YYYYMMDD'),
            "Date_Plantation": moment($scope.dateplantation).format('YYYYMMDD'),
            "CreatedBy": pc.UserName,
            "statutArchive": $scope.statutArchive
          }


          Arbre.pushArbre(_url, pc.objAdd).then(async e => {
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
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(e.data, {
              closeButton: true
            });
          });

        } else {
          $scope.progress = false;
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

      var shapes = [];

      $scope.setPolygone = function() {
        initMap()
        if ($scope.culturale.TokenPolygone !== "" && pc.IsJsonString($scope.culturale.TokenPolygone)) {
          IO.OUT(JSON.parse($scope.culturale.TokenPolygone), map, "#f5a6a6", "#ffffff");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }
        document.getElementById('t1').value = 0;
        document.getElementById('t2').value = 0;

        if ($scope.culturale.Dat_Plant) {
          $scope.dateplantation = ($scope.culturale.Dat_Plant) ? new Date(moment($scope.culturale.Dat_Plant).format("YYYY-MM-DD")) : null;
        }
      }

      var IO = {
        //returns array with storable google.maps.Overlay-definitions
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
              //shapes.push(tmp);
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



      var map;

      function initMap() {
        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 17;
        }
        map = new google.maps.Map(document.getElementById("parcellemap"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'Nouveau Arbre',
          icon: {
            url: "http://maps.google.com/mapfiles/kml/pal2/icon12.png",
            scaledSize: new google.maps.Size(40, 40)
          },
          map: map,
          draggable: true
        });

        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          //IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        }

        google.maps.event.addListener(markers, 'drag', function() {
          var latLng = markers.getPosition();
          document.getElementById('t1').value = latLng.lat();
          document.getElementById('t2').value = latLng.lng();
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





      }

      setTimeout(function() {
        initMap();
      }, 1000);

    }

    //Edit
    $scope.edit = function(data) {
      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.ParcelleCultural = parcellecultural.ShowByDomaineEncours(pc.IDFerme).then(result => {
        return result.data;
      });

      $scope.showAdvancedEdit("ev", $scope.fermes, $scope.ParcelleCultural, data);

    }

    $scope.showAdvancedEdit = function(ev, fermes, ParcelleCultural, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/arbre/EditArbre.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes,
            ParcelleCultural: ParcelleCultural,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, fermes, ParcelleCultural, data) {
      $scope.fermes = fermes;
      $scope.ParcelleCultural = ParcelleCultural;
      $scope.data = data;

      $scope.letmeclick = true;
      $scope.progress = false;
      $scope.Date_Plantation = ($scope.data.Date_Plantation) ? new Date(moment($scope.data.Date_Plantation).format("YYYY-MM-DD")) : null;
      $scope.Latitude = ($scope.data.Coord_X) ? parseFloat($scope.data.Coord_X) : 0;
      $scope.Longitude = ($scope.data.Coord_Y) ? parseFloat($scope.data.Coord_Y) : 0;
      $scope.onUpdate = () => {
        if (!$scope.culturale) {
          $scope.culturale = $scope.data.ID_ParcelleCulturale;
        }
      }

      $scope.statutArchive = ($scope.data.Statut) ? 1 : 0;

      $scope.$watch('data.QR_CODE', function(n) {
        pc.generateCode($scope.data.QR_CODE);
      });

      /*  setTimeout(function() {
          new QRCode("QrCodeImg", {
            text: $scope.data.QR_CODE,
            width: 50,
            height: 50,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }, 1000);*/


      $scope.Modifier = async function() {
        toastr.clear();

        $scope.progress = true;
        $scope.onUpdate();
        if ($scope.data.Code_Arbre && $scope.data.QR_CODE && $scope.culturale && $scope.Date_Plantation) {

          pc.objEdit = {
            "IDArbre": $scope.data.ID,
            "QR_CODE": $scope.data.QR_CODE,
            "Code_Arbre": $scope.data.Code_Arbre,
            "ID_ParcelleCulturale": $scope.culturale.ID,
            "NumLotPepiniere": ($scope.data.NumLotPepiniere) ? $scope.data.NumLotPepiniere : "",
            "Coord_X": document.getElementById('t1').value,
            "Coord_Y": document.getElementById('t2').value,
            "Date_Plantation": moment($scope.Date_Plantation).format('YYYYMMDD'),
            "statutArchive": $scope.statutArchive
          }


          Arbre.updateArbre(_url, pc.objEdit).then(async e => {
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
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(e.data, {
              closeButton: true
            });
          });

        } else {
          $scope.progress = false;
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




      var shapes = [];
      var _i = true;
      $scope.setPolygoneEdit = function() {
        if (_i) {
          setTimeout(function() {
            initMap()
            if ($scope.culturale.TokenPolygone !== "" && pc.IsJsonString($scope.culturale.TokenPolygone)) {
              IO.OUT(JSON.parse($scope.culturale.TokenPolygone), map, "#f5a6a6", "#ffffff");
            } else {
              IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
            }
          }, 2000);
        } else {
          initMap()
          if ($scope.culturale.TokenPolygone !== "" && pc.IsJsonString($scope.culturale.TokenPolygone)) {
            IO.OUT(JSON.parse($scope.culturale.TokenPolygone), map, "#f5a6a6", "#ffffff");
          } else {
            IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
          }
        }
        _i = false;
      }

      var IO = {
        //returns array with storable google.maps.Overlay-definitions
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
              //shapes.push(tmp);
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

      var map;

      function initMap() {
        if (!$scope.fermes[0].Latitude || !$scope.fermes[0].Longitude || $scope.fermes[0].Latitude == 0 || $scope.fermes[0].Longitude == 0 || $scope.fermes[0].Latitude == "" || $scope.fermes[0].Longitude == "") {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        } else {
          var latF = $scope.fermes[0].Latitude;
          var longF = $scope.fermes[0].Longitude;
          var zoooom = 17;
        }

        map = new google.maps.Map(document.getElementById("parcellemap"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        if ($scope.data.Coord_X && $scope.data.Coord_Y && $scope.data.Coord_X != 0 && $scope.data.Coord_Y != 0 && $scope.data.Coord_X != "" && $scope.data.Coord_Y != "") {
          var latF = $scope.data.Coord_X;
          var longF = $scope.data.Coord_Y;
          var zoooom = 17;
        }

        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'Nouveau Arbre',
          icon: {
            url: "http://maps.google.com/mapfiles/kml/pal2/icon12.png",
            scaledSize: new google.maps.Size(40, 40)
          },
          map: map,
          draggable: true
        });

        map.setCenter(new google.maps.LatLng(latF, longF));
        map.setZoom(zoooom);

        if ($scope.fermes[0].Polygone_Ferme !== "" && pc.IsJsonString($scope.fermes[0].Polygone_Ferme)) {
          IO.OUT(JSON.parse($scope.fermes[0].Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }

        google.maps.event.addListener(markers, 'drag', function() {
          var latLng = markers.getPosition();
          document.getElementById('t1').value = latLng.lat();
          document.getElementById('t2').value = latLng.lng();
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





      }

      setTimeout(function() {
        initMap();
      }, 1000);

    }

    //delete
    $scope.delete = async function(c) {
      pc.IDArbre = c;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            Arbre.deleteArbre(_url, {
              "ID": pc.IDArbre
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
  });