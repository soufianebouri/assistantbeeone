'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryCategoriepesticideCtrl
 * @description
 * # RepositoryCategoriepesticideCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryCategoriepesticideCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    TrancheAge,
    $filter,
    DTDefaultOptions,
    $mdDialog, translatedwords,
    VarieteService,
    $cookies,
    toastr,
    $element,
    $transitions, $translatePartialLoader, $translate, $window,
    $state,
    categoriepesticide) {
    var pc = this;
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.objCategorie = {};

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        categoriepesticide.getAll().then(function(result) {
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
            $scope.AddCategorie();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Categorie').withTitle(translatedwords.getTranslatedWord($translate("Catégorie"))),
      DTColumnBuilder.newColumn('Couleur').withTitle(translatedwords.getTranslatedWord($translate("Couleur"))).renderWith(function(data, type, full, meta) {
        if (full.Couleur) {
          return '<h1 style="background: ' + full.Couleur + ';width: 100%;height: 20px;border-style:solid;border-color: ' + full.Couleur + ';border-width: 12px;">';
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add AddCategorie
    $scope.AddCategorie = function() {
      $mdDialog.show({
          controller: DialogControllerAddCategorieArticle,
          templateUrl: '././views/templates/CategorieArticle/AddCategorieArticle.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCategorieArticle($scope, $mdDialog) {
      $scope.Couleur = "#FFFFFF";
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);
      $scope.AjouterCategorieArticle = async function() {
        toastr.clear();
        if ($scope.Categorie) {
          pc.objCategorieArticle = {
            "Categorie": $scope.Categorie,
            "Couleur": document.getElementById('Couleur').value
          }

          categoriepesticide.create(pc.objCategorieArticle).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cet catégorie existe déjà !")), {
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

      $scope.AnnulerCategorieArticle = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //edit
    pc.edit = function(datacategorie) {
      $scope.showAdvancedEdit("ev", datacategorie);
    }

    $scope.showAdvancedEdit = function(ev, datacategorie) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/CategorieArticle/EditCategorieArticle.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datacategorie: datacategorie
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datacategorie) {
      $scope.data = datacategorie;
      $scope.data.Couleur = ($scope.data.Couleur) ? $scope.data.Couleur : "#FFFFFF";
      setTimeout(function() {
        jscolor.installByClassName("jscolor");
      }, 1000);
      $scope.ModiferCode = async function() {
        toastr.clear();
        if ($scope.data.Categorie) {
          pc.objEdit = {
            "Categorie": $scope.data.Categorie,
            "Couleur": document.getElementById('Couleur').value,
            "ID": $scope.data.ID_categorie_pesticide
          }

          categoriepesticide.update(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cet catégorie existe déjà !")), {
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
      pc.objCategorie[data.ID_categorie_pesticide] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.objCategorie[' + data.ID_categorie_pesticide + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.objCategorie[' + data.ID_categorie_pesticide + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDCategorie = c.ID_categorie_pesticide;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            categoriepesticide.delete({
              ID: pc.IDCategorie
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