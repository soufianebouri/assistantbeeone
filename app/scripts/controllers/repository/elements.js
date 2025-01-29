'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryElementsCtrl
 * @description
 * # RepositoryElementsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryElementsCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal, elements,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, $state,
    DTDefaultOptions, translatedwords,
    $q,
    cultureService, $mdDialog, familleculture, toastr, $cookies, generation, domaine
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.elementObject = {};
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        elements.getelementculture(pc.obj).then(function(result) {
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
          text: "Liste des éléments",
          key: '1',
          className: 'pull-right',
          action: function(e, dt, node, config) {
            $state.go('element_liste');
          }
        },
        {
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.AffactationElementCulture();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('mgc_element').withTitle(translatedwords.getTranslatedWord($translate("Élément"))),
      DTColumnBuilder.newColumn('input_field').withTitle(translatedwords.getTranslatedWord($translate("Etat"))).renderWith(function(data, type, full, meta) {
        if (full.input_field)
          return 'Calculer';
        return 'Saisir';
      }),
      DTColumnBuilder.newColumn('formule_calcule').withTitle(translatedwords.getTranslatedWord($translate("Formule de calcule"))),
      DTColumnBuilder.newColumn('createdBy').withTitle(translatedwords.getTranslatedWord($translate("Profil"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all').withOption('width', '5%')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //add
    pc.AffactationElementCulture = function() {
      $q.all([cultureService.getCulture(_url), elements.getall(), elements.getallFormules()]).then((values) => {
        NProgress.done();
        $scope.cultures = values[0].data;
        $scope.elements = values[1].data;
        $scope.formules = values[2].data;
        $scope.showAdvancedAdd("ev", $scope.cultures, $scope.elements, $scope.formules);
      });
    }

    $scope.showAdvancedAdd = function(ev, cultures, elements, formules) {
      $mdDialog.show({
          controller: DialogControllerAddCulture,
          templateUrl: '././views/templates/element/AddAffectation_element_culture.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            cultures: cultures,
            elementsRef: elements,
            formules: formules
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCulture($scope, $mdDialog, cultures, elementsRef, formules) {
      $scope.cultures = cultures;
      $scope.elements = elementsRef;
      $scope.formules = formules;
      $scope.etat = 0;
      $scope.progress = false;
      $scope.cultureselsel = [];
      $scope.elementsel = {};

      $scope.changeEtat = function() {
        $scope.formulesel = null;
      }

      $scope.chckbyEtat = function() {
        if ($scope.etat == 1) {
          if ($scope.formulesel) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.cultureselsel.length > 0 && !angular.equals($scope.elementsel, {}) && $scope.chckbyEtat()) {
          pc.objAdd = {
            "cultureselsel": $scope.cultureselsel,
            "elementsel": $scope.elementsel,
            "etat": $scope.etat,
            "formulesel": $scope.formulesel,
            "id_profil": pc.IDUser,
            "DateCreated": moment().format("YYYYMMDD")
          }
          $scope.progress = true;
          elements.affecttoculture(pc.objAdd).then(async e => {
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
              toastr.error('Err : ' + e.message, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(async e => {

            $scope.progress = false;
            NProgress.done();
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("An error occured, ")) + e.data.message, {
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

      $scope.Anuuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }



    //edit
    pc.edit = function(dataculture) {
      $q.all([cultureService.getCulture(_url), elements.getall(), elements.getallFormules()]).then((values) => {
        NProgress.done();
        $scope.cultures = values[0].data;
        $scope.elementsRef = values[1].data;
        $scope.formules = values[2].data;
        $scope.showAdvancedEdit("ev", dataculture, $scope.cultures, $scope.elementsRef, $scope.formules);
      });
    }

    $scope.showAdvancedEdit = function(ev, dataculture, cultures, elementsRef, formules) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/element/EditAffectation_element_culture.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataculture: dataculture,
            cultures: cultures,
            elementsRef: elementsRef,
            formules: formules
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, dataculture, cultures, elementsRef, formules) {
      $scope.data = dataculture;

      $scope.cultures = cultures;
      $scope.elements = elementsRef;
      $scope.formules = formules;
      $scope.progress = false;
      $scope.etat = ($scope.data.input_field) ? 1 : 0;

      $scope.changeEtat = function() {
        $scope.formulesel = null;
      }

      $scope.chckbyEtat = function() {
        if ($scope.etat == 1) {
          if ($scope.formulesel) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }


      $scope.Modifier = async function() {
        toastr.clear();
        if ($scope.cultureselsel && $scope.elementsel && $scope.chckbyEtat()) {
          pc.objEdit = {
            "ID": $scope.data.id,
            "cultureselsel": $scope.cultureselsel,
            "elementsel": $scope.elementsel,
            "etat": $scope.etat,
            "formulesel": $scope.formulesel,
          }
          $scope.progress = true;
          elements.updateaffecttoculture(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Cette affectation existe déjà !")), {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("An error occured, Server connectivity is down !")), {
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

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }

    //delete
    pc.delete = async function(c) {
      pc.ID = c.id;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            elements.delete_affectation({
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
            }).catch(async function(e) {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured, Server connectivity is down !")), {
                closeButton: true
              });
            });;
          });
        }
      });

    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.elementObject[data.id] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.elementObject[' + data.id + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.elementObject[' + data.id + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }





  });