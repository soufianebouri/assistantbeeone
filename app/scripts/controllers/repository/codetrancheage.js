'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryCodetrancheageCtrl
 * @description
 * # RepositoryCodetrancheageCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryCodetrancheageCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    TrancheAge,
    $filter,
    DTDefaultOptions,
    $mdDialog,
    VarieteService,
    $cookies, translatedwords,
    toastr,
    $element,
    $transitions, $translatePartialLoader, $translate, $window,
    $state
  ) {

    var pc = this;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.obj = {};

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        TrancheAge.getcode(_url).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $scope.AddCode();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "tranches d'âge",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go('Tranche_Age');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Référentiel des tranches d'âge"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Ordre').withTitle(translatedwords.getTranslatedWord($translate("N°Ordre"))),
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Ajouter"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add code
    $scope.AddCode = function() {
      $mdDialog.show({
          controller: DialogControllerAddCode,
          templateUrl: '././views/templates/trancheage/AddTrancheAgeCode.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCode($scope, $mdDialog) {
      $scope.AjouterCode = async function() {
        toastr.clear();
        if ($scope.NewCode) {
          pc.objNewCode = {
            "NewCode": $scope.NewCode,
            "NewOrdre": $scope.NewOrdre
          }
          TrancheAge.getCountOrder(_url, pc.objNewCode).then(async resultCountOrder => {
            NProgress.done();
            try {
              if (resultCountOrder.data[0].Existe == 0) {
                TrancheAge.createnewcode(_url, pc.objNewCode).then(async e => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                      closeButton: true
                    });
                    NProgress.done();
                    $scope.CodeTranche = TrancheAge.getcode(_url).then(result => {
                      NProgress.done();
                      $mdDialog.hide();
                      document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                      pc.dtInstance.reloadData();
                    });
                  } else {
                    toastr.clear();
                    if (e.data[0].description.includes("duplicate key")) {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce code existe déjà !")), {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce ordre existe déjà !")), {
                  closeButton: true
                });
              }
            } catch (e) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + resultCount.data.message, {
                closeButton: true
              });
            }
          });





        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideCode = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerCode = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit
    pc.edit = function(datatrancheage) {
      $scope.showAdvancedEdit("ev", datatrancheage);
    }

    $scope.showAdvancedEdit = function(ev, datatrancheage) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/trancheage/EditTrancheAgeCode.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datatrancheage: datatrancheage
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datatrancheage) {
      $scope.data = datatrancheage;
      $scope.ModiferCode = async function() {
        toastr.clear();
        if ($scope.data.Ordre && $scope.data.Code) {
          pc.objEdit = {
            "Ordre": $scope.data.Ordre,
            "Code": $scope.data.Code,
            "ID": $scope.data.ID,
          }
          TrancheAge.getCountOrderEdit(_url, pc.objEdit).then(async resultCountOrder => {
            NProgress.done();
            try {
              if (resultCountOrder.data[0].Existe == 0) {
                TrancheAge.Editcode(_url, pc.objEdit).then(async e => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                      closeButton: true
                    });
                    NProgress.done();
                    $scope.CodeTranche = TrancheAge.getcode(_url).then(result => {
                      NProgress.done();
                      $mdDialog.hide();
                      document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                      pc.dtInstance.reloadData();
                    });
                  } else {
                    toastr.clear();
                    if (e.data[0].description.includes("duplicate key")) {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce code existe déjà !")), {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce ordre existe déjà !")), {
                  closeButton: true
                });
              }
            } catch (e) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + resultCount.data.message, {
                closeButton: true
              });
            }
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

      $scope.AnnulerCode = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }







    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.obj[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDTranche = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            TrancheAge.deletecode(_url, {
              ID: pc.IDTranche
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

  });