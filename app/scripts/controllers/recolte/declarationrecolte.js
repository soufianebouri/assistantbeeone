'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteDeclarationrecolteCtrl
 * @description
 * # RecolteDeclarationrecolteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteDeclarationrecolteCtrl', function($rootScope, $scope, DTOptionsBuilder, translatedwords, declarationrecolte, $translatePartialLoader, $window, $filter, toastr, GroupeOperationnel, campagneagricole, DTColumnBuilder, $mdDialog, $translate, $q, $compile, expeditions, $state, DTDefaultOptions, $cookies, $templateCache) {
    var pc = this;
    pc.dtInstance = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    $scope._ = _;
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    pc.IDFERME = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    pc.hj_total = 0;
    pc.quantite_total = 0;
    pc.cout_total = 0;
    pc.montant_total = 0;
    pc.cout_total_parcelle = 0;
    pc.cout_total_centre = 0;
    pc.recoltes = [];
    $scope.hidePdf = true;

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Declaration_recolte'
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
      $(".selectpicker").selectpicker('refresh');
    }, 1000);

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
      "DOMAINE": pc.IDFERME,
      "DATE_DEBUT": moment($scope.date_fin).format('YYYYMMDD'),
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

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
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    $scope.type = "Type";

    //get data and refresh datatable
    $scope.getRecolte = function(data) {
      return declarationrecolte.getbyFiltre(data);
    };


    pc.showtable_toggle = function() {
      pc.showtable = true;
    }
    pc.Fax = '';
    //détails pointage
    pc.detailsrecolte = function(data) {
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, 1000);
      pc.recolteByID = data;
      pc.showtable = false;
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      declarationrecolte.getforDetailsByLivraisonID({
        "ID": pc.recolteByID.IDLivraison_Produit_rendement
      }).then(function(res) {
        pc.RecolteDateByID = res.data;
        pc.grandTotal = parseFloat(_.sumBy(pc.RecolteDateByID, 'Total').toFixed(2));
        NProgress.done();
      });

    }


    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddRecolte()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }
    pc.DeclareRecolte = {};
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.getRecolte(pc.obj).then(function(res) {
          defer.resolve(res.data);
          // formDeclarationData(res.data);
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
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
      })
      .withOption('initComplete', function() {
        // do what evrithing
      })
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-file-pdf-o'></i>",
          action: function(e, dt, node, config) {
            $state.go("suivirecolte_par_variete");

          },
          titleAttr: translatedwords.getTranslatedWord($translate("Suivi des récolte par variété"))
        },
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('BR').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('OBSERV').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(function(data, type, full, meta) {
        pc.DeclareRecolte[data.IDLivraison_Produit_rendement] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.DeclareRecolte[' + data.IDLivraison_Produit_rendement + '])" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.DeclareRecolte[' + data.IDLivraison_Produit_rendement + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.DeclareRecolte[' + data.IDLivraison_Produit_rendement + '])" )"=""><i class="fa fa-eye"></i></button>';
        return editbtn + dtailsBtn + deletebtn;
      }).withClass('nowraptd all').withOption('width', '5%')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            declarationrecolte.delete({
              ID: c.IDLivraison_Produit_rendement
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

    pc.detailsorder = function(data) {
      pc.RecolteDateByID = [];
      pc.detailsrecolte(data);
    }

    $scope.AddRecolte = function() {
      $mdDialog.show({
          controller: DialogControllerAddRecolte,
          templateUrl: '././views/templates/recolte/AddRecolte.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddRecolte($scope, $mdDialog) {
      $q.all([
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDFERME
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.letmeclick = true;
      });

      $scope.parcelleculturals = [];
      $scope.getParcellesByGO = () => {
        if ($scope.GroupeOperationnelsel.length > 0) {
          declarationrecolte.getAllParcelle({
            DOMAINE: pc.IDFERME,
            GroupeOp: $scope.GroupeOperationnelsel
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

      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateRecolte = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
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


      $scope.setTotal = function(food) {
        food.Total = food.Quantiteunite * food.PM_estime;
        return food.Total.toFixed(2);
      }

      $scope.setAllTotalTotal = function() {
        try {
          $scope.AllTotal = 0.00;
          if ($scope.parcelleculturals.length > 0)
            $scope.AllTotal = parseFloat(_.sumBy($scope.parcelleculturals, 'Total').toFixed(2));
          return $scope.AllTotal.toFixed(2);
        } catch (e) {
          return 0;

        }

      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }


      $scope.checkProduitLenght = function() {
        var ifoundIt = 0;
        angular.forEach($scope.parcelleculturals, function(value, key) {
          if (value.checkedChoise) {
            ifoundIt++;
          }
        });
        return ifoundIt;
      }

      $scope.checkProduitData = function(parcelleculturalscheched) {
        var ifoundIt = true;
        angular.forEach(parcelleculturalscheched, function(value, key) {
          if (((!value.Quantiteunite || value.Quantiteunite === null || Number.isNaN(value.Quantiteunite)) || (!value.PM_estime || value.PM_estime === null || Number.isNaN(value.PM_estime))) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateRecolte && $scope.Reference) {
          $scope.parcelleculturalscheched = $scope.parcelleculturals.filter(function(parc) {
            return (parc.checkedChoise == true);
          });
          if ($scope.parcelleculturalscheched.length > 0) {
            if ($scope.checkProduitData($scope.parcelleculturalscheched)) {
              pc.objAdd = {
                "DateRecolte": moment($scope.DateRecolte).format('YYYYMMDD'),
                "Reference": $scope.Reference,
                "Observation": $filter('textforsqlserver')($scope.Observation),
                "parcelleculturals": $scope.parcelleculturals.filter(function(parc) {
                  return (parc.checkedChoise == true);
                }),
                "AllTotal": $scope.AllTotal,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDFERME,
                "IDUser": pc.IDUser,
                "Code_compagne": ""
              }
              campagneagricole.getCodeCampagneByIDSocieteDate({
                "IDSOCIETE": pc.IDSociete,
                "DATE": moment($scope.DateVente).format('YYYYMMDD')
              }).then(async function(result) {
                NProgress.done();
                if (result.data.length > 0) {
                  pc.objAdd.Code_compagne = result.data[0].Code_compagne;
                  declarationrecolte.create(pc.objAdd).then(async e => {
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
                      if (e.data.includes("duplicate key")) {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce bon exist déjà !")), {
                          closeButton: true
                        });
                      } else {
                        toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0], {
                          closeButton: true
                        });
                      }
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

                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
                    closeButton: true
                  });
                  $scope.progress = false;
                }
              });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error("Veuillez renseigner les Quantités unités	et les Poids moyen (Kg)", {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner au moins un produit")), {
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

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }

    async function formDeclarationData(data) {
      var produits = [];
      var recoltes = [];
      data.map(d => {
        produits = [];
        declarationrecolte.getforDetailsByLivraisonID({
          "ID": d.IDLivraison_Produit_rendement
        }).then(function(res) {

          res.data.map(p => {
            produits.push({
              "Date": moment(d.Date).format("DD-MM-YYYY"),
              "Produit": p.Designation,
              "nbrCaisses": p.Quantiteunite,
              "Parcelle": p.Ref,
              "Observation": d.OBSERV

            })
          })
          recoltes.push(produits)

        });




      })

      //$rootScope.declarationrecolte = recoltes;
    }

    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditRecolte,
          templateUrl: '././views/templates/recolte/EditRecolte.html',
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
    function DialogControllerEditRecolte($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.DateRecolte = ($scope.data.Date) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;
      $scope.Reference = $scope.data.BR;
      $scope.Observation = $scope.data.OBSERV;
      $q.all([
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDFERME
        }),
        declarationrecolte.getDetailsByID({
          ID: $scope.data.IDLivraison_Produit_rendement
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.parcelleculturals = values[1].data;
        $scope.letmeclick = true;
      });

      $scope.getParcellesByGO = () => {
        if ($scope.GroupeOperationnelsel.length > 0) {
          declarationrecolte.getAllParcelle({
            DOMAINE: pc.IDFERME,
            GroupeOp: $scope.GroupeOperationnelsel
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
      }


      $scope.setTotal = function(food) {
        food.Total = food.Quantiteunite * food.PM_estime;
        return food.Total.toFixed(2);
      }

      $scope.setAllTotalTotal = function() {
        try {
          $scope.AllTotal = 0.00;
          if ($scope.parcelleculturals.length > 0)
            $scope.AllTotal = parseFloat(_.sumBy($scope.parcelleculturals, 'Total').toFixed(2));
          return $scope.AllTotal.toFixed(2);
        } catch (e) {
          return 0;
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


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.checkProduitData = function(parcelleculturalscheched) {
        var ifoundIt = true;
        angular.forEach(parcelleculturalscheched, function(value, key) {
          if (((!value.Quantiteunite || value.Quantiteunite === null || Number.isNaN(value.Quantiteunite)) || (!value.PM_estime || value.PM_estime === null || Number.isNaN(value.PM_estime))) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateRecolte && $scope.Reference) {
          $scope.parcelleculturalscheched = $scope.parcelleculturals.filter(function(parc) {
            return (parc.checkedChoise == true);
          });
          if ($scope.parcelleculturalscheched.length > 0) {
            if ($scope.checkProduitData($scope.parcelleculturalscheched)) {
              pc.objEdit = {
                "ID": $scope.data.IDLivraison_Produit_rendement,
                "DateRecolte": moment($scope.DateRecolte).format('YYYYMMDD'),
                "Reference": $scope.Reference,
                "Observation": $filter('textforsqlserver')($scope.Observation),
                "parcelleculturals": $scope.parcelleculturals.filter(function(parc) {
                  return (parc.checkedChoise == true);
                }),
                "AllTotal": $scope.AllTotal,
                "Code_compagne": ""
              }
              campagneagricole.getCodeCampagneByIDSocieteDate({
                "IDSOCIETE": pc.IDSociete,
                "DATE": moment($scope.DateVente).format('YYYYMMDD')
              }).then(async function(result) {
                NProgress.done();
                if (result.data.length > 0) {
                  pc.objEdit.Code_compagne = result.data[0].Code_compagne;
                  declarationrecolte.update(pc.objEdit).then(async e => {
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
                      if (e.data.includes("duplicate key")) {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce bon exist déjà !")), {
                          closeButton: true
                        });
                      } else {
                        toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0], {
                          closeButton: true
                        });
                      }
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

                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
                    closeButton: true
                  });
                  $scope.progress = false;
                }
              });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error("Veuillez renseigner les Quantités unités	et les Poids moyen (Kg)", {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner au moins un produit")), {
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



      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }



    $scope.searchByType = function(type_text) {
      pc.dtInstance.DataTable.search(type_text).draw();
    };


    pc.printdetails = function(recolteByID) {
      pc.Code_compagne_exp = "";
      campagneagricole.CheckCodeCompagnebyTwoDates({
        date_debut: moment(recolteByID.Date).format('YYYYMMDD'),
        IDSOCIETE: pc.IDSociete
      }).then(e => {
        if (e.data.length > 0) {
          try {
            pc.Code_compagne_exp = e.data[0].Code_compagne;
          } catch (e) {
            pc.Code_compagne_exp = "";
          }
        }
        NProgress.done();
        var type = "";
        var daterecolt = "";

        if (recolteByID.Date) {
          daterecolt = moment(recolteByID.Date).format('DD/MM/YYYY');
        }

        var w = 1000;
        var h = 1000;
        var left = Number((screen.width / 2) - (w / 2));
        var tops = Number((screen.height / 2) - (h / 2));

        var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

        //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('</head><body >');
        //header


        mywindow.document.write('<br/>');

        mywindow.document.write('<center>DÉCLARATION DE LA RÉCOLTE - STATION</center>' +
          '<center>N° : .......... / ' + pc.Code_compagne_exp + '</center>' +
          '<center>Date : ' + daterecolt + '</center>' +
          '<bn>' +
          '<span style="float: left">Domaine : ' + pc.NomFerme + '' +
          '</bn>'
        );


        mywindow.document.write('<br/>');

        mywindow.document.write('<table border="1"  style="width:100%;" >' +
          '<tr>' +
          '<td style="background:#e0e0e0;">Date</td>' +
          '<td>' + daterecolt + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td style="background:#e0e0e0;">Référence</td>' +
          '<td>' + recolteByID.BR + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td style="background:#e0e0e0;height:60px;">Observation</td>' +
          '<td>' + ((recolteByID.OBSERV) ? recolteByID.OBSERV : '') + '</td>' +
          '</tr>' +
          '</table>');

        mywindow.document.write('<br/>');
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_66").innerHTML);


        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');


        mywindow.document.write('<br/>');
        //fert infos

        //mywindow.document.write(document.getElementById("sss").innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
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


  });