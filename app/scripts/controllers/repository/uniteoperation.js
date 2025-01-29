'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryUniteoperationCtrl
 * @description
 * # RepositoryUniteoperationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryUniteoperationCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    uniteoperation, $mdDialog,
    toastr, $cookies, domaine
  ) {
    var pc = this;
    pc.dtInstance = {};
    pc.typeUniteObject = {};
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        uniteoperation.getall().then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.AddUniteOperation();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('Unite').withTitle(translatedwords.getTranslatedWord($translate("Unité"))),
      DTColumnBuilder.newColumn('Recolte').withTitle(translatedwords.getTranslatedWord($translate("Récolte"))).renderWith(function(data, type, full, meta) {
        if (full.Recolte)
          return translatedwords.getTranslatedWord($translate("Unité de récolte"));
        return '';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    //AddUniteOperation
    pc.AddUniteOperation = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAddUniteOperation,
          templateUrl: '././views/templates/uniteoperation/AddUniteOperation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddUniteOperation($scope, $mdDialog) {
      $scope.progress = false;
      $scope.Recolte = false;
      $scope.AjouterUniteOperation = async function() {
        toastr.clear();
        if ($scope.Unite) {
          pc.objNewUniteOperation = {
            "Unite": $scope.Unite,
            "Recolte": $scope.Recolte,
            "Code": ($scope.Reference) ? $scope.Reference : ""
          }
          $scope.progress = true;
          uniteoperation.create(pc.objNewUniteOperation).then(async e => {
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
              if (e.data[0].description.includes("duplicate key")) {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette Unité d'opération existe déjà !")), {
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
            $scope.progress = false;
            toastr.clear();
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


      $scope.hideUniteOperation = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerUniteOperation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //edit
    pc.edit = function(dataUnite) {
      $scope.showAdvancedEdit("ev", dataUnite);
    }

    $scope.showAdvancedEdit = function(ev, dataUnite) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/uniteoperation/EditUniteOperation.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataUnite: dataUnite
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, dataUnite) {
      $scope.data = dataUnite;
      $scope.progress = false;
      $scope.Recolte = ($scope.data.Recolte) ? 1 : 0;
      $scope.ModiferUniteOperation = async function() {
        toastr.clear();
        if ($scope.data.Unite) {
          pc.objEdit = {
            "Recolte": $scope.Recolte,
            "Unite": $scope.data.Unite,
            "Code": ($scope.data.Code) ? $scope.data.Code : "",
            "IDUnite_Operation": $scope.data.IDUnite_Operation
          }
          $scope.progress = true;
          uniteoperation.update(pc.objEdit).then(async e => {
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
            } else {
              toastr.clear();
              if (e.data[0].description.includes("duplicate key")) {
                $scope.progress = false;
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette Unité d'opération existe déjà !")), {
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

      $scope.AnnulerUniteOperation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    //delete
    pc.delete = async function(c) {
      pc.IDUnite_Operation = c.IDUnite_Operation;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            uniteoperation.delete({
              IDUnite_Operation: pc.IDUnite_Operation
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

    function actionsHtml(data, type, full, meta) {
      pc.typeUniteObject[data.IDUnite_Operation] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.typeUniteObject[' + data.IDUnite_Operation + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.typeUniteObject[' + data.IDUnite_Operation + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

  });