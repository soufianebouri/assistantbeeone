'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryParcelleculturalgroupeoperationnelCtrl
 * @description
 * # RepositoryParcelleculturalgroupeoperationnelCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryParcelleculturalgroupeoperationnelCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    parcelleculturalgroupeoperationnel, translatedwords,
    $filter,
    DTDefaultOptions,
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
    pc.objAction = {};
    pc.Intitule = "";
    pc.obj = {
      FERME: pc.IDFermes
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        parcelleculturalgroupeoperationnel.getGroupeParcelleCultural(pc.obj).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      /*.withOption('order', [])
      .withOption('order', false)*/
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
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
            pc.Add();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: translatedwords.getTranslatedWord($translate("Ajouter groupe")),
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $state.go("groupeoperationnel");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter groupe"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Intitule').withTitle(translatedwords.getTranslatedWord($translate("Groupe"))).renderWith(function(data, type, full, meta) {
        /*  if (meta.row == 0) {
            pc.Intitule = full.Intitule.toString();
            return full.Intitule;
          } else {
            if (full.Intitule.trim() !== pc.Intitule.trim()) {
              pc.Intitule = full.Intitule.toString();
              return full.Intitule;
            } else {
              return "<p style='display:none;'>" + full.Intitule + "</p>";
            }
          }*/
        return full.Intitule;
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle cultural"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Modifer
    pc.Add = function() {

      $q.all([parcelleculturalgroupeoperationnel.getParcelleculturalnotGrouped(pc.obj), parcelleculturalgroupeoperationnel.getGroupe(pc.obj)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.Groupes = values[1].data;
        NProgress.done();
        $scope.showAdvancedAdd("ev", $scope.ParcelleCulturale, $scope.Groupes);
      });


    }


    $scope.showAdvancedAdd = function(ev, ParcelleCulturale, Groupes) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/groupeparcellecultural/AddGroupeParcellecultural.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            Groupes: Groupes
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog, ParcelleCulturale, Groupes) {
      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.Groupes = Groupes;

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Ajouter = async function() {
        toastr.clear();

        if ($scope.groupe && $scope.parcelleculturale) {

          var datainsert = "";
          for (var i = 0; i < $scope.parcelleculturale.length; i++) {
            datainsert += "('" + $scope.parcelleculturale[i].ID + "',";
            datainsert += "'" + $scope.groupe.IDGroupeCultural_Operationnel + "',";
            datainsert += "'" + pc.IDFermes + "'";
            datainsert += "),";
          }
          //check campagneagricole
          $scope.progress = true;
          //Edit
          parcelleculturalgroupeoperationnel.Create({
            "DATAINSERT": datainsert.substring(0, datainsert.length - 1)
          }).then(async function(res) {
            NProgress.done();
            pc.resedit = res.data;
            if (pc.resedit[0].message == 'ajout reussi') {
              toastr.clear();
              toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                closeButton: true
              });
              $mdDialog.hide();
              document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
              pc.dtInstance.reloadData();
              $scope.progress = false;
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                closeButton: true
              });
              $scope.progress = false;
            }
          });


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }

    function actionsHtml(data, type, full, meta) {
      pc.objAction[data.IDParcelleCultural_Groupe_Operationnel] = data;
      return '<button class="btn btn-danger btn-xs" title="Retirer" ng-click="pc.delete(pc.objAction[' + data.IDParcelleCultural_Groupe_Operationnel + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //delete
    pc.delete = async function(c) {
      pc.IDParcelleCultural_Groupe_Operationnel = c.IDParcelleCultural_Groupe_Operationnel;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            parcelleculturalgroupeoperationnel.delete({
              ID: pc.IDParcelleCultural_Groupe_Operationnel
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie!")), {
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