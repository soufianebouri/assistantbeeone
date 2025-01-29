'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositorySecteurirrigationCtrl
 * @description
 * # RepositorySecteurirrigationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositorySecteurirrigationCtrl', function($scope,
    $compile, $uibModal, _url, DTOptionsBuilder,
    DTColumnBuilder, DTDefaultOptions, $q,
    TypeVarieteService, $mdDialog, toastr, secteurirrigation, translatedwords, $cookies, Bloc, modeirrigation, ParcellePhysique, $filter, $translatePartialLoader, $translate, $window
  ) {
    var pc = this;
    $scope._ = _;
    pc.dtInstance = {};
    pc.secteurIrrigationObject = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.ifoundData = false;
    pc.parcelleTab = [];
    pc.SpusParcelleTab = [];
    pc.SupTab = [];
    pc.VanneTab = [];
    pc.Nbre_GouteurTab = [];
    pc.Debit_SPTab = [];
    pc.Debit_GouteurTab = [];
    pc.obj = {
      "FERME": pc.IDFerme
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        secteurirrigation.getallbyferme(pc.obj).then(function(result) {
          NProgress.done();
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');

            if (aData.ParcellePhysiqueRefFood) {
              try {
                pc.parcelleTab = aData.ParcellePhysiqueRefFood.split(",");
              } catch (e) {
                pc.parcelleTab = aData.ParcellePhysiqueRefFood;
              }
            } else {
              pc.parcelleTab = [];
            }

            if (aData.RefFood) {
              try {
                pc.SpusParcelleTab = aData.RefFood.split(",");
              } catch (e) {
                pc.SpusParcelleTab = aData.RefFood;
              }
            } else {
              pc.SpusParcelleTab = [];
            }

            if (aData.SupFood) {
              try {
                pc.SupTab = aData.SupFood.split(",");
              } catch (e) {
                pc.SupTab = aData.SupFood;
              }
            } else {
              pc.SupTab = [];
            }

            if (aData.VaneFood) {
              try {
                pc.VanneTab = aData.VaneFood.split(",");
              } catch (e) {
                pc.VanneTab = aData.VaneFood;
              }
            } else {
              pc.VanneTab = [];
            }

            if (aData.Nbre_GouteurFood) {
              try {
                pc.Nbre_GouteurTab = aData.Nbre_GouteurFood.split(",");
              } catch (e) {
                pc.Nbre_GouteurTab = aData.Nbre_GouteurFood;
              }
            } else {
              pc.Nbre_GouteurTab = [];
            }

            if (aData.Debit_GouteurFood) {
              try {
                pc.Debit_GouteurTab = aData.Debit_GouteurFood.split(",");
              } catch (e) {
                pc.Debit_GouteurTab = aData.Debit_GouteurFood;
              }
            } else {
              pc.Debit_GouteurTab = [];
            }

            if (aData.Debit_SPFood) {
              try {
                pc.Debit_SPTab = aData.Debit_SPFood.split(",");
              } catch (e) {
                pc.Debit_SPTab = aData.Debit_SPFood;
              }
            } else {
              pc.Debit_SPTab = [];
            }
          });
        });
        return nRow;
      })
      .withOption('initComplete', function(settings, json) {
        pc.ifoundData = true;
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
            pc.AddSecteurIrrigation();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Bloc').withTitle(translatedwords.getTranslatedWord($translate("Bloc d'irrigation"))),
      DTColumnBuilder.newColumn('Secteur').withTitle(translatedwords.getTranslatedWord($translate("Désignation Secteur"))),
      DTColumnBuilder.newColumn('Satation_de_tete').withTitle(translatedwords.getTranslatedWord($translate("Satation de tête"))),
      DTColumnBuilder.newColumn('Statut').withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        if (full.IDStatut)
          return "Clôturer";
        return "En cours";
      }),
      DTColumnBuilder.newColumn('Superficie').withTitle(translatedwords.getTranslatedWord($translate("Superficie"))).renderWith(function(data, type, full, meta) {
        if (full.Superficie)
          return full.Superficie.toFixed(2);
        return '';
      }),
      DTColumnBuilder.newColumn('NbreGoutteur').withTitle(translatedwords.getTranslatedWord($translate("Nombre distributeurs"))),
      DTColumnBuilder.newColumn('Libelle').withTitle(translatedwords.getTranslatedWord($translate("Mode d'irrigation"))),
      DTColumnBuilder.newColumn('Effic').withTitle(translatedwords.getTranslatedWord($translate("Efficience(%)"))),
      DTColumnBuilder.newColumn('KP').withTitle(translatedwords.getTranslatedWord($translate("Coefficient cultural(KC)"))).renderWith(function(data, type, full, meta) {
        if (full.KP)
          return full.KP.toFixed(2);
        return '';
      }),
      DTColumnBuilder.newColumn('Pluvio').withTitle(translatedwords.getTranslatedWord($translate("Pluvio système (M3/ha/h)"))).renderWith(function(data, type, full, meta) {
        if (full.Pluvio)
          return full.Pluvio.toFixed(2);
        return '';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withClass('nowraptd all').notSortable().renderWith(actionsHtml)
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //add
    pc.AddSecteurIrrigation = function() {
      $q.all([Bloc.getAllbyFerme(pc.obj),
        modeirrigation.getAllbyFerme(pc.obj),
        ParcellePhysique.getParcellePhysique(_url, {
          IDFermes: pc.IDFerme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.blocs = values[0].data;
        $scope.modeirrigations = values[1].data;
        $scope.ParcellePhysiques = values[2].data;
        $scope.showAdvancedAddSecteurIrrigation("ev", $scope.blocs, $scope.modeirrigations, $scope.ParcellePhysiques);
      });
    }

    //add AddSecteurIrrigation
    $scope.showAdvancedAddSecteurIrrigation = function(ev, blocs, modeirrigations, ParcellePhysiques) {
      $mdDialog.show({
          controller: DialogControllerAddSecteurIrrigation,
          templateUrl: '././views/templates/secteurirrigation/AddSecteurIrrigation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            blocs: blocs,
            modeirrigations: modeirrigations,
            ParcellePhysiques: ParcellePhysiques
          }
        })
        .then(function(answer) {}, function() {});
    }

    //add AddSecteurIrrigation
    function DialogControllerAddSecteurIrrigation($scope, $mdDialog, blocs, modeirrigations, ParcellePhysiques) {
      $scope.progress = false;
      $scope.blocs = blocs;
      $scope.modeirrigations = modeirrigations;
      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.Statut = 0;

      $scope.foods = [{
        physique: "",
        sousparcelle: "",
        SuperficieSousPrcelle: "",
        Vanne: "",
        nbrdistributeurs: "",
        debit: "",
        debitSouParcelle: ""
      }];

      $scope.getSumSupInsered = function(index) {
        var sup = 0;
        var i = -1;
        angular.forEach($scope.foods, function(value, key) {
          i++;
          if (value.physique.ID == $scope.foods[index].physique.ID && index != i) {
            sup += value.SuperficieSousPrcelle;
          }
        })
        return sup;
      }

      $scope.ChackNameInsered = function(index) {
        var kayn = false;
        var i = -1;
        angular.forEach($scope.foods, function(value, key) {
          i++;
          if (value.sousparcelle == $scope.foods[index].sousparcelle && !kayn && index != i) {
            kayn = true;
          }
        })
        return kayn;
      }

      $scope.cloneItem = function(index) {
        var itemToClone = {
          physique: "",
          sousparcelle: "",
          SuperficieSousPrcelle: "",
          Vanne: "",
          nbrdistributeurs: "",
          debit: "",
          debitSouParcelle: ""
        };
        if ($scope.foods[index].physique && $scope.foods[index].sousparcelle && $scope.foods[index].SuperficieSousPrcelle >= 0 && $scope.foods[index].nbrdistributeurs >= 0 && $scope.foods[index].debit >= 0) {

          $scope.SupPhysique = $scope.foods[index].physique.Sup;

          $q.all([secteurirrigation.getsupsousparcelle({
              "PARCELLE": $scope.foods[index].physique.ID
            }),
            secteurirrigation.getUniqueSouParcelleName({
              "REF": $scope.foods[index].sousparcelle
            })
          ]).then(async (values) => {
            NProgress.done();
            $scope.TotalSupSousParcelle = values[0].data[0].SupSousParcelle;
            $scope.NbrRef = values[1].data[0].nbrSousParcelle;


            if ($scope.foods[index].SuperficieSousPrcelle <= ($scope.SupPhysique - ($scope.TotalSupSousParcelle + $scope.getSumSupInsered(index)))) {
              if ($scope.NbrRef == 0 && !$scope.ChackNameInsered(index)) {
                $scope.foods.push(itemToClone);
              } else {
                toastr.error("Le Réference sous-parcelle " + $scope.foods[index].sousparcelle + " est deje existe !", {
                  closeButton: true
                });
              }

            } else {
              toastr.error("Veuillez corriger la superficie : La superficie des sous parcelles dépasse celle de la parcelle physique référence + " + $scope.foods[index].physique.Ref + " !", {
                closeButton: true
              });
            }


          }).catch(async e => {
            toastr.clear();
            toastr.error("Connexion au serveur perdu, réessayer ultérieurement : " + e.data, {
              closeButton: true
            });
            //$scope.foods[index].physique = undefined;
          });


        } else {
          toastr.clear();
          toastr.error("Veuillez renseigner tous les champs obligatoires", {
            closeButton: true
          });
        }
      }

      $scope.checkLast = function(index) {
        var foudit = false;
        $scope.SupPhysique = $scope.foods[index].physique.Sup;
        $q.all([secteurirrigation.getsupsousparcelle({
            "PARCELLE": $scope.foods[index].physique.ID
          }),
          secteurirrigation.getUniqueSouParcelleName({
            "REF": $scope.foods[index].sousparcelle
          })
        ]).then((values) => {
          NProgress.done();
          $scope.TotalSupSousParcelle = values[0].data[0].SupSousParcelle;
          $scope.NbrRef = values[1].data[0].nbrSousParcelle;

          if ($scope.foods[index].SuperficieSousPrcelle <= ($scope.SupPhysique - ($scope.TotalSupSousParcelle + $scope.getSumSupInsered(index)))) {
            if ($scope.NbrRef == 0 && !$scope.ChackNameInsered(index)) {
              foudit = true;
            } else {
              toastr.error("Le Réference sous-parcelle est deje existe !", {
                closeButton: true
              });
              $scope.progress = false;
              foudit = false;
            }

          } else {
            toastr.error("Veuillez corriger la superficie : La superficie des sous parcelles dépasse celle de la parcelle physique !", {
              closeButton: true
            });
            $scope.progress = false;
            foudit = false;
          }


          return foudit;
        }).catch(async e => {
          toastr.clear();
          toastr.error("Connexion au serveur perdu, réessayer ultérieurement : " + e.data, {
            closeButton: true
          });
          //$scope.foods[index].physique = undefined;
          $scope.progress = false;

          return false;
        });

      }

      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            physique: "",
            sousparcelle: "",
            SuperficieSousPrcelle: "",
            Vanne: "",
            nbrdistributeurs: "",
            debit: "",
            debitSouParcelle: ""
          });
        }
      }



      $scope.notIn = (IDParcelle) => {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.physique.ID == IDParcelle && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.getSumSup = () => {
        return _.sumBy($scope.foods, 'SuperficieSousPrcelle')
      }

      $scope.getSumGoutteur = () => {
        return _.sumBy($scope.foods, 'nbrdistributeurs')
      }

      $scope.getSumPluviometrie = () => {
        return $filter('floatasNBRdigits')((_.sumBy($scope.foods, 'debit') * 0.001 / $scope.getSumSup()), 3);
      }

      $scope.checkFoods = (index) => {
        if ($scope.foods[index].physique && $scope.foods[index].sousparcelle && $scope.foods[index].SuperficieSousPrcelle >= 0 && $scope.foods[index].nbrdistributeurs >= 0 && $scope.foods[index].debit >= 0) {
          return true;
        } else {
          return false;
          $scope.progress = false;
        }
      }

      $scope.AjouterSecteurIrrigation = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.blocirrigation && $scope.Satation_de_tete && $scope.designationsecteur && $scope.modeirrigation && $scope.Efficience >= 0 && $scope.Coefficient >= 0 && $scope.checkFoods(0) && $scope.checkFoods($scope.foods.length - 1)) {

          $scope.lastIndex = $scope.foods.length - 1;

          $scope.SupPhysique = $scope.foods[$scope.lastIndex].physique.Sup;
          $q.all([secteurirrigation.getsupsousparcelle({
              "PARCELLE": $scope.foods[$scope.lastIndex].physique.ID
            }),
            secteurirrigation.getUniqueSouParcelleName({
              "REF": $scope.foods[$scope.lastIndex].sousparcelle
            })
          ]).then(async (values) => {
            NProgress.done();
            $scope.TotalSupSousParcelle = values[0].data[0].SupSousParcelle;
            $scope.NbrRef = values[1].data[0].nbrSousParcelle;

            if ($scope.foods[$scope.lastIndex].SuperficieSousPrcelle <= ($scope.SupPhysique - ($scope.TotalSupSousParcelle + $scope.getSumSupInsered($scope.lastIndex)))) {
              if ($scope.NbrRef == 0 && !$scope.ChackNameInsered($scope.lastIndex)) {


                pc.objNewSecteurIrrigation = {
                  "blocirrigation": $scope.blocirrigation.ID,
                  "blocirrigationName": $scope.blocirrigation.BLOC,
                  "Satation_de_tete": $scope.Satation_de_tete,
                  "designationsecteur": $scope.designationsecteur,
                  "modeirrigation": $scope.modeirrigation,
                  "Efficience": $scope.Efficience,
                  "Statut": $scope.Statut,
                  "Coefficient": $scope.Coefficient,
                  "sousparcelle": $scope.foods,
                  "SuperficieSousPrcelleTotal": $scope.getSumSup(),
                  "NbrGoutteur": $scope.getSumGoutteur(),
                  "pulvSystem": $scope.getSumPluviometrie(),
                  "IDFermes": pc.IDFerme
                }
                secteurirrigation.create(pc.objNewSecteurIrrigation).then(async e => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                      closeButton: true
                    });
                    NProgress.done();
                    $mdDialog.hide();
                    document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                    pc.parcelleTab = [];
                    pc.SpusParcelleTab = [];
                    pc.SupTab = [];
                    pc.VanneTab = [];
                    pc.Nbre_GouteurTab = [];
                    pc.Debit_SPTab = [];
                    pc.Debit_GouteurTab = [];
                    pc.dtInstance.reloadData();
                  } else {
                    $scope.progress = false;
                    toastr.clear();
                    toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data, {
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
                toastr.error(await translatedwords.getTranslatedWord($translate("Le Réference sous-parcelle est deje existe !")), {
                  closeButton: true
                });
                $scope.progress = false;
              }

            } else {
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez corriger la superficie : La superficie des sous parcelles dépasse celle de la parcelle physique !")), {
                closeButton: true
              });
              $scope.progress = false;
            }


          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
              closeButton: true
            });
            //$scope.foods[$scope.lastIndex].physique = undefined;
            $scope.progress = false;
          });

        } else {
          $scope.progress = false;
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideSecteurIrrigation = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSecteurIrrigation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      //add block
      $scope.AddBloc = function() {
        $mdDialog.show({
            controller: DialogControllerAddBloc,
            templateUrl: '././views/templates/secteurirrigation/AddBloc.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.blocs = answer;
            $scope.blocirrigation = undefined;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add block
      function DialogControllerAddBloc($scope, $mdDialog) {
        $scope.AjouterBloc = async function() {
          toastr.clear();
          if ($scope.Bloc && $scope.StationTete) {
            pc.objNewBloc = {
              "Bloc": $scope.Bloc,
              "StationTete": $scope.StationTete,
              "IDFermes": pc.IDFerme
            }
            $scope.progress = true;
            Bloc.create(pc.objNewBloc).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                Bloc.getAllbyFerme(pc.obj).then(async result => {
                  NProgress.done();
                  $mdDialog.hide(result.data);
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce bloc existe déjà !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.hideBloc = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.AnnulerBloc = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




      }

      //add Mode irrigation
      $scope.AddModeIrrigation = function() {
        $mdDialog.show({
            controller: DialogControllerAddModeIrrigation,
            templateUrl: '././views/templates/secteurirrigation/AddModeIrrigation.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.modeirrigations = answer;
            $scope.modeirrigation = undefined;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add block
      function DialogControllerAddModeIrrigation($scope, $mdDialog) {
        $scope.AjouterModeIrrigation = async function() {
          toastr.clear();
          if ($scope.Libelle) {
            pc.objNewAjouterModeIrrigation = {
              "Libelle": $scope.Libelle,
              "IDFermes": pc.IDFerme
            }

            $scope.progress = true;
            modeirrigation.create(pc.objNewAjouterModeIrrigation).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                modeirrigation.getAllbyFerme(pc.obj).then(async result => {
                  NProgress.done();
                  $mdDialog.hide(result.data);
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce Mode d'irrigation existe déjà !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.hideModeIrrigation = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.AnnulerModeIrrigation = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




      }



    }


    //edit
    pc.edit = function(data) {
      $q.all([Bloc.getAllbyFerme(pc.obj),
        modeirrigation.getAllbyFerme(pc.obj),
        ParcellePhysique.getParcellePhysique(_url, {
          IDFermes: pc.IDFerme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.blocs = values[0].data;
        $scope.modeirrigations = values[1].data;
        $scope.ParcellePhysiques = values[2].data;
        $scope.showAdvancedEditSecteurIrrigation("ev", data, $scope.blocs, $scope.modeirrigations, $scope.ParcellePhysiques);
      });
    }

    $scope.showAdvancedEditSecteurIrrigation = function(ev, data, blocs, modeirrigations, ParcellePhysiques) {
      $mdDialog.show({
          controller: DialogControllerEditSecteurIrrigation,
          templateUrl: '././views/templates/secteurirrigation/EditSecteurIrrigation.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          locals: {
            blocs: blocs,
            modeirrigations: modeirrigations,
            ParcellePhysiques: ParcellePhysiques,
            data: data
          }
        })
        .then(function(answer) {}, function() {});
    }


    function DialogControllerEditSecteurIrrigation($scope, $mdDialog, data, blocs, modeirrigations, ParcellePhysiques) {
      $scope.progress = false;
      $scope.data = data;
      $scope.data.Pluvio = ($scope.data.Pluvio) ? parseFloat($scope.data.Pluvio.toFixed(2)) : 0;
      $scope.blocs = blocs;
      $scope.modeirrigations = modeirrigations;
      $scope.ParcellePhysiques = ParcellePhysiques;
      $scope.Statut = 1;
      $scope.data.KP = $filter('floatasNBRdigits')($scope.data.KP, 2);

      $scope.foods = [];

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      if ($scope.data.ParcellePhysiqueSupFood) {
        try {
          $scope.data.ParcellePhysiqueSupFood = $scope.data.ParcellePhysiqueSupFood.split(",").map(Number);
        } catch (e) {
          $scope.data.ParcellePhysiqueSupFood = $scope.data.ParcellePhysiqueSupFood;
        }
      } else {
        $scope.data.ParcellePhysiqueSupFood = [];
      }

      if ($scope.data.ParcellePhysiqueFood) {
        try {
          $scope.data.ParcellePhysiqueFood = $scope.data.ParcellePhysiqueFood.split(",").map(Number);
        } catch (e) {
          $scope.data.ParcellePhysiqueFood = $scope.data.ParcellePhysiqueFood
        }
      } else {
        $scope.data.ParcellePhysiqueFood = [];
      }

      if ($scope.data.RefFood) {
        try {
          $scope.data.RefFood = $scope.data.RefFood.split(",");
        } catch (e) {
          $scope.data.RefFood = $scope.data.RefFood;
        }

      } else {
        $scope.data.RefFood = [];
      }

      if ($scope.data.SupFood) {
        try {
          $scope.data.SupFood = $scope.data.SupFood.split(",").map(Number);
        } catch (e) {
          $scope.data.SupFood = $scope.data.SupFood;
        }

      } else {
        $scope.data.SupFood = [];
      }

      if ($scope.data.VaneFood) {
        try {
          $scope.data.VaneFood = $scope.data.VaneFood.split(",");
        } catch (e) {
          $scope.data.VaneFood = $scope.data.VaneFood;
        }

      } else {
        $scope.data.VaneFood = [];
      }

      if ($scope.data.Nbre_GouteurFood) {
        try {
          $scope.data.Nbre_GouteurFood = $scope.data.Nbre_GouteurFood.split(",").map(Number);
        } catch (e) {
          $scope.data.Nbre_GouteurFood = $scope.data.Nbre_GouteurFood;
        }

      } else {
        $scope.data.Nbre_GouteurFood = [];
      }

      if ($scope.data.Debit_SPFood) {
        try {
          $scope.data.Debit_SPFood = $scope.data.Debit_SPFood.split(",").map(Number);
        } catch (e) {
          $scope.data.Debit_SPFood = $scope.data.Debit_SPFood;
        }
      } else {
        $scope.data.Debit_SPFood = [];
      }

      if ($scope.data.Debit_GouteurFood) {
        try {
          $scope.data.Debit_GouteurFood = $scope.data.Debit_GouteurFood.split(",").map(Number);
        } catch (e) {
          $scope.data.Debit_GouteurFood = $scope.data.Debit_GouteurFood;
        }
      } else {
        $scope.data.Debit_GouteurFood = [];
      }

      if ($scope.data.IDsousParcelleFoods) {
        try {
          $scope.data.IDsousParcelleFoods = $scope.data.IDsousParcelleFoods.split(",").map(Number);
        } catch (e) {
          $scope.data.IDsousParcelleFoods = $scope.data.IDsousParcelleFoods;
        }

      } else {
        $scope.data.IDsousParcelleFoods = [];
      }




      if ($scope.data.ParcellePhysiqueFood) {

        for (var i = 0; i < $scope.data.ParcellePhysiqueFood.length; i++) {
          $scope.foods.push({
            physique: {
              ID: parseInt($scope.data.ParcellePhysiqueFood[i]),
              Sup: parseFloat($scope.data.ParcellePhysiqueSupFood[i])
            },
            sousparcelle: $scope.data.RefFood[i],
            SuperficieSousPrcelle: parseFloat($scope.data.SupFood[i]),
            Vanne: $scope.data.VaneFood[i],
            nbrdistributeurs: parseInt($scope.data.Nbre_GouteurFood[i]),
            debit: parseFloat($scope.data.Debit_SPFood[i]),
            debitSouParcelle: parseFloat($scope.data.Debit_GouteurFood[i]),
            IDSousParcelle: parseFloat($scope.data.IDsousParcelleFoods[i])
          });
        }
      }

      if ($scope.foods.length == 0) {
        $scope.foods.push({
          physique: "",
          sousparcelle: "",
          SuperficieSousPrcelle: "",
          Vanne: "",
          nbrdistributeurs: "",
          debit: "",
          debitSouParcelle: "",
          IDSousParcelle: 0
        });
      }

      $scope.cloneItem = async function(index) {
        var itemToClone = {
          physique: "",
          sousparcelle: "",
          SuperficieSousPrcelle: "",
          Vanne: "",
          nbrdistributeurs: "",
          debit: "",
          debitSouParcelle: "",
          IDSousParcelle: 0
        };
        if ($scope.foods[index].physique && $scope.foods[index].sousparcelle && $scope.foods[index].SuperficieSousPrcelle >= 0 && $scope.foods[index].nbrdistributeurs >= 0 && $scope.foods[index].debit >= 0) {
          if ($scope.foods.length != $scope.ParcellePhysiques.length) {
            $scope.foods.push(itemToClone);
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Vous avez choisis toutes les parcelle physiques physiques")), {
              closeButton: true
            });
          }
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(itemIndex) {
        $scope.foods.splice(itemIndex, 1);
        if ($scope.foods.length == 0) {
          $scope.foods.push({
            physique: "",
            sousparcelle: "",
            SuperficieSousPrcelle: "",
            Vanne: "",
            nbrdistributeurs: "",
            debit: "",
            debitSouParcelle: "",
            IDSousParcelle: 0
          });
        }

      }


      $scope.notIn = (IDParcelle) => {
        var ifoundIt = false;
        angular.forEach($scope.foods, function(value, key) {
          if (value.physique.ID == IDParcelle && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.getSumSup = () => {
        return _.sumBy($scope.foods, 'SuperficieSousPrcelle')
      }

      $scope.getSumGoutteur = () => {
        return _.sumBy($scope.foods, 'nbrdistributeurs')
      }

      $scope.getSumPluviometrie = () => {
        return $filter('floatasNBRdigits')((_.sumBy($scope.foods, 'debit') * 0.001 / $scope.getSumSup()), 3);
      }

      $scope.checkFoods = async function() {
        var ifoundIt = 0;
        await asyncForEach($scope.foods, async (value, key) => {
          if (value.physique && value.sousparcelle && value.SuperficieSousPrcelle >= 0 && value.nbrdistributeurs >= 0 && value.debit >= 0) {
            ifoundIt++;
          }
        });
        return ifoundIt;
      }



      $scope.getSumSupInsered = async function(index) {
        var sup = 0;
        var i = -1;
        await asyncForEach($scope.foods, async function(value, key) {
          i++;
          if (value.physique.ID == $scope.foods[index].physique.ID && index != key) {
            sup += value.SuperficieSousPrcelle;
          }
        })
        return sup;
      }

      $scope.ChackNameInsered = async function(index) {
        var kayn = false;
        await asyncForEach($scope.foods, async function(value, key) {
          if (value.sousparcelle == $scope.foods[index].sousparcelle && !kayn && index != key) {
            kayn = true;
          }
        })
        return kayn;
      }

      $scope.checkControlFoods = async function() {
        var foudit = false;
        var isfalse = 0;
        await asyncForEach($scope.foods, async (value, key) => {

          if (isfalse == 0) {
            $scope.SupPhysique = $scope.foods[key].physique.Sup;

            await secteurirrigation.getSupSousParcelleEdit({
              "PARCELLE": $scope.foods[key].physique.ID,
              "ID": $scope.foods[key].IDSousParcelle
            }).then(async function(d) {
              NProgress.done();
              $scope.TotalSupSousParcelle = d.data[0].SupSousParcelle;


              await secteurirrigation.getUniqueSouParcelleNameEdit({
                "REF": $scope.foods[key].sousparcelle,
                "ID": $scope.foods[key].IDSousParcelle
              }).then(async function(p) {
                NProgress.done();
                $scope.NbrRef = p.data[0].nbrSousParcelle;

                $q.all([$scope.getSumSupInsered(key)]).then(async (valuessup) => {

                  if ($scope.foods[key].SuperficieSousPrcelle <= ($scope.SupPhysique - ($scope.TotalSupSousParcelle + valuessup[0]))) {

                    $q.all([$scope.ChackNameInsered(key)]).then(async (valuesname) => {

                      if ($scope.NbrRef == 0 && !valuesname[0]) {

                        foudit = true;
                      } else {
                        foudit = false;
                        toastr.error(await translatedwords.getTranslatedWord($translate("Le Réference sous-parcelle ")) + $scope.foods[key].sousparcelle + await translatedwords.getTranslatedWord($translate("est deje existe !")), {
                          closeButton: true
                        });
                        isfalse++;
                      }

                    })


                  } else {
                    foudit = false;
                    toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez corriger la superficie : La superficie des sous parcelles dépasse celle de la parcelle physique référence ")) + $scope.foods[key].physique.Ref + " !", {
                      closeButton: true
                    });
                    isfalse++;
                  }
                })

              }).catch(async e => {
                foudit = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                  closeButton: true
                });
                isfalse++;

              });

            }).catch(async e => {
              foudit = false;
              isfalse++;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                closeButton: true
              });

            });


          }
        });
        return foudit;
      }




      $scope.ModifierSecteurIrrigation = async function() {
        toastr.clear();
        $scope.progress = true;
        if ($scope.blocirrigation && $scope.data.Satation_de_tete && $scope.data.Secteur && $scope.modeirrigation && $scope.data.Effic >= 0 && $scope.data.KP >= 0 && $scope.data.Pluvio >= 0) {

          $q.all([$scope.checkFoods()]).then(async (values) => {
            if (values[0] == $scope.foods.length) {

              $q.all([$scope.checkControlFoods()]).then(async (values) => {
                if (values[0]) {
                  //insert

                  pc.objEditSecteurIrrigation = {
                    "blocirrigation": $scope.blocirrigation.ID,
                    "blocirrigationName": $scope.blocirrigation.BLOC,
                    "Satation_de_tete": $scope.data.Satation_de_tete,
                    "designationsecteur": $scope.data.Secteur,
                    "modeirrigation": $scope.modeirrigation,
                    "Efficience": $scope.data.Effic,
                    "Statut": $scope.Statut,
                    "Coefficient": $scope.data.KP,
                    "sousparcelle": $scope.foods,
                    "SuperficieSousPrcelleTotal": $scope.getSumSup(),
                    "NbrGoutteur": $scope.getSumGoutteur(),
                    "pulvSystem": $scope.getSumPluviometrie(),
                    "IDFermes": pc.IDFerme,
                    "ID": $scope.data.ID
                  }

                  $scope.progress = true;
                  secteurirrigation.update(pc.objEditSecteurIrrigation).then(async e => {
                    if (e.data[0].message == "ajout reussi") {
                      //validate success
                      toastr.clear();
                      toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussite")), {
                        closeButton: true
                      });
                      NProgress.done();
                      $mdDialog.hide();
                      document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                      pc.parcelleTab = [];
                      pc.SpusParcelleTab = [];
                      pc.SupTab = [];
                      pc.VanneTab = [];
                      pc.Nbre_GouteurTab = [];
                      pc.Debit_SPTab = [];
                      pc.Debit_GouteurTab = [];
                      pc.dtInstance.reloadData();
                    } else {
                      toastr.clear();
                      if (e.data[0].description.includes("duplicate key")) {
                        $scope.progress = false;
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce secteur exist déjà !")), {
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
                  $scope.progress = false;
                }
              });

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
                closeButton: true
              });
            }

          })


        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
          $scope.progress = false;
        }

      };


      $scope.hideSecteurIrrigation = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSecteurIrrigation = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


      //add block
      $scope.AddBloc = function() {
        $mdDialog.show({
            controller: DialogControllerAddBloc,
            templateUrl: '././views/templates/secteurirrigation/AddBloc.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.blocs = answer;
            $scope.blocirrigation = undefined;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add block
      function DialogControllerAddBloc($scope, $mdDialog) {
        $scope.AjouterBloc = async function() {
          toastr.clear();
          if ($scope.Bloc && $scope.StationTete) {

            $scope.progress = true;
            pc.objNewBloc = {
              "Bloc": $scope.Bloc,
              "StationTete": $scope.StationTete,
              "IDFermes": pc.IDFerme
            }

            Bloc.create(pc.objNewBloc).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                Bloc.getAllbyFerme(pc.obj).then(result => {
                  NProgress.done();
                  $mdDialog.hide(result.data);
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce bloc existe déjà !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.hideBloc = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.AnnulerBloc = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




      }

      //add Mode irrigation
      $scope.AddModeIrrigation = function() {
        $mdDialog.show({
            controller: DialogControllerAddModeIrrigation,
            templateUrl: '././views/templates/secteurirrigation/AddModeIrrigation.html',
            parent: angular.element(document.body),
            targetEvent: "ev",
            clickOutsideToClose: false
          })
          .then(function(answer) {
            $scope.modeirrigations = answer;
            $scope.modeirrigation = undefined;
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      }

      //add block
      function DialogControllerAddModeIrrigation($scope, $mdDialog) {
        $scope.AjouterModeIrrigation = async function() {
          toastr.clear();
          if ($scope.Libelle) {
            pc.objNewAjouterModeIrrigation = {
              "Libelle": $scope.Libelle,
              "IDFermes": pc.IDFerme
            }

            $scope.progress = true;
            modeirrigation.create(pc.objNewAjouterModeIrrigation).then(async e => {
              if (e.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi")), {
                  closeButton: true
                });
                NProgress.done();
                modeirrigation.getAllbyFerme(pc.obj).then(result => {
                  NProgress.done();
                  $mdDialog.hide(result.data);
                }).catch(async e => {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                if (e.data[0].description.includes("duplicate key")) {
                  toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez noter que ce Mode d'irrigation existe déjà !")), {
                    closeButton: true
                  });
                } else {
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + e.data[0].description, {
                    closeButton: true
                  });
                }
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
            toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
              closeButton: true
            });
          }

        };


        $scope.hideModeIrrigation = function() {
          $mdDialog.hide();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };

        $scope.AnnulerModeIrrigation = function() {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        };




      }



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
            secteurirrigation.delete({
              ID: pc.ID
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                pc.parcelleTab = [];
                pc.SpusParcelleTab = [];
                pc.SupTab = [];
                pc.VanneTab = [];
                pc.Nbre_GouteurTab = [];
                pc.Debit_SPTab = [];
                pc.Debit_GouteurTab = [];
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + result.data[0].description, {
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
      pc.secteurIrrigationObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.secteurIrrigationObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.secteurIrrigationObject[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }






  });