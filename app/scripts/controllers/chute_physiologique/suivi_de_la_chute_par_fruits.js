'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl
 * @description
 * # ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ChutePhysiologiqueSuiviDeLaChuteParFruitsCtrl', function($scope, $translatePartialLoader, Arbre, _url, _appFor, ChutePhysiologique, translatedwords, $rootScope, $window, $translate, DTOptionsBuilder, $filter, campagneagricole, $mdDialog, toastr, DTColumnBuilder, $q, $compile, ProfilCalibre, $state, parcellecultural, GroupeOperationnel, VarieteService, $cookies, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.chute_fruitsAction = {};
    pc.showtable = true;
    $scope.visibleAtt = (_appFor == 'domaine') ? false : true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    /*var aaa = $translate(['Date', 'Rechercher']).then(function(translations) {
      return translations
    });*/

    var bts = $translate.refresh($window.localStorage.getItem("lang").toLowerCase()).then(function(translations) {
      return translations.table
    });


    pc.dtInstance = {};
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').currentUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Suivi_de_la_chute_par_fruits'
    });

    $scope.canIAction = () => {
      if (pc.isAdmin)
        return {
          add: true,
          update: true,
          delete: true
        }
      return {
        add: opsemisAccess[0].a,
        update: opsemisAccess[0].u,
        delete: opsemisAccess[0].d
      }
    }

    pc.obj = {
      "FERME": pc.IDferme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme), VarieteService.getVarieteByParcel(pc.obj)]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.varietes = values[1].data;


      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);

    });

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    function toggleAll(selectAll, selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          selectedItems[id] = selectAll;
        }
      }
    }

    function toggleOne(selectedItems) {
      for (var id in selectedItems) {
        if (selectedItems.hasOwnProperty(id)) {
          if (!selectedItems[id]) {
            pc.selectAll = false;
            return;
          }
        }
      }
      pc.selectAll = true;
    }

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.AddChuteparfruit()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ChutePhysiologique.getAllChuteFruits(pc.obj).then(function(result) {
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withScroller()
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
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Rechercher"))
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
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("suivi_de_la_chute_par_fruits_etat");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue synthétique"))
        },
        {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("suivi_de_la_chute_par_fruits_etat_graph");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue graphique"))
        }, {
          text: "<i class='fa fa-cogs'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            $scope.script_forcumulbufarm()
          },
          titleAttr: 'MAJ cumul'
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Parcelle').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Date_Controle').withTitle(translatedwords.getTranslatedWord($translate("Date de contrôle"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Controle).format('YYYY/MM/DD');
      }),
      DTColumnBuilder.newColumn('chute_avec_calice').withTitle(translatedwords.getTranslatedWord($translate("Nombre de fruits chutés avec Calice"))).renderWith(function(data, type, full, meta) {
        if (full.chute_avec_calice >= 0)
          return full.chute_avec_calice;
        return '';
      }),
      DTColumnBuilder.newColumn('chute_sans_calice').withTitle(translatedwords.getTranslatedWord($translate("Nombre de fruits chutés sans Calice"))).renderWith(function(data, type, full, meta) {
        if (full.chute_sans_calice >= 0)
          return full.chute_sans_calice;
        return '';
      }),
      DTColumnBuilder.newColumn('cumule_nbr_jr').withTitle(translatedwords.getTranslatedWord($translate("Cumul nombre de jours"))).renderWith(function(data, type, full, meta) {
        if (full.cumule_nbr_jr >= 0)
          return full.cumule_nbr_jr;
        return '';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))).renderWith(function(data, type, full, meta) {
        return full.Nom + ' ' + full.Prenom;
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.chute_fruitsAction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.chute_fruitsAction[' + data.ID + '], ' + $scope.visibleAtt + ')" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.chute_fruitsAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        return editbtn + deletebtn;
      }).withOption('width', '8%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    $scope.script_forcumulbufarm = function() {
      $mdDialog.show({
          controller: Dialogscript_forcumulbufarm,
          templateUrl: '././views/templates/chute_physiologique/forcumulbufarm.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }


    function Dialogscript_forcumulbufarm($scope, $mdDialog) {


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;


      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          $scope.Ifullscreen = false;
        }
      }



      $scope.progress = true;
      toastr.clear();

      //


      NProgress.done();

      ChutePhysiologique.updateALLCumul_byfarm({
        idfarm: pc.IDferme
      }).then(async e => {
        if (e.data[0].message == "ajout reussi") {
          //validate success
          toastr.clear();
          toastr.info("MAJ reussi", {
            closeButton: true
          });
          NProgress.done();
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          pc.dtInstance.reloadData();
        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("an error has occurred", {
            closeButton: true
          });
          NProgress.done();
        }
      }).catch(async ee => {
        NProgress.done();
        $scope.progress = false;
        toastr.clear();
        try {
          toastr.error(ee.data.message, {
            closeButton: true
          });
        } catch (err) {
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + err.message, {
            closeButton: true
          });
        }

      });









      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    //Add AddChuteparfruit
    $scope.AddChuteparfruit = function() {
      $mdDialog.show({
          controller: DialogControllerAddChuteparfruit,
          templateUrl: '././views/templates/chute_physiologique/AddChuteFruits.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddChuteparfruit($scope, $mdDialog) {

      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.letmeclick = true;
      });



      $scope.clearParcelleCumul = function() {
        $scope.parcelleculturalsel = undefined;
      }


      $scope.parcelleculturalsel = {};
      $scope.showif = false;
      $scope.showifSans = false;


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          $scope.Ifullscreen = false;
        }
      }

      $scope.checkNbrFruit = function(a, b) {
        if ((a == 0 && b == 0) || (a == null && b == null) || (a == 0 && b == null) || (b == 0 && a == null))
          return false
        return true
      }

      function isFloat(value) {
        // Use the parseFloat function to convert the value to a float
        // If the parseFloat result is a number and is not equal to the original value, it means it's a float
        return Number(value) === parseFloat(value) && !isNaN(parseFloat(value));
      }

      $scope.validateInputNbrFruitAvecCalice = function() {
        $scope.showif = true;
        if ($scope.NbrFruitAvecCalice !== undefined && $scope.NbrFruitAvecCalice !== null) {
          // Remove any non-digit characters from the input
          if (isFloat($scope.NbrFruitAvecCalice)) {
            $scope.NbrFruitAvecCalice = parseInt($scope.NbrFruitAvecCalice)
          }

          if ($scope.NbrFruitAvecCalice < 0) {
            $scope.NbrFruitAvecCalice = $scope.NbrFruitAvecCalice * (-1)
          }

        }
      };

      $scope.validateInputNbrFruitSansCalice = function() {
        $scope.showifSans = true;
        if ($scope.NbrFruitSansCalice !== undefined && $scope.NbrFruitSansCalice !== null) {
          // Remove any non-digit characters from the input
          if (isFloat($scope.NbrFruitSansCalice)) {
            $scope.NbrFruitSansCalice = parseInt($scope.NbrFruitSansCalice)
          }

          if ($scope.NbrFruitSansCalice < 0) {
            $scope.NbrFruitSansCalice = $scope.NbrFruitSansCalice * (-1)
          }

        }
      };


      //add click
      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel) && $scope.NbrFruitAvecCalice >= 0 && $scope.NbrFruitSansCalice >= 0) {

          pc.objAdd = {
            "Date_Controle": moment($scope.DateObservation).format('YYYYMMDD'),
            "ID_ParcelleCul": $scope.parcelleculturalsel.ID,
            "chute_avec_calice": $scope.NbrFruitAvecCalice,
            "chute_sans_calice": $scope.NbrFruitSansCalice,
            "IDFermes": pc.IDferme,
            "IDProfilCreate": pc.IDUser,
            "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
            "Date_debut_Compagne": null
          }
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": moment($scope.DateObservation).format('YYYYMMDD')
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              pc.objAdd.Date_debut_Compagne = moment(result.data[0].Date_debut).format('YYYYMMDD')


              ChutePhysiologique.create(pc.objAdd).then(async e => {
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
                  toastr.error("an error has occurred", {
                    closeButton: true
                  });
                  NProgress.done();
                }
              }).catch(async ee => {
                NProgress.done();
                $scope.progress = false;
                toastr.clear();
                try {
                  toastr.error(ee.data.message, {
                    closeButton: true
                  });
                } catch (err) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + err.message, {
                    closeButton: true
                  });
                }

              });


            } else {
              NProgress.done();
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
                closeButton: true
              });
              $scope.progress = false;
            }
          })









        } else {
          NProgress.done();
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      }



      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }


    //edit
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEditChuteFruits,
          templateUrl: '././views/templates/chute_physiologique/EditChuteFruits.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {}, function() {});
    }

    //edit
    function DialogControllerEditChuteFruits($scope, $mdDialog, data) {
      $scope.data = data;
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;

        $scope.letmeclick = true;
      });

      $scope.showif = false;
      $scope.showifSans = false;

      $scope.parcelleculturalsel = {};

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = ($scope.data.Date_Controle) ? new Date(moment($scope.data.Date_Controle).format("YYYY-MM-DD")) : null;

      $scope.Ifullscreen = false;

      $scope.Fullscreen = function() {
        if (!$scope.Ifullscreen) {
          $("#model").addClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 0;
          $scope.Ifullscreen = true;
        } else {
          $("#model").removeClass("fullscreen-dialog");
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
          $scope.Ifullscreen = false;
        }
      }




      $scope.clearParcelleCumul = function() {
        $scope.parcelleculturalsel = undefined;
      }

      $scope.checkNbrFruit = function(a, b) {
        if ((a == 0 && b == 0) || (a == null && b == null) || (a == 0 && b == null) || (b == 0 && a == null))
          return false
        return true
      }

      function isFloat(value) {
        // Use the parseFloat function to convert the value to a float
        // If the parseFloat result is a number and is not equal to the original value, it means it's a float
        return Number(value) === parseFloat(value) && !isNaN(parseFloat(value));
      }

      $scope.validateInputNbrFruitAvecCalice = function() {
        $scope.showif = true;
        if ($scope.data.chute_avec_calice !== undefined && $scope.data.chute_avec_calice !== null) {
          // Remove any non-digit characters from the input
          if (isFloat($scope.data.chute_avec_calice)) {
            $scope.data.chute_avec_calice = parseInt($scope.data.chute_avec_calice)
          }

          if ($scope.data.chute_avec_calice < 0) {
            $scope.data.chute_avec_calice = $scope.data.chute_avec_calice * (-1)
          }

        }
      };

      $scope.validateInputNbrFruitSansCalice = function() {

        $scope.showifSans = true;
        if ($scope.data.chute_sans_calice !== undefined && $scope.data.chute_sans_calice !== null) {
          // Remove any non-digit characters from the input
          if (isFloat($scope.data.chute_sans_calice)) {
            $scope.data.chute_sans_calice = parseInt($scope.data.chute_sans_calice)
          }

          if ($scope.data.chute_sans_calice < 0) {
            $scope.data.chute_sans_calice = $scope.data.chute_sans_calice * (-1)
          }

        }
      };


      //Modifier
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel) && $scope.data.chute_avec_calice >= 0 && $scope.data.chute_sans_calice >= 0) {


          pc.objEdit = {
            "id_chute_fruits": $scope.data.ID,
            "Date_Controle": moment($scope.DateObservation).format('YYYYMMDD'),
            "ID_ParcelleCul": $scope.parcelleculturalsel.ID,
            "chute_avec_calice": $scope.data.chute_avec_calice,
            "chute_sans_calice": $scope.data.chute_sans_calice,
            "IDFermes": pc.IDferme,
            "IDProfilUpdate": pc.IDUser,
            "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
            "Date_debut_Compagne": null
          }


          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": moment($scope.DateObservation).format('YYYYMMDD')
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              pc.objEdit.Date_debut_Compagne = moment(result.data[0].Date_debut).format('YYYYMMDD')
              ChutePhysiologique.update(pc.objEdit).then(async e => {
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
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error("an error has occurred", {
                    closeButton: true
                  });
                  NProgress.done();
                }
              }).catch(async e => {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                  closeButton: true
                });
              });
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
                closeButton: true
              });
              $scope.progress = false;
            }
          })







        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      }



      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    pc.delete = async function(c) {

      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ChutePhysiologique.delete({
              ID: c.ID,
              ID_ParcelleCul: c.ID_ParcelleCul
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

    function edit(c) {}

    function deleteRow(c) {}

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
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '], ' + $scope.visibleAtt + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;
      $('.selectpicker').prop('disabled', !pc.obj.STANDARD);
      $('.selectpicker').selectpicker('refresh');

      VarieteService.getVarieteByParcel(pc.obj).then(res => {
        pc.varietes = res.data;
        $('.selectpicker').prop('disabled', false);
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });
      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }


    };

    //by variete
    pc.variete_change = function() {

      var variete = $scope.variete.variete;

      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        variete = [0];

      pc.obj.VARIETE = variete;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {

      }


    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    //by date_fin
    pc.date_fin_change = function() {

      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

  });