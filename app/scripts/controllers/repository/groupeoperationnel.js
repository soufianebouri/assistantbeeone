'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryGroupeoperationnelCtrl
 * @description
 * # RepositoryGroupeoperationnelCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryGroupeoperationnelCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    GroupeOperationnel,
    $filter, translatedwords,
    DTDefaultOptions, $translatePartialLoader, $translate, $window,
    $mdDialog,
    $cookies,
    toastr,
    $element,
    $transitions,
    $state
  ) {

    var pc = this;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.objAction = {};
    pc.Intitule = "";
    pc.obj = {
      idferme: pc.IDFermes
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        GroupeOperationnel.getGroupeOperationnelByFerme(pc.obj).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      /*.withOption('order', [])
      .withOption('order', false)*/
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
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
            pc.Add();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: translatedwords.getTranslatedWord($translate("Attachement aux parcelles")),
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go("parcelleculturalgroupeoperationnel");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Attachement aux parcelles"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Intitule').withTitle(translatedwords.getTranslatedWord($translate("Intitule"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Modifer
    pc.Add = function() {
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/groupeoperationnel/AddGroupeOperationnel.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog) {

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Ajouter = async function() {
        toastr.clear();

        if ($scope.Intitule) {
          //check campagneagricole
          $scope.progress = true;
          //Edit
          GroupeOperationnel.create({
            "Intitule": $scope.Intitule,
            "IDFermes": pc.IDFermes,
            "Superficie": 0,
            "Critere_Groupement": ""
          }).then(async function(res) {
            NProgress.done();
            pc.resedit = res.data;
            if (pc.resedit[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                closeButton: true
              });
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
              $scope.progress = false;
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                closeButton: true
              });
              $scope.progress = false;
            }
          });


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }



    //Modifer
    pc.edit = function(data) {
      $scope.showAdvancedEdit("ev", data);
    }


    $scope.showAdvancedEdit = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/groupeoperationnel/EditGroupeOperationnel.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;




      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Modifier = async function() {
        toastr.clear();
        if ($scope.data.Intitule) {
          //check campagneagricole
          $scope.progress = true;
          //Edit
          GroupeOperationnel.update({
            "Intitule": $scope.data.Intitule,
            "ID": $scope.data.IDGroupeCultural_Operationnel
          }).then(async function(res) {
            NProgress.done();
            pc.rescreate = res.data;
            if (pc.rescreate[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                closeButton: true
              });
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
              $scope.progress = false;
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                closeButton: true
              });
              $scope.progress = false;
            }
          });


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

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

    function actionsHtml(data, type, full, meta) {
      pc.objAction[data.IDGroupeCultural_Operationnel] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.objAction[' + data.IDGroupeCultural_Operationnel + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Retirer" ng-click="pc.delete(pc.objAction[' + data.IDGroupeCultural_Operationnel + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDGroupeCultural_Operationnel = c.IDGroupeCultural_Operationnel;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            GroupeOperationnel.delete({
              ID: pc.IDGroupeCultural_Operationnel
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie!")), {
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