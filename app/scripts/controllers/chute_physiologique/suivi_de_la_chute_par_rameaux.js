'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl
 * @description
 * # ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ChutePhysiologiqueSuiviDeLaChuteParRameauxCtrl', function($scope, $translatePartialLoader, Arbre, _url, _appFor, translatedwords, ChutePhysiologique, $rootScope, $window, $translate, DTOptionsBuilder, $filter, campagneagricole, $mdDialog, toastr, DTColumnBuilder, $q, $compile, ProfilCalibre, $state, parcellecultural, GroupeOperationnel, VarieteService, $cookies, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.ProfileCalibreAction = {};
    pc.showtable = true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    /*var aaa = $translate(['Date', 'Rechercher']).then(function(translations) {
      return translations
    });*/

    var bts = $translate.refresh($window.localStorage.getItem("lang").toLowerCase()).then(function(translations) {
      return translations.table
    });


    pc.dtInstance = {};
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Suivi_de_la_chute_par_rameau'
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

    pc.obj = {
      "FERME": [pc.IDferme],
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme), VarieteService.getVarieteByParcel(pc.obj)]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.varietes = values[1].data;


      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);

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

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddChuteparrameau()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ChutePhysiologique.getAllChuteRameau(pc.obj).then(function(result) {
          defer.resolve(result.data);
          defer.resolve([]);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
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
        },
        {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("suivi_de_la_chute_par_rameaux_etat");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue synthétique"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Parcelle').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Date_Controle').withTitle(translatedwords.getTranslatedWord($translate("Date de contrôle"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Controle).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Total_nbr_fruit').withTitle(translatedwords.getTranslatedWord($translate("Nombre total de fruits"))).renderWith(function(data, type, full, meta) {
        if (full.Total_nbr_fruit)
          return full.Total_nbr_fruit;
        return '';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))).renderWith(function(data, type, full, meta) {
        return full.Nom + ' ' + full.Prenom;
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ProfileCalibreAction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.ProfileCalibreAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ProfileCalibreAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.ProfileCalibreAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return etat + editbtn + deletebtn;
      }).withOption('width', '8%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }
    //détails ordre
    pc.detailsorder = function(data) {
      pc.ChuttByID = data;
      pc.showtable = false;
      pc.AllCalibresMensuration = [];
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }


      $q.all([
        ChutePhysiologique.getChuteRameaux_fruitByID({
          "ID_CHPY_ChuteRameaux": pc.ChuttByID.ID
        })
      ]).then(async (values) => {
        NProgress.done();
        pc.ChuteRameaux_fruitByID = values[0].data;
        pc.ChuteRameaux_fruitByID_formed = [{
          Position: "Est",
          Val_D_10_H: 0,
          Val_10_D_20_H: 0,
          Val_20_D_H: 0,
          Val_D_10_B: 0,
          Val_10_D_20_B: 0,
          Val_20_D_B: 0
        }, {
          Position: "Ouest",
          Val_D_10_H: 0,
          Val_10_D_20_H: 0,
          Val_20_D_H: 0,
          Val_D_10_B: 0,
          Val_10_D_20_B: 0,
          Val_20_D_B: 0
        }, {
          Position: "Centre",
          Val_D_10_H: 0,
          Val_10_D_20_H: 0,
          Val_20_D_H: 0,
          Val_D_10_B: 0,
          Val_10_D_20_B: 0,
          Val_20_D_B: 0
        }];
        var ipos = 0;
        await angular.forEach(pc.ChuteRameaux_fruitByID, function(value, key) {
          if (value.Orientation == "Est") {
            if (value.Position == "Haut") {
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_D_10_H = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_10_D_20_H = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_20_D_H = value.Val_20_D;
            } else if (value.Position == "Bas") {
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_D_10_B = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_10_D_20_B = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos].Val_20_D_B = value.Val_20_D;
            }
          } else if (value.Orientation == "Ouest") {
            if (value.Position == "Haut") {
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_D_10_H = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_10_D_20_H = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_20_D_H = value.Val_20_D;
            } else if (value.Position == "Bas") {
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_D_10_B = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_10_D_20_B = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos + 1].Val_20_D_B = value.Val_20_D;
            }


          } else if (value.Orientation == "Centre") {
            if (value.Position == "Haut") {
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_D_10_H = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_10_D_20_H = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_20_D_H = value.Val_20_D;
            } else if (value.Position == "Bas") {
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_D_10_B = value.Val_D_10;
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_10_D_20_B = value.Val_10_D_20;
              pc.ChuteRameaux_fruitByID_formed[ipos + 2].Val_20_D_B = value.Val_20_D;
            }

          }
        });


      });

    }


    //Add AddChuteparrameau
    $scope.AddChuteparrameau = function() {
      $mdDialog.show({
          controller: DialogControllerAddChuteparrameau,
          templateUrl: '././views/templates/chute_physiologique/AddChuteRameaux.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }


    function DialogControllerAddChuteparrameau($scope, $mdDialog) {

      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = {};



      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
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

      //add click
      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.DateObservation &&
          !angular.equals({}, $scope.parcelleculturalsel) &&
          $scope.Est_H_D_10 >= 0 &&
          $scope.Est_H_10_D_20 >= 0 &&
          $scope.Est_H_20_D >= 0 &&
          $scope.Est_B_D_10 >= 0 &&
          $scope.Est_B_10_D_20 >= 0 &&
          $scope.Est_B_20_D >= 0 &&
          $scope.Ouest_H_D_10 >= 0 &&
          $scope.Ouest_H_10_D_20 >= 0 &&
          $scope.Ouest_H_20_D >= 0 &&
          $scope.Ouest_B_D_10 >= 0 &&
          $scope.Ouest_B_10_D_20 >= 0 &&
          $scope.Ouest_B_20_D >= 0 &&
          $scope.Centre_H_D_10 >= 0 &&
          $scope.Centre_H_10_D_20 >= 0 &&
          $scope.Centre_H_20_D >= 0 &&
          $scope.Centre_B_D_10 >= 0 &&
          $scope.Centre_B_10_D_20 >= 0 &&
          $scope.Centre_B_20_D >= 0) {

          $scope.Total_nbr_fruit = $scope.Est_H_D_10 +
            $scope.Est_H_10_D_20 +
            $scope.Est_H_20_D +
            $scope.Est_B_D_10 +
            $scope.Est_B_10_D_20 +
            $scope.Est_B_20_D +
            $scope.Ouest_H_D_10 +
            $scope.Ouest_H_10_D_20 +
            $scope.Ouest_H_20_D +
            $scope.Ouest_B_D_10 +
            $scope.Ouest_B_10_D_20 +
            $scope.Ouest_B_20_D +
            $scope.Centre_H_D_10 +
            $scope.Centre_H_10_D_20 +
            $scope.Centre_H_20_D +
            $scope.Centre_B_D_10 +
            $scope.Centre_B_10_D_20 +
            $scope.Centre_B_20_D;

          pc.objAdd = {
            Date_Controle: moment($scope.DateObservation).format('YYYYMMDD'),
            ID_ParcelleCul: $scope.parcelleculturalsel.ID,
            Est_H_D_10: $scope.Est_H_D_10,
            Est_H_10_D_20: $scope.Est_H_10_D_20,
            Est_H_20_D: $scope.Est_H_20_D,
            Est_B_D_10: $scope.Est_B_D_10,
            Est_B_10_D_20: $scope.Est_B_10_D_20,
            Est_B_20_D: $scope.Est_B_20_D,
            Ouest_H_D_10: $scope.Ouest_H_D_10,
            Ouest_H_10_D_20: $scope.Ouest_H_10_D_20,
            Ouest_H_20_D: $scope.Ouest_H_20_D,
            Ouest_B_D_10: $scope.Ouest_B_D_10,
            Ouest_B_10_D_20: $scope.Ouest_B_10_D_20,
            Ouest_B_20_D: $scope.Ouest_B_20_D,
            Centre_H_D_10: $scope.Centre_H_D_10,
            Centre_H_10_D_20: $scope.Centre_H_10_D_20,
            Centre_H_20_D: $scope.Centre_H_20_D,
            Centre_B_D_10: $scope.Centre_B_D_10,
            Centre_B_10_D_20: $scope.Centre_B_10_D_20,
            Centre_B_20_D: $scope.Centre_B_20_D,
            Total_nbr_fruit: $scope.Total_nbr_fruit,
            IDFermes: pc.IDferme,
            IDProfilCreate: pc.IDUser,
            Est: "Est",
            Ouest: "Ouest",
            Centre: "Centre",
            Haut: "Haut",
            Bas: "Bas",
            Observation: ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : ""
          }
          ChutePhysiologique.createrameau(pc.objAdd).then(async e => {
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
              toastr.error("an error has occurred", {
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
      }



      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }


    //edit
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditProfilCalibre,
          templateUrl: '././views/templates/chute_physiologique/EditChuteRameaux.html',
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

    //edit
    function DialogControllerEditProfilCalibre($scope, $mdDialog, data) {
      $scope.data = data;
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        ChutePhysiologique.getChuteRameaux_fruitByID({
          ID_CHPY_ChuteRameaux: $scope.data.ID
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.rameau_fruits = values[1].data;
        angular.forEach($scope.rameau_fruits, function(value, key) {
          if (value.Orientation == "Est") {
            if (value.Position == "Haut") {
              $scope.data.Est_H_D_10 = value.Val_D_10;
              $scope.data.Est_H_10_D_20 = value.Val_10_D_20;
              $scope.data.Est_H_20_D = value.Val_20_D;
            } else if (value.Position == "Bas") {
              $scope.data.Est_B_D_10 = value.Val_D_10;
              $scope.data.Est_B_10_D_20 = value.Val_10_D_20;
              $scope.data.Est_B_20_D = value.Val_20_D;
            }

          } else if (value.Orientation == "Ouest") {
            if (value.Position == "Haut") {
              $scope.data.Ouest_H_D_10 = value.Val_D_10;
              $scope.data.Ouest_H_10_D_20 = value.Val_10_D_20;
              $scope.data.Ouest_H_20_D = value.Val_20_D;
            } else if (value.Position == "Bas") {
              $scope.data.Ouest_B_D_10 = value.Val_D_10;
              $scope.data.Ouest_B_10_D_20 = value.Val_10_D_20;
              $scope.data.Ouest_B_20_D = value.Val_20_D;
            }


          } else if (value.Orientation == "Centre") {
            if (value.Position == "Haut") {
              $scope.data.Centre_H_D_10 = value.Val_D_10;
              $scope.data.Centre_H_10_D_20 = value.Val_10_D_20;
              $scope.data.Centre_H_20_D = value.Val_20_D;
            } else if (value.Position == "Bas") {
              $scope.data.Centre_B_D_10 = value.Val_D_10;
              $scope.data.Centre_B_10_D_20 = value.Val_10_D_20;
              $scope.data.Centre_B_20_D = value.Val_20_D;
            }

          }
        });


        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = {};


      $scope.icanadd = false;



      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = ($scope.data.Date_Controle) ? new Date(moment($scope.data.Date_Controle).format("YYYY-MM-DD")) : null;

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


      //Modifier
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel) &&
          $scope.data.Est_H_D_10 >= 0 &&
          $scope.data.Est_H_10_D_20 >= 0 &&
          $scope.data.Est_H_20_D >= 0 &&
          $scope.data.Est_B_D_10 >= 0 &&
          $scope.data.Est_B_10_D_20 >= 0 &&
          $scope.data.Est_B_20_D >= 0 &&
          $scope.data.Ouest_H_D_10 >= 0 &&
          $scope.data.Ouest_H_10_D_20 >= 0 &&
          $scope.data.Ouest_H_20_D >= 0 &&
          $scope.data.Ouest_B_D_10 >= 0 &&
          $scope.data.Ouest_B_10_D_20 >= 0 &&
          $scope.data.Ouest_B_20_D >= 0 &&
          $scope.data.Centre_H_D_10 >= 0 &&
          $scope.data.Centre_H_10_D_20 >= 0 &&
          $scope.data.Centre_H_20_D >= 0 &&
          $scope.data.Centre_B_D_10 >= 0 &&
          $scope.data.Centre_B_10_D_20 >= 0 &&
          $scope.data.Centre_B_20_D >= 0) {


          $scope.Total_nbr_fruit = $scope.data.Est_H_D_10 +
            $scope.data.Est_H_10_D_20 +
            $scope.data.Est_H_20_D +
            $scope.data.Est_B_D_10 +
            $scope.data.Est_B_10_D_20 +
            $scope.data.Est_B_20_D +
            $scope.data.Ouest_H_D_10 +
            $scope.data.Ouest_H_10_D_20 +
            $scope.data.Ouest_H_20_D +
            $scope.data.Ouest_B_D_10 +
            $scope.data.Ouest_B_10_D_20 +
            $scope.data.Ouest_B_20_D +
            $scope.data.Centre_H_D_10 +
            $scope.data.Centre_H_10_D_20 +
            $scope.data.Centre_H_20_D +
            $scope.data.Centre_B_D_10 +
            $scope.data.Centre_B_10_D_20 +
            $scope.data.Centre_B_20_D;

          pc.objEdit = {
            ID: $scope.data.ID,
            Date_Controle: moment($scope.DateObservation).format('YYYYMMDD'),
            ID_ParcelleCul: $scope.parcelleculturalsel.ID,
            Est_H_D_10: $scope.data.Est_H_D_10,
            Est_H_10_D_20: $scope.data.Est_H_10_D_20,
            Est_H_20_D: $scope.data.Est_H_20_D,
            Est_B_D_10: $scope.data.Est_B_D_10,
            Est_B_10_D_20: $scope.data.Est_B_10_D_20,
            Est_B_20_D: $scope.data.Est_B_20_D,
            Ouest_H_D_10: $scope.data.Ouest_H_D_10,
            Ouest_H_10_D_20: $scope.data.Ouest_H_10_D_20,
            Ouest_H_20_D: $scope.data.Ouest_H_20_D,
            Ouest_B_D_10: $scope.data.Ouest_B_D_10,
            Ouest_B_10_D_20: $scope.data.Ouest_B_10_D_20,
            Ouest_B_20_D: $scope.data.Ouest_B_20_D,
            Centre_H_D_10: $scope.data.Centre_H_D_10,
            Centre_H_10_D_20: $scope.data.Centre_H_10_D_20,
            Centre_H_20_D: $scope.data.Centre_H_20_D,
            Centre_B_D_10: $scope.data.Centre_B_D_10,
            Centre_B_10_D_20: $scope.data.Centre_B_10_D_20,
            Centre_B_20_D: $scope.data.Centre_B_20_D,
            Total_nbr_fruit: $scope.Total_nbr_fruit,
            IDFermes: pc.IDferme,
            IDProfilUpdate: pc.IDUser,
            Est: "Est",
            Ouest: "Ouest",
            Centre: "Centre",
            Haut: "Haut",
            Bas: "Bas",
            Observation: ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : ""
          }

          ChutePhysiologique.updaterameau(pc.objEdit).then(async e => {
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
      }



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
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ChutePhysiologique.deleterameau({
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

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;
      $('.selectpicker').prop('disabled', !pc.obj.STANDARD);
      $('.selectpicker').selectpicker('refresh');

      VarieteService.getVarieteByParcel(pc.obj).then(res => {
        pc.varietes = res.data;
        $('.selectpicker').prop('disabled', false);
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });
      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }


    };

    //by variete
    pc.variete_change = function() {

      var variete = $scope.variete.variete;

      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        variete = [0];

      pc.obj.VARIETE = variete;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }


    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_fin
    pc.date_fin_change = function() {

      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

  });