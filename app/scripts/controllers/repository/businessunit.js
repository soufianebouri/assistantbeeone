'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryBusinessunitCtrl
 * @description
 * # RepositoryBusinessunitCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryBusinessunitCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder, translatedwords,
    DTColumnBuilder,
    $q,
    BusinessUnit,
    $filter,
    DTDefaultOptions,
    $mdDialog,
    $cookies,
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
        BusinessUnit.getAllBusinessUnit(_url).then(function(result) {
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
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>"
        },
        {
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
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
            $scope.AddBusinessUnit();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Libelle').withTitle(translatedwords.getTranslatedWord($translate("Libelle"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add code
    $scope.AddBusinessUnit = function() {
      $mdDialog.show({
          controller: DialogControllerAddBusinessUnit,
          templateUrl: '././views/templates/businessunit/AddBusinessUnit.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddBusinessUnit($scope, $mdDialog) {
      $scope.AjouterBusinessUnit = async function() {
        toastr.clear();
        if ($scope.Libelle) {
          pc.objAdd = {
            "Libelle": $scope.Libelle
          }
          BusinessUnit.create(pc.objAdd).then(async e => {
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
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
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


      $scope.hideCode = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerBusinessUnit = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit
    pc.edit = function(databusunessunit) {
      $scope.showAdvancedEdit("ev", databusunessunit);
    }

    $scope.showAdvancedEdit = function(ev, databusunessunit) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/businessunit/EditBusinessUnit.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            databusunessunit: databusunessunit
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, databusunessunit) {
      $scope.data = databusunessunit;
      $scope.ModiferBusinessUnit = async function() {
        toastr.clear();
        if ($scope.data.Libelle) {
          pc.objEdit = {
            "Libelle": $scope.data.Libelle,
            "ID": $scope.data.ID,
          }
          BusinessUnit.update(pc.objEdit).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                closeButton: true
              });
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


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerBusinessUnit = function() {
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
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            BusinessUnit.delete({
              ID: pc.ID
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