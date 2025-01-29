'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteOrdretraitementphytosanitaireCtrl
 * @description
 * # SanteplanteOrdretraitementphytosanitaireCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteOrdretraitementphytosanitaireCtrl', function($scope, $window, $filter, translatedwords, GroupeOperationnel, Salaries, $translatePartialLoader, $translate, DTOptionsBuilder, parcellecultural, $mdDialog, toastr, DTColumnBuilder, $q, $compile, ordretraitementphytosanitaire, $state, DTDefaultOptions, $cookies, savefilter) {
    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.ordretraitementphytosanitaireAction = {};
    pc.ordretraitementphytosanitaireByID = [];
    pc.showOutil_Attelage_toggle = false;
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
      ss_module: 'Traitement_phyto'
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    //by date_debutl
    $scope.date_debut_change = function() {
      NProgress.start();
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      NProgress.start();
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    $scope.type = "Type";

    //get data and refresh datatable
    $scope.updateDataOrderTraitementPhyto = function(data) {
      return ordretraitementphytosanitaire.getByFiltre(data);
    };

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    //détails ordre
    pc.detailsorder = function(data) {
      pc.ordretraitementphytosanitaireByID = data;
      pc.parcellescultural = [];
      pc.produits = [];
      pc.attelages = [];
      pc.showtable = false;
      pc.showOutil_Attelage_toggle = false;
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      pc.class_refordre = "";
      pc.class_dt_refordre = "";
      pc.etat_traitemen_detail = "";
      if (pc.ordretraitementphytosanitaireByID.Valide) {
        //realiser
        pc.class_refordre = "badge-yellow_withe";
        pc.etat_traitemen_detail = "Ordre réalisé";
        pc.class_dt_refordre = "dt-withcolor-button-yellow pull-right";
      } else {
        if (parseInt(pc.ordretraitementphytosanitaireByID.Etat_i) > 0) {
          //encours de realiser
          pc.class_refordre = "badge-orange_withe";
          pc.etat_traitemen_detail = "Ordre en cours";
          pc.class_dt_refordre = "dt-withcolor-button-orange pull-right";
        } else {
          //non realiser
          pc.class_refordre = "badge-red_withe";
          pc.etat_traitemen_detail = "Ordre non réalisé";
          pc.class_dt_refordre = "dt-withcolor-button-red pull-right";
        }
      }

      ordretraitementphytosanitaire.getParcelleByID({
        "IDtraitement": pc.ordretraitementphytosanitaireByID.ID
      }).then(function(res) {
        pc.parcellescultural = res.data;
        NProgress.done();
      });

      ordretraitementphytosanitaire.getProduitByID({
        "IDtraitement": pc.ordretraitementphytosanitaireByID.ID
      }).then(function(res) {
        pc.produits = res.data;
        NProgress.done();
      });

      ordretraitementphytosanitaire.getAttelageByID({
        "IDtraitement": pc.ordretraitementphytosanitaireByID.ID
      }).then(function(res) {
        pc.attelages = res.data;
        NProgress.done();
      });

    }

    pc.showOutil_Attelage = function() {
      pc.showOutil_Attelage_toggle = true;
    }

    pc.getSumSup = function(data) {
      pc.total_sup = 0;
      angular.forEach(data, function(parcelle) {
        pc.total_sup += parseFloat(parcelle.Sup_Pa);
      })
      return pc.total_sup;
    }


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
        $scope.updateDataOrderTraitementPhyto(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
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
            $scope.searchByEtat("");
          }
        },
        {
          text: translatedwords.getTranslatedWord($translate("Realisé")),
          action: function(e, dt, node, config) {
            $scope.searchByEtat("Realisé");
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-yellow'
        },
        {
          text: translatedwords.getTranslatedWord($translate("En cours")),
          action: function(e, dt, node, config) {
            $scope.searchByEtat("En cours");
          },
          init: function(api, node, config) {
            $(node).removeClass('dt-button')
          },
          className: 'dt-withcolor-button-orange'
        },
        {
          text: translatedwords.getTranslatedWord($translate("Non réalisé")),
          action: function(e, dt, node, config) {
            $scope.searchByEtat("Non traité");
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

    pc.dtColumns = [DTColumnBuilder.newColumn('Ref_traitement').withTitle(translatedwords.getTranslatedWord($translate("N°Traitement"))).renderWith(function(data, type, full, meta) {

        if (full.Valide) {
          //realiser
          return "<span class='badge-yellow'>" + full.Ref_traitement + "</span>";
        } else {
          if (parseInt(full.Etat_i) > 0) {
            //encours de realiser
            return "<span class='badge-orange_withe'>" + full.Ref_traitement + "</span>";
          } else {
            //non realiser
            return "<span class='badge-red_withe'>" + full.Ref_traitement + "</span>";
          }
        }
      }),
      DTColumnBuilder.newColumn('Ref_OBS').withTitle(translatedwords.getTranslatedWord($translate("Réference observation"))),
      DTColumnBuilder.newColumn('DATE_Ordre').withTitle(translatedwords.getTranslatedWord($translate("'Date instruction"))).renderWith(function(data, type, full, meta) {
        if (full.DATE_Ordre)
          return moment(full.DATE_Ordre).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Responsable_technique').withTitle(translatedwords.getTranslatedWord($translate("Responsable technique"))),
      DTColumnBuilder.newColumn('Valide').withTitle(translatedwords.getTranslatedWord($translate("Validé"))).renderWith(function(data, type, full, meta) {
        if (full.Valide) {
          return '<i class="fa fa-check"></i>';
        } else {
          return '<i class="fa fa-remove"></i>';
        }
      }),
      DTColumnBuilder.newColumn('DAR').withTitle(translatedwords.getTranslatedWord($translate("DAR(j)"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.DAR + '</p>';
      }),
      DTColumnBuilder.newColumn('OBSERV').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('BOUILLIE_estimee').withTitle(translatedwords.getTranslatedWord($translate("Bouilie(L)"))).renderWith(function(data, type, full, meta) {
        if (full.BOUILLIE_estimee)
          return '<p align="right">' + parseFloat(full.BOUILLIE_estimee).toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Methode').withTitle(translatedwords.getTranslatedWord($translate("Méthode"))),
      DTColumnBuilder.newColumn('Ref_traitement').withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {

        if (full.Valide) {
          //realiser
          return "<span class='badge-yellow'>Realisé</span>";
        } else {
          if (parseInt(full.Etat_i) > 0) {
            //encours de realiser
            return "<span class='badge-orange'>En cours</span>";
          } else {
            //non realiser
            return "<span class='badge-red'>Non traité</span>";
          }
        }
      }).notVisible(),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ordretraitementphytosanitaireAction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.ordretraitementphytosanitaireAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ordretraitementphytosanitaireAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.ordretraitementphytosanitaireAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return etat + editbtn + deletebtn;
      }).withOption('width', '8%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    //Add AddOrdreTraitement
    $scope.AddOrdreTraitement = function() {
      $mdDialog.show({
          controller: DialogControllerAddOrdreTraitement,
          templateUrl: '././views/templates/traitementphytosanitaire/AddOrdreTraitement.html',
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
        ordretraitementphytosanitaire.getlastRef({
          IDFermes: pc.IDferme
        }),
        ordretraitementphytosanitaire.getAllObservation({
          IDFermes: pc.IDferme
        }),
        ordretraitementphytosanitaire.getAllStade(),
        ordretraitementphytosanitaire.getAllTypeTraitement(),
        ordretraitementphytosanitaire.getAllTypeMethodeTraitement(),
        ordretraitementphytosanitaire.getAllOperation(),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        ordretraitementphytosanitaire.getAllTracteur({
          IDSociete: pc.IDSociete
        }),
        ordretraitementphytosanitaire.getAllOutilType(),
        ordretraitementphytosanitaire.getAllOutilAttelage({
          IDSociete: pc.IDSociete
        }),
        ordretraitementphytosanitaire.getALLCible(),
        ordretraitementphytosanitaire.getALLUniteDose(),
        Salaries.getPersonnel_fertilisation({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.lastRef = values[1].data;
        if ($scope.lastRef.length > 0) {
          $scope.Reference = "OF-" + pad(parseInt($scope.lastRef[0].NbrOrdres) + 1, 6);
        } else {
          $scope.Reference = "OF-" + pad(1, 6);
        }
        $scope.NumerosObservation = values[2].data;
        $scope.Stades = values[3].data;
        $scope.TypesTraitement = values[4].data;
        $scope.MethodesTraitement = values[5].data;
        $scope.Operations = values[6].data;
        $scope.GroupeOperationnels = values[7].data;
        $scope.Tracteurs = values[8].data;
        $scope.OutilTypes = values[9].data;
        $scope.OutilAttelages = values[10].data;
        $scope.Cibles = values[11].data;
        $scope.UniteDoses = values[12].data;
        $scope.Salaries = values[13].data;
        $scope.letmeclick = true;
      });

      $scope.Responsable = pc.User;
      $scope.Statut = 0;
      $scope.Injection = 0;
      $scope.Salariesel = [];

      $scope.GetOtherReference = function() {
        ordretraitementphytosanitaire.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "OF-" + pad(parseInt(e.data[0].NbrOrdres) + 1, 6);
          } else {
            $scope.Reference = "OF-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.getParcellesByGO = () => {
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

      $scope.getLitrageByImmo = () => {
        ordretraitementphytosanitaire.getLitrageByImmo({
          IDImmobilisation: $scope.OutilAttelage.IDImmobilisation
        }).then(e => {
          NProgress.done();
          $scope.Litrages = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.foodsParcelle = [];

      $scope.setfoodsParcelle = function() {
        $scope.foodsParcelle.push({
          parcelle: $scope.parcelleculturalsel,
          SupAtraiter: $scope.parcelleculturalsel.Sup,
          NBArbre: $scope.parcelleculturalsel.NBR_aRBre_reel,
          PorcentageSupAtraiter: 100
        })
        $scope.Produits = undefined;
        $scope.foodsProduit = [];
      }

      $scope.getProduits = async () => {
        if ($scope.foodsParcelle.length > 0 && $scope.DateOrdre) {
          ordretraitementphytosanitaire.getALLPesticide({
            IDFermes: pc.IDferme,
            Culture: $scope.foodsParcelle[$scope.foodsParcelle.length - 1].parcelle.VarieteNom,
            ID_cible: $scope.Cible,
            DateOrdre: moment($scope.DateOrdre).format('YYYYMMDD')
          }).then(e => {
            NProgress.done();
            $scope.Produits = undefined;
            $scope.Produits = e.data;
            $scope.foodsProduit = [];
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
            $scope.Cible = undefined;
          });
        } else if (!$scope.NumeroObservation) {
          toastr.clear();
          if ($scope.DateOrdre) {
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir au moins une parcelle ")), {
              closeButton: true
            });
          } else {
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir la date de traitment ")), {
              closeButton: true
            });
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir au moins une parcelle ")), {
              closeButton: true
            });
          }
          $scope.Cible = undefined;
        }

      }

      $scope.foodsProduit = [];

      $scope.setfoodsProduit = async function() {
        if (parseFloat(document.getElementById("LitrageTotal").value) > 0) {
          $scope.foodsProduit.push({
            produit: $scope.produitsel,
            quantite: 0,
            UniteDose: undefined
          })
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("veuillez saisir litrage total ")), {
            closeButton: true
          });
          $scope.produitsel = [];
        }

      }

      $scope.RetirerProduit = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression du produit?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok('Ok')
          .cancel('Annuler')

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsProduit.splice(index, 1);
          $scope.produitsel = undefined;
        }, function() {
          //cancel
        })
      }


      $scope.notInProduit = function(Produit) {
        var ifoundIt = false;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.ID == Produit.ID && value.produit.Designation == Produit.Designation && value.produit.cible == Produit.cible && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }




      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok('Ok')
          .cancel('Annuler')

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsParcelle.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.notInParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.getTotalSupTraiter = () => {
        $scope.TotalSupTraiter = parseFloat(_.sumBy($scope.foodsParcelle, 'SupAtraiter').toFixed(2));
        return $scope.TotalSupTraiter;
      }

      $scope.$watch('TotalSupTraiter', function(newValue, oldValue) {
        var unite1 = ["cc/hl", "gr/hl", "g/hl"];
        var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
        var unite3 = ["cc/ha", "gr/ha", "g/ha"];
        var unite4 = ["l/ha", "kg/ha"];
        angular.forEach($scope.foodsProduit, function(value, key) {
          try {
            var uniteselected = value.UniteDose.unite;
          } catch (e) {
            var uniteselected = "NaN";
          }
          var rQte_pest = 0;
          if (unite1.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100000
          } else if (unite2.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100
          } else if (unite3.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose / 1000
          } else if (unite4.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose
          }
          var unitePest = value.produit.unite;
          unitePest = unitePest.replace(/\s/g, '');
          if (unitePest.toLowerCase() == 'g') {
            rQte_pest = rQte_pest * 1000;
          }
          value.quantite = rQte_pest;
        })
      });

      $scope.$watch('LitrageTotal', function(newValue, oldValue) {
        var unite1 = ["cc/hl", "gr/hl", "g/hl"];
        var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
        var unite3 = ["cc/ha", "gr/ha", "g/ha"];
        var unite4 = ["l/ha", "kg/ha"];
        angular.forEach($scope.foodsProduit, function(value, key) {
          try {
            var uniteselected = value.UniteDose.unite;
          } catch (e) {
            var uniteselected = "NaN";
          }
          var rQte_pest = 0;
          if (unite1.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100000
          } else if (unite2.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100
          } else if (unite3.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose / 1000
          } else if (unite4.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose
          }
          var unitePest = value.produit.unite;
          unitePest = unitePest.replace(/\s/g, '');
          if (unitePest.toLowerCase() == 'g') {
            rQte_pest = rQte_pest * 1000;
          }
          value.quantite = rQte_pest;
        })
      });

      $scope.getTotalSup = () => {
        $scope.TotalSup = 0;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          $scope.TotalSup += value.parcelle.Sup;
        })
        $scope.TotalSup = parseFloat($scope.TotalSup.toFixed(2));
        return parseFloat($scope.TotalSup.toFixed(2));
      }

      $scope.setLitrageTotal = () => {
        if ($scope.Litrage && $scope.getTotalSupTraiter() >= 0) {
          return parseFloat(($scope.getTotalSupTraiter() * $scope.Litrage.Litrage).toFixed(2));
        } else {
          return 0;
        }
      }

      $scope.getQteTotal = () => {
        $scope.QteTotal = parseFloat(_.sumBy($scope.foodsProduit, 'quantite').toFixed(2));
        return $scope.QteTotal;
      }

      $scope.setNbrCuvesReel = () => {
        if ($scope.OutilAttelage && $scope.getTotalSupTraiter() >= 0) {
          $scope.NbrCuveReel = Math.ceil((parseFloat(document.getElementById("LitrageTotal").value) / $scope.OutilAttelage.Contenance).toFixed(2));
          return $scope.NbrCuveReel;
        } else {
          $scope.NbrCuveReel = 0;
          return 0;
        }
      }

      $scope.numeroObservationChange = () => {
        $scope.Cible = undefined;
        $scope.Produits = undefined;
        $scope.foodsProduit = [];
      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.DateOrdre = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

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

      $scope.parcelle_change = function() {
        NProgress.start();
        NiveauColorationService.getColorationbyvariete({
          ID_Variete: $scope.parcelleculturalsel.Variete
        }).then(e => {
          NProgress.done();
          $scope.NiveauColoration = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }




      $scope.setQuantite = (food) => {
        var unite1 = ["cc/hl", "gr/hl", "g/hl"];
        var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
        var unite3 = ["cc/ha", "gr/ha", "g/ha"];
        var unite4 = ["l/ha", "kg/ha"];
        try {
          var uniteselected = food.UniteDose.unite;
        } catch (e) {
          var uniteselected = "NaN";
        }
        var rQte_pest = 0;
        if (unite1.includes(uniteselected)) {
          rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * food.produit.Dose / 100000
        } else if (unite2.includes(uniteselected)) {
          rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * food.produit.Dose / 100
        } else if (unite3.includes(uniteselected)) {
          rQte_pest = $scope.TotalSupTraiter * food.produit.Dose / 1000
        } else if (unite4.includes(uniteselected)) {
          rQte_pest = $scope.TotalSupTraiter * food.produit.Dose
        }
        var unitePest = food.produit.unite;
        unitePest = unitePest.replace(/\s/g, '');
        if (unitePest.toLowerCase() == 'g') {
          rQte_pest = rQte_pest * 1000;
        }
        food.quantite = rQte_pest;
        return rQte_pest;
      }

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        $scope.operateursiIDS = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
          $scope.operateursiIDS += String(value.ID).concat(" ; ");
        })
      }

      $scope.getTotalDar = () => {
        $scope.TotalDar = 0;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.dar && $scope.TotalDar < parseFloat(value.produit.dar))
            $scope.TotalDar = parseFloat(value.produit.dar);
        })
        return $scope.TotalDar;
      }

      $scope.getTotalCoutEstime = () => {
        $scope.CoutEstime = 0;
        angular.forEach($scope.foodsProduit, function(value, key) {
          $scope.CoutEstime += value.produit.CMUP * value.produit.solde;
        })
        return parseFloat($scope.CoutEstime.toFixed(2));
      }


      $scope.checkfoodsParcelleData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          if ((!value.SupAtraiter || value.SupAtraiter === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkfoodsProduitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if ((!value.quantite || value.quantite === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkPrincipal = () => {
        var ifoundPrincipale = 0
        var ifoundNonPrincipale = 0
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.Principal) {
            ifoundPrincipale++;
          } else {
            ifoundNonPrincipale++;
          }
        });
        if (ifoundPrincipale == $scope.foodsProduit.length) {
          return 1
        } else if (ifoundNonPrincipale == $scope.foodsProduit.length) {
          return 2
        } else {
          return 3
        }
      }

      $scope.setPorcentageSup = (food) => {
        food.PorcentageSupAtraiter = parseFloat(((100 * food.SupAtraiter) / food.parcelle.Sup).toFixed(2));
        return food.PorcentageSupAtraiter
      }


      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.Reference && $scope.DateOrdre && $scope.Stade && $scope.TypeTraitement && $scope.Methode && $scope.Operation && $scope.foodsParcelle.length > 0 && parseFloat(document.getElementById("LitrageTotal").value) && $scope.foodsProduit.length > 0 && $scope.Responsable && $scope.Salariesel.length > 0) {
          if ($scope.checkfoodsParcelleData()) {
            if ($scope.checkfoodsProduitData()) {

              pc.objAdd = {
                "Reference": $scope.Reference,
                "DateOrdre": moment($scope.DateOrdre).format('YYYYMMDD'),
                "Stade": $scope.Stade,
                "TypeTraitement": $scope.TypeTraitement,
                "Methode": $scope.Methode,
                "Operation": $scope.Operation,
                "LitrageTotal": parseFloat(document.getElementById("LitrageTotal").value),
                "Responsable": ($scope.Responsable) ? $filter('textforsqlserver')($scope.Responsable) : "",
                "operateursNames": $scope.operateursNames,
                "foodsParcelle": $scope.foodsParcelle,
                "foodsProduit": $scope.foodsProduit,
                "NumeroObservation": $scope.NumeroObservation,
                "Tracteur": $scope.Tracteur,
                "OutilType": $scope.OutilType,
                "OutilAttelage": $scope.OutilAttelage,
                "Litrage": $scope.Litrage,
                "Contenance": ($scope.OutilAttelage) ? $scope.OutilAttelage.Contenance : 0,
                "NbrCuve": $scope.NbrCuve,
                "NbrCuveReel": $scope.NbrCuveReel,
                "Statut": $scope.Statut,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "TotalDar": $scope.TotalDar,
                "CoutEstime": $scope.CoutEstime,
                "TotalSupTraiter": $scope.TotalSupTraiter,
                "PorcentageTraiter": parseInt((100 * $scope.TotalSupTraiter) / $scope.TotalSup),
                "TotalSup": $scope.TotalSup,
                "Culture": $scope.foodsParcelle[$scope.foodsParcelle.length - 1].parcelle.VarieteNom,
                "QteTotal": $scope.QteTotal,
                "Article_Principale": $scope.checkPrincipal(),
                "Injection": $scope.Injection,
                "operateursiIDS": $scope.operateursiIDS
              }


              ordretraitementphytosanitaire.createweb(pc.objAdd).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les quantités des produits")), {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les Superficies à traiter des parcelles")), {
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

    //Edit AddOrdreTraitement
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/traitementphytosanitaire/EditOrdreTraitement.html',
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

    //Edit AddAnalyse
    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        ordretraitementphytosanitaire.getAllObservation({
          IDFermes: pc.IDferme
        }),
        ordretraitementphytosanitaire.getAllStade(),
        ordretraitementphytosanitaire.getAllTypeTraitement(),
        ordretraitementphytosanitaire.getAllTypeMethodeTraitement(),
        ordretraitementphytosanitaire.getAllOperation(),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        ordretraitementphytosanitaire.getAllTracteur({
          IDSociete: pc.IDSociete
        }),
        ordretraitementphytosanitaire.getAllOutilType(),
        ordretraitementphytosanitaire.getAllOutilAttelage({
          IDSociete: pc.IDSociete
        }),
        ordretraitementphytosanitaire.getALLCible(),
        ordretraitementphytosanitaire.getALLUniteDose(),
        Salaries.getPersonnel_fertilisation({
          IDFermes: pc.IDferme
        }),
        ordretraitementphytosanitaire.getLitrageByTraitement({
          IDtraitement: $scope.data.ID
        }),
        ordretraitementphytosanitaire.getParcelleByTraitement({
          IDtraitement: $scope.data.ID
        }),
        ordretraitementphytosanitaire.getPesticideByTraitement({
          IDtraitement: $scope.data.ID,
          IDFermes: pc.IDferme,
          DateOrdre: moment($scope.data.DATE_Ordre).format('YYYYMMDD')
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.NumerosObservation = values[1].data;
        $scope.Stades = values[2].data;
        $scope.TypesTraitement = values[3].data;
        $scope.MethodesTraitement = values[4].data;
        $scope.Operations = values[5].data;
        $scope.GroupeOperationnels = values[6].data;
        $scope.Tracteurs = values[7].data;
        $scope.OutilTypes = values[8].data;
        $scope.OutilAttelages = values[9].data;
        $scope.Cibles = values[10].data;
        $scope.UniteDoses = values[11].data;
        $scope.Salaries = values[12].data;
        $scope.AttelagesByTrait = values[13].data;
        $scope.NbrCuve = $scope.AttelagesByTrait[0].NOmbre_cuve;
        $scope.LitrageTotal = $scope.AttelagesByTrait[0].Litrage_Total;

        $scope.ParcelleByTraitement = values[14].data;
        $scope.PesticideByTraitement = values[15].data;
        angular.forEach($scope.PesticideByTraitement, function(value, key) {

          $scope.foodsProduit.push({
            produit: value,
            UniteDose: value.Unite_Dose,
            quantite: value.Quantite_Ordre
          });
        })

        $scope.letmeclick = true;
      });

      $scope.DateOrdre = ($scope.data.DATE_Ordre) ? new Date(moment($scope.data.DATE_Ordre).format("YYYY-MM-DD")) : null;

      $scope.Injection = ($scope.data.Injection) ? 1 : 0;
      $scope.Statut = ($scope.data.Valide) ? 1 : 0;

      $scope.foodsParcelle = [];

      $scope.setFoodsParcelle = function() {
        var SupAtraiter = $scope.parcelleculturalsel.Sup;
        var PorcentageSupAtraiter = 100;
        var NBArbre = 0;
        angular.forEach($scope.ParcelleByTraitement, function(value, key) {
          if (value.Parcelle_culturale == $scope.parcelleculturalsel.ID) {
            SupAtraiter = parseFloat((value.Sup_traiter * $scope.parcelleculturalsel.Sup / 100).toFixed(2));
            PorcentageSupAtraiter = value.Sup_traiter;
            NBArbre = value.NB_arbre;
          }
        })
        $scope.foodsParcelle.push({
          parcelle: $scope.parcelleculturalsel,
          SupAtraiter: SupAtraiter,
          NBArbre: NBArbre,
          PorcentageSupAtraiter: PorcentageSupAtraiter
        });
      }

      $scope.ParcelleIN = function(ID) {
        var i = false;
        angular.forEach($scope.ParcelleByTraitement, function(value, key) {
          if (value.Parcelle_culturale === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }


      $scope.foodsProduit = [];


      $scope.setfoodsProduit = function() {
        var quantite = 0;
        var UniteDose = undefined;
        angular.forEach($scope.PesticideByTraitement, function(value, key) {
          if (value.Id == $scope.produitsel.Id) {
            UniteDose = value.Unite_Dose;
          }
        })
        $scope.foodsProduit.push({
          produit: $scope.produitsel,
          quantite: 0,
          UniteDose: UniteDose
        });
      }

      $scope.isINCible = function(Cible) {
        var ifoundIt = false;
        angular.forEach($scope.PesticideByTraitement, function(value, key) {
          if (value.cible == Cible && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }



      /*$scope.setfoodsProduit = function() {
        if (parseFloat(document.getElementById("LitrageTotal").value) > 0) {
          $scope.foodsProduit.push({
            produit: $scope.produitsel,
            quantite: 0,
            UniteDose: undefined
          })
        } else {
          toastr.clear();
          toastr.error("veuillez saisir litrage total ", {
            closeButton: true
          });
          $scope.produitsel = [];
        }

      }*/





      $scope.isINOperateur = function(ouvrier) {
        var ifoundIt = false;
        var res = $scope.data.ID_Personnel.split(" ; ");
        if (res.includes(String(ouvrier.ID)) && ifoundIt == false) {
          ifoundIt = true;
        }
        return ifoundIt;
      }

      $scope.GetOtherReference = function() {
        ordretraitementphytosanitaire.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "OF-" + pad(parseInt(e.data[0].NbrOrdres) + 1, 6);
          } else {
            $scope.Reference = "OF-" + pad(1, 6);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      $scope.getParcellesByGO = () => {
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

      $scope.getLitrageByImmo = () => {
        ordretraitementphytosanitaire.getLitrageByImmo({
          IDImmobilisation: $scope.OutilAttelage.IDImmobilisation
        }).then(e => {
          NProgress.done();
          $scope.Litrages = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }





      $scope.getProduits = async () => {
        if ($scope.foodsParcelle.length > 0 && $scope.DateOrdre) {
          ordretraitementphytosanitaire.getALLPesticide({
            IDFermes: pc.IDferme,
            Culture: $scope.foodsParcelle[$scope.foodsParcelle.length - 1].parcelle.VarieteNom,
            ID_cible: $scope.Cible,
            DateOrdre: moment($scope.DateOrdre).format('YYYYMMDD')
          }).then(e => {
            NProgress.done();
            $scope.Produits = undefined;
            $scope.Produits = e.data;
            //  $scope.foodsProduit = [];
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
            $scope.Cible = undefined;
          });
        } else if (!$scope.NumeroObservation) {
          toastr.clear();
          if ($scope.DateOrdre) {
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir au moins une parcelle ")), {
              closeButton: true
            });
          } else {
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir la date de traitment ")), {
              closeButton: true
            });
            toastr.error(await translatedwords.getTranslatedWord($translate("veuillez choisir au moins une parcelle ")), {
              closeButton: true
            });
          }
          $scope.Cible = undefined;
        }

      }





      $scope.RetirerProduit = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression du produit?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok('Ok')
          .cancel('Annuler')

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsProduit.splice(index, 1);
          $scope.produitsel = undefined;
        }, function() {
          //cancel
        })
      }


      $scope.notInProduit = function(Produit) {
        var ifoundIt = false;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.ID == Produit.ID && value.produit.Designation == Produit.Designation && value.produit.cible == Produit.cible && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }




      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok('Ok')
          .cancel('Annuler')

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsParcelle.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.notInParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.getTotalSupTraiter = () => {
        $scope.TotalSupTraiter = parseFloat(_.sumBy($scope.foodsParcelle, 'SupAtraiter').toFixed(2));
        return $scope.TotalSupTraiter;
      }

      /*  $scope.$watch('TotalSupTraiter', function(newValue, oldValue) {

          var unite1 = ["cc/hl", "gr/hl", "g/hl"];
          var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
          var unite3 = ["cc/ha", "gr/ha", "g/ha"];
          var unite4 = ["l/ha", "kg/ha"];
          angular.forEach($scope.foodsProduit, function(value, key) {
            try {
              var uniteselected = value.UniteDose.unite;
            } catch (e) {
              var uniteselected = "NaN";
            }
            var rQte_pest = 0;
            if (unite1.includes(uniteselected)) {
              rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100000
            } else if (unite2.includes(uniteselected)) {
              rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100
            } else if (unite3.includes(uniteselected)) {
              rQte_pest = $scope.TotalSupTraiter * value.produit.Dose / 1000
            } else if (unite4.includes(uniteselected)) {
              rQte_pest = $scope.TotalSupTraiter * value.produit.Dose
            }
            var unitePest = value.produit.unite;
            unitePest = unitePest.replace(/\s/g, '');
            if (unitePest.toLowerCase() == 'g') {
              rQte_pest = rQte_pest * 1000;
            }
            value.quantite = rQte_pest;
          })

        });*/

      $scope.$watch('LitrageTotal', function(newValue, oldValue) {

        var unite1 = ["cc/hl", "gr/hl", "g/hl"];
        var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
        var unite3 = ["cc/ha", "gr/ha", "g/ha"];
        var unite4 = ["l/ha", "kg/ha"];
        angular.forEach($scope.foodsProduit, function(value, key) {
          try {
            var uniteselected = value.UniteDose.unite;
          } catch (e) {
            var uniteselected = "NaN";
          }
          var rQte_pest = 0;
          if (unite1.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100000
          } else if (unite2.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * value.produit.Dose / 100
          } else if (unite3.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose / 1000
          } else if (unite4.includes(uniteselected)) {
            rQte_pest = $scope.TotalSupTraiter * value.produit.Dose
          }
          var unitePest = value.produit.unite;
          unitePest = unitePest.replace(/\s/g, '');
          if (unitePest.toLowerCase() == 'g') {
            rQte_pest = rQte_pest * 1000;
          }
          value.quantite = rQte_pest;
        })

      });

      $scope.getTotalSup = () => {
        $scope.TotalSup = 0;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          $scope.TotalSup += value.parcelle.Sup;
        })
        $scope.TotalSup = parseFloat($scope.TotalSup.toFixed(2));
        return parseFloat($scope.TotalSup.toFixed(2));
      }

      $scope.setLitrageTotal = () => {
        /*  if ($scope.Litrage && $scope.getTotalSupTraiter() >= 0) {
            return parseFloat(($scope.getTotalSupTraiter() * $scope.Litrage.Litrage).toFixed(2));
          } else {
            return 0;
          }*/
      }

      $scope.getQteTotal = () => {
        $scope.QteTotal = parseFloat(_.sumBy($scope.foodsProduit, 'quantite').toFixed(2));
        return $scope.QteTotal;
      }

      $scope.setNbrCuvesReel = () => {
        if ($scope.OutilAttelage && $scope.getTotalSupTraiter() >= 0) {
          $scope.NbrCuveReel = Math.ceil((parseFloat(document.getElementById("LitrageTotal").value) / $scope.OutilAttelage.Contenance).toFixed(2));
          return $scope.NbrCuveReel;
        } else {
          $scope.NbrCuveReel = 0;
          return 0;
        }
      }

      $scope.numeroObservationChange = () => {
        $scope.Cible = undefined;
        $scope.Produits = undefined;
        //$scope.foodsProduit = [];
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

      $scope.parcelle_change = function() {
        NProgress.start();
        NiveauColorationService.getColorationbyvariete({
          ID_Variete: $scope.parcelleculturalsel.Variete
        }).then(e => {
          NProgress.done();
          $scope.NiveauColoration = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }



      $scope.setQuantite = (food) => {
        /*  var unite1 = ["cc/hl", "gr/hl", "g/hl"];
          var unite2 = ["l/hl", "kg/hl", "Unité/hl"];
          var unite3 = ["cc/ha", "gr/ha", "g/ha"];
          var unite4 = ["l/ha", "kg/ha"];
          try {
            var uniteselected = food.UniteDose.unite;
          } catch (e) {
            var uniteselected = "NaN";
          }
          var rQte_pest = 0;
          if (unite1.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * food.produit.Dose / 100000
          } else if (unite2.includes(uniteselected)) {
            rQte_pest = parseFloat(document.getElementById("LitrageTotal").value) * food.produit.Dose / 100
          } else if (unite3.includes(uniteselected)) {
            rQte_pest = $scope.getTotalSupTraiter() * food.produit.Dose / 1000
          } else if (unite4.includes(uniteselected)) {
            rQte_pest = $scope.getTotalSupTraiter() * food.produit.Dose
          }
          var unitePest = food.produit.unite;
          unitePest = unitePest.replace(/\s/g, '');
          if (unitePest.toLowerCase() == 'g') {
            rQte_pest = rQte_pest * 1000;
          }
          food.quantite = rQte_pest;
          return rQte_pest;*/
      }

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        $scope.operateursiIDS = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
          $scope.operateursiIDS += String(value.ID).concat(" ; ");
        })
      }

      $scope.getTotalDar = () => {
        $scope.TotalDar = 0;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.dar && $scope.TotalDar < parseFloat(value.produit.dar))
            $scope.TotalDar = parseFloat(value.produit.dar);
        })
        return $scope.TotalDar;
      }

      $scope.getTotalCoutEstime = () => {
        $scope.CoutEstime = 0;
        angular.forEach($scope.foodsProduit, function(value, key) {
          $scope.CoutEstime += value.produit.CMUP * value.produit.solde;
        })
        return parseFloat($scope.CoutEstime.toFixed(2));
      }


      $scope.checkfoodsParcelleData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsParcelle, function(value, key) {
          if ((!value.SupAtraiter || value.SupAtraiter === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkfoodsProduitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsProduit, function(value, key) {
          if ((!value.quantite || value.quantite === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkPrincipal = () => {
        var ifoundPrincipale = 0
        var ifoundNonPrincipale = 0
        angular.forEach($scope.foodsProduit, function(value, key) {
          if (value.produit.Principal) {
            ifoundPrincipale++;
          } else {
            ifoundNonPrincipale++;
          }
        });
        if (ifoundPrincipale == $scope.foodsProduit.length) {
          return 1
        } else if (ifoundNonPrincipale == $scope.foodsProduit.length) {
          return 2
        } else {
          return 3
        }
      }

      $scope.setPorcentageSup = (food) => {
        food.PorcentageSupAtraiter = parseFloat(((100 * food.SupAtraiter) / food.parcelle.Sup).toFixed(2));
        return food.PorcentageSupAtraiter
      }


      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();



        if ($scope.data.Ref_traitement && $scope.DateOrdre && $scope.Stade && $scope.TypeTraitement && $scope.Methode && $scope.Operation && $scope.foodsParcelle.length > 0 && parseFloat(document.getElementById("LitrageTotal").value) && $scope.foodsProduit.length > 0 && $scope.data.Responsable_technique && $scope.Salariesel.length > 0) {
          if ($scope.checkfoodsParcelleData()) {
            if ($scope.checkfoodsProduitData()) {

              pc.objEdit = {
                "ID": $scope.data.ID,
                "Reference": $scope.data.Ref_traitement,
                "DateOrdre": moment($scope.DateOrdre).format('YYYYMMDD'),
                "Stade": $scope.Stade,
                "TypeTraitement": $scope.TypeTraitement,
                "Methode": $scope.Methode,
                "Operation": $scope.Operation,
                "LitrageTotal": parseFloat(document.getElementById("LitrageTotal").value),
                "Responsable": ($scope.data.Responsable_technique) ? $filter('textforsqlserver')($scope.data.Responsable_technique) : "",
                "operateursNames": $scope.operateursNames,
                "foodsParcelle": $scope.foodsParcelle,
                "foodsProduit": $scope.foodsProduit,
                "NumeroObservation": $scope.NumeroObservation,
                "Tracteur": $scope.Tracteur,
                "OutilType": $scope.OutilType,
                "OutilAttelage": $scope.OutilAttelage,
                "Litrage": $scope.Litrage,
                "Contenance": ($scope.OutilAttelage) ? $scope.OutilAttelage.Contenance : 0,
                "NbrCuve": $scope.NbrCuve,
                "NbrCuveReel": $scope.NbrCuveReel,
                "Statut": $scope.Statut,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "TotalDar": $scope.TotalDar,
                "CoutEstime": $scope.CoutEstime,
                "TotalSupTraiter": $scope.TotalSupTraiter,
                "PorcentageTraiter": parseInt((100 * $scope.TotalSupTraiter) / $scope.TotalSup),
                "TotalSup": $scope.TotalSup,
                "Culture": $scope.foodsParcelle[$scope.foodsParcelle.length - 1].parcelle.VarieteNom,
                "QteTotal": $scope.QteTotal,
                "Article_Principale": $scope.checkPrincipal(),
                "Injection": $scope.Injection,
                "operateursiIDS": $scope.operateursiIDS
              }


              ordretraitementphytosanitaire.updateweb(pc.objEdit).then(async e => {
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
                  toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les quantités des produits")), {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les Superficies à traiter des parcelles")), {
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




    $scope.searchByEtat = function(type_text) {
      pc.dtInstance.DataTable.column(9).search(type_text).draw();
    };

    pc.delete = async function(c) {
      pc.IDordretraitementphytosanitaire = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ordretraitementphytosanitaire.delete({
              ID: pc.IDordretraitementphytosanitaire
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

  });