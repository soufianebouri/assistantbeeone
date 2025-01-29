'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryFamillecultureCtrl
 * @description
 * # RepositoryFamillecultureCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryFamillecultureCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    TypeVarieteService, $mdDialog, translatedwords,
    toastr,
    familleculture, domaine, $cookies, $translatePartialLoader, $translate, $window,
  ) {
    var pc = this;
    pc.dtInstance = {};
    pc.familleCultureObject = {};
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        familleculture.getFamilleCulture(pc.obj).then(function(result) {
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
            pc.AddFamilleCulture();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence Famille"))),
      DTColumnBuilder.newColumn('Nom_Famille').withTitle(translatedwords.getTranslatedWord($translate("Désignation Famille"))),
      DTColumnBuilder.newColumn('filier').withTitle(translatedwords.getTranslatedWord($translate("Filièr"))).renderWith(function(data, type, full, meta) {
        if (full.filier == 1) {
          return "Maraichage";
        } else if (full.filier == 2) {
          return "Arboriculture";
        } else if (full.filier == 3) {
          return "Grande Culture";
        } else if (full.filier == 4) {
          return "Floriculture";
        } else if (full.filier == 5) {
          return "Fruits rouges";
        } else {
          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add
    pc.AddFamilleCulture = function() {
      $q.all([domaine.getDomaine()]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.showAdvancedAdd("ev", $scope.domaines);
      });
    }

    //AddFamilleCulture
    $scope.showAdvancedAdd = function(ev, domaines) {
      $mdDialog.show({
          controller: DialogControllerAddFamilleCulture,
          templateUrl: '././views/templates/familleculture/AddFamilleCulture.html',
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
    function DialogControllerAddFamilleCulture($scope, $mdDialog, domaines) {
      $scope.progress = false;
      $scope.Filiere = 1;
      $scope.domaines = domaines;
      $scope.selectedDomaines = [];
      $scope.AjouterFamilleCulture = async function() {
        toastr.clear();
        if ($scope.Reference && $scope.Filiere && $scope.selectedDomaines.length > 0) {
          pc.objNewFamilleCulture = {
            "Reference": $scope.Reference,
            "Nom_Famille": $scope.Famille ? $scope.Famille : "",
            "filier": $scope.Filiere,
            "IDFermes": $scope.selectedDomaines
          }
          $scope.progress = true;
          familleculture.create(pc.objNewFamilleCulture).then(async e => {
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


      $scope.hideFamilleCulture = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerFamilleCulture = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }


    //edit
    pc.edit = function(datafamilleculture, domaines) {
      $q.all([domaine.getDomaine(), familleculture.getFamilleCultureByID({
        IDFamille_Culture: datafamilleculture.IDFamille_Culture
      })]).then((values) => {
        NProgress.done();
        $scope.domaines = values[0].data;
        $scope.famillecultureFermes = values[1].data;
        $scope.showAdvancedEdit("ev", datafamilleculture, $scope.domaines, $scope.famillecultureFermes);
      });

    }

    $scope.showAdvancedEdit = function(ev, datafamilleculture, domaines, famillecultureFermes) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/familleculture/EditFamilleCulture.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            datafamilleculture: datafamilleculture,
            domaines: domaines,
            famillecultureFermes: famillecultureFermes
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, datafamilleculture, famillecultureFermes, domaines) {
      $scope.selectedDomaines = [];
      $scope.data = datafamilleculture;
      $scope.domaines = domaines;
      $scope.famillecultureFermes = famillecultureFermes;
      $scope.progress = false;

      if ($scope.data.ParcellePhysiqueSupFood) {
        try {
          $scope.data.ParcellePhysiqueSupFood = $scope.data.ParcellePhysiqueSupFood.split(",").map(Number);
        } catch (e) {
          $scope.data.ParcellePhysiqueSupFood = $scope.data.ParcellePhysiqueSupFood;
        }
      } else {
        $scope.data.ParcellePhysiqueSupFood = [];
      }

      $scope.onUpdate = () => {
        if ($scope.selectedDomaines.length == 0) {
          $scope.selectedDomaines = $scope.data.FermeID;
        }
      }
      $scope.isiN = function(ferme) {
        var stop = false;
        var foundit = false;
        angular.forEach($scope.famillecultureFermes, function(value, key) {
          if (value.IDFermes == ferme && !stop) {
            stop = true;
            foundit = true;
          }
        })
        return foundit;
      }
      $scope.ModiferFamilleCulture = async function() {
        toastr.clear();
        $scope.onUpdate();
        if ($scope.data.Reference && $scope.data.filier && $scope.selectedDomaines.length > 0) {
          pc.objEdit = {
            "Reference": $scope.data.Reference,
            "Nom_Famille": $scope.data.Nom_Famille ? $scope.data.Nom_Famille : "",
            "filier": $scope.data.filier,
            "IDFamille_Culture": $scope.data.IDFamille_Culture,
            "IDFermes": $scope.selectedDomaines
          }
          $scope.progress = true;
          familleculture.update(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette famille de culture existe déjà !")), {
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

      $scope.AnnulerFamilleCulture = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    //delete
    pc.delete = async function(c) {
      pc.IDFamille_Culture = c.IDFamille_Culture;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            familleculture.delete({
              IDFamille_Culture: pc.IDFamille_Culture
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
      pc.familleCultureObject[data.IDFamille_Culture] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.familleCultureObject[' + data.IDFamille_Culture + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.familleCultureObject[' + data.IDFamille_Culture + '])" )"="">' +
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