'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryFermetepeauCtrl
 * @description
 * # RepositoryFermetepeauCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryFermetepeauCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions, translatedwords,
    $q,
    fermete, $mdDialog,
    toastr, $cookies, domaine
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.fermeteObject = {};
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        fermete.getallPeau().then(function(result) {
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
            pc.AddFermete();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Code').withTitle(translatedwords.getTranslatedWord($translate("Code"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Créer par"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //AddFermete
    pc.AddFermete = function() {
      $mdDialog.show({
          controller: DialogControllerAddFermete,
          templateUrl: '././views/templates/fermete/AddFermete.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {}, function() {});
    }



    //add code
    function DialogControllerAddFermete($scope, $mdDialog) {
      $scope.progress = false;
      $scope.AjouterFermete = async function() {
        toastr.clear();
        if ($scope.Code) {
          pc.objNewFermete = {
            "Code": $scope.Code,
            "CreatedBy": pc.User,
            "ID_Profil": pc.IDUser
          }
          $scope.progress = true;
          fermete.createPeau(pc.objNewFermete).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette fermeté existe déjà !")), {
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


      $scope.hideFermete = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerFermete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //edit
    pc.edit = function(datafermete) {
      $scope.showAdvancedEdit("ev", datafermete);
    }

    $scope.showAdvancedEdit = function(ev, datafermete) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/fermete/EditFermete.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datafermete: datafermete
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datafermete) {
      $scope.data = datafermete;
      $scope.progress = false;
      $scope.ModiferFermete = async function() {
        toastr.clear();
        if ($scope.data.Code) {
          pc.objEdit = {
            "Code": $scope.data.Code,
            "ID": $scope.data.ID
          }
          $scope.progress = true;
          fermete.updatePeau(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette fermeté existe déjà !")), {
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

      $scope.AnnulerFermete = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

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
            fermete.deletePeau({
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

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.fermeteObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.fermeteObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.fermeteObject[' + data.ID + '])" )"="">' +
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