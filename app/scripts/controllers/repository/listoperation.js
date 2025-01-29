'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryListoperationCtrl
 * @description
 * # RepositoryListoperationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryListoperationCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q, translatedwords,
    OperationService,
    DTDefaultOptions,
    $mdDialog,
    toastr,
    $cookies
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.operationObject = {};

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        OperationService.getOperationByFerme(_url, pc.IDFermes).then(function(result) {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.AddOperation();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('OpeRef_Intitule').withTitle(translatedwords.getTranslatedWord($translate("Opération"))),
      //DTColumnBuilder.newColumn('NOM').withTitle('Ferme(s)'),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];


    //add operation
    pc.AddOperation = function() {
      $mdDialog.show({
          controller: DialogControllerAddOperation,
          templateUrl: '././views/templates/operation/AddOperation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddOperation($scope, $mdDialog) {
      $scope.progress = false;

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }
      $scope.AjouterOperation = async function() {
        toastr.clear();
        if ($scope.Operation) {
          pc.objNewOperation = {
            "OpeRef_Intitule": $scope.Operation,
            "IDFermes": pc.IDFermes,
            "Ref_oper": "",
            "Ref_mod": "",
            "Reference": ""
          }
          $scope.progress = true;
          OperationService.getlastOperation(_url).then(async result => {
            if (result.data.length > 0) {
              try {
                pc.objNewOperation.Ref_oper = pad(result.data[0].Ref_oper, 4);
                pc.objNewOperation.Ref_mod = pad(result.data[0].Ref_mod, 4);
                pc.objNewOperation.Reference = pad(result.data[0].Reference, 4);
              } catch (e) {
                toastr.error(await translatedwords.getTranslatedWord($translate("Le serveur ne répond pas !!")), {
                  closeButton: true
                });
              }

            } else {
              pc.objNewOperation.Ref_oper = "0001";
              pc.objNewOperation.Ref_mod = "0001";
              pc.objNewOperation.Reference = "0001";
            }
            OperationService.pushOperation(_url, pc.objNewOperation).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
                closeButton: true
              });
            });
          })

        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideOperation = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerOperation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit
    pc.edit = function(dataoperation) {
      $scope.showAdvancedEdit("ev", dataoperation);
    }

    $scope.showAdvancedEdit = function(ev, dataoperation) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/operation/EditOperation.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataoperation: dataoperation
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, dataoperation) {
      $scope.data = dataoperation;
      $scope.progress = false;
      $scope.ModiferOperation = async function() {
        toastr.clear();
        if ($scope.data.OpeRef_Intitule) {
          pc.objEdit = {
            "OpeRef_Intitule": $scope.data.OpeRef_Intitule,
            "OpeRef_Id": $scope.data.OpeRef_Id,
          }
          $scope.progress = true;
          OperationService.updateOperation(_url, pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette opération existe déjà !")), {
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


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerOperation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    //delete
    pc.delete = async function(c) {
      pc.OpeRef_Id = c.OpeRef_Id;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            OperationService.deleteOperation(_url, {
              OpeRef_Id: pc.OpeRef_Id
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
      pc.operationObject[data.OpeRef_Id] = data;
      return '<a class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.operationObject[' + data.OpeRef_Id + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</a>&nbsp;' +
        '<a class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.operationObject[' + data.OpeRef_Id + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</a>';
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

  });