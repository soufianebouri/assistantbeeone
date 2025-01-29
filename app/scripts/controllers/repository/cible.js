'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryCibleCtrl
 * @description
 * # RepositoryCibleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryCibleCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, familleCible,
    $q,
    BusinessUnit,
    Cible,
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
        Cible.getAllCible().then(function(result) {
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
          text: translatedwords.getTranslatedWord($translate("Ajouter famille cible")),
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go("famille_cible");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Familles cibles"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Categorie').withTitle(translatedwords.getTranslatedWord($translate("Famille"))).renderWith(function(data, type, full, meta) {
        if (full.Categorie)
          return full.Categorie;
        return "<i>Non renseignée</i>";
      }),
      DTColumnBuilder.newColumn('Cible').withTitle(translatedwords.getTranslatedWord($translate("Cible"))),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('Suivie_monitoring').withTitle(translatedwords.getTranslatedWord($translate("Suivie dans le monitoring"))).renderWith(function(data, type, full, meta) {
        if (full.Suivie_monitoring == 1)
          return "Suivie";
        return "Non suivie";
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add code
    $scope.AddCible = function() {
      $mdDialog.show({
          controller: DialogControllerAddCible,
          templateUrl: '././views/templates/cible/AddCible.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCible($scope, $mdDialog) {
      $scope.Monitoring = 0;

      $q.all([
        familleCible.getall()
      ]).then((values) => {
        NProgress.done();
        $scope.Familles = values[0].data;
      });

      $scope.AjouterCible = async function() {
        toastr.clear();
        if ($scope.Cible) {
          pc.objAdd = {
            "Cible": $filter('textforsqlserver')($scope.Cible),
            "Famille": $scope.Famille,
            "Reference": ($scope.Reference) ? $scope.Reference : "",
            "Monitoring": $scope.Monitoring
          }
          Cible.create(pc.objAdd).then(async e => {
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
          templateUrl: '././views/templates/cible/EditCible.html',
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

      $q.all([
        familleCible.getall()
      ]).then((values) => {
        NProgress.done();
        $scope.Familles = values[0].data;
      });

      if ($scope.data.Suivie_monitoring) {
        $scope.Monitoring = 1;
      } else {
        $scope.Monitoring = 0;
      }
      $scope.ModiferCible = async function() {
        toastr.clear();
        if ($scope.data.Cible) {
          pc.objEdit = {
            "Cible": $filter('textforsqlserver')($scope.data.Cible),
            "Famille": $scope.Famille,
            "Reference": ($scope.data.Reference) ? $scope.data.Reference : "",
            "ID": $scope.data.ID_cible,
            "Monitoring": $scope.Monitoring
          }
          Cible.update(pc.objEdit).then(async e => {
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
      pc.obj[data.ID_cible] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID_cible + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID_cible + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.ID = c.ID_cible;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            Cible.delete({
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