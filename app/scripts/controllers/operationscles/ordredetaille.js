'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesOrdredetailleCtrl
 * @description
 * # OperationsclesOrdredetailleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesOrdredetailleCtrl', function($scope, DTOptionsBuilder, bilanHydrique, $mdDialog, $filter, ordredetaille,
    cultureService, VarieteService, translatedwords, portGreffe, $translatePartialLoader, $translate, DTColumnBuilder, $window, $q, toastr, $compile, $state, DTDefaultOptions, $cookies, recoltepollen, parcellecultural) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;
    pc.ordretailleaction = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.IDferme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDprofile = $cookies.getObject('globals').currentUser.ID;
    pc.createdby = $cookies.getObject('globals').currentUser.Nom + ' ' + $cookies.getObject('globals').currentUser.Prenom;

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

    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;

    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'ordre_taille'
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

    if ($scope.canIAction().add) {
      $scope.btnadd = {
        text: "<i class='fa fa-plus'></i>",
        key: '1',
        className: 'pull-left',
        action: function(e, dt, node, config) {
          pc.Add();
        },
        titleAttr: 'Ajouter'
      }
    } else {
      $scope.btnadd = undefined;
    }



    pc.obj = {
      FERME: pc.IDferme,
      culture: [0],
      VARIETE: [0],
      PARCELLE: [0],
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD')
    };

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#culture").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      NProgress.done();
    }, 100);

    pc.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }


    $q.all([cultureService.getCultureByFerme(pc.obj.FERME),
      /*VarieteService.showVarieteByCultureFerme(pc.obj),
      parcellecultural.getParcelleCulturalByFerme(pc.obj.FERME)*/
    ]).then((values) => {
      pc.culture_array = values[0].data;
      //pc.variete_array = values[1].data;
      //pc.parcelles_array = values[2].data;
      setTimeout(function() {
        $(".selectpicker").selectpicker();
        $("#culture").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        NProgress.done();
      }, 100);
      NProgress.done();
    });


    //starting date change listner
    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
    };

    //by date_fin
    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
    };

    pc.parcelle_change = () => {
      if ($scope.parcelle && $scope.parcelle.length > 0 && !$scope.parcelle.includes(0)) {
        pc.obj.PARCELLE = $scope.parcelle;
      } else {
        pc.obj.PARCELLE = [0];
      }
    }

    pc.culture_change = () => {
      NProgress.start();
      if ($scope.culture && $scope.culture.length > 0 && !$scope.culture.includes(0)) {
        pc.obj.culture = $scope.culture;
        pc.obj.VARIETE = [0];
        pc.obj.PARCELLE = [0];
      } else {
        pc.obj.culture = [0];
      }

      $q.all([VarieteService.showVarieteByCultureFerme(pc.obj),
        parcellecultural.getParcelleByVarieteCulture(pc.obj)
      ]).then((values) => {
        pc.variete_array = values[0].data;
        pc.parcelles_array = values[1].data;

        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $('#variete').selectpicker('deselectAll');
          $("#parcelle").selectpicker('refresh');
          $('#parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });

    }

    pc.variete_change = () => {
      NProgress.start();
      if ($scope.variete && $scope.variete.length > 0 && !$scope.variete.includes(0)) {
        pc.obj.VARIETE = $scope.variete;
        pc.obj.PARCELLE = [0];
      } else {
        pc.obj.VARIETE = [0];
      }

      $q.all([parcellecultural.getParcelleByVarieteCulture(pc.obj)]).then((values) => {
        pc.parcelles_array = values[0].data;
        setTimeout(function() {
          $("#parcelle").selectpicker('refresh');
          $('#parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });
    }

    $scope.search = () => {
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    }

    //get data and refresh datatable
    $scope.updateDatarecoltepollen = function(data) {
      return ordredetaille.getByFiltre(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDatarecoltepollen(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go('etat_preconisation_ordre_taille');
          },
          titleAttr: "Etat de synthèse Préconisation/Ordre de la Taille"
        }
      ].concat($scope.btnadd));

    pc.dtColumns = [
      DTColumnBuilder.newColumn('date_previsionnelle_debut').withTitle(translatedwords.getTranslatedWord($translate("Date prévisionnelle de début"))).renderWith(function(data, type, full, meta) {
        return moment(full.date_previsionnelle_debut).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('nbr_parcelle').withTitle(translatedwords.getTranslatedWord($translate("Nbre parcelle"))),
      DTColumnBuilder.newColumn('type_de_taille').withTitle(translatedwords.getTranslatedWord($translate("Type de taille"))),
      DTColumnBuilder.newColumn('mode_de_taille').withTitle(translatedwords.getTranslatedWord($translate("Mode de taille"))),
      DTColumnBuilder.newColumn('intensite_de_la_taille').withTitle(translatedwords.getTranslatedWord($translate("Intensité de la taille"))),
      DTColumnBuilder.newColumn('duree_estimee_taille').withTitle(translatedwords.getTranslatedWord($translate("Durée (jours) estimée de la taille"))),
      DTColumnBuilder.newColumn('affectation_mo_taille').withTitle(translatedwords.getTranslatedWord($translate("Affectation MO taille"))),
      DTColumnBuilder.newColumn('mode_paiement_mo_taille').withTitle(translatedwords.getTranslatedWord($translate("Mode paiement MO taille"))),
      DTColumnBuilder.newColumn('remarques').withTitle(translatedwords.getTranslatedWord($translate("Remarques"))),
      DTColumnBuilder.newColumn('profil_calibre').withTitle(translatedwords.getTranslatedWord($translate("Profil calibre"))),
      DTColumnBuilder.newColumn('charge_des_arbres').withTitle(translatedwords.getTranslatedWord($translate("Charge des arbres"))),
      DTColumnBuilder.newColumn('qualite_interne').withTitle(translatedwords.getTranslatedWord($translate("Qualité interne"))),
      DTColumnBuilder.newColumn('aspect_des_fruits').withTitle(translatedwords.getTranslatedWord($translate("Aspect des fruits"))),
      DTColumnBuilder.newColumn('formation_des_arbres').withTitle(translatedwords.getTranslatedWord($translate("Formation des arbres"))),
      DTColumnBuilder.newColumn('volume_des_arbres').withTitle(translatedwords.getTranslatedWord($translate("Volume des arbres"))),
      DTColumnBuilder.newColumn('hauteurs_des_arbres').withTitle(translatedwords.getTranslatedWord($translate("Hauteurs des arbres"))),
      DTColumnBuilder.newColumn('besoin_operationnel').withTitle(translatedwords.getTranslatedWord($translate("Besoin opérationnel"))),
      DTColumnBuilder.newColumn('observations').withTitle(translatedwords.getTranslatedWord($translate("Observations"))),
      DTColumnBuilder.newColumn('bois_mort').withTitle(translatedwords.getTranslatedWord($translate("Bois mort"))),
      DTColumnBuilder.newColumn('bois_casse').withTitle(translatedwords.getTranslatedWord($translate("Bois cassé"))),
      DTColumnBuilder.newColumn('rameaux_et_bois_chetifs').withTitle(translatedwords.getTranslatedWord($translate("Rameaux et bois chétifs"))),
      DTColumnBuilder.newColumn('tires_seve').withTitle(translatedwords.getTranslatedWord($translate("Tires sève"))),
      DTColumnBuilder.newColumn('jupe').withTitle(translatedwords.getTranslatedWord($translate("Jupe"))),
      DTColumnBuilder.newColumn('charpentieres').withTitle(translatedwords.getTranslatedWord($translate("Charpentières"))),
      DTColumnBuilder.newColumn('frondaison').withTitle(translatedwords.getTranslatedWord($translate("Frondaison"))),
      DTColumnBuilder.newColumn('cheminee').withTitle(translatedwords.getTranslatedWord($translate("Cheminée"))),
      DTColumnBuilder.newColumn('createdby').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.ordretailleaction[data.id] = data;
        var editbtn = ($scope.canIAction().update) ? '<button class="btn btn-success btn-xs" title="Modifier" ng-click="pc.Edit(pc.ordretailleaction[' + data.id + '])"><i class="fa fa-edit"></i></button>&nbsp;' : '';
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.ordretailleaction[' + data.id + '])" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        var etat = '<button class="btn btn-warning btn-xs" title="Détails" ng-click="pc.detailsorder(pc.ordretailleaction[' + data.id + '])" )"=""><i class="fa fa-eye"></i></button>';
        return etat + editbtn + deletebtn;
      }).withOption('width', '5%').withClass('nowraptd all')
    ];
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    pc.detailsorder = function(data) {

      pc.ordre_tailleByID = data;
      pc.showtable = false;
      pc.parcellebyID = [];
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      $q.all([
        ordredetaille.getparcellebyID({
          ID: pc.ordre_tailleByID.id
        })
      ]).then((values) => {
        NProgress.done();
        pc.parcellebyID = values[0].data;
      });


    }


    pc.delete = async function(c) {
      pc.IDOrdre = c.id;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            ordredetaille.deleteweb({
              ID: pc.IDOrdre
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

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }


    pc.Add = function() {
      $scope.showAdvancedAdd("ev");
    }

    $scope.showAdvancedAdd = function(ev) {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/ordredetaille/AddOrdredetaille.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerAdd($scope, $mdDialog) {

      $scope.parcelleculturalsel = [];
      $scope.affectation_mo_taille = [];
      $scope.mode_paiement_mo_taille = [];

      $scope.types_de_taille = ["Taille de Formation", "Taille d'Entretien", "Taille d'Hiver", "Taille en vert", "Taille de Rajeunissement", "Arcure", "Autres...", "N/A"];
      $scope.modes_de_taille = ["Manuelle", "Mécanique", "Combinée", "N/A"];
      $scope.intensites_de_la_taille = ["Légère", "Moyenne", "Forte", "N/A"];
      $scope.affectations_mo_taille = ["Permanente", "Occasionnelle", "Externe", "N/A"];
      $scope.modes_paiement_mo_taille = ["Journée", "A l'unité", "N/A"];

      $scope.profils_calibre = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.charges_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.qualites_interne = ["Brix", "Granulation", "Gumming", "Acidité", "Taux de jus", "Pépins", "N/A"];
      $scope.aspects_des_fruits = ["Marbure", "Coups de soleil", "Peau fine", "Gaufferage", "Coloration", "N/A"];
      $scope.formations_des_arbres = ["Orienter"];
      $scope.volumes_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.hauteurss_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.besoins_operationnel = ["Améliorer le bilan hydrique", "Optimiser la récolte", "Augmenter l'efficacité des traitements", "Minimiser les coûts de tuteurage", "Incision", "Installation paillage", "N/A"];

      $scope.boiss_mort = ["Eliminer", "Nettoyer", "N/A"];
      $scope.boiss_casse = ["Eliminer", "N/A"];
      $scope.rameauxs_et_bois_chetifs = ["Eliminer", "Pincer", "Nettoyer", "N/A"];
      $scope.tiress_seve = ["Eliminer", "Arquer", "Sélectionner", "N/A"];
      $scope.jupes = ["Eliminer", "Soulever", "N/A"];
      $scope.charpentieress = ["Réduire", "Sélectionner", "N/A"];
      $scope.frondaisons = ["Pincer", "Créer des ouvertures", "N/A"];
      $scope.cheminees = ["Nettoyer", "N/A"];



      $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        VarieteService.showVarieteByCultureFerme({
          FERME: pc.IDferme,
          culture: [0],
          VARIETE: [0],
          PARCELLE: [0],
          DATE_DEBUT: moment().format('YYYYMMDD'),
          DATE_FIN: moment().format('YYYYMMDD')
        }),
        portGreffe.getPortGreffe(),
        cultureService.getCultureByFerme(pc.IDferme)
      ]).then((values) => {
        //$scope.parcelleculturals = values[0].data;
        $scope.varietes = values[1].data;
        $scope.portGreffes = values[2].data;
        $scope.cultures = values[3].data;
        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.date_previsionnelle_debut = new Date(moment().format("YYYY-MM-DD"));

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

      $scope.getParcelleByVariete_portgreff = function() {
        $q.all([parcellecultural.ByCultureVarietePortgreff({
          VARIETE: ($scope.variete && $scope.variete.length > 0) ? $scope.variete : 0,
          portgreffe: ($scope.portegreffe && $scope.portegreffe.length > 0) ? $scope.portegreffe : 0,
          FERME: pc.IDferme,
          Culture: ($scope.culture && $scope.culture.length > 0) ? $scope.culture : 0
        })]).then((values) => {
          $scope.parcelleculturals = values[0].data;
          $scope.parcelleculturalsel = null;
          NProgress.done();
          $scope.letmeclick = true;
        });
      }



      $scope.setVarieteandportgreff = function() {
        /*var isFirstIteration = true;
        try {
          $scope.parcelleculturalsel.forEach(parcelle => {
            if (isFirstIteration) {
              $scope.variete = [];
              $scope.portegreffe = [];
              isFirstIteration = false;
            }
            if (parcelle.Variete) {
              $scope.variete.push(parcelle.Variete);
            }
            if (parcelle.IDPorte_greffe) {
              $scope.portegreffe.push(parcelle.IDPorte_greffe);
            }
            if (parcelle.Culture) {
              $scope.culture.push(parcelle.Culture);
            }
          });
        } catch (e) {

        }*/
      };




      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


      $scope.selectedTab = 0;

      $scope.goToPreviousTab = function() {
        if ($scope.selectedTab > 0) {
          $scope.selectedTab--;
        }
      };

      $scope.goToNextTab = function() {
        var totalTabs = 4;
        if ($scope.selectedTab < totalTabs - 1) {
          $scope.selectedTab++;
        }
      };

      $scope.setDateFin = function() {
        if ($scope.date_previsionnelle_debut && $scope.duree_estimee_taille) {
          $scope.date_previsionnelle_fin = new Date(moment($scope.date_previsionnelle_debut).add($scope.duree_estimee_taille, 'days').format("YYYY-MM-DD"));
        }
      }


      $scope.Ajouter = async function() {
        $scope.progress = true;
        toastr.clear();


        if ($scope.date_previsionnelle_debut && $scope.parcelleculturalsel.length > 0 && $scope.type_de_taille && $scope.mode_de_taille && $scope.intensite_de_la_taille) {
          if ($scope.duree_estimee_taille >= 1) {


            pc.objAdd = {
              "date_previsionnelle_debut": moment($scope.date_previsionnelle_debut).format('YYYYMMDD'),
              "parcelleculturalsel": $scope.parcelleculturalsel,
              "type_de_taille": $filter('textforsqlserver_nullsupport')($scope.type_de_taille),
              "mode_de_taille": $filter('textforsqlserver_nullsupport')($scope.mode_de_taille),
              "intensite_de_la_taille": $filter('textforsqlserver_nullsupport')($scope.intensite_de_la_taille),
              "duree_estimee_taille": $scope.duree_estimee_taille,
              "affectation_mo_taille": ($scope.affectation_mo_taille.length > 0) ? ($filter('textforsqlserver_nullsupport')($scope.affectation_mo_taille.join(","))) : [],
              "mode_paiement_mo_taille": ($scope.mode_paiement_mo_taille.length > 0) ? ($filter('textforsqlserver_nullsupport')($scope.mode_paiement_mo_taille.join(","))) : [],

              "remarques": ($scope.remarques) ? $filter('textforsqlserver')($scope.remarques) : null,

              "profil_calibre": $filter('textforsqlserver_nullsupport')($scope.profil_calibre),
              "charge_des_arbres": $filter('textforsqlserver_nullsupport')($scope.charge_des_arbres),
              "qualite_interne": $filter('textforsqlserver_nullsupport')($scope.qualite_interne),
              "aspect_des_fruits": $filter('textforsqlserver_nullsupport')($scope.aspect_des_fruits),
              "formation_des_arbres": $filter('textforsqlserver_nullsupport')($scope.formation_des_arbres),
              "volume_des_arbres": $filter('textforsqlserver_nullsupport')($scope.volume_des_arbres),
              "hauteurs_des_arbres": $filter('textforsqlserver_nullsupport')($scope.hauteurs_des_arbres),
              "besoin_operationnel": $filter('textforsqlserver_nullsupport')($scope.besoin_operationnel),

              "observations": ($scope.observations) ? $filter('textforsqlserver')($scope.observations) : null,

              "bois_mort": $filter('textforsqlserver_nullsupport')($scope.bois_mort),
              "bois_casse": $filter('textforsqlserver_nullsupport')($scope.bois_casse),
              "rameaux_et_bois_chetifs": $filter('textforsqlserver_nullsupport')($scope.rameaux_et_bois_chetifs),
              "tires_seve": $filter('textforsqlserver_nullsupport')($scope.tires_seve),
              "jupe": $filter('textforsqlserver_nullsupport')($scope.jupe),
              "charpentieres": $filter('textforsqlserver_nullsupport')($scope.charpentieres),
              "frondaison": $filter('textforsqlserver_nullsupport')($scope.frondaison),
              "cheminee": $filter('textforsqlserver_nullsupport')($scope.cheminee),

              "ID_Profil": pc.IDprofile,
              "ID_Ferme": pc.IDferme,
              "autre": $filter('textforsqlserver_nullsupport')($scope.autre),
              "date_previsionnelle_fin": moment($scope.date_previsionnelle_fin).format('YYYYMMDD')
            };

            ordredetaille.createweb(pc.objAdd).then(async function(res) {
              pc.resAdd = res.data;
              if (pc.resAdd[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + pc.resAdd[0].description, {
                  closeButton: true
                });
              }
            });

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Durée(jours) estimée de la taille ne peux pas être 0 au moins 1")), {
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
    }


    pc.Edit = function(data) {
      $scope.showAdvancedEdit("ev", data);
    }

    $scope.showAdvancedEdit = function(ev, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/ordredetaille/EditOrdredetaille.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, data) {
      $scope.data = data;
      $scope.date_previsionnelle_debut = new Date(moment($scope.data.date_previsionnelle_debut).format("YYYY-MM-DD"));

      $scope.type_de_taille = $scope.data.type_de_taille
      $scope.mode_de_taille = $scope.data.mode_de_taille
      $scope.intensite_de_la_taille = $scope.data.intensite_de_la_taille
      $scope.duree_estimee_taille = $scope.data.duree_estimee_taille

      $scope.affectation_mo_taille = ($scope.data.affectation_mo_taille) ? $scope.data.affectation_mo_taille : []
      $scope.mode_paiement_mo_taille = ($scope.data.mode_paiement_mo_taille) ? $scope.data.mode_paiement_mo_taille : []

      $scope.remarques = $scope.data.remarques

      $scope.profil_calibre = $scope.data.profil_calibre
      $scope.charge_des_arbres = $scope.data.charge_des_arbres
      $scope.qualite_interne = $scope.data.qualite_interne
      $scope.aspect_des_fruits = $scope.data.aspect_des_fruits
      $scope.formation_des_arbres = $scope.data.formation_des_arbres
      $scope.volume_des_arbres = $scope.data.volume_des_arbres
      $scope.hauteurs_des_arbres = $scope.data.hauteurs_des_arbres
      $scope.besoin_operationnel = $scope.data.besoin_operationnel

      $scope.observations = $scope.data.observations

      $scope.bois_mort = $scope.data.bois_mort
      $scope.bois_casse = $scope.data.bois_casse
      $scope.rameaux_et_bois_chetifs = $scope.data.rameaux_et_bois_chetifs
      $scope.tires_seve = $scope.data.tires_seve
      $scope.jupe = $scope.data.jupe
      $scope.charpentieres = $scope.data.charpentieres
      $scope.frondaison = $scope.data.frondaison
      $scope.cheminee = $scope.data.cheminee


      $scope.types_de_taille = ["Taille de Formation", "Taille d'Entretien", "Taille d'Hiver", "Taille en vert", "Taille de Rajeunissement", "Arcure", "Autres...", "N/A"];
      $scope.modes_de_taille = ["Manuelle", "Mécanique", "Combinée", "N/A"];
      $scope.intensites_de_la_taille = ["Légère", "Moyenne", "Forte", "N/A"];
      $scope.affectations_mo_taille = ["Permanente", "Occasionnelle", "Externe", "N/A"];
      $scope.modes_paiement_mo_taille = ["Journée", "A l'unité", "N/A"];

      $scope.profils_calibre = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.charges_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.qualites_interne = ["Brix", "Granulation", "Gumming", "Acidité", "Taux de jus", "Pépins", "N/A"];
      $scope.aspects_des_fruits = ["Marbure", "Coups de soleil", "Peau fine", "Gaufferage", "Coloration", "N/A"];
      $scope.formations_des_arbres = ["Orienter"];
      $scope.volumes_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.hauteurss_des_arbres = ["Améliorer", "Préserver", "Réduire", "N/A"];
      $scope.besoins_operationnel = ["Améliorer le bilan hydrique", "Optimiser la récolte", "Augmenter l'efficacité des traitements", "Minimiser les coûts de tuteurage", "Incision", "Installation paillage", "N/A"];

      $scope.boiss_mort = ["Eliminer", "Nettoyer", "N/A"];
      $scope.boiss_casse = ["Eliminer", "N/A"];
      $scope.rameauxs_et_bois_chetifs = ["Eliminer", "Pincer", "Nettoyer", "N/A"];
      $scope.tiress_seve = ["Eliminer", "Arquer", "Sélectionner", "N/A"];
      $scope.jupes = ["Eliminer", "Soulever", "N/A"];
      $scope.charpentieress = ["Réduire", "Sélectionner", "N/A"];
      $scope.frondaisons = ["Pincer", "Créer des ouvertures", "N/A"];
      $scope.cheminees = ["Nettoyer", "N/A"];


      $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDferme),
        ordredetaille.getparcellebyID({
          ID: $scope.data.id
        }),
        VarieteService.showVarieteByCultureFerme({
          FERME: pc.IDferme,
          culture: [0],
          VARIETE: [0],
          PARCELLE: [0],
          DATE_DEBUT: moment().format('YYYYMMDD'),
          DATE_FIN: moment().format('YYYYMMDD')
        }),
        portGreffe.getPortGreffe(),
        cultureService.getCultureByFerme(pc.IDferme)
      ]).then((values) => {
        $scope.parcelleculturals = values[0].data;
        $scope.parcelleOrdre = values[1].data;
        $scope.varietes = values[2].data;
        $scope.portGreffes = values[3].data;
        $scope.cultures = values[4].data;
        $scope.variete = [];
        $scope.portegreffe = [];
        $scope.culture = [];
        $scope.parcelleOrdre.forEach(parcelle => {
          if (parcelle.Variete) {
            $scope.variete.push(parcelle.IDVariete);
          }
          if (parcelle.portegreffe) {
            $scope.portegreffe.push(parcelle.IDPorte_greffe);
          }
          if (parcelle.IDCulture) {
            $scope.culture.push(parcelle.IDCulture);
          }
        });


        NProgress.done();
        $scope.letmeclick = true;
      });

      $scope.isINParcelle = function(ID) {
        var ifoundIt = false;
        angular.forEach($scope.parcelleOrdre, function(value, key) {
          if (value.ID_Parcelle == ID && ifoundIt == false) {
            ifoundIt = true;
          }
        });
        return ifoundIt;
      }

      $scope.ichangeVarieteOrportgref = false;

      $scope.getParcelleByVariete_portgreff = async function() {

        await $q.all([parcellecultural.ByCultureVarietePortgreff({
          VARIETE: ($scope.variete && $scope.variete.length > 0) ? $scope.variete : 0,
          portgreffe: ($scope.portegreffe && $scope.portegreffe.length > 0) ? $scope.portegreffe : 0,
          FERME: pc.IDferme,
          Culture: ($scope.culture && $scope.culture.length > 0) ? $scope.culture : 0
        })]).then((values) => {
          $scope.parcelleculturals = values[0].data;
          $scope.parcelleculturalsel = [];
          NProgress.done();
          $scope.letmeclick = true;

          $scope.ichangeVarieteOrportgref = true;
        });
      }

      $scope.setVarieteandportgreff = function() {
        if (!$scope.ichangeVarieteOrportgref) {
          $scope.variete = [];
          $scope.portegreffe = [];
          $scope.culture = [];
          var isFirstIteration = true;
          try {
            $scope.parcelleculturalsel.forEach(parcelle => {
              if (isFirstIteration) {
                isFirstIteration = false;
              }
              if (parcelle.Variete) {
                $scope.variete.push(parcelle.Variete);
              }
              if (parcelle.IDPorte_greffe) {
                $scope.portegreffe.push(parcelle.IDPorte_greffe);
              }
              if (parcelle.idculture) {
                $scope.culture.push(parcelle.idculture);
              }
            });
          } catch (e) {}
        }
      };




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



      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.selectedTab = 0;

      $scope.goToPreviousTab = function() {
        if ($scope.selectedTab > 0) {
          $scope.selectedTab--;
        }
      };

      $scope.goToNextTab = function() {
        var totalTabs = 4;
        if ($scope.selectedTab < totalTabs - 1) {
          $scope.selectedTab++;
        }
      };


      $scope.setDateFin = function() {
        if ($scope.date_previsionnelle_debut && $scope.duree_estimee_taille) {
          $scope.date_previsionnelle_fin = new Date(moment($scope.date_previsionnelle_debut).add($scope.duree_estimee_taille, 'days').format("YYYY-MM-DD"));
        }
      }
      $scope.setDateFin();
      $scope.Modifier = async function() {
        $scope.progress = true;
        toastr.clear();


        if ($scope.date_previsionnelle_debut && $scope.parcelleculturalsel.length > 0 && $scope.type_de_taille && $scope.mode_de_taille && $scope.intensite_de_la_taille) {
          if ($scope.duree_estimee_taille >= 1) {


            pc.objAdd = {
              "ID": $scope.data.id,
              "date_previsionnelle_debut": moment($scope.date_previsionnelle_debut).format('YYYYMMDD'),
              "parcelleculturalsel": $scope.parcelleculturalsel,
              "type_de_taille": $filter('textforsqlserver_nullsupport')($scope.type_de_taille),
              "mode_de_taille": $filter('textforsqlserver_nullsupport')($scope.mode_de_taille),
              "intensite_de_la_taille": $filter('textforsqlserver_nullsupport')($scope.intensite_de_la_taille),
              "duree_estimee_taille": $scope.duree_estimee_taille,
              "affectation_mo_taille": ($scope.affectation_mo_taille.length > 0) ? ($filter('textforsqlserver_nullsupport')($scope.affectation_mo_taille.join(","))) : [],
              "mode_paiement_mo_taille": ($scope.mode_paiement_mo_taille.length > 0) ? ($filter('textforsqlserver_nullsupport')($scope.mode_paiement_mo_taille.join(","))) : [],

              "remarques": ($scope.remarques) ? $filter('textforsqlserver')($scope.remarques) : null,

              "profil_calibre": $filter('textforsqlserver_nullsupport')($scope.profil_calibre),
              "charge_des_arbres": $filter('textforsqlserver_nullsupport')($scope.charge_des_arbres),
              "qualite_interne": $filter('textforsqlserver_nullsupport')($scope.qualite_interne),
              "aspect_des_fruits": $filter('textforsqlserver_nullsupport')($scope.aspect_des_fruits),
              "formation_des_arbres": $filter('textforsqlserver_nullsupport')($scope.formation_des_arbres),
              "volume_des_arbres": $filter('textforsqlserver_nullsupport')($scope.volume_des_arbres),
              "hauteurs_des_arbres": $filter('textforsqlserver_nullsupport')($scope.hauteurs_des_arbres),
              "besoin_operationnel": $filter('textforsqlserver_nullsupport')($scope.besoin_operationnel),

              "observations": ($scope.observations) ? $filter('textforsqlserver')($scope.observations) : null,

              "bois_mort": $filter('textforsqlserver_nullsupport')($scope.bois_mort),
              "bois_casse": $filter('textforsqlserver_nullsupport')($scope.bois_casse),
              "rameaux_et_bois_chetifs": $filter('textforsqlserver_nullsupport')($scope.rameaux_et_bois_chetifs),
              "tires_seve": $filter('textforsqlserver_nullsupport')($scope.tires_seve),
              "jupe": $filter('textforsqlserver_nullsupport')($scope.jupe),
              "charpentieres": $filter('textforsqlserver_nullsupport')($scope.charpentieres),
              "frondaison": $filter('textforsqlserver_nullsupport')($scope.frondaison),
              "cheminee": $filter('textforsqlserver_nullsupport')($scope.cheminee),
              "autre": $filter('textforsqlserver_nullsupport')($scope.data.autre),
              "date_previsionnelle_fin": moment($scope.date_previsionnelle_fin).format('YYYYMMDD')
            };

            ordredetaille.updateweb(pc.objAdd).then(async function(res) {
              pc.resAdd = res.data;
              if (pc.resAdd[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Ajout reussi!")), {
                  closeButton: true
                });
                NProgress.done();
                $mdDialog.hide();
                document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                pc.dtInstance.reloadData();
              } else {
                $scope.progress = false;
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("An error occured ")) + pc.resAdd[0].description, {
                  closeButton: true
                });
              }
            });

          } else {
            $scope.progress = false;
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Durée(jours) estimée de la taille ne peux pas être 0 au moins 1")), {
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


    }


  });