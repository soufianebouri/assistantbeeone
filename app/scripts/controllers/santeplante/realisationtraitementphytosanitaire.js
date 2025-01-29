'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteRealisationtraitementphytosanitaireCtrl
 * @description
 * # SanteplanteRealisationtraitementphytosanitaireCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteRealisationtraitementphytosanitaireCtrl', function($scope, translatedwords, $translatePartialLoader, parametretechnique, $filter, $translate, $window, DTOptionsBuilder, $mdDialog, ordretraitementphytosanitaire, GroupeOperationnel, Salaries, toastr, DTColumnBuilder, $q, $compile, realisationtraitementphytosanitaire, $state, DTDefaultOptions, $cookies, parcellecultural, savefilter) {
    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.realisationAction = toggleOne;
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

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

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddRealisationTraitement()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
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

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });


    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "PARCELLE_CULTURAL": [0],
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };


    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');


    //by parcelle cultural
    $scope.parcelle_change = function() {
      NProgress.start();
      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };



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
    $scope.updateDataRealisationTraitementPhyto = function(data) {
      return realisationtraitementphytosanitaire.getByFiltre(data);
    };
    $scope.getDataRealisation = [];
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataRealisationTraitementPhyto(pc.obj).then(function(res) {
          defer.resolve(res.data);
          $scope.getDataRealisation = res.data;
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
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go("realisationtraitementphytosanitairemap");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("fichesdesuividetraitementsphytosanitaire");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Fiches de suivi de traitements phytosanitaire"))
        }
      ].concat($scope.btnadd));
    $scope.Ref_traitement_first = "";

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ref_traitement').withTitle(translatedwords.getTranslatedWord($translate("N°Traitement"))).renderWith(function(data, type, full, meta) {
        return "<span class='badge-orange_withe'>" + full.Ref_traitement + "</span>";
      }),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date réalisation"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref_Parcelle_culturale').withTitle(translatedwords.getTranslatedWord($translate("Parcelle"))),
      DTColumnBuilder.newColumn('Heure_debut_traitement_parcele').withTitle(translatedwords.getTranslatedWord($translate("Heure début"))).renderWith(function(data, type, full, meta) {
        if (full.Heure_debut_traitement_parcele) {
          if (full.Heure_debut_traitement_parcele.length == 4) {
            return full.Heure_debut_traitement_parcele.slice(0, 2) + ":" + full.Heure_debut_traitement_parcele.slice(2);
          } else {
            return "";
          }
        } else {
          return "";
        }

      }),
      DTColumnBuilder.newColumn('heure_fin_traitement_parcele').withTitle(translatedwords.getTranslatedWord($translate("Heure fin"))).renderWith(function(data, type, full, meta) {
        if (full.heure_fin_traitement_parcele) {
          if (full.heure_fin_traitement_parcele.length == 4) {
            return full.heure_fin_traitement_parcele.slice(0, 2) + ":" + full.heure_fin_traitement_parcele.slice(2);
          } else {
            return "";
          }
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Bouille_realise').withTitle(translatedwords.getTranslatedWord($translate("Bouilie réalisée(L)"))).renderWith(function(data, type, full, meta) {
        if (full.Bouille_realise)
          return '<p align="right">' + full.Bouille_realise.toFixed(2) + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('MATERIEL').withTitle(translatedwords.getTranslatedWord($translate("Matériel"))),
      DTColumnBuilder.newColumn('OPERATEUR').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.realisationAction[data.ID] = data;
        return '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.realisationAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
      }).withOption('width', '5%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Add AddRealisationTraitement
    $scope.AddRealisationTraitement = function() {
      $mdDialog.show({
          controller: DialogControllerAddRealisationTraitement,
          templateUrl: '././views/templates/traitementphytosanitaire/AddAddRealisationTraitement.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddRealisationTraitement($scope, $mdDialog) {
      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $q.all([
        Salaries.getPersonnel_fertilisation({
          IDFermes: pc.IDferme
        }),
        realisationtraitementphytosanitaire.getAllOrdres(),
        realisationtraitementphytosanitaire.getAllLieuElimination()
      ]).then((values) => {
        NProgress.done();
        $scope.Salaries = values[0].data;
        $scope.Ordres = values[1].data;
        $scope.LieuEliminations = values[2].data;
        $scope.letmeclick = true;
      });

      $scope.Responsable = pc.User;
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateRealisation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.Metio = ['+', '++', '+++'];
      $scope.Fonddecuve = 0;

      $scope.numeroNumeroOrdre = function() {
        $scope.DateInstruction = moment(moment($scope.NumeroOrdre.DateInstruction).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
        $q.all([
          realisationtraitementphytosanitaire.getParcelleByOrdre({
            IDTraitement: $scope.NumeroOrdre.ID
          }),
          realisationtraitementphytosanitaire.getProduitByOrdre({
            IDTraitement: $scope.NumeroOrdre.ID
          }),
          realisationtraitementphytosanitaire.getAttelageByOrdre({
            IDTraitement: $scope.NumeroOrdre.ID
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Parcelles = values[0].data;
          $scope.foodsProduits = values[1].data;
          $scope.Attelages = values[2].data;
          $scope.foodsParcelles = [];
          angular.forEach($scope.Parcelles, function(value, key) {
            $scope.foodsParcelles.push({
              IDParcelle: value.Parcelle_culturale,
              Traitement: value.Traitement,
              checked: true,
              Ref: value.Ref,
              Sup: value.Sup,
              CumlBuilie: $scope.NumeroOrdre.BOUILLIE_estimee * value.Sup / $scope.NumeroOrdre.sup_Total,
              BuilieRealise: null,
              HeureDebut: null,
              HeureFin: null,
              Operateurs: $scope.NumeroOrdre.OPERATEUR,
              OperateursIDs: $scope.NumeroOrdre.ID_Personnel,
              Salariesel: [],
              Materiel: $scope.NumeroOrdre.SURVEILLANCERef
            });
          })
        });
      }



      $scope.$watch('BouillieRealisee', function(newValue, oldValue) {
        angular.forEach($scope.foodsParcelles, function(value, key) {
          value.BuilieRealise = parseFloat(($scope.BouillieRealisee * value.Sup / $scope.NumeroOrdre.sup_Total).toFixed(2));
        })
      });


      $scope.isINOperateur = function(ouvrier, IDS) {
        var ifoundIt = false;
        var res = IDS.split(" ; ");
        if (res.includes(String(ouvrier.ID)) && ifoundIt == false) {
          ifoundIt = true;
        }
        return ifoundIt;
      }


      $scope.SetOperateurs = (food) => {
        $scope.operateursNames = "";
        $scope.operateursiIDS = "";
        angular.forEach(food.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
          $scope.operateursiIDS += String(value.ID).concat(" ; ");
        })
        food.Operateurs = $scope.operateursNames;
        food.OperateursIDs = $scope.operateursiIDS;
      }

      $scope.setDRP = () => {
        if ($scope.NumeroOrdre && $scope.DateRealisation) {
          $scope.DRPFormated = '';
          var day = parseInt(($scope.NumeroOrdre.DAR) ? $scope.NumeroOrdre.DAR : 0);
          var dpr = moment($scope.DateRealisation).add(day, 'days');
          dpr = moment(moment(dpr).format('DD/MM/YYYY'))._i;
          $scope.DRPFormated = moment(moment(dpr, 'DD/MM/YYYY').format('YYYYMMDD'))._i;
          return dpr
        }
      }

      $scope.getTotalSupTraiter = () => {
        var newArray = _.filter($scope.foodsParcelles, function(elem) {
          return elem.checked == true;
        });
        $scope.TotalSupTraiter = parseFloat(_.sumBy(newArray, 'Sup').toFixed(2));
        return $scope.TotalSupTraiter;
      }

      $scope.getBouillieTotal = () => {
        $scope.BouillieTotal = parseFloat(_.sumBy($scope.foodsParcelles, 'BuilieRealise').toFixed(2));
        return $scope.BouillieTotal;
      }

      $scope.Fonddecuvechange = () => {
        if ($scope.Fonddecuve <= 0) {
          $scope.LieuElimination = null;
        }
      }

      $scope.setUnite = (food) => {
        if (food.unitedose) {
          var resunite = food.unitedose.split("/");
          food.unitedose = resunite[0];
          return resunite[0];
        }
      }


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

      $scope.checkfoodsParcelleData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsParcelles, function(value, key) {
          if (value.checked) {
            if ((!value.BuilieRealise || value.BuilieRealise === undefined) && ifoundIt) {
              ifoundIt = false;
            }
          }
        });
        return ifoundIt;
      }

      $scope.checkfoodsProduitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsProduits, function(value, key) {
          if ((!value.quantite || value.quantite === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkPrincipal = () => {
        var ifoundPrincipale = 0
        var ifoundNonPrincipale = 0
        angular.forEach($scope.foodsProduits, function(value, key) {
          if (value.Principal) {
            ifoundPrincipale++;
          } else {
            ifoundNonPrincipale++;
          }
        });
        if (ifoundPrincipale == $scope.foodsProduits.length) {
          return 1
        } else if (ifoundNonPrincipale == $scope.foodsProduits.length) {
          return 2
        } else {
          return 3
        }
      }

      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        parametretechnique.checkcloture({
          idferme: pc.IDferme,
          module: 'Technique',
          rubrique: 'Réalisation traitement phyto',
          dateaction: moment($scope.DateRealisation).format('YYYYMMDD')
        }).then(async respense => {
          if (respense.data.length == 0) {

            if ($scope.NumeroOrdre && $scope.DateRealisation && $scope.BouillieRealisee >= 0 && $scope.foodsParcelles.length > 0 && $scope.foodsProduits.length > 0 && $scope.Responsable) {
              if ($scope.BouillieRealisee > 0) {
                if ($scope.checkfoodsParcelleData()) {
                  if ($scope.checkfoodsProduitData()) {
                    pc.objAdd = {
                      "NumeroOrdre": $scope.NumeroOrdre,
                      "DateRealisation": moment($scope.DateRealisation).format('YYYYMMDD'),
                      "BouillieRealisee": $scope.BouillieRealisee,
                      "Responsable": ($scope.Responsable) ? $filter('textforsqlserver')($scope.Responsable) : "",
                      "foodsParcelle": $scope.foodsParcelles,
                      "foodsProduit": $scope.foodsProduits,
                      "Utilisateur": pc.User,
                      "IDFermes": pc.IDferme,
                      "IDUser": pc.IDUser,
                      "Temperature": $scope.Temperature,
                      "Humiditerelative": $scope.Humiditerelative,
                      "Vent": $scope.Vent,
                      "Fonddecuve": $scope.Fonddecuve,
                      "LieuElimination": $scope.LieuElimination,
                      "DRP": $scope.DRPFormated,
                      "Article_Principale": $scope.checkPrincipal(),
                    }



                    realisationtraitementphytosanitaire.createweb(pc.objAdd).then(async e => {
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
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les Bouillies réalisées des parcelles")), {
                    closeButton: true
                  });
                }
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Total Bouillie réalisée doit être supérieur à zéro")), {
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

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
              closeButton: true
            });
          }

        })



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
      parametretechnique.checkcloture({
        idferme: $cookies.getObject('globals').ferme.IDFerme,
        module: 'Technique',
        rubrique: 'Réalisation traitement phyto',
        dateaction: moment(c.DATE).format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          toastr.clear();
          toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer la Suppression de traitement N° ")) + c.Ref_traitement + ' .', {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {
              $("#confirmationRevertYes").click(function() {
                realisationtraitementphytosanitaire.delete({
                  ID: c.TRAITEMENT
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

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }
      })

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