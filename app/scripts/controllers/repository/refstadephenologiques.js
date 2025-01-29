'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRefstadephenologiquesCtrl
 * @description
 * # RepositoryRefstadephenologiquesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRefstadephenologiquesCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    $cookies,
    $mdDialog,
    toastr,
    refstadephenologiques,
    cultureService,
    parametragestockage
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    pc.parcel = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.parametragestockage = [];
    pc.PicturesHostStade = "";

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        refstadephenologiques.getAllStadePhenologique().then(result => {
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
      })
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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.AddStade();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
        }
      ]);

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostStade = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Stade_phenologique + '/';
    });

    pc.dtColumns = [
      DTColumnBuilder.newColumn('code').withTitle(translatedwords.getTranslatedWord($translate("Code"))),
      DTColumnBuilder.newColumn('description').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Couleur').withTitle(translatedwords.getTranslatedWord($translate("Couleur"))).renderWith(function(data, type, full, meta) {
        if (full.CouleurCalque) {
          return '<h4 style="background: ' + full.CouleurCalque + ';width: 50%;height: 10px;border-style:solid;border-color: ' + full.CouleurCadre + ';"></h4>';
        } else {
          return '';
        }
      }),
      /*DTColumnBuilder.newColumn('Photo').withTitle(translatedwords.getTranslatedWord($translate("Photo"))).renderWith(function(data, type, full, meta) {
        if (full.Photo) {
          var pics = full.Photo.split(",");
          var imghtml = "<table><tr>";
          pics.forEach(function(item, index) {
            if (item != 'noimg.png')
              imghtml += `<td><a ng-click="pc.showimg('${pc.PicturesHostStade+item}', '${full.Culture}')">` +
              `<img src="${pc.PicturesHostStade+item}" width="50px" height="50px" class=""/>  ` +
              `</a></td>`;
          });
          return imghtml + '</tr></table>';

        } else {

          return '';
        }
      }),*/
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml).withClass('all')
    ];

    pc.showimg = function(img, culture) {
      $.magnificPopup.open({
        tClose: 'Fermer (Esc)',
        tLoading: 'Chargement...',
        delegate: 'a',
        items: {
          src: img
        },
        closeOnContentClick: true,
        closeBtnInside: true,
        mainClass: 'mfp-fade',
        image: {
          titleSrc: function() {
            return '<b style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><u>Culture</u> : ' + culture + '</b>';
          }
        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      return "<button class='btn btn-warning btn-xs' title='Modifier' ng-click='pc.Edit(" + JSON.stringify(data) + ")'><i class='fa fa-edit'></i></button>" +
        "<button class='btn btn-danger btn-xs' 	title='Supprimer' ng-click='pc.Delete(" + data.IDStade_phenologique + ")'><i class='fa fa-trash'></i></button>";
    }

    //delete stade
    pc.Delete = async function(IDstade) {
      pc.obj = {
        "IDstade": IDstade
      };

      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            refstadephenologiques.DeleteStadePhenologique(pc.obj).then(async function(res) {
              pc.resAdd = res.data;
              if (pc.resAdd[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Une erreur est survenue !")), {
                  closeButton: true
                });
              }
            });
          });
        }
      });
    }

    //add stade
    pc.AddStade = function() {
      $scope.Cultures = cultureService.getCulture(_url).then(result => {
        return result.data;
      });
      $scope.showAdvancedAdd("ev", $scope.Cultures);
    }

    $scope.showAdvancedAdd = function(ev, Cultures) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/stadephenologique/AddStadePhenologique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            Cultures: Cultures
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };



    function DialogController($scope, $mdDialog, Cultures) {

      $scope.Cultures = Cultures;

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Ajouter = function() {
        toastr.clear();
        if (!$scope.culture) {
          $scope.culture = 0;
        }

        if ($scope.Code) {
          if (!$scope.couleurcalque) {
            $scope.couleurcalque = "";
          }

          if (!$scope.couleurcadre) {
            $scope.couleurcadre = "";
          }

          if (!$scope.Description) {
            $scope.Description = "";
          }

          pc.obj = {
            "culture": $scope.culture,
            "Code": $scope.Code,
            "CouleurCalque": $scope.couleurcalque,
            "CouleurCadre": $scope.couleurcadre,
            "Description": $scope.Description
          };

          refstadephenologiques.AddStadePhenologique(pc.obj).then(function(res) {
            pc.resAdd = res.data;
            if (pc.resAdd[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info("Ajout reussi!", {
                closeButton: true
              });
              NProgress.done();
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
            } else {
              toastr.clear();
              toastr.error("Une erreur est survenue !", {
                closeButton: true
              });
            }
          });
        }




      };
    }

    //Edit stade
    pc.Edit = function(data) {
      $scope.Cultures = cultureService.getCulture(_url).then(result => {
        return result.data;
      });
      $scope.showAdvancedEdit("ev", $scope.Cultures, data);
    }

    $scope.showAdvancedEdit = function(ev, Cultures, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/stadephenologique/EditStadePhenologique.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            Cultures: Cultures,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };


    function DialogControllerEdit($scope, $mdDialog, Cultures, data) {

      $scope.Cultures = Cultures;
      $scope.data = data;

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.onUpdate = () => {
        if (!$scope.culture) {
          $scope.culture = $scope.data.IdCulture;
        }
      }

      $scope.Modifier = function() {
        toastr.clear();
        $scope.onUpdate();
        if (!$scope.culture) {
          $scope.culture = 0;
        }

        if (!$scope.data.code) {
          $scope.data.code = "";
        }

        if (!$scope.data.CouleurCalque) {
          $scope.data.CouleurCalque = "";
        }

        if (!$scope.data.CouleurCadre) {
          $scope.data.CouleurCadre = "";
        }

        if (!$scope.data.description) {
          $scope.data.description = "";
        }

        pc.obj = {
          "IDstade": $scope.data.IDStade_phenologique,
          "Code": $scope.data.code,
          "culture": $scope.culture,
          "CouleurCalque": $scope.data.CouleurCalque,
          "CouleurCadre": $scope.data.CouleurCadre,
          "Description": $scope.data.description
        };

        refstadephenologiques.EditStadePhenologique(pc.obj).then(function(res) {
          pc.resAdd = res.data;
          if (pc.resAdd[0].message == 'ajout reussi') {
            toastr.clear();
            toastr.info("Modification réussie", {
              closeButton: true
            });
            NProgress.done();
            $mdDialog.hide();
            document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
            pc.dtInstance.reloadData();
          } else {
            toastr.clear();
            toastr.error("Une erreur est survenue !", {
              closeButton: true
            });
          }
        });


      };
    }

  }).decorator("$mdDialog", function($delegate) {
    // Get a handle of the show method
    var methodHandle = $delegate.show;

    function decorateDialogShow() {
      var args = angular.extend({}, arguments[0], {
        multiple: true
      })
      return methodHandle(args);
    }
    $delegate.show = decorateDialogShow;
    return $delegate;
  });