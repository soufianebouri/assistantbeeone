'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAnalysequalitativeCtrl
 * @description
 * # RecolteAnalysequalitativeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAnalysequalitativeCtrl', function($scope, translatedwords, $translate, fermete, $filter, $translatePartialLoader, $window, campagneagricole, DTOptionsBuilder, NiveauColorationService, DTColumnBuilder, $q, _url, $compile, analyseQualitative, parcellecultural, $cookies, $state, DTDefaultOptions, $mdDialog, toastr) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.anakysequalitativeObject = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.User = $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom;
    pc.IDUser = $cookies.getObject('globals').assistUser.ID;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;




    analyseQualitative.getmodeAnalyseQualitative({
      farm: pc.IDferme
    }).then(function(result) {
      try {
        if (result.data[0].mode_analyse_qualitative) {
          $state.go('analyseQualitativesimplified');
        }
      } catch (e) {
        $state.go('analyseQualitative');
      }

    }).catch(async e => {
      toastr.clear();
      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
        closeButton: true
      });
    });


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').assistUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'analyse_qualitative'
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
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme)]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();


      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
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
          $scope.AddAnalyse()
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        analyseQualitative.getAnalyseQualitative(pc.obj).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
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
        }, {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("analysequalitativesynthese");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Synthèse de'analyses de maturité des fruits"))
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateAnalyse').withTitle(translatedwords.getTranslatedWord($translate("Date d'analyses"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateAnalyse).format('DD/MM/YYYY');
      }), ,
      DTColumnBuilder.newColumn('DatePrelevement').withTitle(translatedwords.getTranslatedWord($translate("Date de Prélévement"))).renderWith(function(data, type, full, meta) {
        return moment(full.DatePrelevement).format('DD/MM/YYYY');
      }), ,
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('NbreFruitEchantillon').withTitle(translatedwords.getTranslatedWord($translate("Nbre Fruit échantillon"))).renderWith(function(data, type, full, meta) {
        if (full.NbreFruitEchantillon)
          return '<p align="right">' + parseInt(full.NbreFruitEchantillon) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Calibre_Moyen').withTitle(translatedwords.getTranslatedWord($translate("Calibre Tot"))).renderWith(function(data, type, full, meta) {
        if (full.Calibre_Moyen)
          return '<p align="right">' + full.Calibre_Moyen.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('PoidsEchantillon').withTitle(translatedwords.getTranslatedWord($translate("Poids échantillon"))).renderWith(function(data, type, full, meta) {
        if (full.PoidsEchantillon)
          return '<p align="right">' + full.PoidsEchantillon.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('calibre').withTitle(translatedwords.getTranslatedWord($translate("Calibre"))),
      DTColumnBuilder.newColumn('Nbre_fruit_avec_pepin').withTitle(translatedwords.getTranslatedWord($translate("Nbre fruit avec pépin"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_fruit_avec_pepin)
          return '<p align="right">' + full.Nbre_fruit_avec_pepin.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Nbre_pepin').withTitle(translatedwords.getTranslatedWord($translate("Nbre de pépin"))).renderWith(function(data, type, full, meta) {
        if (full.Nbre_pepin)
          return '<p align="right">' + full.Nbre_pepin.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Poids_jus').withTitle(translatedwords.getTranslatedWord($translate("Poids de jus"))).renderWith(function(data, type, full, meta) {
        if (full.Poids_jus)
          return '<p align="right">' + full.Poids_jus.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Volume_jus').withTitle(translatedwords.getTranslatedWord($translate("Volume de jus"))).renderWith(function(data, type, full, meta) {
        if (full.Volume_jus)
          return '<p align="right">' + full.Volume_jus.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Brix').withTitle(translatedwords.getTranslatedWord($translate("Brix"))).renderWith(function(data, type, full, meta) {
        if (full.Brix)
          return '<p align="right">' + full.Brix.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Volume').withTitle(translatedwords.getTranslatedWord($translate("Volume NaOH"))).renderWith(function(data, type, full, meta) {
        if (full.Volume)
          return '<p align="right">' + full.Volume.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Acidite').withTitle(translatedwords.getTranslatedWord($translate("Acidité"))).renderWith(function(data, type, full, meta) {
        if (full.Acidite)
          return '<p align="right">' + full.Acidite.toFixed(2) + '</p>';
        return '';
      }),
      DTColumnBuilder.newColumn('Observation').withTitle(translatedwords.getTranslatedWord($translate("Observation"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().renderWith(actionsHtml).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add AddAnalyse
    $scope.AddAnalyse = function() {
      $mdDialog.show({
          controller: DialogControllerAddAvancer,
          templateUrl: '././views/templates/analysequalitative/AddAnalyseQualitative.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAddAvancer($scope, $mdDialog) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        fermete.getallPeau(), fermete.getallFruit()
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.fermetes4Peau = values[1].data;
        $scope.fermetes4Fruit = values[2].data;
        $scope.letmeclick = true;
      });

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.Dateanalyses = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.NbrFruitEchantillon = 20;
      $scope.NiveauColoration = [];
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

      $scope.parcelle_change = function() {
        NProgress.start();
        NiveauColorationService.getColorationbyculture({
          ID_Culture: $scope.parcelleculturalsel.idculture
        }).then(e => {
          NProgress.done();
          $scope.NiveauColoration = e.data;
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }



      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.checkFermetePeauData = function() {
        var ifoundIt = true;
        angular.forEach($scope.fermetes4Peau, function(value, key) {
          if ((value.Valeur < 0 || value.Valeur === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkFermeteFruitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.fermetes4Fruit, function(value, key) {
          if ((value.Valeur || value.Valeur === undefined) < 0 && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkColorationData = function() {
        var ifoundIt = true;
        var sumValColoration = _.sumBy($scope.NiveauColoration, 'Valeur');
        if (sumValColoration > 0) {
          if (sumValColoration == $scope.NbrFruitEchantillon) {
            ifoundIt = true;
          } else {
            ifoundIt = false;
          }
        }
        return ifoundIt;
      }

      $scope.checkBrix = async function() {
        var ifoundIt = true;
        if ($scope.Brix >= 0) {
          if ($scope.Brix < 5 && $scope.Brix > 99) {
            ifoundIt = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Brix :  Min = 5 et max = 99")), {
              closeButton: true
            });
          }
        } else {
          ifoundIt = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Brix :  Min = 5 et max = 99")), {
            closeButton: true
          });
        }
        return ifoundIt;
      }

      $scope.checkVolume = async function() {
        var ifoundIt = true;
        if ($scope.VolumeNaOH >= 0) {
          if ($scope.VolumeNaOH < 1 && $scope.VolumeNaOH > 99) {
            ifoundIt = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Volume NaOH :  Min = 1 et max = 99")), {
              closeButton: true
            });
          }
        } else {
          ifoundIt = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Volume NaOH :  Min = 1 et max = 99")), {
            closeButton: true
          });
        }
        return ifoundIt;
      }



      $scope.setAcidite = function() {
        return parseFloat(($scope.VolumeNaOH * 0.64).toFixed(2));
      }


      $scope.calibre = "Tous calibre";

      //add click
      $scope.AjouterAvancer = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.parcelleculturalsel.ID && $scope.Datedeprelevement && $scope.Dateanalyses && $scope.NbrFruitEchantillon >= 0 && $scope.CalibreTotal >= 0 && $scope.PoitEchantillon >= 0 && $scope.Brix >= 0 && $scope.VolumeNaOH >= 0 && $scope.checkBrix() && $scope.checkVolume() && $scope.nbrefruitavecpepin >= 0 && $scope.Nbredepepin >= 0 && $scope.Poidsdejus >= 0 && $scope.Volumedejus >= 0) {
          if ($scope.checkFermetePeauData()) {
            if ($scope.checkFermeteFruitData()) {
              if ($scope.checkColorationData()) {
                pc.objAdd = {
                  "parcelleculturalsel": $scope.parcelleculturalsel.ID,
                  "Datedeprelevement": moment($scope.Datedeprelevement).format('YYYYMMDD'),
                  "Dateanalyses": moment($scope.Dateanalyses).format('YYYYMMDD'),
                  "Heure": moment().format('HH:mm'),
                  "NbrFruitEchantillon": $scope.NbrFruitEchantillon,
                  "CalibreTotal": $scope.CalibreTotal,
                  "PoitEchantillon": $scope.PoitEchantillon,
                  "nbrefruitavecpepin": $scope.nbrefruitavecpepin,
                  "Nbredepepin": $scope.Nbredepepin,
                  "Poidsdejus": $scope.Poidsdejus,
                  "Volumedejus": $scope.Volumedejus,
                  "Tauxjus": $scope.Poidsdejus / $scope.PoitEchantillon,
                  "Brix": $scope.Brix,
                  "VolumeNaOH": $scope.VolumeNaOH,
                  "Acidite": $scope.VolumeNaOH * 0.64,
                  "fermetes4Peau": $scope.fermetes4Peau,
                  "fermetes4Fruit": $scope.fermetes4Fruit,
                  "NiveauColoration": $scope.NiveauColoration,
                  "Gumming_Leger": $scope.Gumming_Leger,
                  "Gumming_Moyen": $scope.Gumming_Moyen,
                  "Gumming_Sever": $scope.Gumming_Sever,
                  "Granulation_Leger": $scope.Granulation_Leger,
                  "Granulation_Moyen": $scope.Granulation_Moyen,
                  "Granulation_Sever": $scope.Granulation_Sever,
                  "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
                  "Utilisateur": pc.User,
                  "IDFermes": pc.IDferme,
                  "IDUser": pc.IDUser,
                  "Code_compagne": "",
                  "calibre": $scope.calibre
                }


                campagneagricole.CheckCodeCompagnebyTwoDates({
                  date_debut: moment($scope.Dateanalyses).format('YYYYMMDD'),
                  IDSOCIETE: pc.IDSociete
                }).then(async e => {
                  if (e.data.length > 0) {
                    pc.objAdd.Code_compagne = e.data[0].Code_compagne;
                    //add

                    analyseQualitative.createweb(pc.objAdd).then(async e => {
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
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                    closeButton: true
                  });
                });

              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Total coloration doit être égal aux Nbre Fruit échantillon")), {
                  closeButton: true
                });
              }

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner la Fermeté Fruit")), {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner la Fermeté Peau")), {
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

      };


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerAvancer = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


    }

    //Add AddAnalyse
    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControlleredit,
          templateUrl: '././views/templates/analysequalitative/EditAnalyseQualitative.html',
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

    //Add AddAnalyse
    function DialogControlleredit($scope, $mdDialog, data) {
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        fermete.getallPeau(),
        fermete.getallFruit(),
        analyseQualitative.getfermetepeau({
          ID: data.ID
        }),
        analyseQualitative.getfermetefruit({
          ID: data.ID
        }),
        analyseQualitative.getcoloration({
          ID: data.ID
        })
      ]).then((values) => {
        NProgress.done();
        $scope.parcelleculturals = values[0].data;
        $scope.fermetes4Peau = values[1].data;
        $scope.fermetes4Fruit = values[2].data;
        $scope.fermetes4PeauData = values[3].data;
        $scope.fermetes4FruitData = values[4].data;
        $scope.colorationData = values[5].data;
        $scope.letmeclick = true;

        angular.forEach($scope.fermetes4Peau, function(value, key) {
          angular.forEach($scope.fermetes4PeauData, function(valuePeau, keyPeau) {
            if (value.ID == valuePeau.ID_Fermete_Peau) {
              value.Valeur = valuePeau.Fermete_Peau;
            }
          });
        });

        angular.forEach($scope.fermetes4Fruit, function(value, key) {
          angular.forEach($scope.fermetes4FruitData, function(valueFruit, keyFruit) {
            if (value.ID == valueFruit.ID_Fermete_Fruit) {
              value.Valeur = valueFruit.Fermete_Fruit;
            }
          });
        });
      });


      document.getElementById('filter_form').style.display = "none";

      $scope.data = data;
      $scope.Datedeprelevement = ($scope.data.DatePrelevement) ? new Date(moment($scope.data.DatePrelevement).format("YYYY-MM-DD")) : null;
      $scope.Dateanalyses = ($scope.data.DateAnalyse) ? new Date(moment($scope.data.DateAnalyse).format("YYYY-MM-DD")) : null;

      $scope.data.NbreFruitEchantillon = ($scope.data.NbreFruitEchantillon) ? $scope.data.NbreFruitEchantillon : 20;

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

      $scope.parcelle_change = function() {
        NProgress.start();
        NiveauColorationService.getColorationbyculture({
          ID_Culture: $scope.parcelleculturalsel.idculture
        }).then(e => {
          NProgress.done();
          $scope.NiveauColoration = e.data;
          angular.forEach($scope.NiveauColoration, function(value, key) {
            angular.forEach($scope.colorationData, function(valueColor, keyColor) {
              if (value.ID == valueColor.ID_Coloration) {
                value.Valeur = valueColor.Coloration;
              }
            });
          });
        }).catch(async e => {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
            closeButton: true
          });
        });
      }


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.checkFermetePeauData = function() {
        var ifoundIt = true;
        angular.forEach($scope.fermetes4Peau, function(value, key) {
          if ((value.Valeur < 0 || value.Valeur === undefined) && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkFermeteFruitData = function() {
        var ifoundIt = true;
        angular.forEach($scope.fermetes4Fruit, function(value, key) {
          if ((value.Valeur || value.Valeur === undefined) < 0 && ifoundIt) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.checkColorationData = function() {
        var ifoundIt = true;
        var sumValColoration = _.sumBy($scope.NiveauColoration, 'Valeur');
        if (sumValColoration > 0) {
          if (sumValColoration == $scope.data.NbreFruitEchantillon) {
            ifoundIt = true;
          } else {
            ifoundIt = false;
          }
        }
        return ifoundIt;
      }

      $scope.checkBrix = async function() {
        var ifoundIt = true;
        if ($scope.data.Brix >= 0) {
          if ($scope.data.Brix < 5 && $scope.data.Brix > 99) {
            ifoundIt = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Brix :  Min = 5 et max = 99")), {
              closeButton: true
            });
          }
        } else {
          ifoundIt = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Brix :  Min = 5 et max = 99")), {
            closeButton: true
          });
        }
        return ifoundIt;
      }

      $scope.checkVolume = async function() {
        var ifoundIt = true;
        if ($scope.data.Volume >= 0) {
          if ($scope.data.Volume < 1 && $scope.data.Volume > 99) {
            ifoundIt = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Volume NaOH :  Min = 1 et max = 99")), {
              closeButton: true
            });
          }
        } else {
          ifoundIt = false;
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Volume NaOH :  Min = 1 et max = 99")), {
            closeButton: true
          });
        }
        return ifoundIt;
      }



      $scope.setAcidite = function() {
        return parseFloat(($scope.data.Volume * 0.64).toFixed(2));
      }

      $scope.calibre = $scope.data.calibre;
      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.parcelleculturalsel.ID && $scope.Datedeprelevement && $scope.Dateanalyses && $scope.data.NbreFruitEchantillon >= 0 && $scope.data.Calibre_Moyen >= 0 && $scope.data.PoidsEchantillon >= 0 && $scope.data.Brix >= 0 && $scope.data.Volume >= 0 && $scope.checkBrix() && $scope.checkVolume() && $scope.data.Nbre_fruit_avec_pepin >= 0 && $scope.data.Nbre_pepin >= 0 && $scope.data.Poids_jus >= 0 && $scope.data.Volume_jus >= 0) {
          if ($scope.checkFermetePeauData()) {
            if ($scope.checkFermeteFruitData()) {
              if ($scope.checkColorationData()) {
                pc.objEdit = {
                  "ID": $scope.data.ID,
                  "parcelleculturalsel": $scope.parcelleculturalsel.ID,
                  "Datedeprelevement": moment($scope.Datedeprelevement).format('YYYYMMDD'),
                  "Dateanalyses": moment($scope.Dateanalyses).format('YYYYMMDD'),
                  "Heure": moment().format('HH:mm'),
                  "NbrFruitEchantillon": $scope.data.NbreFruitEchantillon,
                  "CalibreTotal": $scope.data.Calibre_Moyen,
                  "PoitEchantillon": $scope.data.PoidsEchantillon,
                  "nbrefruitavecpepin": $scope.data.Nbre_fruit_avec_pepin,
                  "Nbredepepin": $scope.data.Nbre_pepin,
                  "Poidsdejus": $scope.data.Poids_jus,
                  "Volumedejus": $scope.data.Volume_jus,
                  "Tauxjus": $scope.data.Poids_jus / $scope.data.PoidsEchantillon,
                  "Brix": $scope.data.Brix,
                  "VolumeNaOH": $scope.data.Volume,
                  "Acidite": $scope.data.Volume * 0.64,
                  "fermetes4Peau": $scope.fermetes4Peau,
                  "fermetes4Fruit": $scope.fermetes4Fruit,
                  "NiveauColoration": $scope.NiveauColoration,
                  "Gumming_Leger": $scope.data.Gumming_Leger,
                  "Gumming_Moyen": $scope.data.Gumming_Moyen,
                  "Gumming_Sever": $scope.data.Gumming_Sever,
                  "Granulation_Leger": $scope.data.Granulation_Leger,
                  "Granulation_Moyen": $scope.data.Granulation_Moyen,
                  "Granulation_Sever": $scope.data.Granulation_Sever,
                  "Observation": ($scope.data.Observation) ? $filter('textforsqlserver')($scope.data.Observation) : "",
                  "Code_compagne": "",
                  "calibre": $scope.calibre
                }


                campagneagricole.CheckCodeCompagnebyTwoDates({
                  date_debut: moment($scope.Dateanalyses).format('YYYYMMDD'),
                  IDSOCIETE: pc.IDSociete
                }).then(async e => {
                  if (e.data.length > 0) {
                    pc.objEdit.Code_compagne = e.data[0].Code_compagne;
                    //add

                    analyseQualitative.updateWeb(pc.objEdit).then(async e => {
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
                        toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
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
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
                    closeButton: true
                  });
                });

              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Total coloration doit être égal aux Nbre Fruit échantillon")), {
                  closeButton: true
                });
              }

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner la Fermeté Fruit")), {
                closeButton: true
              });
            }
          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner la Fermeté Peau")), {
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

      };


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
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            analyseQualitative.deleteweb({
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

    function actionsHtml(data, type, full, meta) {
      pc.anakysequalitativeObject[data.ID] = data;
      var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.anakysequalitativeObject[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
      var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.anakysequalitativeObject[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
      return editbtn + deletebtn;
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



    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };
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

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });
