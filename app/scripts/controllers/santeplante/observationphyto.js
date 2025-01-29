'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteObservationphytoCtrl
 * @description
 * # SanteplanteObservationphytoCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteObservationphytoCtrl', function($scope, $translatePartialLoader, translatedwords, $mdDialog, $filter, GroupeOperationnel, $translate, DTOptionsBuilder, $window, DTColumnBuilder, $q, $compile, $state, toastr, DTDefaultOptions, $cookies, observationphyto, parcellecultural, $timeout, parametragestockage) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.parametragestockage = [];
    pc.Observationphytosanitaireaction = {};
    pc.PicturesHostStadePheno = "";
    pc.showtable = true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Observation_phyto'
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

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $('#Parcelle').selectpicker('refresh');
    }, 1000);

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostStadePheno = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Observation_phyto + '/';
    });

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    function toggleAll(selectAll, selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          selectedItems[id] = selectAll;
        }
      }
    }

    function toggleOne(selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          if (!selectedItems[id]) {
            pc.selectAll = false;
            return;
          }
        }
      }
      pc.selectAll = true;
    }


    //load Parcelle cultural list by domaine
    $scope.LoadParcelleCultural = parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme).then(function(res) {
      pc.parcellescultural = res.data;
    });

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([$scope.LoadDomaine, $scope.LoadParcelleCultural]).then(function(values) {


      setTimeout(function() {
        $('#Parcelle').selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };


    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');


    //by parcelle cultural
    $scope.parcelle_change = function() {
      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];

      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();


    };

    //by date_fin
    $scope.date_fin_change = function() {

      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();

    };

    //get data and refresh datatable
    $scope.updateDataObservatioPhyto = function(data) {
      return observationphyto.getByFiltre(data);
    };

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddOrdreTraitement()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataObservatioPhyto(pc.obj).then(function(res) {
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
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
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
          text: "Tous",
          action: function(e, dt, node, config) {
            $scope.searchByCriticite("");
          }
        },
        {
          text: translatedwords.getTranslatedWord($translate("Bas")),
          action: function(e, dt, node, config) {
            $scope.searchByCriticite("Bas");
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-green'
        },
        {
          text: translatedwords.getTranslatedWord($translate("Moyen")),
          action: function(e, dt, node, config) {
            $scope.searchByCriticite("Moyen");
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-orange'
        },
        {
          text: translatedwords.getTranslatedWord($translate("Haut")),
          action: function(e, dt, node, config) {
            $scope.searchByCriticite("Haut");
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-red'
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
      DTColumnBuilder.newColumn('DATE_Surveillance').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DATE_Surveillance)
          return moment(full.DATE_Surveillance).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('Parcelles').withTitle(translatedwords.getTranslatedWord($translate("Parcelles culturales"))),
      DTColumnBuilder.newColumn('Cible').withTitle(translatedwords.getTranslatedWord($translate("Cible"))),
      DTColumnBuilder.newColumn('Niveau_Attaque').withTitle(translatedwords.getTranslatedWord($translate("Répartition (%)"))).renderWith(function(data, type, full, meta) {
        var float_Niveau_Attaque = parseFloat(full.Niveau_Attaque).toFixed(2);
        if (isNaN(float_Niveau_Attaque)) {
          float_Niveau_Attaque = "";
        }
        return '<p align="right">' + float_Niveau_Attaque + '</p>';
      }),
      DTColumnBuilder.newColumn('Risque').withTitle(translatedwords.getTranslatedWord($translate("Risque"))).renderWith(function(data, type, full, meta) {
        if (full.Risque == "1") {
          return 'Elevé';
        } else if (full.Risque == "2") {
          return 'Moyen';
        } else if (full.Risque == "3") {
          return 'Faible';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('criticite').withTitle(translatedwords.getTranslatedWord($translate("Seuil d'attaque"))).renderWith(function(data, type, full, meta) {
        if (full.criticite == "1") {
          return '<span class="badge-green_withe">Bas</span>';
        } else if (full.criticite == "2") {
          return '<span class="badge-orange_withe">Moyen</span>';
        } else if (full.criticite == "3") {
          return '<span class="badge-red_withe">Haut</span>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Observations').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('Recommandation').withTitle(translatedwords.getTranslatedWord($translate("Recommandation"))),
      DTColumnBuilder.newColumn('Observateur').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn('Photo').withTitle(translatedwords.getTranslatedWord($translate("Photo"))).renderWith(function(data, type, full, meta) {
        if (full.Photo) {
          var pics = full.Photo.split(",");
          var imghtml = "<table><tr>";
          pics.forEach(function(item, index) {
            if (item != 'noimg.png')
              imghtml += `<td><a ng-click="pc.showimg('${pc.PicturesHostStadePheno+item}', '${full.Observations}')">` +
              `<img src="${pc.PicturesHostStadePheno+item}" width="50px" height="50px" class=""/>  ` +
              `</a></td>`;
          });
          return imghtml + '</tr></table>';

        } else {

          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.Observationphytosanitaireaction[data.ID_Surveillance] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.Observationphytosanitaireaction[' + data.ID_Surveillance + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Observationphytosanitaireaction[' + data.ID_Surveillance + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Observationphytosanitaireaction[' + data.ID_Surveillance + '])" )"=""><i class="fa fa-eye"></i></button>';
        return dtailsBtn + editbtn + deletebtn;
      }).withClass('nowraptd all').withClass('nowraptd all')
    ];

    //Add AddOrdreTraitement
    $scope.AddOrdreTraitement = function() {
      $mdDialog.show({
          controller: DialogControllerAddOrdreTraitement,
          templateUrl: '././views/templates/observationphyto/AddObservationPhyto.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddOrdreTraitement($scope, $mdDialog) {
      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        observationphyto.getlastRef({
          IDFermes: pc.IDferme
        }),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        observationphyto.getALLCible()
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.lastRef = values[1].data;
        if ($scope.lastRef.length > 0) {
          $scope.Reference = "OB-" + pad(parseInt($scope.lastRef[0].NbrObservation) + 1, 6);
        } else {
          $scope.Reference = "OB-" + pad(1, 6);
        }
        $scope.GroupeOperationnels = values[2].data;
        $scope.Cibles = values[3].data;
        $scope.letmeclick = true;
      });

      $scope.Observateur = pc.User;

      $scope.GetOtherReference = function() {
        observationphyto.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "OB-" + pad(parseInt(e.data[0].NbrObservation) + 1, 6);
          } else {
            $scope.Reference = "OB-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error("Connexion au serveur perdu, réessayer ultérieurement " + e.data, {
            closeButton: true
          });
        });
      }

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error("Connexion au serveur perdu, réessayer ultérieurement " + e.data, {
            closeButton: true
          });
        });
      }






      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.DateObservation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

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

      $scope.getTotalSup = () => {
        $scope.TotalSup = 0;
        $scope.TotalSup = parseFloat(_.sumBy($scope.parcelleculturalsel, 'Sup').toFixed(2));
        return $scope.TotalSup;
      }
      $scope.SetParcelleNames = () => {
        $scope.ParcelleNames = '';
        angular.forEach($scope.parcelleculturalsel, function(parcelle) {
          $scope.ParcelleNames += parcelle.Ref + '|';
        })
        return $scope.ParcelleNames;
      }

      $scope.SeuilNuisibilite = 1;
      $scope.Risque = 1;
      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.Reference && $scope.DateObservation && $scope.RepartitionAttaque >= 0 && $scope.Cible && $scope.parcelleculturalsel.length > 0 && $scope.Observateur) {



          pc.objAdd = {
            "Reference": $scope.Reference,
            "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
            "SeuilNuisibilite": $scope.SeuilNuisibilite,
            "RepartitionAttaque": $scope.RepartitionAttaque,
            "Cible": $scope.Cible,
            "Risque": $scope.Risque,
            "foodsParcelle": $scope.parcelleculturalsel,
            "Observateur": ($scope.Observateur) ? $filter('textforsqlserver')($scope.Observateur) : "",
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "Recommandations": ($scope.Recommandations) ? $filter('textforsqlserver')($scope.Recommandations) : "",
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "IDUser": pc.IDUser,
            "ParcelleNames": $scope.SetParcelleNames()
          }


          observationphyto.createweb(pc.objAdd).then(async e => {
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
              toastr.error(e.data, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    //Add AddOrdreTraitement
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditOrdreTraitement,
          templateUrl: '././views/templates/observationphyto/EditObservationPhyto.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerEditOrdreTraitement($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.parcelleculturalsel = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        observationphyto.getALLCible(),
        observationphyto.getParcellesByObservation({
          ID_Surveillance: $scope.data.ID_Surveillance
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.Cibles = values[2].data;
        $scope.AllParcelles = values[3].data;
        $scope.letmeclick = true;
      });

      $scope.GetOtherReference = function() {
        observationphyto.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.data.Ref = "OB-" + pad(parseInt(e.data[0].NbrObservation) + 1, 6);
          } else {
            $scope.data.Ref = "OB-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }


      $scope.DateObservation = ($scope.data.DATE_Surveillance) ? new Date(moment($scope.data.DATE_Surveillance).format("YYYY-MM-DD")) : null;
      $scope.Risque = ($scope.data.Risque) ? parseInt($scope.data.Risque) : 1;
      $scope.SeuilNuisibilite = ($scope.data.criticite) ? parseInt($scope.data.criticite) : 1;
      $scope.RepartitionAttaque = ($scope.data.Niveau_Attaque) ? parseInt($scope.data.Niveau_Attaque) : 0;

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.isInParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.AllParcelles, function(parcelle) {
          if (parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }


      document.getElementById('filter_form').style.display = "none";
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

      $scope.getTotalSup = () => {
        $scope.TotalSup = 0;
        $scope.TotalSup = parseFloat(_.sumBy($scope.parcelleculturalsel, 'Sup').toFixed(2));
        return $scope.TotalSup;
      }
      $scope.SetParcelleNames = () => {
        $scope.ParcelleNames = '';
        angular.forEach($scope.parcelleculturalsel, function(parcelle) {
          $scope.ParcelleNames += parcelle.Ref + '|';
        })
        return $scope.ParcelleNames;
      }


      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.data.Ref && $scope.DateObservation && $scope.RepartitionAttaque >= 0 && $scope.Cible && $scope.parcelleculturalsel.length > 0 && $scope.data.Observateur) {



          pc.objEdit = {
            "ID": $scope.data.ID_Surveillance,
            "Reference": $scope.data.Ref,
            "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
            "SeuilNuisibilite": $scope.SeuilNuisibilite,
            "RepartitionAttaque": $scope.RepartitionAttaque,
            "Cible": $scope.Cible,
            "Risque": $scope.Risque,
            "foodsParcelle": $scope.parcelleculturalsel,
            "Observateur": ($scope.data.Observateur) ? $filter('textforsqlserver')($scope.data.Observateur) : "",
            "Observation": ($scope.data.Observations) ? $filter('textforsqlserver')($scope.data.Observations) : "",
            "Recommandations": ($scope.data.Recommandation) ? $filter('textforsqlserver')($scope.data.Recommandation) : "",
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "IDUser": pc.IDUser,
            "ParcelleNames": $scope.SetParcelleNames()
          }


          observationphyto.updateWeb(pc.objEdit).then(async e => {
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
              toastr.error(e.data, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    pc.delete = async function(c) {
      pc.IDObservationphytosanitaire = c.ID_Surveillance;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            observationphyto.delete({
              ID: pc.IDObservationphytosanitaire
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

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    //détails ordre
    pc.detailsorder = function(data) {
      pc.parcellesdetails = [];
      pc.parcelles = [];
      pc.ObservationByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      observationphyto.getParcelleDetailsByID({
        "ID_Surveillance": pc.ObservationByID.ID_Surveillance
      }).then(function(res) {
        pc.parcellesdetails = res.data;
        NProgress.done();
        NProgress.remove();
      });
    }

    pc.showimg = function(img, describe) {
      document.getElementById("filter_form").style.display = "none";
      $.magnificPopup.open({
        tClose: 'Fermer (Esc)',
        tLoading: 'Chargement...',
        delegate: 'a',
        items: {
          src: img
        },
        closeOnContentClick: true,
        closeBtnInside: true,
        mainClass: 'mfp-fade',
        image: {
          titleSrc: function() {
            return '<b style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><u>Observations</u> : ' + describe + '</b>';
          }
        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    $scope.searchByCriticite = function(criticite_text) {
      pc.dtInstance.DataTable.search(criticite_text).draw();
    };

    function edit(c) {}

    function deleteRow(c) {}

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

  });