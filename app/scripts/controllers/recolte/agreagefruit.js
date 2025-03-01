'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAgreagefruitCtrl
 * @description
 * # RecolteAgreagefruitCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAgreagefruitCtrl', function($scope,
    DTOptionsBuilder,
    DTColumnBuilder, familleCible, $mdSelect,
    $q,
    $compile, observationphyto, GroupeOperationnel,
    AgreageFruit,
    $mdDialog,
    $state,
    $cookies,
    toastr, _url, $filter, translatedwords,
    Cible,
    parcellecultural, $window, $translatePartialLoader, $translate,
    DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    $scope._ = _;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.Agreageaction = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.showtable = true;

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.User = $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').assistUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').assistUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'agreage_fruit'
    });

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

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
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };


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
    pc.search = function() {
      pc.dtInstance.reloadData();
    }


    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.Add()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        AgreageFruit.getAllAgreageFruit(pc.obj).then(function(result) {
          defer.resolve(result.data);
        });
        NProgress.done();
        return defer.promise;
      })
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
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          orientation: 'landscape',
          exportOptions: {
            columns: ':visible',
            search: 'applied',
            order: 'applied'
          },
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("etatdesyntheseagreage");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Etat de synthèse Agréage"))
        },
        {
          text: "<i class='fa fa-link'></i>",
          action: function(e, dt, node, config) {
            $state.go("agreagefruitOld");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Agréage des fruits ancienne version"))
        }
      ].concat($scope.btnadd));
    pc.dtColumns = [
      DTColumnBuilder.newColumn('NumeroFiche').withTitle(translatedwords.getTranslatedWord($translate("N° Fiche d'agréage"))),
      DTColumnBuilder.newColumn('Date_Agriage').withTitle(translatedwords.getTranslatedWord($translate("Date de contrôle"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Agriage).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('NomCaporal').withTitle(translatedwords.getTranslatedWord($translate("Nom/code Caporal"))),
      DTColumnBuilder.newColumn('NbrFruit').withTitle(translatedwords.getTranslatedWord($translate("Nbre Fruits contrôlés"))),
      DTColumnBuilder.newColumn('NbrFruitCalibre').withTitle(translatedwords.getTranslatedWord($translate("Nbre Fruits contrôlés des calibres"))),
      DTColumnBuilder.newColumn('TypeControle').withTitle(translatedwords.getTranslatedWord($translate("Type de contrôle"))).renderWith(function(data, type, full, meta) {
        if (full.TypeControle == 1) {
          return "Scoring";
        } else if (full.TypeControle == 2) {
          return "Récolte";
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Nbr_Caisse').withTitle(translatedwords.getTranslatedWord($translate("Nbre de caisses contrôlées"))),
      DTColumnBuilder.newColumn('Date_Recolte').withTitle(translatedwords.getTranslatedWord($translate("Date de récolte"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Recolte).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Conformite').withTitle(translatedwords.getTranslatedWord($translate("Conformité"))),
      DTColumnBuilder.newColumn('calibre').withTitle(translatedwords.getTranslatedWord($translate("Calibre"))),
      DTColumnBuilder.newColumn('Ref_Bon_Livraison').withTitle(translatedwords.getTranslatedWord($translate("Bon de livraison"))),

      DTColumnBuilder.newColumn('Brix').withTitle(translatedwords.getTranslatedWord($translate("Brix"))),
      DTColumnBuilder.newColumn('Acidite').withTitle(translatedwords.getTranslatedWord($translate("Acidité"))),
      DTColumnBuilder.newColumn('Pepins').withTitle(translatedwords.getTranslatedWord($translate("Pépins"))),
      DTColumnBuilder.newColumn('Fermete').withTitle(translatedwords.getTranslatedWord($translate("Fermeté"))),

      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),

      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').notSortable().renderWith(function(data, type, full, meta) {
        pc.Agreageaction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.Agreageaction[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Agreageaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Agreageaction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return editbtn + dtailsBtn + deletebtn;
      }).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add AddOrdreTraitement
    $scope.Add = function() {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/agreagefruit/addAgreageFruit.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAdd($scope, $mdDialog) {
      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $scope.foodsFamille = [];
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        familleCible.getall(),
        Cible.getCible(_url),
        AgreageFruit.getlastRef({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.familles = values[2].data;

        angular.forEach($scope.familles, function(value, key) {
          $scope.foodsFamille.push({
            famille: value,
            Cibles: [{
              Cible: null,
              value: null
            }]
          })
        });

        $scope.cibles = values[3].data;
        $scope.lastRef = values[4].data;
        if ($scope.lastRef.length > 0) {
          $scope.Reference = pad(parseInt($scope.lastRef[0].NbrObservation) + 1, 4) + "/" + pad(parseInt($scope.lastRef[0].NbrObservation) + 1, 2);
        } else {
          $scope.Reference = pad(1, 2) + "/" + pad(1, 6);
        }
        $scope.letmeclick = true;
      });

      $scope.Observateur = pc.User;
      $scope.Typedecontrole = 1;

      $scope.GetOtherReference = function() {
        AgreageFruit.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = pad(parseInt(e.data[0].NbrObservation) + 1, 4) + "/" + pad(parseInt(e.data[0].NbrObservation) + 1, 2);
          } else {
            $scope.Reference = pad(1, 2) + "/" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        $scope.calibres = [];
        $scope.calibresData = [];
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




      $scope.getCalibre = function() {

        $scope.calibresData = [];
        $scope.calibres = [];

        var cropplotID = [];
        $scope.parcelleculturalsel.forEach(o => {
          cropplotID.push(o.Variete);
        })


        $scope.calibres = [];
        $q.all([AgreageFruit.getCalibreByVariete({
          IDVarietes: cropplotID
        })]).then((values) => {
          NProgress.done();
          $scope.calibres = values[0].data;
        })

      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.datecontrole = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.daterecolte = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.Conformite = 'Conforme';

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


      $scope.setfoodsFamille = function() {
        $scope.foodsFamille.push({
          famille: $scope.famillesel,
          Cibles: [{
            Cible: null,
            value: null
          }]
        })
      }

      $scope.notInFamille = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsFamille, function(value, key) {
          if (value.famille.IDcategorie_cible == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.cloneItem = async function(parent, index) {
        if ($scope.foodsFamille[parent].Cibles[index].Cible && $scope.foodsFamille[parent].Cibles[index].value >= 0 && $scope.foodsFamille[parent].Cibles[index].value != null) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: null,
            value: null
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires ")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(parent, index) {
        $scope.foodsFamille[parent].Cibles.splice(index, 1);
        if ($scope.foodsFamille[parent].Cibles.length == 0) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: null,
            value: null
          });
        }
      }

      $scope.RetirerFamille = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la famille?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsFamille.splice(index, 1);
          $scope.famillesel = undefined;
        }, function() {
          //cancel
        })
      }
      $scope.amountofFruit = 0;

      $scope.checkCibleData = async function() {
        var ifoundIt = true;
        $scope.amountofFruit = 0;
        $scope.fruitAmountErorr = false
        try {

          await angular.forEach($scope.foodsFamille, async function(value, key) {
            await angular.forEach(value.Cibles, async function(valueCible, key) {
              await angular.forEach(valueCible.Cible, async function(valueCibleVals, key) {
                if ((valueCibleVals.value < 0 || valueCibleVals.value == null || valueCibleVals.Cible == null || valueCibleVals.value == undefined) && ifoundIt) {
                  ifoundIt = false;
                } else {
                  $scope.amountofFruit += valueCibleVals.value;
                }


              })
            });
          });
        } catch (e) {

          ifoundIt = false;
        }
        if ($scope.amountofFruit > $scope.NbreFruitscontroles) {
          ifoundIt = false;
          $scope.fruitAmountErorr = true

        }
        return ifoundIt;
      }


      $scope.checkCalibreData = async function() {
        if ($scope.NbreFruitscontrolesCalibre == _.sumBy($scope.calibresData, 'value'))
          return true
        return false
      }

      $scope.getTotal = function(data) {
        return _.sumBy(data, 'value')
      }




      $scope.calibresData = [];
      $scope.calibre = "Tous calibre";
      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.Reference && $scope.datecontrole && $scope.daterecolte && $scope.parcelleculturalsel.length > 0 && $scope.Observateur && $scope.NbreFruitscontroles >= 0 && $scope.NbreFruitscontrolesCalibre >= 0 && $scope.Nbredecaissescontrolees >= 0 && $scope.bl) {
          if (await $scope.checkCibleData()) {
            if (await $scope.checkCalibreData()) {
              pc.objAdd = {
                "Reference": $scope.Reference,
                "Conformite": $scope.Conformite,
                "Typedecontrole": $scope.Typedecontrole,
                "datecreated": moment().format('YYYYMMDD'),
                "datecontrole": moment($scope.datecontrole).format('YYYYMMDD'),
                "daterecolte": moment($scope.daterecolte).format('YYYYMMDD'),
                "TimeCreated": moment().format('HH:mm'),
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "NbreFruitscontroles": $scope.NbreFruitscontroles,
                "NbreFruitscontrolesCalibre": $scope.NbreFruitscontrolesCalibre,
                "Nbredecaissescontrolees": $scope.Nbredecaissescontrolees,
                "bl": $scope.bl,
                "Observateur": ($scope.Observateur) ? $filter('textforsqlserver')($scope.Observateur) : "",
                "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
                "Recommandations": ($scope.Recommandations) ? $filter('textforsqlserver')($scope.Recommandations) : "",
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "FamilleCible": $scope.foodsFamille,
                "Brix": $scope.Brix,
                "Acidite": $scope.Acidite,
                "Pepins": $scope.Pepins,
                "Fermete": $scope.Fermete,
                "calibresData": $scope.calibresData,
                "calibre": $scope.calibre
              }


              AgreageFruit.addAgreageFruit(pc.objAdd).then(async e => {
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

                  if (e.data.description == "Veuillez renseigner les cibles choisie") {
                    toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                      closeButton: true
                    });
                  } else {
                    toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                      closeButton: true
                    });
                  }
                  NProgress.done();
                }
              }).catch(async e => {
                $scope.progress = false;
                toastr.clear();


                if (e.data.description == "Veuillez renseigner les cibles choisie") {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                }

              });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Nbre fruits contrôlés doivent être égaux au valeurs calibre")), {
                closeButton: true
              });
            }
          } else if ($scope.fruitAmountErorr) {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("le nombre de fruits avec anomalie est supérieur au nombre de fruits de l’échantillon ")), {
              closeButton: true
            });
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
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
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/agreagefruit/EditAgreageFruit.html',
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
    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }


      $scope.foodsFamille = [];

      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        familleCible.getall(),
        Cible.getCible(_url),
        AgreageFruit.getParcelleByAgreage({
          "ID": data.ID
        }),
        AgreageFruit.getdatafamillecibleonlyforedit({
          "ID": data.ID
        }),
        AgreageFruit.getCalibreByIDAgreagEdit({
          "ID": data.ID
        })
      ]).then(async (values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.familles = values[2].data;
        $scope.cibles = values[3].data;
        $scope.parcelleagriage = values[4].data;
        $scope.foodsFamille = values[5].data;
        $scope.calibresDataSet = values[6].data;





        $scope.letmeclick = true;
      });





      $scope.RetirerValue = async function(idcible) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(async function() {
            //ok
            await angular.forEach($scope.foodsFamille, async function(foodsFamille, key) {
              await angular.forEach(foodsFamille.Cibles, async function(CiblesFa, key) {
                await angular.forEach(CiblesFa.Cible, function(CiblesFav, keyOut) {
                  if (CiblesFav.ID_cible == idcible) {
                    CiblesFa.Cible.splice(keyOut, 1);
                  }
                })
              })
            })
          },
          function() {
            //cancel
          })
      }


      $scope.data.datecontrole = ($scope.data.Date_Agriage) ? new Date(moment($scope.data.Date_Agriage).format("YYYY-MM-DD")) : null;
      $scope.data.daterecolte = ($scope.data.Date_Recolte) ? new Date(moment($scope.data.Date_Recolte).format("YYYY-MM-DD")) : null;
      $scope.data.Reference = $scope.data.NumeroFiche;
      $scope.data.NbreFruitscontroles = $scope.data.NbrFruit;
      $scope.data.NbreFruitscontrolesCalibre = $scope.data.NbrFruitCalibre;
      $scope.data.Typedecontrole = $scope.data.TypeControle;
      $scope.data.Nbredecaissescontrolees = $scope.data.Nbr_Caisse;
      $scope.data.bl = $scope.data.Ref_Bon_Livraison;
      $scope.data.Conformite = $scope.data.Conformite;
      $scope.data.Observateur = $scope.data.NomCaporal;
      $scope.data.Observation = $scope.data.Observation;
      $scope.data.Recommandation = $scope.data.Recommandation;

      $scope.isInParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.parcelleagriage, function(parcelle) {
          if (parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }


      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        $scope.calibres = [];
        $scope.calibresData = [];
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

      $scope.setEditCible = (cible) => {

        return false;
      }

      $scope.cibleselected = (cible, cibles) => {

        var ifoundIt = false;
        angular.forEach(cibles, function(valueCibleVals, key) {
          if (valueCibleVals.ID_cible == cible.ID_cible && !ifoundIt) {
            ifoundIt = true;
          }
        })

        return ifoundIt;

      }

      $scope.RetirerCible = (ID_cible, foodsFamille) => {

        //  cibles.splice(index, 1);
      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];

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


      $scope.setfoodsFamille = function() {
        $scope.foodsFamille.push({
          famille: $scope.famillesel,
          Cibles: [{
            Cible: null,
            value: null
          }]
        })
      }

      $scope.notInFamille = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsFamille, function(value, key) {
          if (value.famille.IDcategorie_cible == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }





      $scope.cloneItem = async function(parent, index) {
        if ($scope.foodsFamille[parent].Cibles[index].Cible && $scope.foodsFamille[parent].Cibles[index].value >= 0 && $scope.foodsFamille[parent].Cibles[index].value != null) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: null,
            value: null
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires ")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(parent, index) {
        $scope.foodsFamille[parent].Cibles.splice(index, 1);
        if ($scope.foodsFamille[parent].Cibles.length == 0) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: null,
            value: null
          });
        }
      }

      $scope.RetirerFamille = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la famille?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsFamille.splice(index, 1);
          $scope.famillesel = undefined;
        }, function() {
          //cancel
        })
      }


      $scope.checkCibleData = async function() {
        var ifoundIt = true;
        $scope.amountofFruit = 0;
        $scope.fruitAmountErorr = false;
        try {

          await angular.forEach($scope.foodsFamille, async function(value, key) {
            await angular.forEach(value.Cibles, async function(valueCible, key) {
              await angular.forEach(valueCible.Cible, async function(valueCibleVals, key) {
                if ((valueCibleVals.value < 0 || valueCibleVals.value == null || valueCibleVals.Cible == null || valueCibleVals.value == undefined) && ifoundIt) {
                  ifoundIt = false;
                } else {
                  $scope.amountofFruit += valueCibleVals.value;
                }
              })
            });
          });
        } catch (e) {

          ifoundIt = false;
        }
        if ($scope.amountofFruit > $scope.data.NbreFruitscontroles) {
          ifoundIt = false;
          $scope.fruitAmountErorr = true

        }
        return ifoundIt;
      }

      $scope.getCalibre = function() {

        $scope.calibresData = [];
        var cropplotID = [];
        $scope.parcelleculturalsel.forEach(o => {
          cropplotID.push(o.Variete);
        })

        if ($scope.ichangeCalibre) {
          $scope.calibres = [];
          $q.all([AgreageFruit.getCalibreByVarieteEdit({
            IDVarietes: cropplotID,
            "ID": data.ID
          })]).then((values) => {
            NProgress.done();
            $scope.calibres = values[0].data;
          })
        } else {
          $scope.ichangeCalibre = true;
        }
      }

      $scope.pushcalibresDataSet = function() {

        $scope.calibresDataSet.push({
          Calibre: $scope.calibresData.Calibre,
          Valeur: $scope.calibresData.value,
          IDCalibre: $scope.calibresData.IDCalibre
        })

        $scope.calibres.forEach(o => {
          if (o.IDCalibre == $scope.calibresData.IDCalibre) {
            o.status = 1;
          }
        })

      }

      $scope.RetirerCalibreValue = async function(IDCalibre, index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la famille?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.calibresDataSet.splice(index, 1);

          $scope.calibres.forEach(o => {
            if (o.IDCalibre == IDCalibre) {
              o.status = 0;
            }
          })
        }, function() {
          //cancel
        })
      }

      $scope.checkCalibreData = async function() {
        if ($scope.data.NbreFruitscontrolesCalibre == _.sumBy($scope.calibresDataSet, 'Valeur'))
          return true
        return false
      }

      $scope.getTotal = function(data) {
        return _.sumBy(data, 'Valeur')
      }

      $scope.calibre = $scope.data.calibre
      //add click
      $scope.Modifier = async function() {



        $scope.progress = true;
        toastr.clear();

        if ($scope.data.Reference && $scope.data.datecontrole && $scope.data.bl && $scope.data.daterecolte && $scope.parcelleculturalsel.length > 0 && $scope.data.Observateur && $scope.data.NbreFruitscontroles >= 0 && $scope.data.NbreFruitscontrolesCalibre >= 0 && $scope.data.Nbredecaissescontrolees >= 0 && $scope.data.bl) {
          if (await $scope.checkCibleData()) {
            if (await $scope.checkCalibreData()) {
              pc.objEdit = {
                "ID": $scope.data.ID,
                "Reference": $scope.data.Reference,
                "Conformite": $scope.data.Conformite,
                "Typedecontrole": $scope.data.Typedecontrole,
                "datecontrole": moment($scope.data.datecontrole).format('YYYYMMDD'),
                "daterecolte": moment($scope.data.daterecolte).format('YYYYMMDD'),
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "NbreFruitscontroles": $scope.data.NbreFruitscontroles,
                "NbreFruitscontrolesCalibre": $scope.data.NbreFruitscontrolesCalibre,
                "Nbredecaissescontrolees": $scope.data.Nbredecaissescontrolees,
                "bl": $scope.data.bl,
                "Observateur": ($scope.data.Observateur) ? $filter('textforsqlserver')($scope.data.Observateur) : "",
                "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
                "Recommandation": ($scope.data.Recommandation) ? $filter('textforsqlserver')($scope.data.Recommandation) : "",
                "FamilleCible": $scope.foodsFamille,
                "Brix": $scope.data.Brix,
                "Acidite": $scope.data.Acidite,
                "Pepins": $scope.data.Pepins,
                "Fermete": $scope.data.Fermete,
                "calibresData": $scope.calibresDataSet,
                "calibre": $scope.calibre
              }

              AgreageFruit.editAgreageFruit(pc.objEdit).then(async e => {
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
                if (e.data.description == "Veuillez renseigner les cibles choisie") {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                }
              });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Nbre fruits contrôlés doivent être égaux au valeurs calibre")), {
                closeButton: true
              });
            }
          } else if ($scope.fruitAmountErorr) {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("le nombre de fruits avec anomalie est supérieur au nombre de fruits de l’échantillon ")), {
              closeButton: true
            });
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
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


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

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


    pc.delete = async function(c) {
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            AgreageFruit.deleteAgreageFruit({
              ID: pc.ID
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



    //détails ordre
    pc.detailsorder = function(data) {
      pc.ObservationByID = data;
      pc.parcellesdetails = [];
      pc.ciblesdetails = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      AgreageFruit.getParcelleByAgreage({
        "ID": data.ID
      }).then(function(res) {
        pc.parcellesdetails = res.data;
        NProgress.done();
        NProgress.remove();
      });

      AgreageFruit.getCibleByAgreage({
        "ID": data.ID
      }).then(function(res) {
        pc.ciblesdetails = res.data;
        NProgress.done();
        NProgress.remove();
      });

      AgreageFruit.getCalibreByIDAgreage({
        "ID": data.ID
      }).then(function(res) {
        pc.calibredetails = res.data;
        NProgress.done();
        NProgress.remove();
      });
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

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

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }





  });
