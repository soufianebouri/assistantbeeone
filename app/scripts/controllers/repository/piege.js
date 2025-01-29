'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryPiegeCtrl
 * @description
 * # RepositoryPiegeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryPiegeCtrl', function($scope,
    $compile,
    $uibModal,
    _url, translatedwords,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    Piege,
    $filter,
    DTDefaultOptions, $translatePartialLoader, $translate, $window,
    $cookies,
    $mdDialog,
    toastr,
    Cible,
    domaine,
    ParcellePhysique
  ) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.piege = {};
    pc.dtInstance = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#Parcellephysique").selectpicker('refresh');
    }, 1000);

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    $q.all([ParcellePhysique.getParcellePhysique(_url, {
      IDFermes: $cookies.getObject('globals').ferme.IDFerme
    })]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Parcellephysique").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "PARCELLEPHYSIQUE": [0]
    };


    $scope.updatePiege = function(data) {
      return Piege.getPiege(data);
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //by parcelle cultural
    pc.parcellephysique_change = function() {

      var parcelle = $scope.parcelle.parcelle;
      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLEPHYSIQUE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updatePiege(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Rechercher"))
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
      DTColumnBuilder.newColumn('Code_Piege').withTitle(translatedwords.getTranslatedWord($translate("Code piège"))),
      DTColumnBuilder.newColumn('Ligne').withTitle(translatedwords.getTranslatedWord($translate("Ligne"))),
      DTColumnBuilder.newColumn('Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))),
      DTColumnBuilder.newColumn('Lat_Piege').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))),
      DTColumnBuilder.newColumn('Long_Piege').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))),
      DTColumnBuilder.newColumn('cible').withTitle(translatedwords.getTranslatedWord($translate("Cible"))),
      DTColumnBuilder.newColumn('isArchive').withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        if (full.isArchive) {
          return '<span class="badge-red_withe">Archivé</span>';
        } else {
          return '<span class="badge-green_withe">En cours</span>';
        }
      }),
      DTColumnBuilder.newColumn('Date_Installation').withTitle(translatedwords.getTranslatedWord($translate("Date d'installation"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Installation) {
          return moment(full.Date_Installation).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('qr_code').withTitle("QR CODE"),
      DTColumnBuilder.newColumn('numero_iteration').withTitle("Numéro iteration"),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date de création"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated) {
          return moment(full.DateCreated).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all')
    ];

    //add
    pc.Add = function() {
      document.getElementById("filter_form").style.display = "none";
      $scope.cibles = Cible.getCible(_url).then(function(res) {
        return res.data;
      });

      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.ParcellePhysiques = ParcellePhysique.getParcellePhysique(_url, {
        IDFermes: pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.showAdvancedAdd("ev", $scope.fermes, $scope.cibles, $scope.ParcellePhysiques);

    }

    $scope.showAdvancedAdd = function(ev, fermes, cibles, ParcellePhysiques) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/piege/AddPiege.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes,
            cibles: cibles,
            ParcellePhysiques: ParcellePhysiques
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog, fermes, cibles, ParcellePhysiques) {
      $scope.fermes = fermes;
      $scope.cibles = cibles;
      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.Latitude = 0;
      $scope.Longitude = 0;
      $scope.Caracteristique = "Mâle";

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.code && $scope.physique && $scope.cible && $scope.dateinstalation && $scope.Ligne && $scope.Arbre && $scope.qr_code) {

          pc.objAdd = {
            "IDFermes": pc.IDFerme,
            "code": $scope.code,
            "physique": $scope.physique.ID,
            "cible": $scope.cible,
            "dateinstalation": moment($scope.dateinstalation).format('YYYYMMDD'),
            "Ligne": $scope.Ligne,
            "Arbre": $scope.Arbre,
            "qr_code": $scope.qr_code,
            "numero_iteration": $scope.numero_iteration,
            "Caracteristique": ($scope.Caracteristique == 'Mâle') ? 0 : 1,
            "Latitude": document.getElementById('t1').value,
            "Longitude": document.getElementById('t2').value,
            "DateCreated": moment().format('YYYYMMDD'),
            "CreatedBy": pc.UserName

          }


          Piege.pushPiege(_url, pc.objAdd).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(e => {
            try {
              toastr.error(e.data[0].description, {
                closeButton: true
              });
            } catch (e) {
              toastr.error(e.data, {
                closeButton: true
              });
            }
          });

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




      var shapes = [];

      $scope.setPolygone = function() {
        initMap()
        if ($scope.physique.TokenPolygone !== "" && pc.IsJsonString($scope.physique.TokenPolygone)) {
          IO.OUT(JSON.parse($scope.physique.TokenPolygone), map, "#f5a6a6", "#ffffff");
        } else {
          IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
        }
        document.getElementById('t1').value = 0;
        document.getElementById('t2').value = 0;
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
          var zoooom = 16;
        }
        map = new google.maps.Map(document.getElementById("parcellemap"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'Nouveau Piege',
          icon: "http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
          map: map,
          draggable: true
        });

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

    //Edit
    pc.edit = function(data) {
      document.getElementById("filter_form").style.display = "none";
      $scope.cibles = Cible.getCible(_url).then(function(res) {
        return res.data;
      });

      $scope.fermes = domaine.DomaineByID({
        "IDFermes": pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.ParcellePhysiques = ParcellePhysique.getParcellePhysique(_url, {
        IDFermes: pc.IDFerme
      }).then(result => {
        return result.data;
      });

      $scope.showAdvancedEdit("ev", $scope.fermes, $scope.cibles, $scope.ParcellePhysiques, data);

    }

    $scope.showAdvancedEdit = function(ev, fermes, cibles, ParcellePhysiques, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/piege/EditPiege.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            fermes: fermes,
            cibles: cibles,
            ParcellePhysiques: ParcellePhysiques,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, fermes, cibles, ParcellePhysiques, data) {
      $scope.fermes = fermes;
      $scope.cibles = cibles;
      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.data = data;
      $scope.dateinstalation = ($scope.data.Date_Installation) ? new Date(moment($scope.data.Date_Installation).format("YYYY-MM-DD")) : null;
      $scope.Latitude = ($scope.data.Lat_Piege) ? parseFloat($scope.data.Lat_Piege) : 0;
      $scope.Longitude = ($scope.data.Long_Piege) ? parseFloat($scope.data.Long_Piege) : 0;
      $scope.Ligne = ($scope.data.Ligne) ? parseInt($scope.data.Ligne) : 0;
      $scope.Arbre = ($scope.data.Arbre) ? parseInt($scope.data.Arbre) : 0;
      $scope.Caracteristique = ($scope.data.Caracteristique == 0) ? "Mâle" : "Female";
      $scope.Statut = ($scope.data.isArchive) ? 1 : 0;
      $scope.onUpdate = () => {
        if (!$scope.physique) {
          $scope.physique = $scope.data.ID_Parcelle;
        }
        if (!$scope.cible) {
          $scope.cible = $scope.data.ID_cible;
        }
      }
      $scope.Modifier = async function() {
        toastr.clear();
        if ($scope.data.Code_Piege && $scope.physique && $scope.cible && $scope.dateinstalation && $scope.Ligne && $scope.Arbre && $scope.data.qr_code) {

          pc.objEdit = {
            "IDFermes": pc.IDFerme,
            "IDPiege": $scope.data.ID,
            "code": $scope.data.Code_Piege,
            "physique": $scope.physique.ID,
            "cible": $scope.cible,
            "qr_code": $scope.data.qr_code,
            "numero_iteration": $scope.data.numero_iteration,
            "dateinstalation": moment($scope.dateinstalation).format('YYYYMMDD'),
            "Ligne": $scope.Ligne,
            "Arbre": $scope.Arbre,
            "Caracteristique": ($scope.Caracteristique == 'Mâle') ? 0 : 1,
            "Latitude": document.getElementById('t1').value,
            "Longitude": document.getElementById('t2').value,
            "isArchive": $scope.Statut
          }

          Piege.updatePiege(_url, pc.objEdit).then(async e => {
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
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(e => {
            toastr.clear();
            try {
              toastr.error(e.data[0].description, {
                closeButton: true
              });
            } catch (e) {
              toastr.error(e.data, {
                closeButton: true
              });
            }

          });

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




      var shapes = [];
      var _i = true;
      $scope.setPolygoneEdit = function() {
        if (_i) {
          setTimeout(function() {
            initMap()
            if ($scope.physique.TokenPolygone !== "" && pc.IsJsonString($scope.physique.TokenPolygone)) {
              IO.OUT(JSON.parse($scope.physique.TokenPolygone), map, "#f5a6a6", "#ffffff");
            } else {
              IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
            }
          }, 2000);
        } else {
          initMap()
          if ($scope.physique.TokenPolygone !== "" && pc.IsJsonString($scope.physique.TokenPolygone)) {
            IO.OUT(JSON.parse($scope.physique.TokenPolygone), map, "#f5a6a6", "#ffffff");
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
          var zoooom = 16;
        }

        map = new google.maps.Map(document.getElementById("parcellemap"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        if ($scope.data.Lat_Piege && $scope.data.Long_Piege && $scope.data.Lat_Piege != 0 && $scope.data.Long_Piege != 0 && $scope.data.Lat_Piege != "" && $scope.data.Long_Piege != "") {
          var latF = $scope.data.Lat_Piege;
          var longF = $scope.data.Long_Piege;
          var zoooom = 16;
        }

        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'Nouveau Piege',
          icon: "http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
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
    pc.delete = async function(c) {
      pc.IDPiege = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            Piege.deletePiege(_url, {
              ID: pc.IDPiege
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
      pc.piege[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.piege[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" 	title="Supprimer" ng-click="pc.delete(pc.piege[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

  });