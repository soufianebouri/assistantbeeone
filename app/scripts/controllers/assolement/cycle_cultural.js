'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:AssolementCycleCulturalCtrl
 * @description
 * # AssolementCycleCulturalCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('AssolementCycleCulturalCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    DTDefaultOptions,
    $q,
    cycle,
    domaine,
    $cookies, $mdDialog, toastr, campagneagricole, actualisercycle, $timeout
  ) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.dtInstance = {};
    pc.cycle = {};

    pc.obj = {
      "DOMAINE": pc.IDFerme
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        cycle.getCycleByferme(pc.obj).then(result => {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withScroller()
      .withOption('responsive', true)
      .withOption('scrollY', $(window).height() - 320)


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
          action: function(e, dt, node, config) {
            pc.Add();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter un cycle cultural"))
        },
        {
          text: "<i class='fa fa fa-refresh'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.Actualiser();
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Actualisation des cycles culturaux"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('CODE').withTitle(translatedwords.getTranslatedWord($translate("Code cycle"))),
      DTColumnBuilder.newColumn('date_debut').withTitle(translatedwords.getTranslatedWord($translate("Date début"))).renderWith(function(data, type, full, meta) {
        if (full.date_debut)
          return moment(full.date_debut).format('DD/MM/YYYY');
        return ""
      }),
      DTColumnBuilder.newColumn('Date_fin').withTitle(translatedwords.getTranslatedWord($translate("Date fin"))).renderWith(function(data, type, full, meta) {
        if (full.Date_fin)
          return moment(full.Date_fin).format('DD/MM/YYYY');
        return ""
      }),
      DTColumnBuilder.newColumn('Type_cycle').withTitle(translatedwords.getTranslatedWord($translate("Type cycle"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable()
      .renderWith(actionsHtml).withClass('nowraptd all')
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //add
    pc.Actualiser = function(datacycle) {
      $scope.cyles = cycle.getCycleByferme(pc.obj).then(result => {
        return result.data
      });
      pc.showActualiserCycle("ev", $scope.cyles);
    }

    //Actualisation des cycles culturaux
    pc.showActualiserCycle = function(ev, cyles) {
      $mdDialog.show({
          controller: ActualisationCyclesAdd,
          templateUrl: '././views/templates/cycle/ActualisationCycles.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            cyles: cyles
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function ActualisationCyclesAdd($scope, $mdDialog, cyles) {
      $scope.allCycle = cyles;
      $scope.progress = false;
      pc.actualiserSearchObj = {
        IDSOCIETE: pc.IDSociete,
        DOMAINE: pc.IDFerme,
        date1: "",
        date2: "",
        IDCYCLE: 0,
        IDPARCELLECULTURAL: 0
      }


      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      $scope.HLitRecherchePremierCycle = function(Expr1) {
        var defer = $q.defer();
        $scope.existe = 0;
        angular.forEach($scope.allCycle, function(allCycle) {
          if (new String(allCycle.CODE).valueOf() == new String(Expr1).valueOf()) {
            $scope.existe++;
          }
        });
        defer.resolve($scope.existe);
        return defer.promise;
      }

      $scope.HLitRechercheCycle = function(Expr1) {
        var defer = $q.defer();
        $scope.existein = 0;
        angular.forEach($scope.allAsyncCycle, function(allCycle) {
          if (new String(allCycle.CODE).valueOf() == new String(Expr1).valueOf() && $scope.existein == 0) {
            $scope.existein = allCycle.IDCycle;
          }
        });
        defer.resolve($scope.existein);
        return defer.promise;
      }




      $scope.ifondCycle = 0;
      $scope.ifondparcelle = 0;
      $scope.actualiserADD = [];
      $scope.actualiserParcelleADD = [];


      $scope.getFinalCycleData = async function() {
        //get campagne
        await actualisercycle.getCampagne(pc.actualiserSearchObj).then(async function(c) {
          $scope.allcampagnes = c.data;
          await asyncForEach($scope.allcampagnes, async (allcampagnes, i) => {

            pc.actualiserSearchObj.date1 = moment(allcampagnes.Date_debut).format("YYYYMMDD");
            pc.actualiserSearchObj.date2 = moment(allcampagnes.Date_fin).format("YYYYMMDD");
            //get cycle arboriculture
            await actualisercycle.getCycleArbo().then(async function(e) {
              $scope.allcyclesArbo = e.data;

              await asyncForEach($scope.allcyclesArbo, async (allcyclesArbo, i) => {
                //check in allcycles
                await $scope.HLitRecherchePremierCycle(allcyclesArbo.Expr1 + ' ' + allcampagnes.Code_compagne).then(async function(val) {
                  if (val == 0) {
                    //to make nan duplacete on search
                    $scope.allCycle.push({
                      CODE: allcyclesArbo.Expr1 + ' ' + allcampagnes.Code_compagne,
                      date_debut: "2017-10-01",
                      Date_fin: "2018-09-30",
                      IDCycle: 0,
                      IDFermes: pc.IDFerme,
                      Type_cycle: "arboriculture"
                    })

                    $scope.Annee = moment(allcampagnes.Date_debut).format("YYYY");
                    $scope.Mois = moment(allcyclesArbo.Date_debut).format("MM");


                    $scope.datedebutinsert = $scope.Annee + '' + $scope.Mois + '' + '01';
                    $scope.datefin11 = moment($scope.datedebutinsert, 'YYYYMMDD').add(11, 'M');
                    $scope.datefinAnnee = moment($scope.datefin11).format("YYYY");
                    $scope.datefinMois = moment($scope.datefin11).format("MM");
                    $scope.datefinDay = moment($scope.datefin11).endOf("month").format("DD");
                    $scope.datefininsert = $scope.datefinAnnee + '' + $scope.datefinMois + '' + $scope.datefinDay;

                    //push data to insert
                    $scope.actualiserADD.push({
                      CODE: allcyclesArbo.Expr1 + ' ' + allcampagnes.Code_compagne,
                      date_debut: $scope.datedebutinsert,
                      Date_fin: $scope.datefininsert,
                      IDFermes: pc.IDFerme,
                      Type_cycle: "arboriculture"
                    });
                    $scope.ifondCycle++;

                  }
                });


              });




            });

          });


        });

        return $scope.actualiserADD
      }

      $scope.getFinalParcelleData = async function() {
        //get campagne
        await actualisercycle.getCampagne(pc.actualiserSearchObj).then(async function(c) {
          $scope.allcampagnes = c.data;

          await asyncForEach($scope.allcampagnes, async (allcampagnes, i) => {
            //get Parcelle Arbo
            //NB PLZ LOAD ALLcYCLE AGAIN lATER
            await actualisercycle.getParcelleArbo({
              date1: moment(allcampagnes.Date_debut).format("YYYYMMDD"),
              date2: moment(allcampagnes.Date_fin).format("YYYYMMDD"),
              DOMAINE: pc.IDFerme
            }).then(async function(p) {
              $scope.allParcelleArbo = p.data;
              await asyncForEach($scope.allParcelleArbo, async (allParcelleArbo, i) => {
                //check in allcycles
                //$scope.IDCYCLE = $scope.HLitRechercheCycle(allParcelleArbo.codeCyc + ' ' + allcampagnes.Code_compagne);

                await $scope.HLitRechercheCycle(allParcelleArbo.codeCyc + ' ' + allcampagnes.Code_compagne).then(async function(val) {
                  $scope.IDCYCLE = val;
                  if ($scope.IDCYCLE > 0) {
                    //check existance
                    await actualisercycle.getParcelleCycle({
                      IDCYCLE: $scope.IDCYCLE,
                      IDPARCELLECULTURAL: allParcelleArbo.IDParcelle
                    }).then(async function(ex) {
                      try {
                        if (ex.data[0].HNbEnr == 0) {
                          //existe parcelle cycle
                          $scope.actualiserParcelleADD.push({
                            IDCycle: $scope.IDCYCLE,
                            IDParcelleCultural: allParcelleArbo.IDParcelle,
                            IDvariete: allParcelleArbo.Variete
                          });
                          $scope.ifondparcelle++;
                        }
                      } catch (e) {
                        toastr.clear();
                        toastr.error(await translatedwords.getTranslatedWord($translate("Impossible de se connecter au serveur !")), {
                          closeButton: true
                        });
                      }
                    });
                  }
                })
              })


            });
          });


        });

        return $scope.actualiserParcelleADD;
      }




      $scope.Actualiser = function() {
        $scope.progress = true;
        $scope.iactualise = true;
        $scope.cycleactualise = false;
        $scope.parcellectualise = false;
        $scope.actualiserADD = [];
        $scope.actualiserParcelleADD = [];
        $scope.ifondCycle = 0;
        $scope.ifondparcelle = 0;
        $scope.oerationdone = false;

        //NProgress.done();
        //$mdDialog.hide();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        //pc.dtInstance.reloadData();
        $q.all([$scope.getFinalCycleData(), $scope.getFinalParcelleData()]).then((values) => {
          actualisercycle.CreateActualiserCycle({
            actualiserADD: $scope.actualiserADD
          }).then(async e => {

            if (e.data == 'done') {
              //validate success
              $scope.cycleactualise = true;

              $q.all([cycle.getCycleByferme(pc.obj)]).then((values) => {
                $scope.allAsyncCycle = values[0].data;

                $q.all([$scope.getFinalParcelleData()]).then((values) => {
                  actualisercycle.CreateActualiserParcelle({
                    actualiserParcelleADD: $scope.actualiserParcelleADD
                  }).then(async e => {

                    if (e.data == 'done') {
                      //validate success
                      NProgress.done();
                      pc.dtInstance.reloadData();
                      $scope.parcellectualise = true;
                      $scope.progress = false;
                      $scope.oerationdone = true;
                    } else {
                      toastr.clear();
                      toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
                        closeButton: true
                      });
                      $scope.progress = false;
                      NProgress.done();
                    }
                  }).catch(async e => {
                    $scope.progress = false;
                    toastr.clear();
                    toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
                      closeButton: true
                    });
                  });

                })
              })

            } else {
              $scope.progress = false;
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data, {
                closeButton: true
              });
              NProgress.done();
            }
          }).catch(e => {
            $scope.progress = false;
            toastr.clear();
            toastr.error(e.data, {
              closeButton: true
            });
          });
        });

      };


      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = async function() {
        if ($scope.progress) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Traitement en cours, veuillez patienter ..")), {
            closeButton: true
          });
        } else {
          $mdDialog.cancel();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        }

      };

    }

    //add
    pc.Add = function() {
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/cycle/AddCycle.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {}
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog) {
      $scope.Type = "arboriculture";
      $scope.progress = false;

      $scope.checkdates = async function() {
        $scope.youcan = true;
        // control dates
        if (moment($scope.date_debut).isSameOrAfter(moment($scope.date_fin))) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date fin doit être supérieure à la date début !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }
        return $scope.youcan;
      }

      $scope.Ajouter = async function() {
        toastr.clear();
        if ($scope.code && $scope.date_debut && $scope.date_fin) {
          if ($scope.checkdates()) {

            $scope.progress = true;
            pc.objAdd = {
              "IDFermes": pc.IDFerme,
              "CODE": $scope.code,
              "date_debut": moment($scope.date_debut).format('YYYYMMDD'),
              "date_fin": moment($scope.date_fin).format('YYYYMMDD'),
              "Type": $scope.Type,
              "Campagne": "",
            }

            campagneagricole.CheckCodeCompagnebyTwoDates({
              IDSOCIETE: pc.IDSociete,
              date_debut: pc.objAdd.date_debut,
              date_fin: pc.objAdd.date_fin
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objAdd.CODE = pc.objAdd.CODE + ' ' + e.data[0].Code_compagne;
                pc.objAdd.Campagne = e.data[0].Code_compagne;
                cycle.createCycle(pc.objAdd).then(async e => {
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
                    if (e.data[0].description.includes('WDIDX_Cycle_CODEIDFermes')) {
                      toastr.clear();
                      toastr.error(await translatedwords.getTranslatedWord($translate("Ce cycle exist déjà sur la campagne ")) + pc.objAdd.Campagne + " !", {
                        closeButton: true
                      });
                    } else {
                      toastr.clear();
                      toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data[0].description, {
                        closeButton: true
                      });
                    }
                    NProgress.done();
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                NProgress.done();
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Date début n'a pas comprise dans les bornes de campagne !")), {
                  closeButton: true
                });
              }

            });


          }
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

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }

    //edit
    pc.edit = function(cycledata) {
      $scope.showAdvancedEdit("ev", cycledata);
    }


    $scope.showAdvancedEdit = function(ev, cycledata) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/cycle/EditCycle.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            cycledata: cycledata
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, cycledata) {
      $scope.data = cycledata;
      $scope.data.CODE = ($scope.data.CODE.includes(' / ')) ? $scope.data.CODE.substring(0, $scope.data.CODE.length - 12) : $scope.data.CODE
      $scope.date_debut = ($scope.data.date_debut) ? new Date(moment($scope.data.date_debut).format("YYYY-MM-DD")) : null;
      $scope.Date_fin = ($scope.data.Date_fin) ? new Date(moment($scope.data.Date_fin).format("YYYY-MM-DD")) : null;
      $scope.Type = ($scope.data.Type_cycle == 'arboriculture') ? $scope.data.Type_cycle : 'autres';

      $scope.progress = false;

      $scope.checkdates = async function() {
        $scope.youcan = true;
        // control dates
        if (moment($scope.date_debut).isSameOrAfter(moment($scope.Date_fin))) {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("La date fin doit être supérieure à la date début !")), {
            closeButton: true
          });
          $scope.youcan = false;
        }
        return $scope.youcan;
      }

      $scope.Modifier = async function() {
        if ($scope.data.CODE && $scope.date_debut && $scope.Date_fin) {
          if ($scope.checkdates()) {
            $scope.progress = true;
            pc.objEdit = {
              "CODE": $scope.data.CODE,
              "IDCycle": $scope.data.IDCycle,
              "IDFermes": pc.IDFerme,
              "date_fin": moment($scope.Date_fin).format('YYYYMMDD'),
              "date_debut": moment($scope.date_debut).format('YYYYMMDD'),
              "Type": $scope.Type,
              "Campagne": ""
            }

            campagneagricole.CheckCodeCompagnebyTwoDates({
              IDSOCIETE: pc.IDSociete,
              date_debut: pc.objEdit.date_debut,
              date_fin: pc.objEdit.date_fin
            }).then(async e => {
              if (e.data.length > 0) {
                pc.objEdit.CODE = pc.objEdit.CODE + ' ' + e.data[0].Code_compagne;
                pc.objEdit.Campagne = e.data[0].Code_compagne;
                cycle.updateCycle(pc.objEdit).then(async e => {
                  if (e.data[0].message == "ajout reussi") {
                    //validate success
                    toastr.clear();
                    toastr.info(await translatedwords.getTranslatedWord($translate("Modification reussi")), {
                      closeButton: true
                    });
                    NProgress.done();
                    $mdDialog.hide();
                    document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                    pc.dtInstance.reloadData();
                  } else {
                    $scope.progress = false;
                    if (e.data[0].description.includes('WDIDX_Cycle_CODEIDFermes')) {
                      toastr.clear();
                      toastr.error(await translatedwords.getTranslatedWord($translate("Ce cycle exist déjà sur la campagne ")) + pc.objEdit.Campagne + " !", {
                        closeButton: true
                      });
                    } else {
                      toastr.clear();
                      toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + e.data[0].description, {
                        closeButton: true
                      });
                    }
                    NProgress.done();
                  }
                }).catch(async e => {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error(e.data, {
                    closeButton: true
                  });
                });
              } else {
                $scope.progress = false;
                NProgress.done();
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Date début n'a pas comprise dans les bornes de campagne !")), {
                  closeButton: true
                });
              }

            });

          }


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

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

    }


    pc.delete = async function(c) {
      pc.IDCycle = c.IDCycle;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            cycle.deleteCycle({
              IDCycle: pc.IDCycle
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
      pc.cycle[data.IDCycle] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.cycle[' + data.IDCycle + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.cycle[' + data.IDCycle + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }




  });