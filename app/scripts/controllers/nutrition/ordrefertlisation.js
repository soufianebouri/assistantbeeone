'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionOrdrefertlisationCtrl
 * @description
 * # NutritionOrdrefertlisationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionOrdrefertlisationCtrl', function($scope, translatedwords, $translate, $window, $translatePartialLoader, DTOptionsBuilder, DTColumnBuilder, $q, toastr, Salaries, GroupeOperationnel, parcellecultural, sousparcelle, secteurirrigation, _url, solutionmere, bac, Bloc, engrais, OperationService, $compile, ordrefertlisation, $filter, BilanNutritionnel, $state, DTDefaultOptions, $cookies, savefilter, $mdDialog) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    pc.mode_fert = 1;
    pc.ordrefertlisationAction = {};
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    $scope.currentNavItem = 'ordrefertlisation';
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
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
      "DOMAINE": pc.IDferme,
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
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      //Save to filter service
      savefilter.setFilters(pc.obj);
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
      //Save to filter service
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
    };

    $scope.type = "Type";

    //get data and refresh datatable
    $scope.updateDataOrderFertilisation = function(data) {
      return ordrefertlisation.getByFiltre(data);
    };

    //détails ordre
    pc.detailsorder = function(data) {
      pc.ordrefertlisationdetails = [];
      pc.parcelles = [];
      pc.secteurs = [];
      pc.engrais = [];
      pc.ordreFertilisationByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      if (pc.ordreFertilisationByID.Type == 1) {
        //Fertigation
        ordrefertlisation.getByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.ordrefertlisationdetails = res.data;
          NProgress.done();
        });

        ordrefertlisation.getSecteurByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.secteurs = res.data;
          NProgress.done();
        });

        ordrefertlisation.getEngraisByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.engrais = res.data;
          NProgress.done();
        });
      } else {
        ordrefertlisation.getParcelleByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.parcelles = res.data;
          NProgress.done();
        });

        ordrefertlisation.getEngraisByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.engrais = res.data;
          NProgress.done();
        });
      }


    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }




    pc.dtOptions = DTOptionsBuilder.fromFnPromise(async function() {
        var defer = $q.defer();
        BilanNutritionnel.getmodefert({
          FERME: pc.IDferme
        }).then(async dt => {
          pc.mode_fert = dt.data[0].Mode_fert;
          await pc.getOrder(defer);
        })
        return defer.promise;
      })
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
          extend: 'collection',
          text: "TYPE <i class='fa fa-chevron-down'></i>",
          buttons: [{
              text: "Tous",
              action: function(e, dt, node, config) {
                $scope.searchByType("");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Fertigation")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Fertigation");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Epandage")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Epandage");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Apport foliaire")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Apport foliaire");
              },
              className: 'SetSize'
            }
          ]
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
          title: '',
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer")),
          autoPrint: true
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            (pc.mode_fert == 1) ? $scope.AddAvancer(): $scope.AddSimple()
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type de fertigation"))).renderWith(function(data, type, full, meta) {
        if (full.Type == 1) {
          return "<span class='badge-green_withe'>Fertigation</span>";
        } else if (full.Type == 2) {
          return "<span class='badge-orange_withe'>Epandage</span>";
        } else if (full.Type == 3) {
          return "<span class='badge-blue-unclear_withe'>Apport foliaire</span>";
        } else {
          return "";
        }
      }).withOption('width', '12%'),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("N°Ordre"))).withOption('width', '9%'),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }).withOption('width', '12%'),
      DTColumnBuilder.newColumn('Valide').withTitle(translatedwords.getTranslatedWord($translate("Validé"))).renderWith(function(data, type, full, meta) {
        if (full.Valide) {
          return '<i class="fa fa-check"></i>';
        } else {
          return '<i class="fa fa-remove"></i>';
        }
      }).withOption('width', '5%'),
      DTColumnBuilder.newColumn('OpeRef_Intitule').withTitle(translatedwords.getTranslatedWord($translate("Opération"))).withOption('width', '20%'),
      DTColumnBuilder.newColumn('Responsable').withTitle(translatedwords.getTranslatedWord($translate("Responsable technique"))).withOption('width', '12%'),
      DTColumnBuilder.newColumn('OPERATEUR').withTitle(translatedwords.getTranslatedWord($translate("Opérateur de station"))).withOption('width', '10%').renderWith(function(data, type, full, meta) {
        if (full.OPERATEUR != '0')
          return full.OPERATEUR;
        return '';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').withOption('width', '5%').renderWith(actionsHtml)
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      pc.ordrefertlisationAction[data.ID] = data;
      var editbtn = (pc.mode_fert == 1) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editAvancer(pc.ordrefertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>' : '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editSimple(pc.ordrefertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>';

      return '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.ordrefertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>' + editbtn +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ordrefertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }


    pc.getOrder = function(d) {
      return ordrefertlisation.getByFiltre(pc.obj).then(function(result) {
        NProgress.done();
        NProgress.remove();
        d.resolve(result.data);
      });
    }


    //Add simplifier
    $scope.AddSimple = function() {
      $q.all([GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        }),
        ordrefertlisation.getlastRef({
          IDFermes: pc.IDferme
        }),
        BilanNutritionnel.getmodefert({
          FERME: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.parcelleculturals = values[1].data;
        $scope.engrais = values[2].data;
        $scope.lastRef = values[3].data;
        $scope.modefer = values[4].data;
        $scope.showAdvancedAddSimple("ev", $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.engrais, $scope.lastRef, $scope.modefer);
      });
    }

    //Add simplifier
    $scope.showAdvancedAddSimple = function(ev, GroupeOperationnels, parcelleculturals, engrais, lastRef, modefer) {
      $mdDialog.show({
          controller: DialogControllerAddSimple,
          templateUrl: '././views/templates/fertilisation/AddOrdreFertilisationSimple.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            engrais: engrais,
            lastRef: lastRef,
            modefer: modefer
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add simplifier
    function DialogControllerAddSimple($scope, $mdDialog, GroupeOperationnels, parcelleculturals, engrais, lastRef, modefer) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.engrais = engrais;
      $scope.lastRef = lastRef;
      $scope.modefer = modefer;
      $scope.Mode_fert_ha = $scope.modefer[0].Mode_fert_ha;
      $scope.foods = [];
      $scope.foodsEngais = [];

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      if ($scope.lastRef.length > 0) {
        $scope.Reference = "OF-" + pad(parseInt($scope.lastRef[0].Reference.match(/\d+/)) + 1, 6);
      } else {
        $scope.Reference = "OF-" + pad(1, 6);
      }

      $scope.GetOtherReference = function() {
        ordrefertlisation.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "OF-" + pad(parseInt(e.data[0].Reference.match(/\d+/)) + 1, 6);
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


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.notInEngrais = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
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
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.RetirerEngrais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngais.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }


      $scope.setFoods = function() {
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup,
          Volume: null
        })
      }

      $scope.setFoodsEngrais = function() {
        $scope.foodsEngais.push({
          engrais: $scope.engraissel,
          quantite: null,
          dose: null
        })
      }

      $scope.getSumSup = () => {
        return parseFloat(_.sumBy($scope.foods, 'parcelleSup').toFixed(2))
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

      $scope.AjouterSimple = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Reference && $scope.datefertilisation && $scope.foods.length > 0 && $scope.foodsEngais.length > 0) {
          if ($scope.foods[0].Volume != null && $scope.foodsEngais[0].quantite != null) {
            pc.objAdd = {
              "Reference": $scope.Reference,
              "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
              "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "Code_compagne": "",
              "SupTotal": $scope.getSumSup(),
              "fertilisationParcelle": $scope.foods,
              "fertilisationEngrais": $scope.foodsEngais,
              "Mode_fert_ha": $scope.Mode_fert_ha
            }

            ordrefertlisation.createwebsimple(pc.objAdd).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins un engrais")), {
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


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit simplifier
    pc.editSimple = function(data) {
      $q.all([GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        }),
        ordrefertlisation.getSecteur_parcelle({
          ID: data.ID
        }),
        ordrefertlisation.getFert_Engrais({
          ID: data.ID
        }),
        BilanNutritionnel.getmodefert({
          FERME: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.GroupeOperationnels = values[0].data;
        $scope.parcelleculturals = values[1].data;
        $scope.engrais = values[2].data;
        $scope.Secteur_parcelle = values[3].data;
        $scope.Fert_Engrais = values[4].data;
        $scope.modefer = values[5].data;
        $scope.showAdvancedEditSimple("ev", data, $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.engrais, $scope.Secteur_parcelle, $scope.Fert_Engrais, $scope.modefer);
      });
    }

    //edit simplifier
    $scope.showAdvancedEditSimple = function(ev, data, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais, modefer) {
      $mdDialog.show({
          controller: DialogControllerEditSimple,
          templateUrl: '././views/templates/fertilisation/EditOrdreFertilisationSimple.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            engrais: engrais,
            Secteur_parcelle: Secteur_parcelle,
            Fert_Engrais: Fert_Engrais,
            modefer: modefer
          }
        })
        .then(function(answer) {}, function() {});
    }

    //edit simplifier
    function DialogControllerEditSimple($scope, $mdDialog, data, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais, modefer) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.engrais = engrais;
      $scope.Secteur_parcelle = Secteur_parcelle;
      $scope.Fert_Engrais = Fert_Engrais;
      $scope.modefer = modefer;
      $scope.Mode_fert_ha = $scope.modefer[0].Mode_fert_ha;
      $scope.foods = [];
      $scope.foodsEngais = [];

      $scope.datefertilisation = ($scope.data.DATE) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.isIn = async function(ID) {
        var i = false;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.notInEngrais = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.ParcelleisIN = function(IDParcelle) {
        var i = false;
        angular.forEach($scope.Secteur_parcelle, function(value, key) {
          if (value.parcelle_id === IDParcelle && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.EngraisisIN = function(IDEngrais) {
        var i = false;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais === IDEngrais && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.RetirerEngrais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngais.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        var Volume = null;
        angular.forEach($scope.Secteur_parcelle, function(value, key) {
          if (value.parcelle_id == $scope.parcelleculturalsel.ID) {
            Volume = parseFloat(value.volume_ordre);
          }
        })
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup,
          Volume: Volume
        });
      }

      $scope.setFoodsEngrais = function() {
        var quantite = null;
        var dose = null;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais == $scope.engraissel.IDEngrais) {
            quantite = ($scope.Mode_fert_ha) ? parseFloat(value.Qte_Ordre_HA) : parseFloat(value.Qte_Ordre);
            dose = parseFloat(value.Dose);
          }
        })
        $scope.foodsEngais.push({
          engrais: $scope.engraissel,
          quantite: quantite,
          dose: dose
        });
      }

      $scope.getSumSup = () => {
        return parseFloat(_.sumBy($scope.foods, 'parcelleSup').toFixed(2))
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

      $scope.ModifierSimple = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.foods.length > 0 && $scope.foodsEngais.length > 0) {
          if ($scope.foods[0].Volume != null && $scope.foodsEngais[0].quantite != null) {
            pc.objAdd = {
              "ID": $scope.data.ID,
              "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
              "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
              "SupTotal": $scope.getSumSup(),
              "fertilisationParcelle": $scope.foods,
              "fertilisationEngrais": $scope.foodsEngais,
              "Mode_fert_ha": $scope.Mode_fert_ha
            }
            ordrefertlisation.updatewebsimple(pc.objAdd).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir au moins un engrais")), {
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


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //Add avancer
    $scope.AddAvancer = function() {
      $q.all([
        ordrefertlisation.getlastRef({
          IDFermes: pc.IDferme
        }),
        solutionmere.getSolutionMereByFerme({
          DOMAINE: pc.IDferme
        }),
        OperationService.getOperationByFerme(_url, pc.IDferme),
        sousparcelle.byferme({
          IDFermes: pc.IDferme
        }),
        Salaries.getPersonnel_fertilisation({
          IDFermes: pc.IDferme
        }),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        engrais.showbyferme({
          IDFermes: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.lastRef = values[0].data;
        $scope.SolutionMeres = values[1].data;
        $scope.Operations = values[2].data;
        $scope.sousparcelles = values[3].data;
        $scope.Salaries = values[4].data;
        $scope.GroupeOperationnels = values[5].data;
        $scope.parcelleculturals = values[6].data;
        $scope.engrais = values[7].data;
        $scope.showAdvancedAddAvancer("ev", $scope.lastRef, $scope.SolutionMeres, $scope.Operations, $scope.sousparcelles, $scope.Salaries, $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.engrais);
      });
    }

    //Add Avancer
    $scope.showAdvancedAddAvancer = function(ev, lastRef, SolutionMeres, Operations, sousparcelles, Salaries, GroupeOperationnels, parcelleculturals, engrais) {
      $mdDialog.show({
          controller: DialogControllerAddAvancer,
          templateUrl: '././views/templates/fertilisation/AddOrdreFertilisationAvancer.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            lastRef: lastRef,
            SolutionMeres: SolutionMeres,
            Operations: Operations,
            sousparcelles: sousparcelles,
            Salaries: Salaries,
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            engrais: engrais
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add Avancer
    function DialogControllerAddAvancer($scope, $mdDialog, lastRef, SolutionMeres, Operations, sousparcelles, Salaries, GroupeOperationnels, parcelleculturals, engrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.datefertilisation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.lastRef = lastRef;
      $scope.SolutionMeres = SolutionMeres;
      $scope.Operations = Operations;
      $scope.sousparcelles = sousparcelles;
      $scope.Salaries = Salaries;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.engrais = engrais;
      $scope.foods = [];
      $scope.foodsEngais = [];
      $scope.type = 1;
      $scope.operateursNames = "";
      $scope.onTabSelected = function(type) {
        $scope.type = type;
        $scope.foods = [];
        $scope.foodsEngais = [];
        $scope.foodsEngaisEpandage = [];
        $scope.foodsParcelleEpandage = [];
        $scope.foodsParcelleApportFoliaire = [];
        $scope.foodsParcelleApportFoliaire = [];
        $scope.SolutionMere = null;
        $scope.parcelleculturalsel = null;
        $scope.engraissel = null;
      }

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      if ($scope.lastRef.length > 0) {
        $scope.Reference = "OF-" + pad(parseInt($scope.lastRef[0].Reference.match(/\d+/)) + 1, 6);
      } else {
        $scope.Reference = "OF-" + pad(1, 6);
      }

      $scope.GetOtherReference = function() {
        ordrefertlisation.getlastRef({
          IDFermes: pc.IDferme
        }).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = "OF-" + pad(parseInt(e.data[0].Reference.match(/\d+/)) + 1, 6);
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

      $scope.change_getSolutionMereEngrais = function() {
        solutionmere.getSolutionMereEngraisForFertigation({
          ID: $scope.SolutionMere.ID
        }).then(e => {
          $scope.SolutionMereEngrais = e.data;
          NProgress.done();

          secteurirrigation.getallbyBloc({
            IDbloc: $scope.SolutionMere.Bloc
          }).then(e => {
            $scope.Secteurs = e.data;
            NProgress.done();
            $scope.foods = [];
            $scope.foods.push({
              Bac: $scope.SolutionMere.Bac,
              BacName: $scope.SolutionMere.BacName,
              Bloc: $scope.SolutionMere.Bloc,
              BLOCName: $scope.SolutionMere.BLOCName,
              VolumeUtiliser: $scope.SolutionMere.VI,
              VolumeDisponible: $scope.SolutionMere.VI,
              engrais: $scope.SolutionMereEngrais,
              secteurs: $scope.Secteurs
            })
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
            $scope.SolutionMere = null;
            $scope.foods = [];
          });

        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
          $scope.SolutionMere = null;
          $scope.foods = [];
        });
      }


      $scope.checkafood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.VolumeUtiliser == null && value.VolumeDisponible == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkafoodEngrais = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          angular.forEach(value.engrais, async function(valueE, key) {
            if (valueE.QantiteOrdre == null && valueE.Qantite == null && ifoundIt == true) {
              ifoundIt = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Aucun engrais trouvé ! ")), {
                closeButton: true
              });
            }
          });
        });
        return ifoundIt;
      }

      $scope.checkafoodSecteurs = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          angular.forEach(value.secteurs, async function(valueS, key) {
            if (valueS.Volume == null && ifoundIt == true) {
              ifoundIt = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Aucun secteurs trouvé ! ")), {
                closeButton: true
              });
            }
          });
        });
        return ifoundIt;
      }

      $scope.SetVolume = function(index) {
        var Volume = 0;
        Volume = $scope.foods[0].VolumeUtiliser * $scope.foods[0].secteurs[index].Superficie / _.sumBy($scope.foods[0].secteurs, 'Superficie');
        if (Volume) {
          $scope.foods[0].secteurs[index].Volume = parseFloat(Volume.toFixed(3))
        } else {
          $scope.foods[0].secteurs[index].Volume = null;
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

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
        })
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }


      //Type 2 Epandage
      $scope.foodsParcelleEpandage = [];

      $scope.setFoodsParcelleEpandage = function() {
        $scope.foodsParcelleEpandage.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup
        })
      }


      $scope.getSumSupParcelleEpandage = () => {
        return parseFloat(_.sumBy($scope.foodsParcelleEpandage, 'parcelleSup').toFixed(2))
      }

      $scope.notInParcelleEpandage = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsParcelleEpandage, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerParcelleEpandage = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsParcelleEpandage.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
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

      $scope.foodsEngaisEpandage = [];

      $scope.setFoodsEngraisEpandage = function() {
        $scope.foodsEngaisEpandage.push({
          engrais: $scope.engraissel,
          quantite: null
        })
      }

      $scope.notInEngraisEpandage = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngaisEpandage, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerEngraisEpandage = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de l'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngaisEpandage.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }


      //Type 3 Apport foliaire
      $scope.foodsParcelleApportFoliaire = [];

      $scope.setFoodsParcelleApportFoliaire = function() {
        $scope.foodsParcelleApportFoliaire.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup
        })
      }


      $scope.getSumSupParcelleApportFoliaire = () => {
        return parseFloat(_.sumBy($scope.foodsParcelleApportFoliaire, 'parcelleSup').toFixed(2))
      }

      $scope.notInParcelleApportFoliaire = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsParcelleApportFoliaire, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerParcelleApportFoliaire = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsParcelleApportFoliaire.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
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

      $scope.foodsEngaisApportFoliaire = [];

      $scope.setFoodsEngraisApportFoliaire = function() {
        $scope.foodsEngaisApportFoliaire.push({
          engrais: $scope.engraissel,
          quantite: null
        })
      }

      $scope.notInEngraisApportFoliaire = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngaisApportFoliaire, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.RetirerEngraisApportFoliaire = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de l'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngaisApportFoliaire.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }

      //add click
      $scope.AjouterAvancer = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Reference && $scope.datefertilisation && $scope.SolutionMere && $scope.Responsable && $scope.operateursNames && $scope.Operation && $scope.foods.length > 0 && $scope.checkafood && $scope.checkafoodEngrais && $scope.checkafoodSecteurs) {

          if ($scope.foods[0].VolumeUtiliser <= $scope.foods[0].VolumeDisponible) {


            pc.objAdd = {
              "Reference": $scope.Reference,
              "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
              "Responsable": ($scope.Responsable) ? $filter('textforsqlserver')($scope.Responsable) : "",
              "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
              "OperateurIDs": $scope.Salariesel,
              "Operation": $scope.Operation,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDferme,
              "SolutionMere": $scope.SolutionMere,
              "fertilisationEngraisSecteur": $scope.foods
            }

            ordrefertlisation.createwebavancer(pc.objAdd).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Volume Utilisé doit inferieur ou égal au Volume Disponible !")), {
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

      $scope.checkafoodEngaisEpandage = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsEngaisEpandage, function(value, key) {
          if (value.quantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.AjouterAvancerEpandage = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Reference && $scope.datefertilisation && $scope.Responsable && $scope.operateursNames && $scope.Operation && $scope.foodsEngaisEpandage.length > 0 && $scope.foodsParcelleEpandage.length > 0 && $scope.checkafoodEngaisEpandage()) {

          pc.objAdd = {
            "Reference": $scope.Reference,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Responsable": ($scope.Responsable) ? $filter('textforsqlserver')($scope.Responsable) : "",
            "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "OperateurIDs": $scope.Salariesel,
            "Operation": $scope.Operation,
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "sup_Total": $scope.getSumSupParcelleEpandage(),
            "fertilisationParcelle": $scope.foodsParcelleEpandage,
            "fertilisationEngrais": $scope.foodsEngaisEpandage
          }

          ordrefertlisation.createwebavancerepandage(pc.objAdd).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };

      $scope.checkafoodEngaisApportFoliaire = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsEngaisApportFoliaire, function(value, key) {
          if (value.quantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.AjouterAvancerApportFoliaire = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.Reference && $scope.datefertilisation && $scope.Bouillie && $scope.Responsable && $scope.operateursNames && $scope.Operation && $scope.foodsEngaisApportFoliaire.length > 0 && $scope.foodsParcelleApportFoliaire.length > 0 && $scope.checkafoodEngaisApportFoliaire()) {

          pc.objAdd = {
            "Reference": $scope.Reference,
            "Bouillie": $scope.Bouillie,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Responsable": ($scope.Responsable) ? $filter('textforsqlserver')($scope.Responsable) : "",
            "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "OperateurIDs": $scope.Salariesel,
            "Operation": $scope.Operation,
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "sup_Total": $scope.getSumSupParcelleApportFoliaire(),
            "fertilisationParcelle": $scope.foodsParcelleApportFoliaire,
            "fertilisationEngrais": $scope.foodsEngaisApportFoliaire
          }

          ordrefertlisation.createwebavancerapportfoliaire(pc.objAdd).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };

      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }


    //Edit avancer
    pc.editAvancer = function(data) {
      if (data.Type == 1) {
        $q.all([
          OperationService.getOperationByFerme(_url, pc.IDferme),
          sousparcelle.byferme({
            IDFermes: pc.IDferme
          }),
          Salaries.getPersonnel_fertilisation({
            IDFermes: pc.IDferme
          }),
          ordrefertlisation.getFertilisation_SolutionAvancer({
            ID: data.ID
          }),
          ordrefertlisation.getFerti_PersonAvancer({
            ID: data.ID
          }),
          ordrefertlisation.getFert_EngraisAvancer({
            ID: data.ID
          }),
          ordrefertlisation.getFert_sect_SecteurAvancer({
            ID: data.ID
          }),
          ordrefertlisation.getFert_sect_SousParcelleAvancer({
            ID: data.ID
          }),
          solutionmere.getSolutionMereByFerme({
            DOMAINE: pc.IDferme
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Operations = values[0].data;
          $scope.sousparcelles = values[1].data;
          $scope.Salaries = values[2].data;
          $scope.SolutionAvancer = values[3].data;
          $scope.PersonAvancer = values[4].data;
          $scope.EngraisAvancer = values[5].data;
          $scope.SecteurAvancer = values[6].data;
          $scope.SousParcelleAvancer = values[7].data;
          $scope.SolutionMeres = values[8].data;
          $scope.showAdvancedEditAvancer("ev", data, $scope.Operations, $scope.sousparcelles, $scope.Salaries, $scope.SolutionAvancer, $scope.PersonAvancer, $scope.EngraisAvancer, $scope.SecteurAvancer, $scope.SousParcelleAvancer, $scope.SolutionMeres);
        });
      } else if (data.Type == 2 || data.Type == 3) {
        $q.all([
          OperationService.getOperationByFerme(_url, pc.IDferme),
          Salaries.getPersonnel_fertilisation({
            IDFermes: pc.IDferme
          }),
          ordrefertlisation.getFerti_PersonAvancer({
            ID: data.ID
          }),
          GroupeOperationnel.getGroupeOperationnelByFerme({
            idferme: pc.IDferme
          }),
          parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
          engrais.showbyferme({
            IDFermes: pc.IDferme
          }),
          ordrefertlisation.getSecteur_parcelle({
            ID: data.ID
          }),
          ordrefertlisation.getFert_Engrais({
            ID: data.ID
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Operations = values[0].data;
          $scope.Salaries = values[1].data;
          $scope.PersonAvancer = values[2].data;
          $scope.GroupeOperationnels = values[3].data;
          $scope.parcelleculturals = values[4].data;
          $scope.engrais = values[5].data;
          $scope.Secteur_parcelle = values[6].data;
          $scope.Fert_Engrais = values[7].data;
          if (data.Type == 2) {
            $scope.showAdvancedEditAvancerEpandage("ev", data, $scope.Operations, $scope.Salaries, $scope.PersonAvancer, $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.engrais, $scope.Secteur_parcelle, $scope.Fert_Engrais);
          } else if (data.Type == 3) {
            $scope.showAdvancedEditAvancerApportFoliaire("ev", data, $scope.Operations, $scope.Salaries, $scope.PersonAvancer, $scope.GroupeOperationnels, $scope.parcelleculturals, $scope.engrais, $scope.Secteur_parcelle, $scope.Fert_Engrais);
          }
        });
      } else if (data.Type == 3) {

      }

    }

    //Edit Avancer Fertigation
    $scope.showAdvancedEditAvancer = function(ev, data, Operations, sousparcelles, Salaries, SolutionAvancer, PersonAvancer, EngraisAvancer, SecteurAvancer, SousParcelleAvancer, SolutionMeres) {
      $mdDialog.show({
          controller: DialogControllerEditAvancer,
          templateUrl: '././views/templates/fertilisation/EditOrdreFertilisationAvancer.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            Operations: Operations,
            sousparcelles: sousparcelles,
            Salaries: Salaries,
            SolutionAvancer: SolutionAvancer,
            PersonAvancer: PersonAvancer,
            EngraisAvancer: EngraisAvancer,
            SecteurAvancer: SecteurAvancer,
            SousParcelleAvancer: SousParcelleAvancer,
            SolutionMeres: SolutionMeres
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Edit Avancer Fertigation
    function DialogControllerEditAvancer($scope, data, $mdDialog, Operations, sousparcelles, Salaries, SolutionAvancer, PersonAvancer, EngraisAvancer, SecteurAvancer, SousParcelleAvancer, SolutionMeres) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.Operations = Operations;
      $scope.sousparcelles = sousparcelles;
      $scope.Salaries = Salaries;
      $scope.SolutionAvancer = SolutionAvancer;
      $scope.PersonAvancer = PersonAvancer;
      $scope.EngraisAvancer = EngraisAvancer;
      $scope.SecteurAvancer = SecteurAvancer;
      $scope.SousParcelleAvancer = SousParcelleAvancer;
      $scope.SolutionMeres = SolutionMeres;
      $scope.foods = [];
      $scope.foodsEngais = [];
      $scope.type = 1;
      $scope.typeSelected = 0;
      $scope.operateursNames = "";

      $scope.datefertilisation = ($scope.data.DATE) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;


      $scope.isINOperateur = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.PersonAvancer, function(value, key) {
          if (value.ID_pers == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }

      $scope.SousParcelleisIN = function(IDsP) {
        var i = false;
        angular.forEach($scope.SousParcelleAvancer, function(value, key) {
          if (parseInt(value.parcelle_id) === IDsP && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.change_getSolutionMereEngrais = function() {
        $scope.foods = [];
        $scope.foods.push({
          Bac: $scope.SolutionMere.Bac,
          BacName: $scope.SolutionMere.BacName,
          Bloc: $scope.SolutionMere.Bloc,
          BLOCName: $scope.SolutionMere.BLOCName,
          VolumeUtiliser: $scope.SolutionAvancer[0].Volume_utilise_ordre,
          VolumeDisponible: $scope.SolutionAvancer[0].VOLUME_DISPO,
          engrais: $scope.EngraisAvancer,
          secteurs: $scope.SecteurAvancer
        })
      }

      $scope.checkafood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.VolumeUtiliser == null && value.VolumeDisponible == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkafoodEngrais = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          angular.forEach(value.engrais, async function(valueE, key) {
            if (valueE.QantiteOrdre == null && valueE.Qantite == null && ifoundIt == true) {
              ifoundIt = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Aucun engrais trouvé ! ")), {
                closeButton: true
              });
            }
          });
        });
        return ifoundIt;
      }

      $scope.checkafoodSecteurs = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          angular.forEach(value.secteurs, async function(valueS, key) {
            if (valueS.Volume == null && ifoundIt == true) {
              ifoundIt = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Aucun secteurs trouvé ! ")), {
                closeButton: true
              });
            }
          });
        });
        return ifoundIt;
      }

      $scope.SetVolume = function(index) {
        var Volume = 0;
        angular.forEach($scope.foods[0].secteurs, function(value, key) {
          Volume = $scope.foods[0].VolumeUtiliser * value.Superficie / _.sumBy($scope.foods[0].secteurs, 'Superficie');
          if (Volume) {
            value.Volume = parseFloat(Volume.toFixed(2))
          } else {
            value.Volume = null;
          }
        });
      }

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
        })
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }



      $scope.ModifierAvancer = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.SolutionMere && $scope.data.Responsable && $scope.operateursNames && $scope.Operation && $scope.foods.length > 0 && $scope.checkafood && $scope.checkafoodEngrais && $scope.checkafoodSecteurs) {
          if ($scope.foods[0].VolumeUtiliser <= $scope.foods[0].VolumeDisponible) {

            pc.objEdit = {
              "ID": $scope.data.ID,
              "FERT_SM": $scope.SolutionAvancer[0].ID_SM,
              "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
              "Responsable": ($scope.data.Responsable) ? $filter('textforsqlserver')($scope.data.Responsable) : "",
              "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
              "OperateurIDs": $scope.Salariesel,
              "Operation": $scope.Operation,
              "SolutionMere": $scope.SolutionMere,
              "fertilisationEngraisSecteur": $scope.foods
            }


            ordrefertlisation.updatewebavancer(pc.objEdit).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Volume Utilisé doit inferieur ou égal au Volume Disponible !")), {
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

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //Edit Avancer Epandage
    $scope.showAdvancedEditAvancerEpandage = function(ev, data, Operations, Salaries, PersonAvancer, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais) {
      $mdDialog.show({
          controller: DialogControllerEditAvancerEpandage,
          templateUrl: '././views/templates/fertilisation/EditOrdreFertilisationAvancer.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            Operations: Operations,
            Salaries: Salaries,
            PersonAvancer: PersonAvancer,
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            engrais: engrais,
            Secteur_parcelle: Secteur_parcelle,
            Fert_Engrais: Fert_Engrais
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Edit Avancer Epandage
    function DialogControllerEditAvancerEpandage($scope, data, $mdDialog, Operations, Salaries, PersonAvancer, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.Operations = Operations;
      $scope.Salaries = Salaries;
      $scope.PersonAvancer = PersonAvancer;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.engrais = engrais;
      $scope.engrais = engrais;
      $scope.Secteur_parcelle = Secteur_parcelle;
      $scope.Fert_Engrais = Fert_Engrais

      $scope.foods = [];
      $scope.foodsEngais = [];
      $scope.type = 2;
      $scope.typeSelected = 1;
      $scope.operateursNames = "";
      $scope.datefertilisation = ($scope.data.DATE) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;


      $scope.isINOperateur = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.PersonAvancer, function(value, key) {
          if (value.ID_pers == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
        })
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.isIn = async function(ID) {
        var i = false;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.notInEngrais = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.ParcelleisIN = function(IDParcelle) {
        var i = false;
        angular.forEach($scope.Secteur_parcelle, function(value, key) {
          if (value.parcelle_id === IDParcelle && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.EngraisisIN = function(IDEngrais) {
        var i = false;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais === IDEngrais && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.RetirerEngrais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de l\'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngais.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup
        });
      }

      $scope.setFoodsEngrais = function() {
        var quantite = null;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais == $scope.engraissel.IDEngrais) {
            quantite = parseFloat(value.Qte_Ordre);
          }
        })
        $scope.foodsEngais.push({
          engrais: $scope.engraissel,
          quantite: quantite
        });
      }

      $scope.getSumSupParcelleEpandage = () => {
        return parseFloat(_.sumBy($scope.foods, 'parcelleSup').toFixed(2))
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

      $scope.checkafoodEngaisEpandage = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.quantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.ModifierAvancer = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.data.Responsable && $scope.operateursNames && $scope.Operation && $scope.foods.length > 0, $scope.checkafoodEngaisEpandage()) {
          pc.objEdit = {
            "ID": $scope.data.ID,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Responsable": ($scope.data.Responsable) ? $filter('textforsqlserver')($scope.data.Responsable) : "",
            "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
            "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
            "OperateurIDs": $scope.Salariesel,
            "Operation": $scope.Operation,
            "sup_Total": $scope.getSumSupParcelleEpandage(),
            "fertilisationParcelle": $scope.foods,
            "fertilisationEngrais": $scope.foodsEngais
          }


          ordrefertlisation.updatewebavancerepandage(pc.objEdit).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //Edit Apport Foliaire
    $scope.showAdvancedEditAvancerApportFoliaire = function(ev, data, Operations, Salaries, PersonAvancer, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais) {
      $mdDialog.show({
          controller: DialogControllerEditApportFoliaire,
          templateUrl: '././views/templates/fertilisation/EditOrdreFertilisationAvancerApportFoliaire.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            Operations: Operations,
            Salaries: Salaries,
            PersonAvancer: PersonAvancer,
            GroupeOperationnels: GroupeOperationnels,
            parcelleculturals: parcelleculturals,
            engrais: engrais,
            Secteur_parcelle: Secteur_parcelle,
            Fert_Engrais: Fert_Engrais
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Edit Apport Foliaire
    function DialogControllerEditApportFoliaire($scope, data, $mdDialog, Operations, Salaries, PersonAvancer, GroupeOperationnels, parcelleculturals, engrais, Secteur_parcelle, Fert_Engrais) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.data = data;
      $scope.Operations = Operations;
      $scope.Salaries = Salaries;
      $scope.PersonAvancer = PersonAvancer;
      $scope.GroupeOperationnels = GroupeOperationnels;
      $scope.parcelleculturals = parcelleculturals;
      $scope.engrais = engrais;
      $scope.Secteur_parcelle = Secteur_parcelle;
      $scope.Fert_Engrais = Fert_Engrais;

      $scope.foods = [];
      $scope.foodsEngais = [];
      $scope.type = 3;
      $scope.typeSelected = 2;
      $scope.operateursNames = "";
      $scope.datefertilisation = ($scope.data.DATE) ? new Date(moment($scope.data.DATE).format("YYYY-MM-DD")) : null;


      $scope.isINOperateur = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.PersonAvancer, function(value, key) {
          if (value.ID_pers == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }

      $scope.SetOperateurs = function() {
        $scope.operateursNames = "";
        angular.forEach($scope.Salariesel, function(value, key) {
          $scope.operateursNames += value.Nom + " " + value.Prenom + " ; ";
        })
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.isIn = async function(ID) {
        var i = false;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.blocsirrigation.ID === ID && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.notIn = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.parcelle.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.notInEngrais = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.engrais.IDEngrais == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.ParcelleisIN = function(IDParcelle) {
        var i = false;
        angular.forEach($scope.Secteur_parcelle, function(value, key) {
          if (value.parcelle_id === IDParcelle && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.EngraisisIN = function(IDEngrais) {
        var i = false;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais === IDEngrais && i == false) {
            i = true;
          }
        });
        return i;
      }

      $scope.RetirerParcelle = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la Parcelle?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foods.splice(index, 1);
          $scope.parcelleculturalsel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.RetirerEngrais = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de l'engrais?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsEngais.splice(index, 1);
          $scope.engraissel = undefined;
        }, function() {
          //cancel
        })
      }

      $scope.setFoods = function() {
        $scope.foods.push({
          parcelle: $scope.parcelleculturalsel,
          parcelleSup: $scope.parcelleculturalsel.Sup
        });
      }

      $scope.setFoodsEngrais = function() {
        var quantite = null;
        angular.forEach($scope.Fert_Engrais, function(value, key) {
          if (value.Engrais == $scope.engraissel.IDEngrais) {
            quantite = parseFloat(value.Qte_Ordre);
          }
        })
        $scope.foodsEngais.push({
          engrais: $scope.engraissel,
          quantite: quantite
        });
      }

      $scope.getSumSupParcelleEpandage = () => {
        return parseFloat(_.sumBy($scope.foods, 'parcelleSup').toFixed(2))
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

      $scope.checkafoodEngaisEpandage = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsEngais, function(value, key) {
          if (value.quantite == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.ModifierAvancer = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.data.Volume_utilise_ordre && $scope.data.Responsable && $scope.operateursNames && $scope.Operation && $scope.foods.length > 0, $scope.checkafoodEngaisEpandage()) {
          pc.objEdit = {
            "ID": $scope.data.ID,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Bouillie": $scope.data.Volume_utilise_ordre,
            "Responsable": ($scope.data.Responsable) ? $filter('textforsqlserver')($scope.data.Responsable) : "",
            "Operateur": ($scope.operateursNames) ? $filter('textforsqlserver')($scope.operateursNames) : "",
            "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
            "OperateurIDs": $scope.Salariesel,
            "Operation": $scope.Operation,
            "sup_Total": $scope.getSumSupParcelleEpandage(),
            "fertilisationParcelle": $scope.foods,
            "fertilisationEngrais": $scope.foodsEngais
          }


          ordrefertlisation.updatewebavancerapportfoliaire(pc.objEdit).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    pc.delete = async function(c) {
      pc.IDordrefertlisation = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ordrefertlisation.delete({
              ID: pc.IDordrefertlisation
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



    $scope.searchByType = function(type_text) {
      pc.dtInstance.DataTable.search(type_text).draw();
    };


    pc.printdetails = function(ordreFertilisationByID) {
      //alert(ordreFertilisationByID);

      var type = "";
      var dateFeri = "";
      var daterealisation = "";
      if (ordreFertilisationByID.Type == 1) {
        type = "Fertigation";
      } else if (ordreFertilisationByID.Type == 2) {
        type = "Epandage";
      } else if (ordreFertilisationByID.Type == 3) {
        type = "Apport foliaire";
      }

      if (ordreFertilisationByID.DATE) {
        dateFeri = moment(ordreFertilisationByID.DATE).format('DD/MM/YYYY');
      }

      if (ordreFertilisationByID.Date_Realisation) {
        daterealisation = moment(ordreFertilisationByID.Date_Realisation).format('DD/MM/YYYY');
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
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="3" style="width:30%;">' + pc.NomFerme + '</th>' +
        '<th style="width:40%;">' + type + '</th>' +
        '<th rowspan="3" style="width:30%;">Réf</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Le ' + dateFeri + '</th>' +
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
        '<td style="background:#e0e0e0;">N°Ordre</td>' +
        '<td>' + ordreFertilisationByID.Reference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Date d\'instruction</td>' +
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Date de réalisation</td>' +
        '<td>' + daterealisation + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');



      if (ordreFertilisationByID.Type == 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_1").innerHTML);
        $('table').attr('border', '0');
      }

      if (ordreFertilisationByID.Type != 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_23").innerHTML);
        $('table').attr('border', '0');
      }



      mywindow.document.write('<br/>');
      //fert infos
      mywindow.document.write('<table border="0" style="width:100%;" >' +
        '<tr>' +
        '<td rowspan="4" style="width:35%;">Observation<br/><textarea rows="5" cols="30">' + ordreFertilisationByID.Observation + '</textarea></td>' +
        '<td style="width:32.5%;">Opérateurs</td>' +
        '<td style="width:32.5%;">Visa</td>' +
        '</tr>' +
        '<tr>' +
        '<td><input type="text" value="' + ordreFertilisationByID.OPERATEUR + '" size="' + ordreFertilisationByID.OPERATEUR.length + '"/></td>' +
        '<td><input type="text" value=""/></td>' +
        '</tr>' +
        '<tr>' +
        '<td>Responsable</td>' +
        '<td>Visa</td>' +
        '</tr>' +
        '<tr>' +
        '<td><input type="text" value="' + ordreFertilisationByID.Responsable + '" size="' + ordreFertilisationByID.OPERATEUR.length + '"/></td>' +
        '<td><input type="text" value=""/></td>' +
        '</tr>' +
        '</table>');


      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
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