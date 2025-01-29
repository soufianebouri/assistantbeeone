'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryProduitCtrl
 * @description
 * # RepositoryProduitCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryProduitCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window,
    $compile, $uibModal, _url, DTOptionsBuilder,
    DTColumnBuilder, DTDefaultOptions, $q, produitrendement,
    $mdDialog, toastr, $cookies, uniteoperation, VarieteService, $filter, $state
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.ProduitObject = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "FERME": pc.IDFerme
    };
    pc.varieteTab = [];
    pc.uniteTab = [];
    pc.poitTab = [];
    pc.ifoundData = false;
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        produitrendement.getall().then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');


            if (aData.VarietesName) {
              try {
                pc.varieteTab = aData.VarietesName.split(",");
              } catch (e) {
                pc.varieteTab = aData.VarietesName;
              }
            } else {
              pc.varieteTab = [];
            }

            if (aData.UniteOperationNames) {
              try {
                pc.uniteTab = aData.UniteOperationNames.split(",");
              } catch (e) {
                pc.uniteTab = aData.UniteOperationNames;
              }
            } else {
              pc.uniteTab = [];
            }

            if (aData.UniteOperationsPoitMoyens) {
              try {
                pc.poitTab = aData.UniteOperationsPoitMoyens.split(",");
              } catch (e) {
                pc.poitTab = aData.UniteOperationsPoitMoyens;
              }
            } else {
              pc.poitTab = [];
            }

          });
        });
        return nRow;
      })
      .withOption('initComplete', function(settings, json) {
        pc.ifoundData = true;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
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
          text: "<i class='fa fa-columns'></i>",
          action: function(e, dt, node, config) {
            $state.go("produitgenerale");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Produit (Vue générale)"))
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.AddProduit();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ref_technique').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('designation').withTitle(translatedwords.getTranslatedWord($translate("Produit"))),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
      DTColumnBuilder.newColumn('Principale_Accessoire').withTitle(translatedwords.getTranslatedWord($translate("Type"))).renderWith(function(data, type, full, meta) {
        if (full.Principale_Accessoire == 1) {
          return translatedwords.getTranslatedWord($translate("Principale"));
        } else if (full.Principale_Accessoire == 2) {
          return translatedwords.getTranslatedWord($translate("Accessoire"));
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn('Stockable').withTitle(translatedwords.getTranslatedWord($translate("Stockable"))).renderWith(function(data, type, full, meta) {
        if (full.Stockable)
          return translatedwords.getTranslatedWord($translate("Stockable"));
        return translatedwords.getTranslatedWord($translate("Non Stockable"));
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //add
    pc.AddProduit = function() {
      $q.all([uniteoperation.getall(pc.obj),
        VarieteService.getVarieteByFerme({
          IDFermes: 0
        })
      ]).then((values) => {
        NProgress.done();
        $scope.uniteoperations = values[0].data;
        $scope.varietes = values[1].data;
        $scope.showAdvancedAddProduit("ev", $scope.uniteoperations, $scope.varietes);
      });
    }

    //add
    $scope.showAdvancedAddProduit = function(ev, uniteoperations, varietes) {
      $mdDialog.show({
          controller: DialogControllerAddProduit,
          templateUrl: '././views/templates/produit/AddProduit.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            uniteoperations: uniteoperations,
            varietes: varietes
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add
    function DialogControllerAddProduit($scope, $mdDialog, uniteoperations, varietes) {
      $scope.progress = false;
      $scope.uniteoperations = uniteoperations;
      $scope.varietes = varietes;
      $scope.Type = "1";
      $scope.Stockable = false;
      $scope.Variete = [];

      $scope.foods = [{
        uniteoperation: "",
        poidsmoyen: 0
      }];

      $scope.cloneItem = async function(index) {
        var itemToClone = {
          uniteoperation: "",
          poidsmoyen: 0
        };
        if ($scope.foods[index].uniteoperation) {
          if ($scope.foods.length != $scope.uniteoperations.length) {
            $scope.foods.push(itemToClone);
          } else {
            toastr.clear();
            toastr.error("Vous avez choisis tous les unités d'opération", {
              closeButton: true
            });
          }
        } else {
          toastr.clear();
          toastr.error("Veuillez renseigner tous les champs obligatoires", {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            uniteoperation: "",
            poidsmoyen: 0
          });
        }
      }

      $scope.notIn = (IDUnite) => {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.uniteoperation == IDUnite && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      $scope.AjouterProduit = async function() {
        toastr.clear();
        if ($scope.Designation && $scope.Variete && $scope.foods[0].uniteoperation && $scope.foods[$scope.foods.length - 1].uniteoperation) {
          pc.objNewProduit = {
            "Designation": $scope.Designation,
            "Variete": $scope.Variete,
            "Type": $scope.Type,
            "Stockable": $scope.Stockable,
            "Descriptif": ($scope.Descriptif) ? $filter('textforsqlserver')($scope.Descriptif) : "",
            "UniteData": $scope.foods
          }

          $scope.progress = true;
          produitrendement.getlast().then(async result => {
            if (result.data.length > 0) {
              try {
                pc.objNewProduit.Reference = "PF" + pad(result.data[0].Ref_technique, 9);
              } catch (e) {
                toastr.error("Le serveur ne répond pas !!", {
                  closeButton: true
                });
              }

            } else {
              pc.objNewProduit.Reference = "PF000000001";
            }

            produitrendement.create(pc.objNewProduit).then(async e => {
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
                pc.varieteTab = [];
                pc.uniteTab = [];
                pc.poitTab = [];
              } else {
                $scope.progress = false;
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce type de variété existe déjà !")), {
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
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
                closeButton: true
              });
            });

          }).catch(async e => {
            $scope.progress = false;
            toastr.clear();
            NProgress.done();
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
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


      $scope.hideProduit = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerProduit = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //edit
    pc.edit = function(dataproduit) {
      $q.all([uniteoperation.getall(pc.obj),
        VarieteService.getVarieteByFerme({
          IDFermes: 0
        })
      ]).then((values) => {
        NProgress.done();
        $scope.uniteoperations = values[0].data;
        $scope.varietes = values[1].data;
        $scope.showAdvancedEdit("ev", dataproduit, $scope.uniteoperations, $scope.varietes);
      });
    }

    $scope.showAdvancedEdit = function(ev, dataproduit, uniteoperations, varietes) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/produit/EditProduit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataproduit: dataproduit,
            uniteoperations: uniteoperations,
            varietes: varietes
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, dataproduit, uniteoperations, varietes) {
      $scope.data = dataproduit;
      $scope.uniteoperations = uniteoperations;
      $scope.varietes = varietes;
      $scope.progress = false;
      $scope.Variete = [];
      $scope.notIn = (IDUnite) => {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.uniteoperation == IDUnite && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }
      $scope.foods = [];

      if ($scope.data.UniteOperationsID) {
        try {
          $scope.data.UniteOperationsID = $scope.data.UniteOperationsID.split(",").map(Number);
        } catch (e) {
          $scope.data.UniteOperationsID = $scope.data.UniteOperationsID;
        }
      } else {
        $scope.data.UniteOperationsID = [];
      }

      if ($scope.data.UniteOperationsPoitMoyens) {
        try {
          $scope.data.UniteOperationsPoitMoyens = $scope.data.UniteOperationsPoitMoyens.split(",").map(Number);
        } catch (e) {
          $scope.data.UniteOperationsPoitMoyens = $scope.data.UniteOperationsPoitMoyens;
        }
      } else {
        $scope.data.UniteOperationsPoitMoyens = [];
      }
      if ($scope.data.VarietesID) {
        try {
          $scope.data.VarietesID = $scope.data.VarietesID.split(",").map(Number);
        } catch (e) {
          $scope.data.VarietesID = $scope.data.VarietesID;
        }
      } else {
        $scope.data.VarietesID = [];
      }




      $scope.onUpdate = () => {
        if (!$scope.Variete) {
          $scope.Variete = $scope.data.VarietesID;

        }
      }
      for (var i = 0; i < $scope.data.UniteOperationsID.length; i++) {
        $scope.foods.push({
          uniteoperation: $scope.data.UniteOperationsID[i],
          poidsmoyen: parseFloat($scope.data.UniteOperationsPoitMoyens[i])
        });
      }

      if ($scope.data.UniteOperationsID.length == 0) {
        $scope.foods.push({
          uniteoperation: "",
          poidsmoyen: 0
        });
      }

      $scope.cloneItem = async function(index) {
        var itemToClone = {
          uniteoperation: "",
          poidsmoyen: 0
        };
        if ($scope.foods[index].uniteoperation) {
          if ($scope.foods.length != $scope.uniteoperations.length) {
            $scope.foods.push(itemToClone);
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Vous avez choisis tous les unités d'opération")), {
              closeButton: true
            });
          }
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            uniteoperation: "",
            poidsmoyen: 0
          });
        }
      }

      $scope.ModiferProduit = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.designation && $scope.Variete && $scope.foods[0].uniteoperation && $scope.foods[$scope.foods.length - 1].uniteoperation) {
          pc.objEdit = {
            "Designation": $scope.data.designation,
            "Variete": $scope.Variete,
            "Type": $scope.data.Principale_Accessoire,
            "Stockable": $scope.data.Stockable,
            "Descriptif": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
            "UniteData": $scope.foods,
            "IDProduit_Rendement": $scope.data.IDProduit_Rendement
          }
          $scope.progress = true;
          produitrendement.update(pc.objEdit).then(async e => {
            if (e.data[0].message == "ajout reussi") {
              //validate success
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
              pc.varieteTab = [];
              pc.uniteTab = [];
              pc.poitTab = [];
            } else {
              toastr.clear();
              if (e.data[0].description.includes("duplicate key")) {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce type de variété existe déjà !")), {
                  closeButton: true
                });
              } else {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                  closeButton: true
                });
              }
              NProgress.done();
            }
          }).catch(async e => {
            toastr.clear();
            $scope.progress = false;
            toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
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


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerProduit = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    //delete
    pc.delete = async function(c) {
      pc.IDProduit_Rendement = c.IDProduit_Rendement;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            produitrendement.delete({
              IDProduit_Rendement: pc.IDProduit_Rendement
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                pc.dtInstance.reloadData();
                pc.varieteTab = [];
                pc.uniteTab = [];
                pc.poitTab = [];
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

    function actionsHtml(data, type, full, meta) {
      pc.ProduitObject[data.IDProduit_Rendement] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.ProduitObject[' + data.IDProduit_Rendement + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ProduitObject[' + data.IDProduit_Rendement + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }






  });