'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryListcultureCtrl
 * @description
 * # RepositoryListcultureCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryListcultureCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions, translatedwords,
    $q,
    cultureService, $mdDialog, familleculture, toastr, $cookies, generation, domaine
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.cultureObject = {};
    pc.IDFermes = $cookies.getObject('globals').ferme.IDFerme;
    pc.obj = {
      "IDFermes": pc.IDFermes
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        cultureService.GetFullByFerme(pc.obj).then(function(result) {
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            pc.AddCulture();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Nom_Famille').withTitle(translatedwords.getTranslatedWord($translate("Famille de culture"))),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence culture"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Désignation culture"))),
      DTColumnBuilder.newColumn('GenerationName').withTitle(translatedwords.getTranslatedWord($translate("Génération"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //add
    pc.AddCulture = function() {
      $q.all([familleculture.getAllfamilleculture(), generation.getall(), domaine.getDomaine()]).then((values) => {
        NProgress.done();
        $scope.familleculture = values[0].data;
        $scope.generations = values[1].data;
        $scope.domaines = values[2].data;
        $scope.showAdvancedAdd("ev", $scope.familleculture, $scope.generations, $scope.domaines);
      });
    }

    //AddFamilleCulture
    $scope.showAdvancedAdd = function(ev, familleculture, generations, domaines) {
      $mdDialog.show({
          controller: DialogControllerAddCulture,
          templateUrl: '././views/templates/culture/AddCulture.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            familleculture: familleculture,
            generations: generations,
            domaines: domaines
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add code
    function DialogControllerAddCulture($scope, $mdDialog, familleculture, generations, domaines) {
      $scope.famillecultures = familleculture;
      $scope.generations = generations;
      $scope.domaines = domaines;
      $scope.progress = false;
      $scope.Filiere = 1;
      $scope.selectedDomaines = [];
      $scope.ichangeFamille = () => {
        $scope.selectedGeneration = [];
      }
      $scope.AjouterCulture = async function() {
        toastr.clear();
        if ($scope.Culture && $scope.FamilleCulture && $scope.selectedDomaines.length > 0) {
          pc.objNewCulture = {
            "Reference": ($scope.Reference) ? $scope.Reference : "",
            "Culture": $scope.Culture,
            "Famiile": ($scope.FamilleCulture.filier) ? $scope.FamilleCulture.filier : 0,
            "IDFamille_Culture": $scope.FamilleCulture.IDFamille_Culture,
            "IDFermes": $scope.selectedDomaines,
            "Generation": $scope.selectedGeneration
          }
          $scope.progress = true;
          cultureService.create(pc.objNewCulture).then(async e => {
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
            toastr.error(await translatedwords.getTranslatedWord($translate("An error occured, ")) + e.data, {
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


      $scope.hideCulture = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerCulture = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }



    //edit
    pc.edit = function(dataculture) {
      $q.all([familleculture.getAllfamilleculture(), generation.getall(), domaine.getDomaine()]).then((values) => {
        NProgress.done();
        $scope.familleculture = values[0].data;
        $scope.generations = values[1].data;
        $scope.domaines = values[2].data;
        $scope.showAdvancedEdit("ev", dataculture, $scope.familleculture, $scope.generations, $scope.domaines);
      });
    }

    $scope.showAdvancedEdit = function(ev, dataculture, familleculture, generations, domaines) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/culture/EditCulture.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            dataculture: dataculture,
            familleculture: familleculture,
            generations: generations,
            domaines: domaines
          }
        })
        .then(function(answer) {}, function() {});
    };

    function DialogControllerEdit($scope, $mdDialog, dataculture, familleculture, generations, domaines) {
      $scope.data = dataculture;
      $scope.famillecultures = familleculture;
      $scope.generations = generations;
      $scope.domaines = domaines;
      $scope.selectedGeneration = [];
      $scope.selectedDomaines = [];
      $scope.progress = false;

      if ($scope.data.FermeID) {
        try {
          $scope.data.FermeID = $scope.data.FermeID.split(",").map(Number);
        } catch (e) {
          $scope.data.FermeID = $scope.data.FermeID;
        }
      } else {
        $scope.data.FermeID = [];
      }


      if ($scope.data.GenerationID) {
        try {
          $scope.data.GenerationID = $scope.data.GenerationID.split(",").map(Number);
        } catch (e) {
          $scope.data.GenerationID = $scope.data.GenerationID;
        }
      } else {
        $scope.data.GenerationID = [];
      }

      $scope.onUpdate = () => {
        if (!$scope.FamilleCulture) {
          $scope.FamilleCulture = $scope.data.IdFamille_Culture;
        }
        if (!$scope.selectedDomaines) {
          $scope.selectedDomaines = $scope.data.FermeID;
        }
        if (!$scope.selectedGeneration) {
          $scope.selectedGeneration = $scope.data.GenerationID;
        }
      }

      $scope.ModiferCulture = async function() {
        $scope.onUpdate();
        toastr.clear();
        if ($scope.data.Culture && $scope.FamilleCulture && $scope.selectedDomaines.length > 0) {
          pc.objEdit = {
            "Reference": $scope.data.Reference,
            "Culture": $scope.data.Culture,
            "Famiile": ($scope.FamilleCulture.filier) ? $scope.FamilleCulture.filier : 0,
            "IDFamille_Culture": $scope.FamilleCulture.IDFamille_Culture,
            "ID": $scope.data.ID,
            "IDFermes": $scope.selectedDomaines,
            "Generation": $scope.selectedGeneration
          }
          $scope.progress = true;
          cultureService.update(pc.objEdit).then(async e => {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que cette culture existe déjà !")), {
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

      $scope.AnnulerCulture = function() {
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
            cultureService.delete({
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
      pc.cultureObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.cultureObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.cultureObject[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }





  });