'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:NutritionRealisationCtrl
 * @description
 * # NutritionRealisationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('NutritionRealisationCtrl', function($scope, translatedwords,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    $compile,
    realisation,
    $state,
    DTDefaultOptions, parametretechnique,
    $cookies,
    $window, $translate, $translatePartialLoader,
    ordrefertlisation, BilanNutritionnel, $mdDialog, toastr,
    savefilter) {
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    $scope.hour = moment().format("hh:mm");
    $scope.farmName = $cookies.getObject('globals').ferme.NomFerme;
    pc.showtable = true;
    pc.printDetail = false;
    pc.mode_fert = 1;
    pc.realisationfertlisationAction = {};
    $scope.widthPrintDetail = $("#printDetail").css('width');
    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    $scope.currentNavItem = 'realisation';
    pc.User = $cookies.getObject('globals').currentUser.Nom + " " + $cookies.getObject('globals').currentUser.Prenom;
    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": pc.IDferme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }


    if ($window.sessionStorage.length) {
      if ($window.sessionStorage.getItem(0) != null) {
        pc.obj = angular.fromJson($window.sessionStorage.getItem(0));
        $window.sessionStorage.removeItem(0);
        $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
        $scope.date_fin = moment(moment(pc.obj.DATE_FIN).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      }
    } else {
      $scope.date_debut_sel = 0;
      $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');
    }

    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      //Save to filter service
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      //Save to filter service
      savefilter.setFilters(pc.obj);
      pc.dtInstance.reloadData();
    };

    $scope.type = "Type";



    pc.getRealisation = function(d) {
      return realisation.getByFiltre(pc.obj).then(function(result) {
        NProgress.done();
        NProgress.remove();
        d.resolve(result.data);
      });
    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    pc.getDetailFert = (i) => {
      pc.temp_array = pc.allDataFert[1][i];
      return pc.temp_array;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(async function() {
        var defer = $q.defer();
        BilanNutritionnel.getmodefert({
          FERME: pc.IDferme
        }).then(async dt => {
          pc.mode_fert = dt.data[0].Mode_fert;
          await pc.getRealisation(defer);
        })
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
      })
      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          extend: 'collection',
          text: "TYPE <i class='fa fa-chevron-down'></i>",
          buttons: [{
              text: "Tous",
              action: function(e, dt, node, config) {
                $scope.searchByType("");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Fertigation")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Fertigation");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Epandage")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Epandage");
              },
              className: 'SetSize'
            },
            {
              text: translatedwords.getTranslatedWord($translate("Apport foliaire")),
              action: function(e, dt, node, config) {
                $scope.searchByType("Apport foliaire");
              },
              className: 'SetSize'
            }
          ]
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
          titleAttr: translatedwords.getTranslatedWord($translate("Impression simplifiée"))
        },
        {
          text: "<i class='fa fa-save'></i>",
          action: function(e, dt, node, config) {
            pc.printPdf();
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Impression détaillé"))
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }, {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("bilan_nutritionnel");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Bilan nutritionnel"))
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("realisation_synthese");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Etats Ordres"))
        },
        {
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          className: 'pull-left',
          action: function(e, dt, node, config) {
            (pc.mode_fert == 1) ? $scope.AddSimple(): $scope.AddSimple()
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Type de fertigation"))).renderWith(function(data, type, full, meta) {
        if (full.Type == 1) {
          return "<span class='badge-green_withe'>Fertigation</span>";
        } else if (full.Type == 2) {
          return "<span class='badge-orange_withe'>Epandage</span>";
        } else if (full.Type == 3) {
          return "<span class='badge-blue-unclear_withe'>Apport foliaire</span>";
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("N°Ordre"))),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date ordre"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('DATE_realisation').withTitle(translatedwords.getTranslatedWord($translate("Date réalisation"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE_realisation).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Responsable').withTitle(translatedwords.getTranslatedWord($translate("Responsable technique"))),
      DTColumnBuilder.newColumn('OPERATEUR').withTitle(translatedwords.getTranslatedWord($translate("Opérateur de station"))),
      DTColumnBuilder.newColumn('PH').withTitle(translatedwords.getTranslatedWord($translate("PH"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.PH + '</p>';
      }),
      DTColumnBuilder.newColumn('EC').withTitle(translatedwords.getTranslatedWord($translate("EC"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.EC + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Action"))).withClass('nowraptd all').renderWith(actionsHtml).withOption('width', '5%')
    ];



    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    //Add simplifier
    $scope.AddSimple = function() {
      $q.all([realisation.getUndoneFertilisation({
          IDFermes: pc.IDferme
        }),
        BilanNutritionnel.getmodefert({
          FERME: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        $scope.UndoneFertilisation = values[0].data;
        $scope.modefer = values[1].data;
        $scope.showAdvancedAddSimple("ev", $scope.UndoneFertilisation, $scope.modefer);
      });
    }

    //Add simplifier
    $scope.showAdvancedAddSimple = function(ev, UndoneFertilisation, modefer) {
      $mdDialog.show({
          controller: DialogControllerAddSimple,
          templateUrl: '././views/templates/fertilisation/AddRealisationFertilisationSimple.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false,
          locals: {
            UndoneFertilisation: UndoneFertilisation,
            modefer: modefer
          }
        })
        .then(function(answer) {}, function() {});
    }

    //Add simplifier
    function DialogControllerAddSimple($scope, $mdDialog, UndoneFertilisation, modefer) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.UndoneFertilisation = UndoneFertilisation;
      $scope.modefer = modefer;
      $scope.Mode_fert_ha = $scope.modefer[0].Mode_fert_ha;

      $scope.foods = [];

      $scope.getOrdre = () => {
        if ($scope.Ordre.Type != 1) {
          realisation.getFert_EngraisFert_sectByFert({
            ID: $scope.Ordre.ID
          }).then(e => {
            NProgress.done();
            $scope.Fert_EngraisFert_sectByFert = e.data;
            $scope.foods = [];
            angular.forEach($scope.Fert_EngraisFert_sectByFert, function(value, key) {
              $scope.foods.push({
                parcelleID: value.parcelle_id,
                parcelleRef: value.Ref,
                parcelleSup: value.Sup,
                engraisID: value.Engrais,
                engraisRef: value.Designation,
                quantiteOrdre: ($scope.Mode_fert_ha) ? value.Qte_Ordre_HA : value.Qte_Ordre,
                quantiteRealise: ($scope.Mode_fert_ha) ? value.Qte_Ordre_HA : value.Qte_Ordre,
                ID: value.ID
              })
            })

          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
            $scope.Ordre = null;
            $scope.foods = [];
          });
        } else {
          //food fertigation
          $q.all([realisation.getFertilisationSolutionByID({
            ID: $scope.Ordre.ID
          }), realisation.getAllSMByID({
            ID: $scope.Ordre.ID
          })]).then((values) => {
            NProgress.done();
            $scope.FertilisationSolution = values[0].data;
            $scope.AllSM = values[1].data;
          });
        }

      }


      $scope.checkallqteFood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.quantiteRealise == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }
      $scope.getSumSup = () => {
        return parseFloat(_.sumBy($scope.foods, 'parcelleSup').toFixed(2))
      }
      $scope.AjouterSimple = async function() {
        $scope.progress = true;
        toastr.clear();

        parametretechnique.checkcloture({
          idferme: $cookies.getObject('globals').ferme.IDFerme,
          module: 'Technique',
          rubrique: 'Réalisation fertilisation',
          dateaction: moment($scope.datefertilisation).format('YYYYMMDD')
        }).then(async respense => {
          if (respense.data.length == 0) {

            if ($scope.Ordre && $scope.datefertilisation && $scope.foods.length > 0 && $scope.checkallqteFood()) {
              pc.objAdd = {
                "Ordre": $scope.Ordre.ID,
                "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "SupTotal": $scope.getSumSup(),
                "realisation": $scope.foods,
                "Mode_fert_ha": $scope.Mode_fert_ha
              }

              realisation.createwebsimple(pc.objAdd).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
              closeButton: true
            });
          }

        })




      };


      $scope.checkallqteFertilisationSolution = function() {
        var ifoundIt = true;
        angular.forEach($scope.FertilisationSolution, function(value, key) {
          if (!value.Qte_Realisee && !value.Volume_utilise_realisation && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.SetVolumeRealiser = function(Volume_utilise_realisation, Reference) {
        angular.forEach($scope.FertilisationSolution, function(value, key) {
          if (Reference === value.SolutionMereReference) {
            value.Volume_utilise_realisation = Volume_utilise_realisation;
          }
        });
        return Volume_utilise_realisation
      }

      $scope.AjouterRealisationFertigation = async function() {
        $scope.progress = true;
        toastr.clear();

        parametretechnique.checkcloture({
          idferme: $cookies.getObject('globals').ferme.IDFerme,
          module: 'Technique',
          rubrique: 'Réalisation fertilisation',
          dateaction: moment($scope.datefertilisation).format('YYYYMMDD')
        }).then(async respense => {
          if (respense.data.length == 0) {

            if ($scope.Ordre && $scope.datefertilisation && $scope.FertilisationSolution.length > 0 && $scope.checkallqteFertilisationSolution()) {
              pc.objAdd = {
                "Ordre": $scope.Ordre.ID,
                "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
                "Utilisateur": pc.User,
                "IDFermes": pc.IDferme,
                "realisation": $scope.FertilisationSolution
              }

              realisation.createwebsimplefertigation(pc.objAdd).then(async e => {
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
              toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
                closeButton: true
              });
            }

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
              closeButton: true
            });
          }

        })




      };


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //Edit simplifier
    pc.editSimple = function(data) {
      if (data.Type != 1) {
        $q.all([realisation.getFert_AffByID({
            ID: data.ID
          }), realisation.getFert_EngraisFert_sectByFert({
            ID: data.ID
          }),
          BilanNutritionnel.getmodefert({
            FERME: pc.IDferme
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Fert_Aff = values[0].data;
          $scope.Fert_EngraisFert_sectByFert = values[1].data;
          $scope.modefer = values[2].data;
          $scope.showAdvancedEditSimple("ev", data, $scope.Fert_Aff, $scope.Fert_EngraisFert_sectByFert, $scope.modefer);
        });
      } else {
        $q.all([realisation.getFertilisationSolutionByID({
          ID: data.ID
        }), realisation.getAllSMByID({
          ID: data.ID
        })]).then((values) => {
          NProgress.done();
          $scope.FertilisationSolution = values[0].data;
          $scope.AllSM = values[1].data;
          $scope.showAdvancedEditSimpleFertigation("ev", data, $scope.FertilisationSolution, $scope.AllSM);
        });
      }
    }

    //Edit simplifier
    $scope.showAdvancedEditSimple = function(ev, data, Fert_Aff, Fert_EngraisFert_sectByFert, modefer) {

      parametretechnique.checkcloture({
        idferme: $cookies.getObject('globals').ferme.IDFerme,
        module: 'Technique',
        rubrique: 'Réalisation fertilisation',
        dateaction: moment(data.DATE_realisation).format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          $mdDialog.show({
              controller: DialogControllerEditSimple,
              templateUrl: '././views/templates/fertilisation/EditRealisationFertilisationSimple.html',
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
              hasBackdrop: true,
              escapeToClose: false,
              locals: {
                data: data,
                Fert_Aff: Fert_Aff,
                Fert_EngraisFert_sectByFert: Fert_EngraisFert_sectByFert,
                modefer: modefer
              }
            })
            .then(function(answer) {}, function() {});

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })


    }

    //Edit simplifier
    function DialogControllerEditSimple($scope, $mdDialog, data, Fert_Aff, Fert_EngraisFert_sectByFert, modefer) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.Fert_Aff = Fert_Aff;
      $scope.Fert_EngraisFert_sectByFert = Fert_EngraisFert_sectByFert;
      $scope.data = data;
      $scope.datefertilisation = ($scope.data.DATE_realisation) ? new Date(moment($scope.data.DATE_realisation).format("YYYY-MM-DD")) : null;
      $scope.modefer = modefer;
      $scope.Mode_fert_ha = $scope.modefer[0].Mode_fert_ha;

      $scope.foods = [];

      angular.forEach($scope.Fert_EngraisFert_sectByFert, function(value, key) {
        var quantiteRealise = null
        angular.forEach($scope.Fert_Aff, function(valueF, key) {
          if (value.parcelle_id == valueF.parcelle_id && value.Engrais == valueF.Engrais) {
            quantiteRealise = valueF.Quantite
          }
        });
        $scope.foods.push({
          parcelleID: value.parcelle_id,
          parcelleRef: value.Ref,
          parcelleSup: value.Sup,
          engraisID: value.Engrais,
          engraisRef: value.Designation,
          quantiteOrdre: ($scope.Mode_fert_ha) ? value.Qte_Ordre_HA : value.Qte_Ordre,
          quantiteRealise: ($scope.Mode_fert_ha) ? value.Qte_Ordre_HA : value.Qte_Ordre /*quantiteRealise*/
        })
      })


      $scope.checkallqteFood = function() {
        var ifoundIt = true;
        angular.forEach($scope.foods, function(value, key) {
          if (value.quantiteRealise == null && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.ModifierSimple = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.foods.length > 0 && $scope.checkallqteFood()) {
          pc.objAdd = {
            "ID": $scope.data.ID,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "realisation": $scope.foods
          }

          realisation.updatewebsimple(pc.objAdd).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    //Edit simplifier
    $scope.showAdvancedEditSimpleFertigation = function(ev, data, FertilisationSolution, AllSM) {

      parametretechnique.checkcloture({
        idferme: $cookies.getObject('globals').ferme.IDFerme,
        module: 'Technique',
        rubrique: 'Réalisation fertilisation',
        dateaction: moment(data.DATE_realisation).format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          $mdDialog.show({
              controller: DialogControllerEditSimpleFertigation,
              templateUrl: '././views/templates/fertilisation/EditRealisationFertilisationSimpleFertigation.html',
              parent: angular.element(document.body),
              targetEvent: "ev",
              clickOutsideToClose: false,
              hasBackdrop: true,
              escapeToClose: false,
              locals: {
                data: data,
                FertilisationSolution: FertilisationSolution,
                AllSM: AllSM
              }
            })
            .then(function(answer) {}, function() {});

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })


    }

    //Edit simplifier Fertigation
    function DialogControllerEditSimpleFertigation($scope, $mdDialog, data, FertilisationSolution, AllSM) {
      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.FertilisationSolution = FertilisationSolution;
      $scope.AllSM = AllSM;
      $scope.data = data;
      $scope.datefertilisation = ($scope.data.DATE_realisation) ? new Date(moment($scope.data.DATE_realisation).format("YYYY-MM-DD")) : null;




      $scope.SetVolumeRealiser = function(Volume_utilise_realisation, Reference) {
        angular.forEach($scope.FertilisationSolution, function(value, key) {
          if (Reference === value.SolutionMereReference) {
            value.Volume_utilise_realisation = Volume_utilise_realisation;
          }
        });
        return Volume_utilise_realisation
      }

      $scope.checkallqteFertilisationSolution = function() {
        var ifoundIt = true;
        angular.forEach($scope.FertilisationSolution, function(value, key) {
          if (!value.Qte_Realisee && !value.Volume_utilise_realisation && ifoundIt == true) {
            ifoundIt = false;
          }
        });
        return ifoundIt;
      }

      $scope.ModifierSimpleFertigation = async function() {
        $scope.progress = true;
        toastr.clear();
        if ($scope.datefertilisation && $scope.FertilisationSolution.length > 0 && $scope.checkallqteFertilisationSolution()) {
          pc.objAdd = {
            "ID": $scope.data.ID,
            "Date": moment($scope.datefertilisation).format('YYYYMMDD'),
            "Utilisateur": pc.User,
            "IDFermes": pc.IDferme,
            "realisation": $scope.FertilisationSolution
          }

          realisation.updatewebsimplefertigation(pc.objAdd).then(async e => {
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
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };


      $scope.hideSimple = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.AnnulerSimple = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };




    }

    pc.delete = async function(c) {

      parametretechnique.checkcloture({
        idferme: $cookies.getObject('globals').ferme.IDFerme,
        module: 'Technique',
        rubrique: 'Réalisation fertilisation',
        dateaction: moment(c.DATE_realisation).format('YYYYMMDD')
      }).then(async respense => {
        if (respense.data.length == 0) {

          toastr.clear();
          toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
            closeButton: true,
            allowHtml: true,
            onShown: function(toast) {
              $("#confirmationRevertYes").click(function() {
                realisation.delete({
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

        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Tout ajout, modification ou suppression dont la date d'exécution est compromise entre " + moment(respense.data[0].Date_debut).format('DD/MM/YYYY') + " et " + moment(respense.data[0].Date_fin).format('DD/MM/YYYY') + " est bloqué", {
            closeButton: true
          });
        }

      })



    }

    $scope.searchByType = function(type_text) {
      pc.dtInstance.DataTable.search(type_text).draw();
    };


    function actionsHtml(data, type, full, meta) {
      pc.realisationfertlisationAction[data.ID] = data;
      var editbtn = '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.editSimple(pc.realisationfertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-edit"></i></button>';
      var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.realisationfertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
      return dtailsBtn + editbtn +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.realisationfertlisationAction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
    }

    pc.printdetails = function(ordreFertilisationByID) {
      //alert(ordreFertilisationByID);
      var type = "";
      var dateFeri = "";
      var daterealisation = "";
      var Valide = "Non";
      if (ordreFertilisationByID.Type == 1) {
        type = "Fertigation";
      } else if (ordreFertilisationByID.Type == 2) {
        type = "Epandage";
      } else if (ordreFertilisationByID.Type == 3) {
        type = "Apport foliaire";
      }

      if (ordreFertilisationByID.DATE) {
        dateFeri = moment(ordreFertilisationByID.DATE).format('DD/MM/YYYY');
      }

      if (ordreFertilisationByID.Date_Realisation) {
        daterealisation = moment(ordreFertilisationByID.Date_Realisation).format('DD/MM/YYYY');
      }

      if (ordreFertilisationByID.Valide) {
        Valide = "Oui";
      }

      var w = 1000;
      var h = 1000;
      var left = Number((screen.width / 2) - (w / 2));
      var tops = Number((screen.height / 2) - (h / 2));

      var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write('<html><head><title></title>');
      mywindow.document.write('</head><body >');
      //header
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="3" style="width:30%;">' + pc.NomFerme + '</th>' +
        '<th style="width:40%;">' + type + '</th>' +
        '<th rowspan="3" style="width:30%;">Réf</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Le ' + dateFeri + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Liste de diffusion</th>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '</td></tr></table>');

      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" class="pull-right" style="width:50%;" >' +
        '<tr>' +
        '<td style="background:#e0e0e0;">N°Ordre</td>' +
        '<td>' + ordreFertilisationByID.Reference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Date de réalisation</td>' +
        '<td>' + daterealisation + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td style="background:#e0e0e0;">Validé</td>' +
        '<td>' + Valide + '</td>' +
        '</tr>' +
        '</table>');

      mywindow.document.write('<br/>');



      if (ordreFertilisationByID.Type == 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_1").innerHTML);
        $('table').attr('border', '0');
      }

      if (ordreFertilisationByID.Type != 1) {
        $('table').attr('border', '1');
        $('table').width('100%');
        $('td').width('100%');
        $('th').width('100%');
        mywindow.document.write(document.getElementById("tab_2").innerHTML);
        $('table').attr('border', '0');
      }



      mywindow.document.write('<br/>');
      //fert infos
      mywindow.document.write('<table border="0" style="width:100%;" >' +
        '<tr>' +
        '<td rowspan="4" style="width:35%;">Observation<br/><textarea rows="5" cols="30">' + ordreFertilisationByID.Observation + '</textarea></td>' +
        '<td style="width:32.5%;">Opérateurs</td>' +
        '<td style="width:32.5%;">Visa</td>' +
        '</tr>' +
        '<tr>' +
        '<td><input type="text" value="' + ordreFertilisationByID.OPERATEUR + '" size="' + ordreFertilisationByID.OPERATEUR.length + '"/></td>' +
        '<td><input type="text" value=""/></td>' +
        '</tr>' +
        '<tr>' +
        '<td>Responsable</td>' +
        '<td>Visa</td>' +
        '</tr>' +
        '<tr>' +
        '<td><input type="text" value="' + ordreFertilisationByID.Responsable + '" size="' + ordreFertilisationByID.OPERATEUR.length + '"/></td>' +
        '<td><input type="text" value=""/></td>' +
        '</tr>' +
        '</table>');


      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
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



    //détails ordre
    pc.detailsorder = function(data) {
      pc.ordrefertlisationdetails = [];
      pc.parcelles = [];
      pc.secteurs = [];
      pc.engrais = [];
      pc.ordreFertilisationByID = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }
      if (pc.ordreFertilisationByID.Type == 1) {
        //Fertigation
        ordrefertlisation.getByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.ordrefertlisationdetails = res.data;
          NProgress.done();
          NProgress.remove();
        });

        ordrefertlisation.getSecteurByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.secteurs = res.data;
          NProgress.done();
          NProgress.remove();
        });

        /*ordrefertlisation.getFert_EngraisByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.fert_engrais = res.data;
        });*/
      } else {
        ordrefertlisation.getParcelleByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.parcelles = res.data;
          NProgress.done();
          NProgress.remove();
        });

        ordrefertlisation.getEngraisByID({
          "IDFertilisation": pc.ordreFertilisationByID.ID
        }).then(function(res) {
          pc.engrais = res.data;
          NProgress.done();
          NProgress.remove();
        });
      }


    }

    pc.printPdf = () => {
      NProgress.start();
      realisation.getAllDataByDate(pc.obj).then(e => {
        pc.allDataFert = e.data;
        $("#tableToHideInPrint").css("display", "none");
        $("#over").addClass('container-print');
        $(".right_col").css("margin-left", "0");
        $window.sessionStorage.setItem(0, JSON.stringify(pc.obj));
        setTimeout(function() {
          NProgress.done();
          NProgress.remove();
          javascript: window.print();
        }, 2000);

      });
    };

    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      $state.reload();
    });

  });