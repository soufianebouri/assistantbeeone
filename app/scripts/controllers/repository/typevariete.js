'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryTypevarieteCtrl
 * @description
 * # RepositoryTypevarieteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryTypevarieteCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    TypeVarieteService, $mdDialog,
    toastr, $cookies, domaine
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.typeVarieteObject = {};
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        TypeVarieteService.getTypeVarieteByFerme(pc.obj).then(function(result) {
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
            pc.AddTypeVariete();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence Type Variété"))),
      DTColumnBuilder.newColumn('Libile').withTitle(translatedwords.getTranslatedWord($translate("Désignation Type Variété"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Add
    pc.AddTypeVariete = function() {
      $q.all([domaine.getDomaine()]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.showAdvancedAdd("ev", $scope.domaines);
      });
    }

    //add TypeVariete
    $scope.showAdvancedAdd = function(ev, domaines) {
      $mdDialog.show({
          controller: DialogControllerAddTypeVariete,
          templateUrl: '././views/templates/typevariete/AddTypeVariete.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            domaines: domaines
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddTypeVariete($scope, $mdDialog, domaines) {
      $scope.progress = false;
      $scope.domaines = domaines;

      $scope.selectedDomaines = [];
      $scope.AjouterTypeVariete = async function() {
        toastr.clear();
        if ($scope.Libelle && $scope.selectedDomaines.length > 0) {
          pc.objNewTypeVariete = {
            "Libelle": $scope.Libelle,
            "Reference": ($scope.Reference) ? $scope.Reference : "",
            "IDFermes": $scope.selectedDomaines
          }
          $scope.progress = true;
          TypeVarieteService.pushDataTypeVariete(_url, pc.objNewTypeVariete).then(async e => {
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


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideTypeVariete = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerTypeVariete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //edit
    pc.edit = function(datatypevariete) {
      $q.all([domaine.getDomaine()]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.showAdvancedEdit("ev", datatypevariete, $scope.domaines);
      });
    }

    $scope.showAdvancedEdit = function(ev, datatypevariete, domaines) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/typevariete/EditTypeVariete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datatypevariete: datatypevariete,
            domaines: domaines
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datatypevariete, domaines) {
      $scope.data = datatypevariete;
      $scope.domaines = domaines;
      $scope.progress = false;
      $scope.selectedDomaines = [];

      if ($scope.data.FermeID) {
        try {
          $scope.data.FermeID = $scope.data.FermeID.split(",").map(Number);
        } catch (e) {
          $scope.data.FermeID = $scope.data.FermeID;
        }
      } else {
        $scope.data.FermeID = [];
      }

      $scope.onUpdate = () => {
        if ($scope.selectedDomaines.length == 0) {
          $scope.selectedDomaines = $scope.data.FermeID;
        }
      }
      $scope.ModiferTypeVariete = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.Libile && $scope.selectedDomaines.length > 0) {
          pc.objEdit = {
            "Libile": $scope.data.Libile,
            "Reference": ($scope.data.Reference) ? $scope.data.Reference : "",
            "IDFermes": $scope.selectedDomaines,
            "IDFamille_variete": $scope.data.IDFamille_variete
          }
          $scope.progress = true;
          TypeVarieteService.updateDataTypeVariete(_url, pc.objEdit).then(async e => {
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

      $scope.AnnulerTypeVariete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    //delete
    pc.delete = async function(c) {
      pc.IDFamille_variete = c.IDFamille_variete;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            TypeVarieteService.deleteTypeVariete(_url, {
              IDFamille_variete: pc.IDFamille_variete
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
      pc.typeVarieteObject[data.IDFamille_variete] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.typeVarieteObject[' + data.IDFamille_variete + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.typeVarieteObject[' + data.IDFamille_variete + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }


    pc.showModal = function(size, req) {
      var template = './views/templates/addtypevarietemodal.html';
      pc.data.action = "insert";

      if (req == "d") {
        template = './views/templates/modalconfirmedelete.html';
        pc.data.action = "delete";
      } else if (req == "u") {
        pc.data.action = "update";
      }

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'TemplatesModaltypevarieteCtrl',
        controllerAs: 'pc',
        size: size,
        resolve: {
          data: function() {
            return pc.data;
          }
        }
      });

      modalInstance.result.then(function(res) {
        if (res == 'delete') {
          TypeVarieteService.deleteTypeVariete(_url, {
            id: pc.idTypeVariete
          }).then(function(result) {
            if (result.data[0].message == "ajout reussi") {
              pc.dtInstance.reloadData();
            } else {
              alert("Error : " + result.data[0].description);
            }
          });
        } else if (res == 'insert') {
          pc.dtInstance.reloadData();
        }
      }, function() {});

    };



  });