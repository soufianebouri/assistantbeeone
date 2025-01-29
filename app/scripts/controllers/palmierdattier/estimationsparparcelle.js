'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierEstimationsparparcelleCtrl
 * @description
 * # PalmierdattierEstimationsparparcelleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierEstimationsparparcelleCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, toastr, GroupeOperationnel, $mdDialog, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, estimationsparparcelle, parcellecultural, $filter) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.IDFERME = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.Estimaction = {};
    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'estimation_parcelle'
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
      $("#Parcelle").selectpicker('refresh');
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
    $scope.updateDataEstimationParParcelle = function(data) {
      return estimationsparparcelle.getByFiltre(data);
    };

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddEstimation()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataEstimationParParcelle(pc.obj).then(function(res) {
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
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DATE)
          return moment(full.DATE).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('NBR_ARB_PROD').withTitle(translatedwords.getTranslatedWord($translate("Nbr Arbre"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.NBR_ARB_PROD + '</p>';
      }),
      DTColumnBuilder.newColumn('Poids_moy_fruit').withTitle("Poids moyen par arbre (Kg)").renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Poids_moy_fruit + '</p>';
      }),
      DTColumnBuilder.newColumn('Tonnage_estime').withTitle("Tonnage estimé (T)").renderWith(function(data, type, full, meta) {
        if (full.Poids_moy_fruit && full.NBR_ARB_PROD) {
          var tonage = full.Poids_moy_fruit * full.NBR_ARB_PROD / 1000;
          return '<p align="right">' + $filter('AsTwoDigit')(tonage) + '</p>';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('designation').withTitle(translatedwords.getTranslatedWord($translate("Produit de rendement"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(function(data, type, full, meta) {
        pc.Estimaction[data.ID] = data;
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Estimaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Estimaction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return dtailsBtn + deletebtn;
      }).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    pc.showtable = true;
    pc.detailsorder = function(data) {
      pc.EstimByID = data;
      pc.CategorieByEstim = [];
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      estimationsparparcelle.getCategorieByEstim({
        "ID": data.ID
      }).then(function(res) {
        pc.CategorieByEstim = res.data;
        NProgress.done();
        NProgress.remove();
      });
    }

    pc.delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            estimationsparparcelle.deleteestimation({
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


    $scope.AddEstimation = function() {
      $mdDialog.show({
          controller: DialogControllerAddEstimation,
          templateUrl: '././views/templates/estimation/AddEstimation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddEstimation($scope, $mdDialog) {

      $q.all([
        estimationsparparcelle.allParcelle({
          DOMAINE: pc.IDFERME
        }),
        estimationsparparcelle.allCategorieArbre()
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.categoriearbre = values[1].data;
        $scope.letmeclick = true;
      });

      $scope.parcelleculturals = [];

      $scope.getParcellesByGO = () => {
        if ($scope.parcellecultural.Sup > 0)
          $scope.nbrArbreHa = parseInt($scope.parcellecultural.Nbre_plant / $scope.parcellecultural.Sup);
      }

      $scope.foodsCategrie = [{
        categoriearbres: undefined,
        nbrFruit: undefined,
        porcentagearbre: undefined
      }];

      $scope.removeItem = function(index) {
        $scope.foodsCategrie.splice(index, 1);
        if ($scope.foodsCategrie.length == 0) {
          $scope.foodsCategrie.push({
            categoriearbres: undefined,
            nbrFruit: undefined,
            porcentagearbre: undefined
          });
        }
      }

      $scope.cloneItem = async function(index) {
        if ($scope.foodsCategrie[index].categoriearbres && $scope.foodsCategrie[index].nbrFruit >= 0 && $scope.foodsCategrie[index].porcentagearbre >= 0 && $scope.foodsCategrie[index].porcentagearbre <= 100) {
          $scope.foodsCategrie.push({
            categoriearbres: undefined,
            nbrFruit: undefined,
            porcentagearbre: undefined
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires ")), {
            closeButton: true
          });
        }
      }

      $scope.setQuantitetotaldefruits = function() {
        $scope.Quantitetotaldefruits = 0;
        angular.forEach($scope.foodsCategrie, function(value, key) {
          if (value.nbrFruit && value.porcentagearbre) {
            $scope.Quantitetotaldefruits += value.nbrFruit * (value.porcentagearbre * $scope.nbrArbreProductif) / 100;
          }
        });
        return parseFloat($scope.Quantitetotaldefruits.toFixed(2));
      }

      $scope.setTonnageestimeKg = function() {
        $scope.TonnageestimeKg = 0;
        if ($scope.Quantitetotaldefruits >= 0 && $scope.nbrPoidFruit >= 0)
          $scope.TonnageestimeKg = $scope.Quantitetotaldefruits * $scope.nbrPoidFruit;
        return parseFloat($scope.TonnageestimeKg.toFixed(2));
      }


      $scope.iadd = false;

      $scope.addItem = function() {
        if ($scope.iadd) {
          $scope.iadd = false
        } else {
          $scope.iadd = true;
        }
      }

      $scope.GetOtherReference = function() {
        expeditions.getMaxRef(pc.obj).then(e => {
          NProgress.done();
          if (e.data.length > 0) {
            $scope.Reference = pad(parseInt(e.data[0].NbrExp) + 1, 4);
          } else {
            $scope.Reference = pad(1, 4);
          }
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateEstim = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.Ifullscreen = false;
      $scope.VarieteProduit = [];

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



      $scope.checkProduitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.foodsCategrie, function(value, key) {
          if (((!value.categoriearbres) || (!value.nbrFruit || value.nbrFruit === null || Number.isNaN(value.nbrFruit)) || (!value.porcentagearbre || value.porcentagearbre === null || Number.isNaN(value.porcentagearbre) || value.porcentagearbre > 100)) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }




      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateEstim && $scope.parcellecultural && $scope.nbrArbreProductif && $scope.nbrPoidFruit && $scope.foodsCategrie.length > 0) {
          if ($scope.checkProduitData()) {
            pc.objAdd = {
              "DateEstim": moment($scope.DateEstim).format('YYYYMMDD'),
              "parcellecultural": $scope.parcellecultural,
              "nbrArbreProductif": $scope.nbrArbreProductif,
              "nbrPoidFruit": $scope.nbrPoidFruit,
              "nbrArbreHa": $scope.nbrArbreHa,
              "Quantitetotaldefruits": $scope.Quantitetotaldefruits,
              "TonnageestimeKg": $scope.TonnageestimeKg,
              "foodsCategrie": $scope.foodsCategrie,
              "Utilisateur": pc.User,
              "IDFermes": pc.IDFERME,
              "IDUser": pc.IDUser
            }

            estimationsparparcelle.createestimation(pc.objAdd).then(async e => {
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
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les catégrories d'arbre")), {
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


      //add code
      $scope.addCategorieArbre = function() {
        $mdDialog.show({
            controller: DialogControllerAddCategorieArbre,
            templateUrl: '././views/templates/estimation/AddCategorieArbre.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.categoriearbre = answer;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add code
      function DialogControllerAddCategorieArbre($scope, $mdDialog) {
        $scope.AjouterCategorieArbre = async function() {
          toastr.clear();
          if ($scope.Categrorie) {
            pc.objNewCode = {
              "Categrorie": $filter('textforsqlserver')($scope.Categrorie)
            }
            estimationsparparcelle.createcategrie(pc.objNewCode).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                $scope.categoriearbre = estimationsparparcelle.allCategorieArbre().then(result => {
                  NProgress.done();
                  $mdDialog.hide(result.data);
                });
              } else {
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette Marque existe déjà !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
                NProgress.done();
              }
            }).catch(async e => {
              toastr.clear();
              toastr.error(e.data, {
                closeButton: true
              });
            });

          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.AnnulerCategorieArbre = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




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