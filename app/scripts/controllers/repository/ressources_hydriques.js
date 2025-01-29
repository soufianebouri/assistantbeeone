'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRessourcesHydriquesCtrl
 * @description
 * # RepositoryRessourcesHydriquesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRessourcesHydriquesCtrl', function($scope,
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
    ParcellePhysique, ressourcesHydriques,
    parametretechnique
  ) {

    var pc = this;

    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.ressources_hydriques = {};
    pc.dtInstance = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#Ferme").selectpicker('refresh');
    }, 1000);

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.obj = {
      "Ferme": [0],
      "Reference": ""
    };

    pc.multi_diametre = false;
    $q.all([domaine.getDomaine(), parametretechnique.get_parametragetechnique_general()]).then((values) => {
      pc.fermes = values[0].data;
      pc.parametragetechnique_general = values[1].data;
      try {
        pc.multi_diametre = pc.parametragetechnique_general[0].ressources_hydriques_multi_diametre;
      } catch (e) {
        pc.multi_diametre = false;
      }


      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#Ferme").selectpicker('refresh');
      }, 1000);
    });

    $scope.updateressources_hydriques = function(data) {
      return ressourcesHydriques.showbyfiltre(data);
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }


    //by ferme
    pc.ferme_change = function() {

      var ferme = $scope.ferme.ferme;
      if (validateInput(ferme) || $scope.ferme.ferme.length === 0 || $scope.ferme.ferme.includes(0))
        ferme = [0];

      pc.obj.Ferme = ferme;
    };

    $scope.search = () => {
      pc.dtInstance.reloadData();
    }


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'ressources_hydriques'
    });

    $scope.canIAction = () => {
      if (pc.isAdmin)
        return {
          add: true,
          update: true,
          delete: true
        }
      return {
        add: opsemisAccess[0].a,
        update: opsemisAccess[0].u,
        delete: opsemisAccess[0].d
      }
    }

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          pc.Add()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateressources_hydriques(pc.obj).then(function(res) {
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
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('FarmName').withTitle(translatedwords.getTranslatedWord($translate("Ferme"))),
      DTColumnBuilder.newColumn('ReferenceRessourceHydrique').withTitle(translatedwords.getTranslatedWord($translate("Référence de la ressource"))),

      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type de la ressource hydrique"))).renderWith(function(data, type, full, meta) {
        if (full.Type == 1)
          return "Eaux souterraines";
        return "Eaux de surface";
      }),
      DTColumnBuilder.newColumn('DateMiseEnService').withTitle(translatedwords.getTranslatedWord($translate("Date de mise en service"))).renderWith(function(data, type, full, meta) {
        if (full.DateMiseEnService) {
          return moment(full.DateMiseEnService).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),

      DTColumnBuilder.newColumn('DateApprofondissement').withTitle(translatedwords.getTranslatedWord($translate("Date d'approfondissement"))).renderWith(function(data, type, full, meta) {
        if (full.DateApprofondissement) {
          return moment(full.DateApprofondissement).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Profondeur').withTitle(translatedwords.getTranslatedWord($translate("Profondeur (m)"))),

      DTColumnBuilder.newColumn('DateEssai').withTitle(translatedwords.getTranslatedWord($translate("Date de l'essai"))).renderWith(function(data, type, full, meta) {
        if (full.DateEssai) {
          return moment(full.DateEssai).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('DebitExploitation').withTitle(translatedwords.getTranslatedWord($translate("Débit d'exploitation (m3/h)"))),
      DTColumnBuilder.newColumn('NiveauStatique').withTitle(translatedwords.getTranslatedWord($translate("Niveau statique (m)"))),
      DTColumnBuilder.newColumn('NiveauDynamique').withTitle(translatedwords.getTranslatedWord($translate("Niveau dynamique (m)"))),
      DTColumnBuilder.newColumn('EC').withTitle(translatedwords.getTranslatedWord($translate("EC (mS/cm)"))),


      DTColumnBuilder.newColumn('ReferenceAutorisation').withTitle(translatedwords.getTranslatedWord($translate("Référence de l'autorisation"))),
      DTColumnBuilder.newColumn('DateAutorisation').withTitle(translatedwords.getTranslatedWord($translate("Date de l'autorisation"))).renderWith(function(data, type, full, meta) {
        if (full.DateAutorisation) {
          return moment(full.DateAutorisation).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('DebitAnnuelAlloue').withTitle(translatedwords.getTranslatedWord($translate("Volume annuel alloué (m3)"))),
      DTColumnBuilder.newColumn('DebitJournalierAlloue').withTitle(translatedwords.getTranslatedWord($translate("Débit journalier alloué (m3/j)"))),
      DTColumnBuilder.newColumn('Latitude').withTitle(translatedwords.getTranslatedWord($translate("Latitude"))).renderWith(function(data, type, full, meta) {
        if (full.Latitude) {
          return full.Latitude;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Longitude').withTitle(translatedwords.getTranslatedWord($translate("Longitude"))).renderWith(function(data, type, full, meta) {
        if (full.Longitude) {
          return full.Longitude;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all').withOption('width', '10%').withClass('nowraptd all')
    ];


    //add
    pc.Add = function() {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/ressourceshydriques/AddRessourcesHydriques.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog) {
      $scope.Type = 1;
      $scope.Latitude = 0;
      $scope.Longitude = 0;

      $q.all([domaine.getDomaine()]).then((values) => {
        $scope.fermes = values[0].data;
        NProgress.done();
        $scope.letmeclick = true;
      });


      $scope.progress = false;
      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          $scope.Ifullscreen = true;
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          $scope.Ifullscreen = false;
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        }
      }
      $scope.checkRequiredbyType = function() {
        /*if ($scope.Type == 1) {
          if ($scope.Profondeur >= 0 && document.getElementById('DebitAnnuelAlloue').value >= 0 && document.getElementById('DebitAnnuelAlloue').value != "")
            return true
          return false
        } else {
          return true
        }*/
        return true;
      }

      $scope.checkDocumentByID = function(id) {
        var val = null;
        try {
          val = document.getElementById(id).value
        } catch (e) {
          //the same shit
          val = val;
        }
        return val;
      }

      $scope.checkniveau = function() {
        if ($scope.Type == 1) {
          if ($scope.checkDocumentByID('NiveauStatique') && $scope.checkDocumentByID('NiveauDynamique')) {
            if (parseFloat($scope.checkDocumentByID('NiveauStatique')) >= parseFloat($scope.checkDocumentByID('NiveauDynamique'))) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      }


      $scope.diametres = [{
        value: 0,
        profondeur: 0
      }]

      $scope.cloneItem = async function() {
        $scope.diametres.push({
          value: 0,
          profondeur: 0
        })
      }

      $scope.removeItem = function(itemIndex) {
        $scope.diametres.splice(itemIndex, 1);
        if ($scope.diametres.length == 0) {
          $scope.cloneItem();
        }
      }

      $scope.mono_or_multi = function(type) {
        if (type == 1 && pc.multi_diametre)
          return true
        return false
      }
      $scope.mono_or_multi_revers = function(type) {
        if (type == 1 && !pc.multi_diametre)
          return true
        return false
      }


      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Ferme && $scope.ReferenceRessourceHydrique && $scope.DateMiseEnService && $scope.checkRequiredbyType()) {
          if ($scope.checkniveau()) {
            pc.objAdd = {
              ReferenceRessourceHydrique: $scope.ReferenceRessourceHydrique,
              Type: $scope.Type,
              DateMiseEnService: moment($scope.DateMiseEnService).format('YYYYMMDD'),
              DateApprofondissement: ($scope.DateApprofondissement) ? moment($scope.DateApprofondissement).format('YYYYMMDD') : null,
              Profondeur: $scope.Profondeur,
              Diametre: $scope.Diametre,
              DateEssai: ($scope.checkDocumentByID('DateEssai')) ? moment($scope.checkDocumentByID('DateEssai')).format('YYYYMMDD') : null,
              DebitExploitation: $scope.checkDocumentByID('DebitExploitation'),
              NiveauStatique: $scope.checkDocumentByID('NiveauStatique'),
              NiveauDynamique: $scope.checkDocumentByID('NiveauDynamique'),
              EC: $scope.checkDocumentByID('EC'),
              ReferenceAutorisation: $scope.checkDocumentByID('ReferenceAutorisation'),
              DateAutorisation: ($scope.checkDocumentByID('DateAutorisation')) ? moment($scope.checkDocumentByID('DateAutorisation')).format('YYYYMMDD') : null,
              DebitAnnuelAlloue: $scope.checkDocumentByID('DebitAnnuelAlloue'),
              DebitJournalierAlloue: $scope.checkDocumentByID('DebitJournalierAlloue'),
              Latitude: document.getElementById('t1').value,
              Longitude: document.getElementById('t2').value,
              CreatedBy: pc.UserName,
              DateCreated: moment().format('YYYYMMDD'),
              ID_Ferme: $scope.Ferme,
              ID_Profil: pc.IDUser,
              diametres: $scope.diametres,
              multi_diametre: pc.multi_diametre
            }

            ressourcesHydriques.createweb(pc.objAdd).then(async e => {
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
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
                NProgress.done();
              }
            }).catch(e => {
              $scope.progress = false;
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Le niveau statique doit toujours être inférieur au dynamique")), {
              closeButton: true
            });
          }
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
        $scope.initMap()
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
      $scope.initMap = function() {
        document.getElementById('t1').value = 0;
        document.getElementById('t2').value = 0;
        if ($scope.Ferme) {
          if (!$scope.Ferme.Latitude || !$scope.Ferme.Longitude || $scope.Ferme.Latitude == 0 || $scope.Ferme.Longitude == 0 || $scope.Ferme.Latitude == "" || $scope.Ferme.Longitude == "") {
            var latF = 33.9691409;
            var longF = -6.9273709;
            var zoooom = 4;
          } else {
            var latF = $scope.Ferme.Latitude;
            var longF = $scope.Ferme.Longitude;
            var zoooom = 16;
          }
        } else {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        }

        map = new google.maps.Map(document.getElementById("Ressourceshydriques"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'New One',
          icon: "http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
          map: map,
          draggable: true
        });

        if ($scope.Ferme) {
          if ($scope.Ferme.Polygone_Ferme !== "" && pc.IsJsonString($scope.Ferme.Polygone_Ferme)) {
            IO.OUT(JSON.parse($scope.Ferme.Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
          } else {
            IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
          }
        }


        google.maps.event.addListener(markers, 'drag', function() {
          var latLng = markers.getPosition();
          document.getElementById('t1').value = latLng.lat();
          document.getElementById('t2').value = latLng.lng();
        });

        map.addListener("center_changed", () => {
          if (document.getElementById('t1').value != 0 && document.getElementById('t2').value != 0 && document.getElementById('t1').value != "0" && document.getElementById('t2').value != "0" && document.getElementById('t1').value && document.getElementById('t2').value) {
            window.setTimeout(() => {
              var position = new google.maps.LatLng(document.getElementById('t1').value, document.getElementById('t2').value);
              markers.setPosition(position);
            }, 100);
          } else {
            var position = new google.maps.LatLng(document.getElementById('t1').value, document.getElementById('t2').value);
            markers.setPosition(position);
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

      $scope.newLocation = function(newLat, newLng) {
        map.setCenter({
          lat: newLat,
          lng: newLng
        });
      }

      setTimeout(function() {
        $scope.initMap();
      }, 1000);

    }

    //Edit
    pc.Edit = function(data) {
      document.getElementById("filter_form").style.display = "none";
      $scope.showAdvancedEdit("ev", data);
    }

    $scope.showAdvancedEdit = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/ressourceshydriques/EditRessourcesHydriques.html',
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

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;

      $scope.DateMiseEnService = ($scope.data.DateMiseEnService) ? new Date(moment($scope.data.DateMiseEnService).format("YYYY-MM-DD")) : undefined;
      $scope.DateApprofondissement = ($scope.data.DateApprofondissement) ? new Date(moment($scope.data.DateApprofondissement).format("YYYY-MM-DD")) : undefined;
      $scope.DebitExploitation = ($scope.data.DebitExploitation) ? new Date(moment($scope.data.DebitExploitation).format("YYYY-MM-DD")) : undefined;
      $scope.DateAutorisation = ($scope.data.DateAutorisation) ? new Date(moment($scope.data.DateAutorisation).format("YYYY-MM-DD")) : undefined;
      $scope.DateEssai = ($scope.data.DateEssai) ? new Date(moment($scope.data.DateEssai).format("YYYY-MM-DD")) : undefined;
      $scope.Latitude = ($scope.data.Latitude) ? parseFloat($scope.data.Latitude) : 0;
      $scope.Longitude = ($scope.data.Longitude) ? parseFloat($scope.data.Longitude) : 0;

      $scope.diametres = [];
      $q.all([domaine.getDomaine(), ressourcesHydriques.getDiametres({
        ID: $scope.data.ID
      })]).then((values) => {
        $scope.fermes = values[0].data;
        $scope.diametres = values[1].data;
        if ($scope.diametres.length == 0) {
          $scope.diametres = [{
            value: 0,
            profondeur: 0
          }];
        }
        NProgress.done();
        $scope.letmeclick = true;
      });



      $scope.progress = false;
      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          $scope.Ifullscreen = false;
        }
      }
      $scope.checkRequiredbyType = function() {
        if ($scope.data.Type == 1) {
          if ($scope.data.Profondeur >= 0 && $scope.data.Diametre >= 0 && document.getElementById('DebitAnnuelAlloue').value >= 0 && document.getElementById('DebitAnnuelAlloue').value != "")
            return true
          return false
        } else {
          return true
        }
      }

      $scope.checkDocumentByID = function(id) {
        var val = null;
        try {
          val = document.getElementById(id).value
        } catch (e) {
          //the same shit
          val = val;
        }
        return val;
      }

      $scope.checkniveau = function() {
        if ($scope.data.Type == 1) {
          if ($scope.checkDocumentByID('NiveauStatique') && $scope.checkDocumentByID('NiveauDynamique')) {
            if (parseFloat($scope.checkDocumentByID('NiveauStatique')) >= parseFloat($scope.checkDocumentByID('NiveauDynamique'))) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      }

      $scope.cloneItem = async function() {
        $scope.diametres.push({
          value: 0,
          profondeur: 0
        })
      }

      $scope.removeItem = function(itemIndex) {
        $scope.diametres.splice(itemIndex, 1);
        if ($scope.diametres.length == 0) {
          $scope.cloneItem();
        }
      }

      $scope.mono_or_multi = function(type) {
        if (type == 1 && pc.multi_diametre)
          return true
        return false
      }
      $scope.mono_or_multi_revers = function(type) {
        if (type == 1 && !pc.multi_diametre)
          return true
        return false
      }

      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();

        if ($scope.Ferme && $scope.data.ReferenceRessourceHydrique && $scope.DateMiseEnService && $scope.checkRequiredbyType()) {
          if ($scope.checkniveau()) {
            pc.objEdit = {
              ID: $scope.data.ID,
              ReferenceRessourceHydrique: $scope.data.ReferenceRessourceHydrique,
              Type: $scope.data.Type,
              DateMiseEnService: moment($scope.DateMiseEnService).format('YYYYMMDD'),
              DateApprofondissement: ($scope.DateApprofondissement) ? moment($scope.DateApprofondissement).format('YYYYMMDD') : null,
              Profondeur: $scope.data.Profondeur,
              Diametre: $scope.data.Diametre,
              DateEssai: ($scope.checkDocumentByID('DateEssai')) ? moment($scope.checkDocumentByID('DateEssai')).format('YYYYMMDD') : null,
              DebitExploitation: $scope.checkDocumentByID('DebitExploitation'),
              NiveauStatique: $scope.checkDocumentByID('NiveauStatique'),
              NiveauDynamique: $scope.checkDocumentByID('NiveauDynamique'),
              EC: $scope.checkDocumentByID('EC'),
              ReferenceAutorisation: $scope.checkDocumentByID('ReferenceAutorisation'),
              DateAutorisation: ($scope.checkDocumentByID('DateAutorisation')) ? moment($scope.checkDocumentByID('DateAutorisation')).format('YYYYMMDD') : null,
              DebitAnnuelAlloue: $scope.checkDocumentByID('DebitAnnuelAlloue'),
              DebitJournalierAlloue: $scope.checkDocumentByID('DebitJournalierAlloue'),
              Latitude: document.getElementById('t1').value,
              Longitude: document.getElementById('t2').value,
              CreatedBy: pc.UserName,
              DateCreated: moment().format('YYYYMMDD'),
              ID_Ferme: $scope.Ferme,
              ID_Profil: pc.IDUser,
              diametres: $scope.diametres,
              multi_diametre: pc.multi_diametre
            }

            ressourcesHydriques.updateweb(pc.objEdit).then(async e => {
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
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
                NProgress.done();
              }
            }).catch(e => {
              $scope.progress = false;
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Le niveau statique doit toujours être inférieur au dynamique")), {
              closeButton: true
            });
          }
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
      $scope.initMap = function() {
        if ($scope.Ferme) {
          if (!$scope.Ferme.Latitude || !$scope.Ferme.Longitude || $scope.Ferme.Latitude == 0 || $scope.Ferme.Longitude == 0 || $scope.Ferme.Latitude == "" || $scope.Ferme.Longitude == "") {
            var latF = 33.9691409;
            var longF = -6.9273709;
            var zoooom = 4;
          } else {
            var latF = $scope.Ferme.Latitude;
            var longF = $scope.Ferme.Longitude;
            var zoooom = 16;
          }
        } else {
          var latF = 33.9691409;
          var longF = -6.9273709;
          var zoooom = 4;
        }

        map = new google.maps.Map(document.getElementById("Ressourceshydriques"), {
          center: new google.maps.LatLng(latF, longF),
          zoom: zoooom,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        if ($scope.data.ID_Ferme == $scope.Ferme.IDFermes && $scope.data.Latitude && $scope.data.Longitude && $scope.data.Latitude != 0 && $scope.data.Longitude != 0 && $scope.data.Latitude != "" && $scope.data.Longitude != "") {
          var latF = $scope.data.Latitude;
          var longF = $scope.data.Longitude;
          var zoooom = 16;
          map.setCenter(new google.maps.LatLng(latF, longF));
          map.setZoom(zoooom);
          document.getElementById('t1').value = $scope.data.Latitude;
          document.getElementById('t2').value = $scope.data.Longitude;
        } else {
          document.getElementById('t1').value = 0;
          document.getElementById('t2').value = 0;
        }



        var markers = new google.maps.Marker({
          position: new google.maps.LatLng(latF, longF),
          title: 'New One',
          icon: "http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png",
          map: map,
          draggable: true
        });

        if ($scope.Ferme) {
          if ($scope.Ferme.Polygone_Ferme !== "" && pc.IsJsonString($scope.Ferme.Polygone_Ferme)) {
            IO.OUT(JSON.parse($scope.Ferme.Polygone_Ferme), map, "#c4bf7d", "#8eb2a0");
          } else {
            IO.OUT(JSON.parse('[{"type": "POLYGON","id": null,"geometry": [[]]}]'), map, "#c4bf7d", "#8eb2a0");
          }
        }


        google.maps.event.addListener(markers, 'drag', function() {
          var latLng = markers.getPosition();
          document.getElementById('t1').value = latLng.lat();
          document.getElementById('t2').value = latLng.lng();
        });

        map.addListener("center_changed", () => {
          if (document.getElementById('t1').value != 0 && document.getElementById('t2').value != 0 && document.getElementById('t1').value != "0" && document.getElementById('t2').value != "0" && document.getElementById('t1').value && document.getElementById('t2').value) {
            window.setTimeout(() => {
              var position = new google.maps.LatLng(document.getElementById('t1').value, document.getElementById('t2').value);
              markers.setPosition(position);
            }, 100);
          } else {
            var position = new google.maps.LatLng(document.getElementById('t1').value, document.getElementById('t2').value);
            markers.setPosition(position);
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
      $scope.newLocation = function(newLat, newLng) {
        map.setCenter({
          lat: newLat,
          lng: newLng
        });
      }
      setTimeout(function() {
        $scope.initMap();
      }, 1000);

    }

    //delete
    pc.Delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ressourcesHydriques.deleteweb({
              ID: c.ID
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
      pc.ressources_hydriques[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.Edit(pc.ressources_hydriques[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.Delete(pc.ressources_hydriques[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.details(pc.ressources_hydriques[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
      return dtailsBtn + editbtn + deletebtn;
    }
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable = true;
    //détails
    pc.details = function(data) {
      pc.ressources_hydriquesByID = data;

      ressourcesHydriques.getDiametres({
        ID: data.ID
      }).then(function(res) {
        pc.diametresData = res.data;
        NProgress.done();
      });

      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }


    pc.printdetails = function(data) {
      //alert(data);
      pc.DateNow = moment().format('DD/MM/YYYY');
      pc.TimeNow = moment().format('HH:mm');
      var DateMiseEnService = "";

      if (data.DateMiseEnService) {
        DateMiseEnService = moment(data.DateMiseEnService).format('DD/MM/YYYY');
      }

      var typename = (data.Type == 1) ? 'Eaux souterraines' : 'Eaux de surface';
      var w = 1000;
      var h = 1000;
      var left = Number((screen.width / 2) - (w / 2));
      var tops = Number((screen.height / 2) - (h / 2));

      var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write('<html><head><title></title>');
      mywindow.document.write('</head><body >');
      //header
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="3" style="width:30%;">' + data.FarmName + '</th>' +
        '<th style="width:40%;">' + typename + '</th>' +
        '<th rowspan="3" style="width:30%;">' + data.ReferenceRessourceHydrique + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Date de mise en service ' + DateMiseEnService + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Liste de diffusion</th>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '</td></tr></table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Latitude</td>' +
        '<td>' + data.Latitude + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Longitude</td>' +
        '<td>' + data.Longitude + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');



      if (data.Type == 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_23").innerHTML);
        $('table').attr('border', '0');
      }


      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    }

  });