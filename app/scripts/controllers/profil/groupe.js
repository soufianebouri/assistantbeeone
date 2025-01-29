'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ProfilGroupeCtrl
 * @description
 * # ProfilGroupeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ProfilGroupeCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    BusinessUnit, translatedwords,
    $filter,
    DTDefaultOptions,
    $mdDialog,
    $cookies,
    toastr,
    $element,
    $transitions,
    $state, ModuleManager, $translatePartialLoader, $translate, $window
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.UserName = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.dtInstance = {};
    pc.obj = {};



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ModuleManager.getProfil().then(function(result) {
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
            $scope.AddProfil([]);
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('reference').withTitle(translatedwords.getTranslatedWord($translate("Référence Profil"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');




    //add code
    $scope.AddProfil = function(profilData) {
      $mdDialog.show({
          locals: {
            profilData: profilData
          },
          controller: DialogControllerProfilCtrl,
          templateUrl: '././views/templates/administration/refprofils.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true
        })
        .then(function(answer) {}, function() {});
    }



    //add profil
    function DialogControllerProfilCtrl($scope, $mdDialog, profilData) {
      $scope.disabledRef = false;
      $scope.ID = 0;

      $scope.reference = "";
      $scope.IDREF = 0;

      $scope.module_array = [];
      $scope.rubrique_array = [];
      $scope.roles = {};
      $scope.checked_module = [];
      ModuleManager.listgetroleprofil({
        ID: $scope.IDREF
      }).then(e => {
        NProgress.done();
        $scope.roles = e.data[0];
        $scope.checked_module = e.data[1];
        angular.forEach(e.data[0], (v, k) => {
          $scope.module_array.push(k);
        });
      });

      $scope.module_changed = () => {}

      $scope.getRubrique = (module) => {
        var rubrique = [];
        angular.forEach($scope.roles[module], (v, k) => {
          for (var k in v) {
            rubrique.push(k);
            break;
          }
        });
        return rubrique;
      }

      $scope.getSsModule = (rubrique, module) => {
        var ss_module = [];
        angular.forEach($scope.roles[module], (v, k) => {
          for (var k in v) {
            if (k == rubrique) {
              ss_module = v[rubrique];
            }
            break;
          }
        });
        return ss_module;
      }

      $scope.saveModule = async (module_name, rubrique, rubrique_model, reference) => {
        if (reference) {
          if ($scope.ID == 0) {
            ModuleManager.createRef({
              reference: reference
            }).then(e => {
              NProgress.done();
              $scope.ID = e.data.IDinserted;

              var ObPost = {};
              if (rubrique_model.length == 0 || !rubrique_model) {
                ObPost = {
                  REF_rubrique: rubrique,
                  ID_REF_PROFIL: $scope.ID
                };
              } else {
                var str = "";
                var ss_module_ids = [];
                angular.forEach(rubrique_model, (v, k) => {
                  str += `(${$scope.ID},${v.id},${(v.a)?v.a:0},${(v.u)?v.u:0},${(v.d)?v.d:0},${(v.web)?v.web:0},${(v.mobile)?v.mobile:0}),`;
                  ss_module_ids.push(v.id);
                });
                str = str.slice(0, -1);
                str = str.replace(/false/g, 0).replace(/true/g, 1);
                ObPost = {
                  VALUES: str,
                  ID_REF_PROFIL: $scope.ID,
                  REF_RUB: rubrique_model[0].ref_rubrique,
                  SS_MODULE_IDS: ss_module_ids
                };
              }

              ModuleManager.createRefProfil(ObPost).then(async e => {
                NProgress.done();
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Action réussie")), {
                  closeButton: true
                });

                pc.dtInstance.reloadData();
                $scope.disabledRef = true;
              }).catch(async e => {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Un problème est survenu : ")) + e.data, {
                  closeButton: true
                });
              });

            }).catch(async e => {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Un problème est survenu : ")) + " Cette référence existe déjà", {
                closeButton: true
              });
            });
          } else {
            var ObPost = {};
            if (rubrique_model.length == 0 || !rubrique_model) {
              ObPost = {
                REF_rubrique: rubrique
              };
            } else {
              var str = "";
              var ss_module_ids = [];
              angular.forEach(rubrique_model, (v, k) => {
                str += `(${$scope.ID},${v.id},${(v.a)?v.a:0},${(v.u)?v.u:0},${(v.d)?v.d:0},${(v.web)?v.web:0},${(v.mobile)?v.mobile:0}),`;
                ss_module_ids.push(v.id);
              });
              str = str.slice(0, -1);
              str = str.replace(/false/g, 0).replace(/true/g, 1);
              ObPost = {
                VALUES: str,
                ID_REF_PROFIL: $scope.ID,
                REF_RUB: rubrique_model[0].ref_rubrique,
                SS_MODULE_IDS: ss_module_ids
              };
            }

            ModuleManager.createRefProfil(ObPost).then(async e => {
              NProgress.done();
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Action réussie")), {
                closeButton: true
              });
              pc.dtInstance.reloadData();
            }).catch(async e => {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("veuillez réessayer ultérieurement, un problème est survenu : ")) + e.data, {
                closeButton: true
              });
            });
          }




        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("veuillez saisir la référence du profil")), {
            closeButton: true
          });
        }



      }




      //-------------------------



      $scope.Annuler = () => {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      }




    }

    //edit code
    $scope.EditProfil = function(profilData) {
      $mdDialog.show({
          locals: {
            profilData: profilData
          },
          controller: DialogControllerProfilEditCtrl,
          templateUrl: '././views/templates/administration/refprofils.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true
        })
        .then(function(answer) {}, function() {});
    }


    //edit profil
    function DialogControllerProfilEditCtrl($scope, $mdDialog, profilData) {
      $scope.disabledRef = false;
      $scope.ID = 0;
      $scope.profilData = profilData;

      var keys = Object.keys(profilData);
      var len = keys.length;

      $scope.reference = $scope.profilData.reference;
      $scope.IDREF = $scope.profilData.IDcode_profil_modules;

      $scope.module_array = [];
      $scope.rubrique_array = [];
      $scope.roles = {};
      $scope.checked_module = [];
      ModuleManager.listgetroleprofil({
        ID: $scope.IDREF
      }).then(e => {
        NProgress.done();
        $scope.roles = e.data[0];
        $scope.checked_module = e.data[1];
        angular.forEach(e.data[0], (v, k) => {
          $scope.module_array.push(k);
        });
      });

      $scope.module_changed = () => {}

      $scope.getRubrique = (module) => {
        var rubrique = [];
        angular.forEach($scope.roles[module], (v, k) => {
          for (var k in v) {
            rubrique.push(k);
            break;
          }
        });
        return rubrique;
      }

      $scope.getSsModule = (rubrique, module) => {
        var ss_module = [];
        angular.forEach($scope.roles[module], (v, k) => {
          for (var k in v) {
            if (k == rubrique) {
              ss_module = v[rubrique];
            }
            break;
          }
        });
        return ss_module;
      }

      $scope.saveModule = async (module_name, rubrique, rubrique_model, reference) => {


        if (reference) {

          var ObPost = {};
          if (rubrique_model.length == 0 || !rubrique_model) {
            ObPost = {
              REF_rubrique: rubrique,
              ID_REF_PROFIL: $scope.IDREF,
              REFERENCE: reference
            };
          } else {
            var str = "";
            var ss_module_ids = [];
            angular.forEach(rubrique_model, (v, k) => {
              str += `(${$scope.IDREF},${v.id},${(v.a)?v.a:0},${(v.u)?v.u:0},${(v.d)?v.d:0},${(v.web)?v.web:0},${(v.mobile)?v.mobile:0}),`;
              ss_module_ids.push(v.id);
            });
            str = str.slice(0, -1);
            str = str.replace(/false/g, 0).replace(/true/g, 1);
            ObPost = {
              VALUES: str,
              ID_REF_PROFIL: $scope.IDREF,
              REF_RUB: rubrique_model[0].ref_rubrique,
              SS_MODULE_IDS: ss_module_ids,
              REFERENCE: reference
            };
          }

          ModuleManager.createRefProfil(ObPost).then(async e => {
            NProgress.done();
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Action réussie")), {
              closeButton: true
            });
            pc.dtInstance.reloadData();
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Un problème est survenu : ")) + e.data, {
              closeButton: true
            });
          });




        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("veuillez saisir la référence du profil")), {
            closeButton: true
          });
        }



      }

      $scope.Annuler = () => {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      }

    }
    //-------------------------









    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.obj[data.IDcode_profil_modules] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="EditProfil(pc.obj[' + data.IDcode_profil_modules + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.IDcode_profil_modules + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDcode_profil_modules = c.IDcode_profil_modules;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ModuleManager.deleteRef({
              ID_REF_PROFIL: pc.IDcode_profil_modules
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