'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryFamilleCibleCtrl
 * @description
 * # RepositoryFamilleCibleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryFamilleCibleCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    BusinessUnit,
    familleCible,
    $filter,
    DTDefaultOptions, translatedwords,
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
        familleCible.getall().then(function(result) {
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
            $scope.AddCible();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-plus'></i> " + translatedwords.getTranslatedWord($translate("Cibles")),
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go("cible");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Cibles"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Categorie').withTitle(translatedwords.getTranslatedWord($translate("Famille"))),
      DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add code
    $scope.AddCible = function() {
      $mdDialog.show({
          controller: DialogControllerAddCible,
          templateUrl: '././views/templates/cible/AddFamilleCible.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCible($scope, $mdDialog) {
      $scope.Monitoring = 0;
      $scope.AjouterCible = async function() {
        toastr.clear();
        if ($scope.Famille) {
          pc.objAdd = {
            "Famille": $filter('textforsqlserver')($scope.Famille)
          }
          familleCible.create(pc.objAdd).then(async e => {
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
              if (e.data[0].description.includes("duplicate key")) {
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette cible existe déjà !")), {
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


      $scope.hideCode = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerCible = function() {
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
          templateUrl: '././views/templates/cible/EditFamilleCible.html',
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
      if ($scope.data.Suivie_monitoring) {
        $scope.Monitoring = 1;
      } else {
        $scope.Monitoring = 0;
      }
      $scope.ModiferCible = async function() {
        toastr.clear();
        if ($scope.data.Categorie) {
          pc.objEdit = {
            "Famille": $filter('textforsqlserver')($scope.data.Categorie),
            "ID": $scope.data.IDcategorie_cible
          }
          familleCible.update(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette cible existe déjà !")), {
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


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerCible = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }







    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.obj[data.IDcategorie_cible] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.IDcategorie_cible + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.IDcategorie_cible + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.ID = c.IDcategorie_cible;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            familleCible.delete({
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