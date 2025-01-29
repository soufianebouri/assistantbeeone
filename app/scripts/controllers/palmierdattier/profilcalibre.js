'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierProfilcalibreCtrl
 * @description
 * # PalmierdattierProfilcalibreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierProfilcalibreCtrl', function($scope, $translatePartialLoader, Arbre, _url, _appFor, $anchorScroll, translatedwords, $rootScope, $window, $translate, DTOptionsBuilder, $filter, campagneagricole, $mdDialog, toastr, DTColumnBuilder, $q, $compile, ProfilCalibre, $state, parcellecultural, GroupeOperationnel, VarieteService, $cookies, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.ProfileCalibreAction = {};
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
    pc.role = $cookies.getObject('globals').currentUser.role;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'profil_calibre'
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
      "STANDARD": true,
      "FERME": [$cookies.getObject('globals').ferme.IDFerme],
      "VARIETE": [0],
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme), VarieteService.getVarieteByParcel(pc.obj)]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.varietes = values[1].data;


      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#VarieteSelection").selectpicker('refresh');
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
          $scope.AddProfilCalibre($scope.visibleAtt)
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        ProfilCalibre.getProfilCalibre(pc.obj).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = moment(result.data[i].DateCreated).format('YYYY-MM-DD');
            result.data[i].TimeCreated = (result.data[i].TimeCreated) ? result.data[i].TimeCreated : "--";
          }
          pc.obj.STANDARD = false;
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
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
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("fichedesuiviprofilcalibre");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Fiche de suivi de profil calibre"))
        },
        {
          text: "<i class='fa fa-columns'></i>",
          action: function(e, dt, node, config) {
            $state.go("etatdesyntheseprofilcalibre");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Etat de synthèse Profil Calibre"))
        },
        {
          text: "<i class='fa fa-columns'></i>",
          action: function(e, dt, node, config) {
            if (pc.isAdmin || pc.role === 2) {
              $state.go("etatdesyntheseprofilcalibreprojection");
            } else {
              toastr.clear();
              toastr.warning("Malheureusement, vous n'avez pas le droit d'accéder !", {
                closeButton: true
              });
            }
          },
          titleAttr: "Etat de synthèse Profil Calibre après projection"
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('TimeCreated').withTitle(translatedwords.getTranslatedWord($translate("Heure"))),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Code_Arbre').withOption('visible', $scope.visibleAtt).withTitle(translatedwords.getTranslatedWord($translate("Arbre"))).renderWith(function(data, type, full, meta) {
        if (full.Code_Arbre)
          return full.Code_Arbre;
        return '';
      }),
      /*DTColumnBuilder.newColumn('Pourcentage_Calibre').withTitle('Pourcentage calibre').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Pourcentage_Calibre + '</p>';
      }),*/
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))),
      DTColumnBuilder.newColumn('includedInScoring').withTitle("Inclus dans le Scoring").renderWith(function(data, type, full, meta) {
        if (full.includedInScoring)
          return 'Oui';
        return (full.filier === 2) ? 'Non' : 'Non (Pas dans la famille Arboriculture.)'
        //return full.filier
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ProfileCalibreAction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.edit(pc.ProfileCalibreAction[' + data.ID + '], ' + $scope.visibleAtt + ')" )"=""><i class="fa fa-edit"></i></button>' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ProfileCalibreAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.ProfileCalibreAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return etat + editbtn + deletebtn;
      }).withOption('width', '8%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }
    //détails ordre
    pc.detailsorder = function(data) {
      pc.ProfileCalibreDetailsByID = data;
      pc.showtable = false;
      pc.showOutil_Attelage_toggle = false;
      pc.AllCalibresMensuration = [];
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }



      $q.all([
        ProfilCalibre.getCalibreByProfil({
          "ID_Obs_Suivi_Profil_Calibre": pc.ProfileCalibreDetailsByID.ID
        }),
        ProfilCalibre.getPourcentageCalibreByProfil({
          "ID_Obs_Suivi_Profil_Calibre": pc.ProfileCalibreDetailsByID.ID
        }),
        ProfilCalibre.getCalibreByProfil_Prevision({
          "ID_Obs_Suivi_Profil_Calibre": pc.ProfileCalibreDetailsByID.ID
        }, pc.ProfileCalibreDetailsByID.saved_prevision),
        ProfilCalibre.getPourcentageCalibreByProfil_Prevision({
          "ID_Obs_Suivi_Profil_Calibre": pc.ProfileCalibreDetailsByID.ID
        }, pc.ProfileCalibreDetailsByID.saved_prevision)
      ]).then((values) => {
        NProgress.done();
        pc.AllCalibresMensuration = values[0].data;
        pc.PourcentageCalibreByProfil = values[1].data;
        pc.AllCalibresMensuration_Prevision = values[2].data;
        pc.PourcentageCalibreByProfil_Prevision = values[3].data;
      });


    }


    //Add AddOrdreTraitement
    $scope.AddProfilCalibre = function(visibleAtt) {
      $mdDialog.show({
          controller: DialogControllerAddProfilCalibre,
          templateUrl: '././views/templates/profilcalibre/AddProfilCalibre.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            visibleAtt: visibleAtt
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddProfilCalibre($scope, $mdDialog, visibleAtt) {

      $scope.savePrevision = false;
      $scope.valueAdd = 0;

      $scope.visibleAtt = visibleAtt;

      $scope.disablePrevision = () => {
        // If pc.isAdmin is 1, return false
        if (pc.isAdmin === 1) {
          return false;
        }

        // If pc.role is 2, return false
        if (pc.role === 2) {
          return false;
        }

        // Check if pc.isAdmin is 0 and pc.role is 1
        if (pc.isAdmin === 0 && pc.role === 1) {
          return true;
        }

        // If none of the conditions match, return false
        return false;
      }
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        Arbre.getArbre(_url, pc.IDferme)
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.Arbres = values[2].data;
        $scope.letmeclick = true;
      });

      $scope.parcelleculturalsel = {};

      $scope.getParcellesByGO = () => {
        $scope.IDArbre = undefined;
        $scope.Arbres = [];
        $scope.parcelleculturalsel = {};
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });

        if ($scope.valueAdd >= 0) {
          $scope.foodsPrevision = angular.copy($scope.foods);
          angular.forEach($scope.foodsPrevision, function(value, key) {

            value.mensuration += $scope.valueAdd;

            /*var matchingCalibre = $scope.Calibres.find(function(calibre) {
              return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
            });*/

            /*if (matchingCalibre) {
              value.Calibre = matchingCalibre.IDCalibre;
            } else {
              value.Calibre = null;
            }*/

            /*if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }*/

          });
        }
      }


      $scope.setiadd = (index) => {
        /*angular.forEach($scope.foods, function(value, key) {
          if (value.mensuration) {
            value.purcentagemensuration = parseFloat((value.mensuration / $scope.foods.length).toFixed(2));
          } else {
            value.purcentagemensuration = 0;
          }
        });*/


        //if ($scope.valueAdd >= 0) {

        //$scope.foods[index].color = 'initial'
        //$scope.foodsPrevision = angular.copy($scope.foods);
        /*angular.forEach($scope.foodsPrevision, function(value, key) {

          value.mensuration += $scope.valueAdd;

          var matchingCalibre = $scope.Calibres.find(function(calibre) {
            return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
          });

          if (matchingCalibre) {
            value.Calibre = matchingCalibre.IDCalibre;
          } else {
            value.Calibre = null;
          }

          if (value.mensuration) {
            value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
          } else {
            value.purcentagemensuration = 0;
          }

        });*/
        //}


      }


      $scope.addValue = function(valAdd) {
        //$scope.foodsPrevision = angular.copy($scope.foods);
        //  angular.forEach($scope.foodsPrevision, function(value, key) {
        //    if (valAdd) {
        //      value.mensuration += valAdd;

        /*var matchingCalibre = $scope.Calibres.find(function(calibre) {
          return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
        });*/

        /*if (matchingCalibre) {
          value.Calibre = matchingCalibre.IDCalibre;
        } else {
          value.Calibre = null;
        }*/

        //    } else {

        //  }
        //  });

      }


      $scope.setrows = async function() {
        NProgress.start();
        $scope.foods = [];

        const pushFoodPromise = new Promise((resolve) => {
          for (let i = 0; i < $scope.nbrrow; i++) {
            $scope.foods.push({
              mensuration: 0,
              purcentagemensuration: 0,
              Calibre: -1,
              CalibrePourcentage: 0
            });

            if (i === $scope.nbrrow - 1) {
              // Resolve the promise when the loop is finished
              resolve();
            }
          }
        });

        // Wait for the loop to finish and then call NProgress.done()
        await pushFoodPromise.then(() => {
          NProgress.done();
        });
      }


      $scope.getCalibreGO = () => {
        $scope.IDArbre = undefined;
        $q.all([
          ProfilCalibre.getCalibreByVariete({
            IDvariete: $scope.parcelleculturalsel.Variete
          }),
          Arbre.getArbreByParcelle({
            DOMAINE: pc.IDferme,
            PARCELLE_CULTURAL: [$scope.parcelleculturalsel.ID]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Calibres = values[0].data;
          $scope.Arbres = values[1].data;
          $scope.addValue($scope.valueAdd);
          $scope.letmeclick = true;
        });
      }

      /*$scope.foods = [{
        mensuration: 0,
        purcentagemensuration: 0,
        Calibre: null,
        CalibrePourcentage: 0
      }];*/




      $scope.cloneItem = async function(index) {
        if ($scope.foods[index].mensuration) {
          $scope.foods.push({
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: -1,
            CalibrePourcentage: 0
          });


          //if ($scope.valueAdd >= 0) {
          //$scope.foodsPrevision = angular.copy($scope.foods);
          /*angular.forEach($scope.foodsPrevision, function(value, key) {

            value.mensuration += $scope.valueAdd;

            var matchingCalibre = $scope.Calibres.find(function(calibre) {
              return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
            });

            if (matchingCalibre) {
              value.Calibre = matchingCalibre.IDCalibre;
            } else {
              value.Calibre = null;
            }

            if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }

          });*/
          //}


          /*window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': 'Tab',
            ctrlKey: true
          }));*/


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La mensuration doit être supérieur à zéro")), {
            closeButton: true
          });
        }
      }







      /*document.addEventListener('keyup', async function(event) {
        event.preventDefault();
        if (event.key === '+') {

          let indexKeuup = $scope.foods.length - 1;
          await $scope.cloneItem(indexKeuup);
        }
      });*/


      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        $scope.foodsPrevision.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: -1,
            CalibrePourcentage: 0
          });
        }
      }

      /*$scope.setAVGmensuration = () => {
        $scope.AVGmensuration = parseFloat((_.sumBy($scope.foods, 'mensuration') / $scope.foods.length).toFixed(2));
        return $scope.AVGmensuration;
      }*/

      /*  $scope.setPorcentage = (food) => {
          if (food.mensuration) {
            food.purcentagemensuration = parseFloat((food.mensuration / $scope.foods.length).toFixed(2));
          } else {
            food.purcentagemensuration = 0;
          }
        }*/


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

      $scope.checkfoods = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
            value.color = 'red';
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      function uniqueByKey(array, key) {
        return [...new Map(array.map((x) => [x[key], x])).values()];
      }
      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel)) {
          if ($scope.checkfoods()) {
            if (($scope.savePrevision && $scope.DateProjection) || (!$scope.savePrevision && !$scope.DateProjection)) {
              pc.objAdd = {
                "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
                "TimeObservation": moment().format('HH:mm'),
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "Cible": $scope.Cible,
                "Risque": $scope.Risque,
                "Calibre": $scope.Calibres,
                "foodsMensuration": $scope.foods,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "IDArbre": $scope.IDArbre,
                "Code_compagne": "",
                "foodsPorcentageCalibre": uniqueByKey($scope.foods, 'Calibre'),
                "foodsMensurationPrevision": $scope.foodsPrevision,
                "valueToAdd": ($scope.valueAdd) ? $scope.valueAdd : 0,
                "DateProjection": ($scope.DateProjection) ? moment($scope.DateProjection).format('YYYYMMDD') : null,
                "savePrevision": ($scope.savePrevision) ? 1 : 0
              }

              campagneagricole.CheckCodeCompagnebyTwoDates({
                date_debut: moment($scope.DateObservation).format('YYYYMMDD'),
                IDSOCIETE: pc.IDSociete
              }).then(async e => {
                if (e.data.length > 0) {
                  pc.objAdd.Code_compagne = e.data[0].Code_compagne;

                  ProfilCalibre.createweb(pc.objAdd).then(async e => {
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
                    if (e.data.code == 5487) {
                      toastr.error(e.data.message, {
                        closeButton: true
                      });
                    } else {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data.message, {
                        closeButton: true
                      });
                    }

                  });

                } else {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                    closeButton: true
                  });
                }
              });
            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
                closeButton: true
              });
            }



          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Les mensurations Calibre ne doivent pas être nuls.", {
              closeButton: true
            });
          }

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


    //edit
    pc.edit = function(data, visibleAtt) {
      $mdDialog.show({
          controller: DialogControllerEditProfilCalibre,
          templateUrl: '././views/templates/profilcalibre/EditProfilCalibre.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            data: data,
            visibleAtt: visibleAtt
          }
        })
        .then(function(answer) {}, function() {});
    }

    //edit
    function DialogControllerEditProfilCalibre($scope, $mdDialog, data, visibleAtt) {
      $scope.data = data;
      $scope.visibleAtt = visibleAtt;

      $scope.savePrevision = ($scope.data.saved_prevision) ? true : false;

      $scope.disablePrevision = () => {
        // If pc.isAdmin is 1, return false
        if (pc.isAdmin === 1) {
          return false;
        }

        // If pc.role is 2, return false
        if (pc.role === 2) {
          return false;
        }

        // Check if pc.isAdmin is 0 and pc.role is 1
        if (pc.isAdmin === 0 && pc.role === 1) {
          return true;
        }

        // If none of the conditions match, return false
        return false;
      }

      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        ProfilCalibre.getAllCalibreByProfil({
          ID_Obs_Suivi_Profil_Calibre: $scope.data.ID
        }),
        Arbre.getArbreByParcelle({
          DOMAINE: pc.IDferme,
          PARCELLE_CULTURAL: [$scope.data.ID_ParcelleCulturale]
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.AllCalibre = values[2].data;
        $scope.Arbres = values[3].data;

        $scope.AllCalibrePrevision = angular.copy($scope.AllCalibre);

        if ($scope.AllCalibre.length > 0) {
          $scope.foods = $scope.AllCalibre;
        } else {
          $scope.foods = [{
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: null,
            CalibrePourcentage: 0
          }];
        }


        if ($scope.AllCalibrePrevision.length > 0) {
          $scope.foodsPrevision = $scope.AllCalibrePrevision;
        } else {
          $scope.foodsPrevision = [{
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: null,
            CalibrePourcentage: 0
          }];
        }

        $scope.letmeclick = true;
      });




      $scope.parcelleculturalsel = {};

      $scope.getParcellesByGO = () => {
        $scope.foods = [{
          mensuration: 0,
          purcentagemensuration: 0,
          Calibre: null,
          CalibrePourcentage: 0
        }];
        parcellecultural.showbydomaineandgroupe({
          idferme: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }
      $scope.icanadd = false;

      $scope.getCalibreGO = () => {
        $scope.IDArbre = undefined;
        if ($scope.icanadd) {
          $scope.foods = [{
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: null,
            CalibrePourcentage: 0
          }];
        } else {
          $scope.icanadd = true;
        }

        $q.all([
          ProfilCalibre.getCalibreByVariete({
            IDvariete: $scope.parcelleculturalsel.Variete
          }),
          Arbre.getArbreByParcelle({
            DOMAINE: pc.IDferme,
            PARCELLE_CULTURAL: [$scope.parcelleculturalsel.ID]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Calibres = values[0].data;
          $scope.Arbres = values[1].data;
          $scope.valueAdd = ($scope.data.value_prevision) ? $scope.data.value_prevision : 0;
          $scope.addValue($scope.valueAdd);
          $scope.letmeclick = true;
        });

      }


      $scope.cloneItem = async function(index) {

        if ($scope.foods[index].mensuration) {
          $scope.foods.push({
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: null,
            CalibrePourcentage: 0
          });

          angular.forEach($scope.foods, function(value, key) {
            if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foods.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }
          });

          if ($scope.valueAdd >= 0) {
            $scope.foodsPrevision = angular.copy($scope.foods);
            angular.forEach($scope.foodsPrevision, function(value, key) {

              value.mensuration += $scope.valueAdd;

              var matchingCalibre = $scope.Calibres.find(function(calibre) {
                return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
              });

              if (matchingCalibre) {
                value.Calibre = matchingCalibre.IDCalibre;
              } else {
                value.Calibre = null;
              }

              if (value.mensuration) {
                value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
              } else {
                value.purcentagemensuration = 0;
              }

            });
          }

        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La mensuration doit être supérieur à zéro")), {
            closeButton: true
          });
        }
      }


      document.addEventListener('keyup', async function(event) {
        event.preventDefault();
        if (event.key === '+') {

          let indexKeuup = $scope.foods.length - 1;
          await $scope.cloneItem(indexKeuup);
        }
      });



      $scope.addValue = function(valAdd) {
        $scope.foodsPrevision = angular.copy($scope.foods);
        angular.forEach($scope.foodsPrevision, function(value, key) {
          if (valAdd) {
            value.mensuration += valAdd;

            var matchingCalibre = $scope.Calibres.find(function(calibre) {
              return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
            });

            if (matchingCalibre) {
              value.Calibre = matchingCalibre.IDCalibre;
            } else {
              value.Calibre = null;
            }

          } else {

          }
        });

      }

      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        $scope.foodsPrevision.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            mensuration: 0,
            purcentagemensuration: 0,
            Calibre: null,
            CalibrePourcentage: 0
          });
        } else {

          angular.forEach($scope.foods, function(value, key) {
            if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foods.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }
          });

          angular.forEach($scope.foodsPrevision, function(value, key) {
            if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }
          });


        }
      }

      $scope.setiadd = () => {
        angular.forEach($scope.foods, function(value, key) {
          if (value.mensuration) {
            value.purcentagemensuration = parseFloat((value.mensuration / $scope.foods.length).toFixed(2));
          } else {
            value.purcentagemensuration = 0;
          }
        });


        if ($scope.valueAdd >= 0) {
          $scope.foodsPrevision = angular.copy($scope.foods);
          angular.forEach($scope.foodsPrevision, function(value, key) {

            value.mensuration += $scope.valueAdd;

            var matchingCalibre = $scope.Calibres.find(function(calibre) {
              return calibre.val_min <= value.mensuration && calibre.val_max > value.mensuration;
            });

            if (matchingCalibre) {
              value.Calibre = matchingCalibre.IDCalibre;
            } else {
              value.Calibre = null;
            }

            if (value.mensuration) {
              value.purcentagemensuration = parseFloat((value.mensuration / $scope.foodsPrevision.length).toFixed(2));
            } else {
              value.purcentagemensuration = 0;
            }

          });
        }


      }


      $scope.setAVGmensuration = () => {
        if ($scope.foods) {
          $scope.AVGmensuration = parseFloat((_.sumBy($scope.foods, 'mensuration') / $scope.foods.length).toFixed(2));
          return $scope.AVGmensuration;
        }
      }

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.DateObservation = ($scope.data.DateCreated) ? new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD")) : null;
      $scope.DateProjection = ($scope.data.DateProjection) ? new Date(moment($scope.data.DateProjection).format("YYYY-MM-DD")) : null;

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

      $scope.checkfoods = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }


      function uniqueByKey(array, key) {
        return [...new Map(array.map((x) => [x[key], x])).values()];
      }

      //Modifier
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.DateObservation && !angular.equals({}, $scope.parcelleculturalsel)) {
          if ($scope.checkfoods()) {
            if (($scope.savePrevision && $scope.DateProjection) || (!$scope.savePrevision && !$scope.DateProjection)) {

              pc.objEdit = {
                "ID": $scope.data.ID,
                "DateObservation": moment($scope.DateObservation).format('YYYYMMDD'),
                "TimeObservation": moment().format('HH:mm'),
                "parcelleculturalsel": $scope.parcelleculturalsel,
                "Cible": $scope.Cible,
                "Risque": $scope.Risque,
                "foodsMensuration": $scope.foods,
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "IDUser": pc.IDUser,
                "IDArbre": $scope.IDArbre,
                "Code_compagne": "",
                "foodsPorcentageCalibre": uniqueByKey($scope.foods, 'Calibre'),
                "foodsMensurationPrevision": $scope.foodsPrevision,
                "foodsPorcentageCalibrePrevision": uniqueByKey($scope.foodsPrevision, 'Calibre'),
                "valueToAdd": ($scope.valueAdd) ? $scope.valueAdd : 0,
                "DateProjection": ($scope.DateProjection) ? moment($scope.DateProjection).format('YYYYMMDD') : null,
                "savePrevision": ($scope.savePrevision) ? 1 : 0
              }

              campagneagricole.CheckCodeCompagnebyTwoDates({
                date_debut: moment($scope.DateObservation).format('YYYYMMDD'),
                IDSOCIETE: pc.IDSociete
              }).then(async e => {
                if (e.data.length > 0) {
                  pc.objEdit.Code_compagne = e.data[0].Code_compagne;

                  ProfilCalibre.updateweb(pc.objEdit).then(async e => {
                    if (e.data[0].message == "ajout reussi") {
                      //validate success
                      toastr.clear();
                      toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
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
                    toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                      closeButton: true
                    });
                  });

                } else {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("la date n'appartient a aucune campagne agricole !")), {
                    closeButton: true
                  });
                }
              });

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
                closeButton: true
              });
            }


          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Les mensurations Calibre ne doivent pas être nuls", {
              closeButton: true
            });
          }

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
            ProfilCalibre.delete({
              ID: c.ID
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