'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierGrossissementsuividecalibreCtrl
 * @description
 * # PalmierdattierGrossissementsuividecalibreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierGrossissementsuividecalibreCtrl', function($scope, $filter, translatedwords, $translatePartialLoader, $translate, campagneagricole, GroupeOperationnel, toastr, $window, Arbre, _url, $mdDialog, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, grossissementsuividecalibre, parcellecultural) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.showtable = true;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.Grossissementaction = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);
    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Suivi_grossissement'
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
        $("#Parcelle").selectpicker('refresh');
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
      pc.dtInstance.reloadData();


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
      return grossissementsuividecalibre.getByFiltre(data);
    };


    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddSuiviCalibre()
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
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("graphgrossissementsuividecalibre");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue graphique"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('YYYY-MM-DD');
        return "";
      }), ,
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Moyenne_calibre').withTitle(translatedwords.getTranslatedWord($translate("Moyenne du calibre"))),
      DTColumnBuilder.newColumn('Calibre_Min').withTitle(translatedwords.getTranslatedWord($translate("Calibre Min"))),
      DTColumnBuilder.newColumn('Calibre_Max').withTitle(translatedwords.getTranslatedWord($translate("Calibre Max"))), ,
      DTColumnBuilder.newColumn('Code_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))).renderWith(function(data, type, full, meta) {
        if (full.Code_Arbre)
          return full.Code_Arbre;
        return '';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.Grossissementaction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.Grossissementaction[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Grossissementaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Grossissementaction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return dtailsBtn + editbtn + deletebtn;
      }).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    pc.delete = async function(c) {

      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            grossissementsuividecalibre.deleteweb({
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

    //Add AddSuiviCalibre
    $scope.AddSuiviCalibre = function() {
      $mdDialog.show({
          controller: DialogControllerAddSuiviCalibre,
          templateUrl: '././views/templates/grossissementsuividecalibre/AddSuiviCalibre.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddSuiviCalibre($scope, $mdDialog) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        Arbre.getArbre(_url, pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.Arbres = values[2].data;
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = {};

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = {};
        $scope.Arbres = [];
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


      $scope.getCalibreGO = () => {
        $scope.Arbres = [];
        $scope.IDArbre = undefined;
        $q.all([
          Arbre.getArbreByParcelle({
            DOMAINE: pc.IDferme,
            PARCELLE_CULTURAL: [$scope.parcelleculturalsel.ID]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Arbres = values[0].data;
          $scope.letmeclick = true;
        });
      }

      $scope.foods = [{
        NumeroFruit: "1",
        mensuration: null
      }, {
        NumeroFruit: "2",
        mensuration: null
      }, {
        NumeroFruit: "3",
        mensuration: null
      }, {
        NumeroFruit: "4",
        mensuration: null
      }, {
        NumeroFruit: "5",
        mensuration: null
      }, {
        NumeroFruit: "6",
        mensuration: null
      }, {
        NumeroFruit: "7",
        mensuration: null
      }, {
        NumeroFruit: "8",
        mensuration: null
      }, {
        NumeroFruit: "9",
        mensuration: null
      }, {
        NumeroFruit: "10",
        mensuration: null
      }, {
        NumeroFruit: "11",
        mensuration: null
      }, {
        NumeroFruit: "12",
        mensuration: null
      }, {
        NumeroFruit: "13",
        mensuration: null
      }, {
        NumeroFruit: "14",
        mensuration: null
      }, {
        NumeroFruit: "15",
        mensuration: null
      }, {
        NumeroFruit: "16",
        mensuration: null
      }];

      $scope.setAVGmensuration = () => {
        $scope.AVGmensuration = parseFloat((_.sumBy($scope.foods, 'mensuration') / $scope.foods.length).toFixed(2));
        return $scope.AVGmensuration;
      }

      $scope.setMaxmensuration = () => {
        if ($scope.foods) {
          $scope.max = Math.max.apply(Math, $scope.foods.map(function(item) {
            return item.mensuration == null ? 0 : item.mensuration;
          }));
          $scope.Maxmensuration = parseFloat(($scope.max).toFixed(2));
          return $scope.Maxmensuration;
        }
      }

      $scope.setMinmensuration = () => {
        if ($scope.foods) {
          $scope.min = Math.min.apply(Math, $scope.foods.map(function(item) {
            return item.mensuration == null ? 0 : item.mensuration;
          }));
          $scope.Minmensuration = parseFloat(($scope.min).toFixed(2));
          return $scope.Minmensuration;
        }
      }

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

      $scope.checkfoods = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }


      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel)) {
          if ($scope.checkfoods()) {

            pc.objAdd = {
              "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
              "TimeObservation": moment().format('HH:mm'),
              "parcelleculturalsel": $scope.parcelleculturalsel,
              "Cible": $scope.Cible,
              "Risque": $scope.Risque,
              "foodsMensuration": $scope.foods,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "IDUser": pc.IDUser,
              "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
              "AVGmensuration": $scope.AVGmensuration,
              "Maxmensuration": $scope.Maxmensuration,
              "Minmensuration": $scope.Minmensuration,
              "IDArbre": $scope.IDArbre,
              "Code_compagne": ""
            }

            campagneagricole.CheckCodeCompagnebyTwoDates({
              date_debut: moment($scope.DateObservation).format('YYYYMMDD'),
              IDSOCIETE: pc.IDSociete
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objAdd.Code_compagne = e.data[0].Code_compagne;

                grossissementsuividecalibre.createweb(pc.objAdd).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                  closeButton: true
                });
              }
            });

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Les mensurations doit être supérieur à zéro ")), {
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

    //Add AddSuiviCalibre
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditSuiviCalibre,
          templateUrl: '././views/templates/grossissementsuividecalibre/EditSuiviCalibre.html',
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
    function DialogControllerEditSuiviCalibre($scope, $mdDialog, data) {
      $scope.data = data;
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        grossissementsuividecalibre.getGrossissementByID({
          IDObs_Suivi_Calibre: $scope.data.ID
        }),
        Arbre.getArbreByParcelle({
          DOMAINE: pc.IDferme,
          PARCELLE_CULTURAL: [$scope.data.ID_ParcelleCulturale]
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.foods = values[2].data;
        if ($scope.foods.length == 0) {
          $scope.foods = [{
            NumeroFruit: "1",
            mensuration: null
          }, {
            NumeroFruit: "2",
            mensuration: null
          }, {
            NumeroFruit: "3",
            mensuration: null
          }, {
            NumeroFruit: "4",
            mensuration: null
          }, {
            NumeroFruit: "5",
            mensuration: null
          }, {
            NumeroFruit: "6",
            mensuration: null
          }, {
            NumeroFruit: "7",
            mensuration: null
          }, {
            NumeroFruit: "8",
            mensuration: null
          }, {
            NumeroFruit: "9",
            mensuration: null
          }, {
            NumeroFruit: "10",
            mensuration: null
          }, {
            NumeroFruit: "11",
            mensuration: null
          }, {
            NumeroFruit: "12",
            mensuration: null
          }, {
            NumeroFruit: "13",
            mensuration: null
          }, {
            NumeroFruit: "14",
            mensuration: null
          }, {
            NumeroFruit: "15",
            mensuration: null
          }, {
            NumeroFruit: "16",
            mensuration: null
          }];
        }
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = {};
      $scope.DateObservation = ($scope.data.DateCreated) ? new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD")) : null;

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = {};
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


      $scope.getCalibreGO = () => {
        $scope.IDArbre = undefined;

        $q.all([
          Arbre.getArbreByParcelle({
            DOMAINE: pc.IDferme,
            PARCELLE_CULTURAL: [$scope.parcelleculturalsel.ID]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Arbres = values[0].data;
          $scope.letmeclick = true;
        });

      }





      $scope.setAVGmensuration = () => {
        $scope.AVGmensuration = parseFloat((_.sumBy($scope.foods, 'mensuration') / $scope.foods.length).toFixed(2));
        if (!$scope.AVGmensuration) {
          $scope.AVGmensuration = $scope.data.Moyenne_calibre;
        }
        return $scope.AVGmensuration;
      }

      $scope.setMaxmensuration = () => {
        if ($scope.foods) {
          $scope.max = Math.max.apply(Math, $scope.foods.map(function(item) {
            return item.mensuration == null ? 0 : item.mensuration;
          }));
          $scope.Maxmensuration = parseFloat(($scope.max).toFixed(2));
          if (!$scope.Maxmensuration) {
            $scope.Maxmensuration = $scope.data.Calibre_Max;
          }
          return $scope.Maxmensuration;
        }
      }

      $scope.setMinmensuration = () => {
        if ($scope.foods) {
          $scope.min = Math.min.apply(Math, $scope.foods.map(function(item) {
            return item.mensuration == null ? 0 : item.mensuration;
          }));
          $scope.Minmensuration = parseFloat(($scope.min).toFixed(2));
          if (!$scope.Minmensuration) {
            $scope.Minmensuration = $scope.data.Calibre_Min;
          }
          return $scope.Minmensuration;
        }
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

      $scope.checkfoods = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }


      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel)) {
          if ($scope.checkfoods()) {

            pc.objEdit = {
              "ID": $scope.data.ID,
              "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
              "TimeObservation": moment().format('HH:mm'),
              "parcelleculturalsel": $scope.parcelleculturalsel,
              "Cible": $scope.Cible,
              "Risque": $scope.Risque,
              "foodsMensuration": $scope.foods,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "IDUser": pc.IDUser,
              "IDArbre": $scope.IDArbre,
              "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
              "AVGmensuration": $scope.AVGmensuration,
              "Maxmensuration": $scope.Maxmensuration,
              "Minmensuration": $scope.Minmensuration,
              "Code_compagne": ""
            }

            campagneagricole.CheckCodeCompagnebyTwoDates({
              date_debut: moment($scope.DateObservation).format('YYYYMMDD'),
              IDSOCIETE: pc.IDSociete
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objEdit.Code_compagne = e.data[0].Code_compagne;

                grossissementsuividecalibre.updateweb(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                  closeButton: true
                });
              }
            });

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Les mensurations doit être supérieur à zéro ")), {
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


    //détails ordre
    pc.detailsorder = function(data) {
      pc.ProfileCalibreDetailsByID = data;
      pc.showtable = false;
      pc.showOutil_Attelage_toggle = false;
      pc.AllCalibresMensuration = [];
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      grossissementsuividecalibre.getGrossissementByID({
        "IDObs_Suivi_Calibre": pc.ProfileCalibreDetailsByID.ID
      }).then(function(res) {
        pc.AllCalibresMensuration = res.data;
        NProgress.done();
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

  });