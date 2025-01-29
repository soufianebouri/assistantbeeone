'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PlantationIntensitefleursCtrl
 * @description
 * # PlantationIntensitefleursCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PlantationIntensitefleursCtrl', function($scope, translatedwords, DTOptionsBuilder, DTColumnBuilder, $translatePartialLoader, $translate, $window, $q, $compile, $mdDialog, toastr, savefilter, campagneagricole, IntensiteFleur, $state, parcellecultural, $cookies, DTDefaultOptions) {


    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 4);
    pc.dtInstance = {};
    //set date input
    $scope.reload = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.IntensiteObject = {};
    pc.obj = {
      "STANDARD": true,
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "CAMPAGNE_AGRICOLE": 0,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

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

    //load Parcelle cultural list by domaine
    parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme).then(function(res) {
      pc.parcellescultural = res.data;


      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });

    //by parcelle cultural
    pc.parcelle_change = function() {


      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;
      $scope.reload = true;
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
      savefilter.setFilters(pc.obj);
      $scope.reload = true;
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
      savefilter.setFilters(pc.obj);
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        IntensiteFleur.getIntensiteFleur(pc.obj).then(function(result) {
          //to tell the WS that we need custom data with date,parcel and so on ...
          pc.obj.STANDARD = false;
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = moment(result.data[i].DateCreated).format('YYYY-MM-DD');
            result.data[i].TimeCreated = (result.data[i].TimeCreated) ? result.data[i].TimeCreated : "--";
          }
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("syntheseIntensiteFleurs");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Synthèse intensité des fleurs / type de fleurs"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Num_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))),
      DTColumnBuilder.newColumn('Orientation').withTitle(translatedwords.getTranslatedWord($translate("Orientation"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_solitaire').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/ solitaire"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_avec_feuille').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/avec feuille"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_apical').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur apical"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_feuilles_sup_fleurs').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/ feuilles> fleurs"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_feuilles_inf_fleurs').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/ feuilles< fleurs"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_grappe').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/grappe"))),
      DTColumnBuilder.newColumn('nbr_de_fleur_aveugle').withTitle(translatedwords.getTranslatedWord($translate("Nbr de fleur/aveugle"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withOption('width', '5%').withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable()
      .renderWith(actionsHtml).withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

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
      pc.IntensiteObject[data.ID] = data;
      return "<center><button class='btn btn-warning btn-xs' title='Modifier' ng-click='pc.edit(pc.IntensiteObject[  " + data.ID + " ])'><i class='fa fa-edit'></i></button>&nbsp;" +
        "<button class='btn btn-danger btn-xs' title='Supprimer' ng-click='pc.delete(" + data.ID + ")'><i class='fa fa-trash'></i></button><center>";
    }

    //Modifer
    pc.edit = function(data) {
      $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.data);
      });
    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/Suiviintensitefleurs/EditIntensiteFleurs.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcelleCulturale, data) {
      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.data = data;
      $scope.progress = false;
      $scope.datedecreation = new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD"));
      $scope.orientationArr = [{
        'name': 'E',
        'key': 1
      }, {
        'name': 'O',
        'key': 2
      }, {
        'name': 'N',
        'key': 3
      }, {
        'name': 'S',
        'key': 4
      }, {
        'name': 'C',
        'key': 5
      }];

      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.ID_ParcelleCulturale;
        }
        if (!$scope.orientation) {
          $scope.orientation = $scope.data.Orientation;
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

      $scope.Modifier = async function() {
        toastr.clear();
        $scope.onUpdate();
        $scope.mydatedecreation = moment($scope.datedecreation).format('YYYYMMDD');
        if ($scope.parcelleculturale && $scope.data.Num_Arbre && $scope.orientation && data.nbr_de_fleur_apical >= 0 && data.nbr_de_fleur_avec_feuille >= 0 && data.nbr_de_fleur_aveugle >= 0 && data.nbr_de_fleur_feuilles_inf_fleurs >= 0 && data.nbr_de_fleur_feuilles_sup_fleurs >= 0 && data.nbr_de_fleur_grappe >= 0 && data.nbr_de_fleur_solitaire >= 0) {
          //check campagneagricole

          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              IntensiteFleur.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "parcelleculturale": $scope.parcelleculturale,
                "Num_Arbre": $scope.data.Num_Arbre,
                "orientation": $scope.orientation,
                "Code_compagne": result.data[0].Code_compagne,
                "nbr_de_fleur_apical": $scope.data.nbr_de_fleur_apical,
                "nbr_de_fleur_avec_feuille": $scope.data.nbr_de_fleur_avec_feuille,
                "nbr_de_fleur_aveugle": $scope.data.nbr_de_fleur_aveugle,
                "nbr_de_fleur_feuilles_inf_fleurs": $scope.data.nbr_de_fleur_feuilles_inf_fleurs,
                "nbr_de_fleur_feuilles_sup_fleurs": $scope.data.nbr_de_fleur_feuilles_sup_fleurs,
                "nbr_de_fleur_grappe": $scope.data.nbr_de_fleur_grappe,
                "nbr_de_fleur_solitaire": $scope.data.nbr_de_fleur_solitaire
              }).then(async function(res) {
                NProgress.done();
                pc.rescreate = res.data;
                if (pc.rescreate[0].message == 'ajout reussi') {
                  toastr.clear();
                  toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                    closeButton: true
                  });
                  $mdDialog.hide();
                  document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                  pc.dtInstance.reloadData();
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
              toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
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

    //Delete StadePheno
    pc.delete = async function(ID) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            IntensiteFleur.delete({
              "ID": ID
            }).then(async function(res) {
              NProgress.done();
              pc.rescreate = res.data;
              if (pc.rescreate[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Le serveur ne répond pas, veuillez réessayer ultérieurement !")), {
                  closeButton: true
                });
              }
            });
          });
        }
      });


    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });