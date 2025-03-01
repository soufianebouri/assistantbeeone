'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteScoringCtrl
 * @description
 * # RecolteScoringCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteScoringCtrl', function($scope,
    DTOptionsBuilder,
    DTColumnBuilder, familleCible, $mdSelect, scoring,
    $q,
    $compile, observationphyto, GroupeOperationnel,
    AgreageFruit,
    $mdDialog,
    $state,
    $cookies,
    toastr, _url, $filter, translatedwords, cultureService,
    Cible,
    parcellecultural, $window, $translatePartialLoader, $translate, VarieteService, ProfilCalibre,
    DTDefaultOptions,
    NiveauColorationService) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    $scope._ = _;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.Scoringaction = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.showtable = true;

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.User = $cookies.getObject('beeoneAssistant').assistUser.Nom + " " + $cookies.getObject('beeoneAssistant').assistUser.Prenom;
    pc.IDUser = $cookies.getObject('beeoneAssistant').assistUser.ID;
    pc.IDferme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('beeoneAssistant').ferme.IDSociete;

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('beeoneAssistant').assistUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'scoring'
    });

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

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
      "idferme": $cookies.getObject('beeoneAssistant').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };


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
    pc.search = function() {
      pc.dtInstance.reloadData();
    }


    if ($scope.canIAction().add) {
      $scope.btnadd = [{
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          $scope.Add()
        },
        titleAttr: 'Ajouter'
      },
      {
        text: "<i class='fa fa-database'></i>",
        action: function(e, dt, node, config) {
          $state.go("profile_calibre_data_integration");
        },
        titleAttr: "Intégration des Données de Profil Calibre"
      },
      {
        text: "<i class='fa fa-sliders'></i>",
        action: function(e, dt, node, config) {
          $state.go("ajustement_des_calibres");
        },
        titleAttr: "Ajustement des calibres"
      }]
    } else {
      $scope.btnadd = undefined;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        scoring.get_scoring(pc.obj).then(function(result) {
          defer.resolve(result.data);
        });
        NProgress.done();
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
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          orientation: 'landscape',
          exportOptions: {
            columns: ':visible',
            search: 'applied',
            order: 'applied'
          },
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
            $state.go("etatdesynthesescroring");
          },
          titleAttr: "Etat de synthèse"
        }
      ].concat($scope.btnadd));
    pc.dtColumns = [
      DTColumnBuilder.newColumn('Variete').withTitle("Variété"),
      DTColumnBuilder.newColumn('date_scoring').withTitle("Date de scoring").renderWith(function(data, type, full, meta) {
        return moment(full.date_scoring).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('date_previsionnelle_recolte').withTitle("Date prévisionnelle de la récolte").renderWith(function(data, type, full, meta) {
        return moment(full.date_previsionnelle_recolte).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('evolution_journaliere').withTitle("Evolution journalière de la période (mm)"),
      DTColumnBuilder.newColumn('Gumming_Leger').withTitle("Gumming Leger"),
      DTColumnBuilder.newColumn('Gumming_Moyen').withTitle("Gumming Moyen"),
      DTColumnBuilder.newColumn('Gumming_Sever').withTitle("Gumming Sever"),
      DTColumnBuilder.newColumn('Granulation_Leger').withTitle("Granulation Leger"),
      DTColumnBuilder.newColumn('Granulation_Moyen').withTitle("Granulation Moyen"),
      DTColumnBuilder.newColumn('Granulation_Sever').withTitle("Granulation Sever"),
      DTColumnBuilder.newColumn('nbrefruitavecpepin').withTitle("Nbre fruit avec pépine"),
      DTColumnBuilder.newColumn('Nbredepepin').withTitle("Nbre de pépine"),
      DTColumnBuilder.newColumn('NbrFruitEchantillon').withTitle("Nbr fruit échantillon"),
      DTColumnBuilder.newColumn('poids_echantillon').withTitle("Poids échantillon"),
      DTColumnBuilder.newColumn('calibre_total_echantillon').withTitle("Calibre total d'échantillon"),
      DTColumnBuilder.newColumn('poids_jus').withTitle("Poids de jus"),
      DTColumnBuilder.newColumn('volume_jus').withTitle("Volume de jus"),
      DTColumnBuilder.newColumn('brix').withTitle("Brix"),
      DTColumnBuilder.newColumn('volume_naoh').withTitle("Volume NaOH"),
      DTColumnBuilder.newColumn('decision_verger').withTitle("Décision Verger"),
      DTColumnBuilder.newColumn('rpr').withTitle("RPR"),
      DTColumnBuilder.newColumn('classification_code').withTitle("Classification"),
      DTColumnBuilder.newColumn('classification_valeur').withTitle("Valeur classification").renderWith(function(data, type, full, meta) {
        if (full.classification_valeur)
          return full.classification_valeur.toFixed(2)
        return full.classification_valeur
      }),
      DTColumnBuilder.newColumn('classification_color').withTitle("Couleur classification").renderWith(function(data, type, full, meta) {
        if (full.classification_color) {
          return '<div style="width: 20px; height: 20px; border-radius: 50%; background-color: ' + full.classification_color + ';"></div>';
        }
        return 'HC'
      }),
      DTColumnBuilder.newColumn('Observation').withTitle("Observation"),
      DTColumnBuilder.newColumn('createdBy').withTitle("Observateur"),
      DTColumnBuilder.newColumn('profilCalibreOrigin').withTitle("Origine").renderWith(function(data, type, full, meta) {
        if (full.profilCalibreOrigin)
          return 'Profil Calibre';
        return 'Scoring'
      }),
      DTColumnBuilder.newColumn(null).withTitle("Actions").withClass('nowraptd all').notSortable().renderWith(function(data, type, full, meta) {
        pc.Scoringaction[data.ID] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.Scoringaction[' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Scoringaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var dtailsBtn = '<button class="btn btn-success btn-xs" title="Détails" ng-click="pc.detailsorder(pc.Scoringaction[' + data.ID + '])" )"=""><i class="fa fa-eye"></i></button>';
        return editbtn + dtailsBtn + deletebtn;
      }).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    //Add AddOrdreTraitement
    $scope.Add = function() {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/scoring/addScoring.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }

    //Add AddAnalyse
    function DialogControllerAdd($scope, $mdDialog) {
      $scope.decision_verger = 0;
      $scope.rpr = 0;
      $scope.foodsFamille = [];
      $scope.foods = [];
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        familleCible.getall(),
        Cible.getCible(_url),
        VarieteService.showVarieteByCultureFerme({
          FERME: pc.IDferme,
          encour: true,
          culture: [0]
        }),
        cultureService.ByFermeEncours({
          FERME: pc.IDferme
        })
      ]).then((values) => {
        NProgress.done();
        //$scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.familles = values[2].data;
        var validCategories = ['Défauts physiologiques', 'Défauts physilogiques', 'Dégâts climatiques', 'Dégâts des ravageurs'];
        $scope.familles = $scope.familles.filter(function(item) {
          return validCategories.includes(item.Categorie);
        });


        angular.forEach($scope.familles, function(value, key) {
          $scope.foodsFamille.push({
            famille: value,
            Cibles: [{
              Cible: [],
              value: null
            }]
          })
        });

        $scope.cibles = values[3].data;
        $scope.varietes = values[4].data;
        $scope.cultures = values[5].data;
        $scope.letmeclick = true;
      });

      $scope.Observateur = pc.User;
      $scope.Typedecontrole = 1;

      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        $scope.calibres = [];
        $scope.calibresData = [];
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

      $scope.getParcellesAndVarieteByCulture = () => {
        $scope.varietes = [];
        $scope.parcelleculturals = [];
        $scope.parcelleculturalsel = [];
        $scope.NiveauColoration = [];
        $scope.calibres = [];
        $scope.calibresData = [];
        $scope.varietesel = 0;
        $q.all([
          VarieteService.showVarieteByCultureFerme({
            FERME: pc.IDferme,
            encour: true,
            culture: $scope.culturesel
          }),
          parcellecultural.showbydomaineandVarieteculture({
            FERME: pc.IDferme,
            culture: [$scope.culturesel],
            VARIETE: [$scope.varietesel]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.varietes = values[0].data;
          $scope.parcelleculturals = values[1].data;
          $scope.letmeclick = true;
        });
      }


      $scope.getParcellesByVariete = () => {
        $scope.parcelleculturalsel = [];
        $scope.NiveauColoration = [];
        $scope.calibres = [];
        $scope.calibresData = [];
        parcellecultural.ByCultureVarietePortgreff({
          FERME: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel,
          VARIETE: [$scope.varietesel],
          Culture: [0],
          portgreffe: [0]
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

      $scope.ensureInteger = function(cibles) {
        if (cibles.value !== undefined && cibles.value !== null) {
          cibles.value = Math.floor(cibles.value);
        }
      };

      $scope.ensureIntegerColration = function(colaration) {
        if (colaration.Valeur !== undefined && colaration.Valeur !== null) {
          colaration.Valeur = Math.floor(colaration.Valeur);
        }
      };


      $scope.getCalibre = () => {
        $scope.Calibres = []
        $scope.NiveauColoration = []
        $q.all([
          ProfilCalibre.getCalibreByVariete({
            IDvariete: $scope.parcelleculturalsel[0].Variete
          }),
          NiveauColorationService.getColorationbyculture({
            ID_Culture: ($scope.parcelleculturalsel[0].IDCULTURE) ? $scope.parcelleculturalsel[0].IDCULTURE : $scope.parcelleculturalsel[0].idculture
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Calibres = values[0].data;
          $scope.NiveauColoration = values[1].data;
          $scope.letmeclick = true;
        });
      }

      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.NiveauColoration = [];
      $scope.date_scoring = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.date_previsionnelle_recolte = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.daterecolte = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.Conformite = 'Conforme';

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


      $scope.setfoodsFamille = function() {
        $scope.foodsFamille.push({
          famille: $scope.famillesel,
          Cibles: [{
            Cible: [],
            value: null
          }]
        })
      }

      $scope.notInFamille = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsFamille, function(value, key) {
          if (value.famille.IDcategorie_cible == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.cloneItem = async function(parent, index) {
        if ($scope.foodsFamille[parent].Cibles[index].Cible && $scope.foodsFamille[parent].Cibles[index].value >= 0 && $scope.foodsFamille[parent].Cibles[index].value != null) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: [],
            value: null
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires ")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(parent, index) {
        $scope.foodsFamille[parent].Cibles.splice(index, 1);
        if ($scope.foodsFamille[parent].Cibles.length == 0) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: [],
            value: null
          });
        }
      }

      $scope.RetirerFamille = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la famille?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsFamille.splice(index, 1);
          $scope.famillesel = undefined;
        }, function() {
          //cancel
        })
      }
      $scope.amountofFruit = 0;

      $scope.checkCibleData = async function() {
        var ifoundIt = true;
        var counter = 0;
        //$scope.amountofFruit = 0;
        //$scope.fruitAmountErorr = false
        try {

          await angular.forEach($scope.foodsFamille, async function(value, key) {

            await angular.forEach(value.Cibles, async function(valueCible, key) {

              if (valueCible.Cible.length > 0) {
                await angular.forEach(valueCible.Cible, async function(valueCibleVals, key) {
                  if ((valueCibleVals.value < 0 || valueCibleVals.value == null || valueCibleVals.Cible == null || valueCibleVals.value == undefined) && ifoundIt) {
                    ifoundIt = false;
                  } else {
                    counter++;
                  }
                  /*else {
                                         $scope.amountofFruit += valueCibleVals.value;
                                       }*/


                })
              } else {
                ifoundIt = false;
              }



            });




          });
        } catch (e) {

          ifoundIt = false;
        }
        /*if ($scope.amountofFruit > $scope.NbreFruitscontroles) {
          ifoundIt = false;
          $scope.fruitAmountErorr = true

        }*/
        return (counter > 0) ? true : ifoundIt;
      }


      $scope.checkCalibreData = async function() {
        if ($scope.NbreFruitscontrolesCalibre == _.sumBy($scope.calibresData, 'value'))
          return true
        return false
      }

      $scope.getTotal = function(data) {
        return _.sumBy(data, 'value')
      }


      $scope.calibresData = [];
      $scope.calibre = "Tous calibre";

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


      $scope.checkfoods = function() {
        var ifoundIt = true;
        if ($scope.foods.length > 0) {
          angular.forEach($scope.foods, function(value, key) {
            if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
              ifoundIt = false;
            }
          });
        } else {
          ifoundIt = false;
        }
        return ifoundIt;
      }

      $scope.checkColorationData = function() {
        var ifoundIt = true;
        var sumValColoration = 0;
        sumValColoration = _.sumBy($scope.NiveauColoration, 'Valeur');
        //if (sumValColoration > 0) {
        if (sumValColoration == $scope.NbrFruitEchantillon) {
          ifoundIt = true;
        } else {
          ifoundIt = false;
        }
        //}
        return ifoundIt;
      }

      function uniqueByKey(array, key) {
        return [...new Map(array.map((x) => [x[key], x])).values()];
      }


      $scope.getDayDifference = function() {
        // Parse the dates using moment
        var datePrevisionnelleRecolte = moment($scope.date_previsionnelle_recolte, "YYYY-MM-DD"); // Adjust format as necessary
        var dateScoring = moment($scope.date_scoring, "YYYY-MM-DD");

        // Check if the two dates are the same
        if (datePrevisionnelleRecolte.isSame(dateScoring, 'day')) {
          return 1; // Return 2 if the dates are the same
        }

        // Calculate the difference in days
        var dayDifference = dateScoring.diff(datePrevisionnelleRecolte, 'days') * (-1) + 1;

        return dayDifference;
      };


      $scope.foodsMensuration_previsionaddvalue = async function(data, valueAdd) {
        angular.forEach(data, function(value, key) {
          data.mensuration += valueAdd
        });
        return data;
      }


      //add click
      $scope.Ajouter = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.date_scoring &&
          !angular.equals({}, $scope.parcelleculturalsel) &&
          $scope.date_previsionnelle_recolte &&
          $scope.evolution_journaliere >= 0 &&
          $scope.nbrefruitavecpepin >= 0 &&
          $scope.Nbredepepin >= 0 &&
          $scope.NbrFruitEchantillon >= 0 &&
          $scope.poids_echantillon >= 0 &&
          $scope.calibre_total_echantillon >= 0 &&
          $scope.poids_jus >= 0 &&
          $scope.volume_jus >= 0 &&
          $scope.brix >= 0 &&
          $scope.volume_naoh >= 0) {

          let days = $scope.getDayDifference();

          if (days > 0) {
            $scope.valeur_evolution = days * $scope.evolution_journaliere;

            if (await $scope.checkfoods()) {

              if (await $scope.checkCibleData()) {

                if (await $scope.checkColorationData()) {
                  pc.objAdd = {
                    "date_scoring": moment($scope.date_scoring).format('YYYYMMDD'),
                    "parcelleculturalsel": $scope.parcelleculturalsel,
                    "date_previsionnelle_recolte": moment($scope.date_previsionnelle_recolte).format('YYYYMMDD'),
                    "evolution_journaliere": $scope.evolution_journaliere,
                    "foodsMensuration": $scope.foods,
                    "FamilleCible": $scope.foodsFamille,
                    "Gumming_Leger": $scope.Gumming_Leger,
                    "Gumming_Moyen": $scope.Gumming_Moyen,
                    "Gumming_Sever": $scope.Gumming_Sever,
                    "Granulation_Leger": $scope.Granulation_Leger,
                    "Granulation_Moyen": $scope.Granulation_Moyen,
                    "Granulation_Sever": $scope.Granulation_Sever,
                    "nbrefruitavecpepin": $scope.nbrefruitavecpepin,
                    "Nbredepepin": $scope.Nbredepepin,
                    "NiveauColoration": $scope.NiveauColoration,
                    "NbrFruitEchantillon": $scope.NbrFruitEchantillon,
                    "poids_echantillon": $scope.poids_echantillon,
                    "calibre_total_echantillon": $scope.calibre_total_echantillon,
                    "poids_jus": $scope.poids_jus,
                    "volume_jus": $scope.volume_jus,
                    "brix": $scope.brix,
                    "volume_naoh": $scope.volume_naoh,
                    "decision_verger": $scope.decision_verger,
                    "rpr": $scope.rpr,
                    "DateCreated": moment().format('YYYYMMDD'),
                    "TimeCreated": moment().format('HH:mm'),
                    "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
                    "Utilisateur": pc.User,
                    "ID_Ferme": pc.IDferme,
                    "ID_Profil": pc.IDUser,
                    "Calibre": $scope.Calibres,
                    "foodsPorcentageCalibre": uniqueByKey($scope.foods, 'Calibre'),
                    "valeur_evolution_to_add": $scope.valeur_evolution,
                    "foods_prevision": await $scope.foodsMensuration_previsionaddvalue($scope.foods, $scope.valeur_evolution),
                    "foodsPorcentageCalibre_prevision": null
                  }



                  scoring.create(pc.objAdd).then(async e => {
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

                      if (e.data.description == "Veuillez renseigner les cibles choisie") {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                          closeButton: true
                        });
                      } else {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                          closeButton: true
                        });
                      }
                      NProgress.done();
                    }
                  }).catch(async e => {
                    $scope.progress = false;
                    toastr.clear();


                    if (e.data.description == "Veuillez renseigner les cibles choisie") {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                        closeButton: true
                      });
                    } else {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                        closeButton: true
                      });
                    }

                  });
                } else {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error("Total coloration doit être égal aux Nbre Fruit échantillon", {
                    closeButton: true
                  });
                }
              } else if ($scope.fruitAmountErorr) {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("le nombre de fruits avec anomalie est supérieur au nombre de fruits de l’échantillon ")), {
                  closeButton: true
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
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
            toastr.error("Date de prévision doit être supérieure ou égale à date de scoring!", {
              closeButton: true
            });
          }


        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Veuillez renseigner tous les champs obligatoires", {
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

    pc.edit = function(data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/scoring/editScoring.html',
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

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.evolution_journaliere = $scope.data.evolution_journaliere;
      $scope.Granulation_Leger = $scope.data.Granulation_Leger;
      $scope.Granulation_Moyen = $scope.data.Granulation_Moyen;
      $scope.Granulation_Sever = $scope.data.Granulation_Sever;
      $scope.Gumming_Leger = $scope.data.Gumming_Leger;
      $scope.Gumming_Moyen = $scope.data.Gumming_Moyen;
      $scope.Gumming_Sever = $scope.data.Gumming_Sever;
      $scope.nbrefruitavecpepin = $scope.data.nbrefruitavecpepin;
      $scope.Nbredepepin = $scope.data.Nbredepepin;
      $scope.NbrFruitEchantillon = $scope.data.NbrFruitEchantillon;
      $scope.poids_echantillon = $scope.data.poids_echantillon;
      $scope.calibre_total_echantillon = $scope.data.calibre_total_echantillon;
      $scope.poids_jus = $scope.data.poids_jus;
      $scope.volume_jus = $scope.data.volume_jus;
      $scope.brix = $scope.data.brix;
      $scope.volume_naoh = $scope.data.volume_naoh;
      $scope.Observation = $scope.data.Observation;
      $scope.Calibres = [];

      $scope.rpr = ($scope.data.rpr === 'Oui') ? 1 : 0;
      $scope.decision_verger = ($scope.data.decision_verger === 'Station') ? 0 : 1;

      $scope.foodsFamille = [];
      $scope.foods = [];
      $q.all([
        parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        GroupeOperationnel.getGroupeOperationnelByFerme({
          idferme: pc.IDferme
        }),
        familleCible.getall(),
        Cible.getCible(_url),
        VarieteService.showVarieteByCultureFerme({
          FERME: pc.IDferme,
          encour: true,
          culture: [0]
        }),
        cultureService.ByFermeEncours({
          FERME: pc.IDferme
        }),
        scoring.get_scoring_parcelle({
          ID: $scope.data.ID
        }),
        scoring.get_scoring_profil_calibre({
          ID: data.ID
        }),
        scoring.getdatafamillecibleonlyforedit({
          ID: data.ID
        }),
        scoring.get_scoring_coloration({
          ID: data.ID
        })
      ]).then((values) => {
        NProgress.done();
        //$scope.parcelleculturals = values[0].data;
        $scope.GroupeOperationnels = values[1].data;
        $scope.familles = values[2].data;
        var validCategories = ['Défauts physiologiques', 'Défauts physilogiques', 'Dégâts climatiques', 'Dégâts des ravageurs'];
        $scope.familles = $scope.familles.filter(function(item) {
          return validCategories.includes(item.Categorie);
        });


        $scope.cibles = values[3].data;
        $scope.varietes = values[4].data;
        $scope.cultures = values[5].data;
        $scope.parcellesByid = values[6].data;
        $scope.profileCalibreByID = values[7].data;
        $scope.nbrrow = $scope.profileCalibreByID.length;
        $scope.foods = $scope.profileCalibreByID;
        $scope.foodsFamille = values[8].data;
        $scope.NiveauColoration = values[9].data;
        $scope.colorationData = values[9].data;

        try {
          $scope.culturesel = $scope.parcellesByid[0].Culture;
        } catch (e) {
          $scope.culturesel = null;
        }
        try {
          $scope.varietesel = $scope.parcellesByid[0].VarieteID;
        } catch (e) {
          $scope.varietesel = null;
        }

        parcellecultural.showbydomaineandVarieteculture({
          FERME: pc.IDferme,
          culture: [$scope.culturesel],
          VARIETE: [$scope.varietesel]
        }).then(e => {
          NProgress.done();
          $scope.parcelleculturals = e.data;
        })

        $scope.letmeclick = true;
      });

      $scope.isINParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.parcellesByid, function(value, key) {
          if (value.ID == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }

      $scope.Observateur = pc.User;
      $scope.Typedecontrole = 1;


      $scope.cibleselected = (cible, cibles) => {

        var ifoundIt = false;
        angular.forEach(cibles, function(valueCibleVals, key) {
          if (valueCibleVals.ID_cible == cible.ID_cible && !ifoundIt) {
            ifoundIt = true;
          }
        })

        return ifoundIt;

      }

      $scope.RetirerValue = async function(idcible) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(async function() {
            //ok
            await angular.forEach($scope.foodsFamille, async function(foodsFamille, key) {
              await angular.forEach(foodsFamille.Cibles, async function(CiblesFa, key) {
                await angular.forEach(CiblesFa.Cible, function(CiblesFav, keyOut) {
                  if (CiblesFav.ID_cible == idcible) {
                    CiblesFa.Cible.splice(keyOut, 1);
                  }
                })
              })
            })
          },
          function() {
            //cancel
          })
      }


      $scope.getParcellesByGO = () => {
        $scope.parcelleculturalsel = [];
        $scope.calibres = [];
        $scope.calibresData = [];
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

      $scope.getParcellesAndVarieteByCulture = () => {
        $scope.varietes = [];
        $scope.parcelleculturals = [];
        $scope.parcelleculturalsel = [];
        $scope.NiveauColoration = [];
        $scope.calibres = [];
        $scope.calibresData = [];
        $scope.varietesel = 0;
        $q.all([
          VarieteService.showVarieteByCultureFerme({
            FERME: pc.IDferme,
            encour: true,
            culture: $scope.culturesel
          }),
          parcellecultural.showbydomaineandVarieteculture({
            FERME: pc.IDferme,
            culture: [$scope.culturesel],
            VARIETE: [$scope.varietesel]
          })
        ]).then((values) => {
          NProgress.done();
          $scope.varietes = values[0].data;
          $scope.parcelleculturals = values[1].data;
          $scope.letmeclick = true;
        });
      }


      $scope.getParcellesByVariete = () => {
        $scope.parcelleculturalsel = [];
        $scope.NiveauColoration = [];
        $scope.calibres = [];
        $scope.calibresData = [];
        parcellecultural.ByCultureVarietePortgreff({
          FERME: pc.IDferme,
          idgroupe: $scope.GroupeOperationnelsel,
          VARIETE: [$scope.varietesel],
          Culture: [0],
          portgreffe: [0]
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

      $scope.ensureInteger = function(cibles) {
        if (cibles.value !== undefined && cibles.value !== null) {
          cibles.value = Math.floor(cibles.value);
        }
      };

      $scope.ensureIntegerColration = function(colaration) {
        if (colaration.Valeur !== undefined && colaration.Valeur !== null) {
          colaration.Valeur = Math.floor(colaration.Valeur);
        }
      };

      $scope.initialLoad = true;

      $scope.getCalibre = function() {

        if ($scope.initialLoad) {
          $scope.initialLoad = false;
          return;
        }

        $scope.Calibres = [];
        $scope.NiveauColoration = [];
        $q.all([
          ProfilCalibre.getCalibreByVariete({
            IDvariete: $scope.parcelleculturalsel[0].Variete
          }),
          NiveauColorationService.getColorationbyculture({
            ID_Culture: ($scope.parcelleculturalsel[0].IDCULTURE) ? $scope.parcelleculturalsel[0].IDCULTURE : $scope.parcelleculturalsel[0].idculture
          })
        ]).then((values) => {
          NProgress.done();
          $scope.Calibres = values[0].data;
          $scope.NiveauColoration = values[1].data;
          angular.forEach($scope.NiveauColoration, function(value, key) {
            angular.forEach($scope.colorationData, function(valueColor, keyColor) {
              if (value.ID == valueColor.ID) {
                value.Valeur = valueColor.Valeur;
              }
            });
          });
          $scope.letmeclick = true;
        });

      }


      document.getElementById('filter_form').style.display = "none";
      $scope.progress = false;
      $scope.parcelleculturalsel = [];
      $scope.NiveauColoration = [];

      $scope.date_scoring = ($scope.data.date_scoring) ? new Date(moment($scope.data.date_scoring).format("YYYY-MM-DD")) : null;
      $scope.date_previsionnelle_recolte = ($scope.data.date_previsionnelle_recolte) ? new Date(moment($scope.data.date_previsionnelle_recolte).format("YYYY-MM-DD")) : null;

      $scope.Conformite = 'Conforme';

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


      $scope.setfoodsFamille = function() {
        $scope.foodsFamille.push({
          famille: $scope.famillesel,
          Cibles: [{
            Cible: [],
            value: null
          }]
        })
      }

      $scope.notInFamille = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.foodsFamille, function(value, key) {
          if (value.famille.IDcategorie_cible == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        })
        return ifoundIt;
      }

      $scope.cloneItem = async function(parent, index) {
        if ($scope.foodsFamille[parent].Cibles[index].Cible && $scope.foodsFamille[parent].Cibles[index].value >= 0 && $scope.foodsFamille[parent].Cibles[index].value != null) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: [],
            value: null
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez saisir les champs obligatoires ")), {
            closeButton: true
          });
        }
      }

      $scope.removeItem = function(parent, index) {
        $scope.foodsFamille[parent].Cibles.splice(index, 1);
        if ($scope.foodsFamille[parent].Cibles.length == 0) {
          $scope.foodsFamille[parent].Cibles.push({
            Cible: [],
            value: null
          });
        }
      }

      $scope.RetirerFamille = async function(index) {
        var confirm = $mdDialog.confirm()
          .title(await translatedwords.getTranslatedWord($translate("Veuillez confirmer la suppression de la famille?")))
          .textContent('')
          .ariaLabel('Lucky day')
          .ok(await translatedwords.getTranslatedWord($translate("Ok")))
          .cancel(await translatedwords.getTranslatedWord($translate("Annuler")))

        $mdDialog.show(confirm.multiple(true)).then(function() {
          //ok
          $scope.foodsFamille.splice(index, 1);
          $scope.famillesel = undefined;
        }, function() {
          //cancel
        })
      }
      $scope.amountofFruit = 0;

      $scope.checkCibleData = async function() {
        var ifoundIt = true;
        var counter = 0;
        //$scope.amountofFruit = 0;
        //$scope.fruitAmountErorr = false
        try {

          await angular.forEach($scope.foodsFamille, async function(value, key) {

            await angular.forEach(value.Cibles, async function(valueCible, key) {

              if (valueCible.Cible.length > 0) {
                await angular.forEach(valueCible.Cible, async function(valueCibleVals, key) {
                  if ((valueCibleVals.value < 0 || valueCibleVals.value == null || valueCibleVals.Cible == null || valueCibleVals.value == undefined) && ifoundIt) {
                    ifoundIt = false;
                  } else {
                    counter++;
                  }
                  /*else {
                                         $scope.amountofFruit += valueCibleVals.value;
                                       }*/


                })
              } else {
                ifoundIt = false;
              }



            });




          });
        } catch (e) {

          ifoundIt = false;
        }
        /*if ($scope.amountofFruit > $scope.NbreFruitscontroles) {
          ifoundIt = false;
          $scope.fruitAmountErorr = true

        }*/
        return (counter > 0) ? true : ifoundIt;
      }


      $scope.checkCalibreData = async function() {
        if ($scope.NbreFruitscontrolesCalibre == _.sumBy($scope.calibresData, 'value'))
          return true
        return false
      }

      $scope.getTotal = function(data) {
        return _.sumBy(data, 'value')
      }


      $scope.calibresData = [];
      $scope.calibre = "Tous calibre";

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


      $scope.checkfoods = function() {
        var ifoundIt = true;
        if ($scope.foods.length > 0) {
          angular.forEach($scope.foods, function(value, key) {
            if ((!value.mensuration || value.mensuration === undefined) && ifoundIt) {
              ifoundIt = false;
            }
          });
        } else {
          ifoundIt = false;
        }
        return ifoundIt;
      }

      $scope.checkColorationData = function() {
        var ifoundIt = true;
        var sumValColoration = 0;
        sumValColoration = _.sumBy($scope.NiveauColoration, 'Valeur');
        //if (sumValColoration > 0) {
        if (sumValColoration == $scope.NbrFruitEchantillon) {
          ifoundIt = true;
        } else {
          ifoundIt = false;
        }
        //}
        return ifoundIt;
      }

      function uniqueByKey(array, key) {
        return [...new Map(array.map((x) => [x[key], x])).values()];
      }

      $scope.getDayDifference = function() {
        // Parse the dates using moment
        var datePrevisionnelleRecolte = moment($scope.date_previsionnelle_recolte, "YYYY-MM-DD"); // Adjust format as necessary
        var dateScoring = moment($scope.date_scoring, "YYYY-MM-DD");

        // Check if the two dates are the same
        if (datePrevisionnelleRecolte.isSame(dateScoring, 'day')) {
          return 1; // Return 2 if the dates are the same
        }

        // Calculate the difference in days
        var dayDifference = dateScoring.diff(datePrevisionnelleRecolte, 'days') * (-1) + 1;

        return dayDifference;
      };


      $scope.foodsMensuration_previsionaddvalue = async function(data, valueAdd) {
        angular.forEach(data, function(value, key) {
          data.mensuration += valueAdd
        });
        return data;
      }

      //add click
      $scope.Modifier = async function() {

        $scope.progress = true;
        toastr.clear();

        if ($scope.date_scoring &&
          !angular.equals({}, $scope.parcelleculturalsel) &&
          $scope.date_previsionnelle_recolte &&
          $scope.evolution_journaliere >= 0 &&
          $scope.nbrefruitavecpepin >= 0 &&
          $scope.Nbredepepin >= 0 &&
          $scope.NbrFruitEchantillon >= 0 &&
          $scope.poids_echantillon >= 0 &&
          $scope.calibre_total_echantillon >= 0 &&
          $scope.poids_jus >= 0 &&
          $scope.volume_jus >= 0 &&
          $scope.brix >= 0 &&
          $scope.volume_naoh >= 0) {

          if ($scope.Calibres.length === 0) {
            await ProfilCalibre.getCalibreByVariete({
              IDvariete: $scope.parcelleculturalsel[0].Variete
            }).then((values) => {
              NProgress.done();
              $scope.Calibres = values.data;
            })
          }

          let days = $scope.getDayDifference();

          if (days > 0) {
            $scope.valeur_evolution = days * $scope.evolution_journaliere;

            if (await $scope.checkfoods()) {

              if (await $scope.checkCibleData()) {

                if (await $scope.checkColorationData()) {
                  pc.objAdd = {
                    "ID": $scope.data.ID,
                    "date_scoring": moment($scope.date_scoring).format('YYYYMMDD'),
                    "parcelleculturalsel": $scope.parcelleculturalsel,
                    "date_previsionnelle_recolte": moment($scope.date_previsionnelle_recolte).format('YYYYMMDD'),
                    "evolution_journaliere": $scope.evolution_journaliere,
                    "foodsMensuration": $scope.foods,
                    "FamilleCible": $scope.foodsFamille,
                    "Gumming_Leger": $scope.Gumming_Leger,
                    "Gumming_Moyen": $scope.Gumming_Moyen,
                    "Gumming_Sever": $scope.Gumming_Sever,
                    "Granulation_Leger": $scope.Granulation_Leger,
                    "Granulation_Moyen": $scope.Granulation_Moyen,
                    "Granulation_Sever": $scope.Granulation_Sever,
                    "nbrefruitavecpepin": $scope.nbrefruitavecpepin,
                    "Nbredepepin": $scope.Nbredepepin,
                    "NiveauColoration": $scope.NiveauColoration,
                    "NbrFruitEchantillon": $scope.NbrFruitEchantillon,
                    "poids_echantillon": $scope.poids_echantillon,
                    "calibre_total_echantillon": $scope.calibre_total_echantillon,
                    "poids_jus": $scope.poids_jus,
                    "volume_jus": $scope.volume_jus,
                    "brix": $scope.brix,
                    "volume_naoh": $scope.volume_naoh,
                    "decision_verger": $scope.decision_verger,
                    "rpr": $scope.rpr,
                    "Observation": ($scope.Observation) ? $filter('textforsqlserver')($scope.Observation) : "",
                    "Calibre": $scope.Calibres,
                    "foodsPorcentageCalibre": uniqueByKey($scope.foods, 'Calibre'),
                    "valeur_evolution_to_add": $scope.valeur_evolution,
                    "foods_prevision": await $scope.foodsMensuration_previsionaddvalue($scope.foods, $scope.valeur_evolution),
                    "foodsPorcentageCalibre_prevision": null
                  }


                  scoring.edit(pc.objAdd).then(async e => {
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

                      if (e.data.description == "Veuillez renseigner les cibles choisie") {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                          closeButton: true
                        });
                      } else {
                        toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                          closeButton: true
                        });
                      }
                      NProgress.done();
                    }
                  }).catch(async e => {
                    $scope.progress = false;
                    toastr.clear();


                    if (e.data.description == "Veuillez renseigner les cibles choisie") {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
                        closeButton: true
                      });
                    } else {
                      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement : ")) + e.data, {
                        closeButton: true
                      });
                    }

                  });
                } else {
                  $scope.progress = false;
                  toastr.clear();
                  toastr.error("Total coloration doit être égal aux Nbre Fruit échantillon", {
                    closeButton: true
                  });
                }
              } else if ($scope.fruitAmountErorr) {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("le nombre de fruits avec anomalie est supérieur au nombre de fruits de l’échantillon ")), {
                  closeButton: true
                });
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner les cibles choisie")), {
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
            toastr.error("Date de prévision doit être supérieure ou égale à date de scoring!", {
              closeButton: true
            });
          }



        } else {
          $scope.progress = false;
          toastr.clear();
          toastr.error("Veuillez renseigner tous les champs obligatoires", {
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


    pc.delete = async function(c) {
      pc.ID = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            scoring.delete({
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



    //détails ordre
    pc.detailsorder = function(data) {
      pc.scoring = data;
      pc.scoring_parcelle = [];
      pc.scoring_cible = [];
      pc.scoring_profil_calibre = [];
      pc.scoring_profil_calibre_poucentage = [];
      pc.scoring_coloration = [];
      pc.ciblesdetails = data;
      pc.showtable = false;

      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      $q.all([
        scoring.get_scoring_parcelle({
          ID: data.ID
        }),
        scoring.get_scoring_cible({
          ID: data.ID
        }),
        scoring.get_scoring_profil_calibre({
          ID: data.ID
        }),
        scoring.get_scoring_profil_calibre_poucentage({
          ID: data.ID
        }),
        scoring.get_scoring_coloration({
          ID: data.ID
        }),
        scoring.get_scoring_profil_calibre_prevision({
          ID: data.ID
        }),
        scoring.get_scoring_profil_calibre_poucentage_prevision({
          ID: data.ID
        })
      ]).then((values) => {
        pc.scoring_parcelle = values[0].data;
        pc.scoring_cible = values[1].data;
        pc.scoring_profil_calibre = values[2].data;
        pc.scoring_profil_calibre_poucentage = values[3].data;
        pc.scoring_coloration = values[4].data;
        pc.scoring_profil_calibre_prevision = values[5].data;
        pc.scoring_profil_calibre_poucentage_prevision = values[6].data;
        NProgress.done();
        NProgress.remove();
      });

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
