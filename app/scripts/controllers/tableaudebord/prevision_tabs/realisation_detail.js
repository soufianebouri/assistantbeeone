'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RealisationDetailCtrl
 * @description
 * # RealisationDetailCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RealisationDetailCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $q,
    PeriodeEstimation,
    TypeVarieteService,
    FermeService,
    VarieteService, translatedwords,
    parcellecultural,
    societe,
    _url) {
    var pc = this;
    var pivot = {};
    //refresh ll picker
    setTimeout(function() {
      $("#Societe_d_real").selectpicker('refresh');
      $("#periode_d_real").selectpicker('refresh');
      $("#type_variete_d_real").selectpicker('refresh');
      $("#domaine_d_real").selectpicker('refresh');
      $("#variete_d_real").selectpicker('refresh');
      $("#parcelle_d_real").selectpicker('refresh');
      $(".selectpicker").selectpicker('refresh');
    }, 100);
    //end refresh

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    //START 'Détail des realisation' (variables)
    pc.periode_array_realisation_to_choose = [{
        ID: 1,
        label: 'Hier'
      },
      {
        ID: 2,
        label: 'Semaine en cours à date'
      },
      {
        ID: 3,
        label: 'Semaine dernière',
      },
      {
        ID: 4,
        label: 'Derniers 7 jours',
      }
    ]
    pc.obj_realisation = {
      "FERME": [0],
      "multi": true,
      "today": moment().format('YYYYMMDD'),
      "idferme": [0],
      "VARIETE": [0],
      "TYPE_VARIETE": [0],
      "PARCELLE": [0],
      "FROM": moment().format('YYYYMMDD'),
      "TO": moment().format('YYYYMMDD')
    };
    $scope.periode_d_real = 1;
    //END 'Détail des realisation' (variables)
    am4core.useTheme(am4themes_animated);
    //START 'Détail des réalisations' (functions)
    setTimeout(function() {
      $('#periode_d_real').selectpicker('val', pc.periode_array_realisation_to_choose[0].ID);
    }, 100);

    pc.societe_change_detail_realisation = () => {
      pc.type_variete_array_d_real = [];
      pc.domaine_d_real_array = [];
      pc.variete_d_real_array = [];
      pc.parcelles_d_real_array = [];
      $q.all([TypeVarieteService.showBySociete({
        ID_Societe: $scope.societe_d_real
      })]).then((values) => {
        pc.type_variete_array_d_real = values[0].data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 100);
        NProgress.done();
      });
    }

    pc.type_variete_change_d_real = () => {
      pc.domaine_d_real_array = [];
      pc.variete_d_real_array = [];
      pc.parcelles_d_real_array = [];

      if ($scope.type_variete_d_real) {
        NProgress.start();
        pc.obj_realisation.TYPE_VARIETE = $scope.type_variete_d_real;
        FermeService.byTypeVariete({
          idfamille_variete: $scope.type_variete_d_real
        }).then(e => {
          pc.domaine_d_real_array = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 100);
        pc.obj_realisation.TYPE_VARIETE = 0;
      }

    }

    pc.domaine_change_d_real = () => {
      pc.variete_d_real_array = [];
      pc.parcelles_d_real_array = [];

      NProgress.start();

      if ($scope.domaine_d_real && $scope.domaine_d_real.length > 0 && !$scope.domaine_d_real.includes(0)) {
        pc.obj_realisation.idferme = $scope.domaine_d_real;
      } else {
        pc.obj_realisation.idferme = [];
        angular.forEach(pc.domaine_d_real_array, (v, k) => {
          pc.obj_realisation.idferme.push(v.idfermes);
        });
      }

      if (pc.obj_realisation.idferme.length > 0) {
        $q.all([VarieteService.getVarieteByFarm(pc.obj_realisation), parcellecultural.showbydomaineIfExist({
          DOMAINE: pc.obj_realisation.idferme
        })]).then((values) => {
          pc.variete_d_real_array = values[0].data;
          pc.parcelles_d_real_array = values[1].data;


          setTimeout(function() {
            $("#variete_d_real").selectpicker('refresh');
            $("#parcelle_d_real").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $("#variete_d_real").selectpicker('refresh');
          $("#parcelle_d_real").selectpicker('refresh');
          NProgress.done();
        }, 100);
        pc.obj_realisation.idferme = [0];
      }

    }

    pc.loadDataDetailRealisation = () => {
      if ($scope.periode_d_real) {
        if ($scope.periode_d_real == 1) {
          PeriodeEstimation.hierRealisation(pc.obj_realisation).then(e => {
            renderRocks_detailRealisation(e.data)
          });
        } else if ($scope.periode_d_real == 2) {
          PeriodeEstimation.semainEnCoursRealisation(pc.obj_realisation).then(e => {
            renderRocks_detailRealisation(e.data)
          })
        } else if ($scope.periode_d_real == 3) {
          PeriodeEstimation.semaineDerniereRealisation(pc.obj_realisation).then(e => {
            renderRocks_detailRealisation(e.data)
          })
        } else {
          PeriodeEstimation.lastSevenDaysRealisation(pc.obj_realisation).then(e => {
            renderRocks_detailRealisation(e.data)
          });
        }
      }
    }

    pc.variete_change_d_real = () => {
      NProgress.start();
      if ($scope.variete_d_real && $scope.variete_d_real.length > 0 && !$scope.variete_d_real.includes(0)) {
        pc.obj_realisation.VARIETE = $scope.variete_d_real;
      } else pc.obj_realisation.VARIETE = [0];

      parcellecultural.showbyDomaineVarieteIfExist({
        DOMAINE: pc.obj_realisation.idferme,
        VARIETE: pc.obj_realisation.VARIETE
      }).then(e => {

        pc.parcelles_d_real_array = e.data;
        setTimeout(function() {
          $("#parcelle_d_real").selectpicker('refresh');
          NProgress.done();
        }, 100);
      });
    }

    pc.loadDataDetailRealisation();

    async function renderRocks_detailRealisation(data) {
      pivot = new Flexmonster({
        container: "wdr-component-realisation",
        componentFolder: "https://cdn.flexmonster.com/",
        toolbar: false,
        height: $(window).height() - ($(window).height() / 2),
        report: {
          dataSource: {
            data: [{
              "Ferme": {
                type: "String"
              },
              "superficie": {
                type: "number"
              },
              "QTE": {
                type: "number"
              },
              "date": {
                type: "String"
              }
            }].concat(data)
          },
          options: {
            grid: {
              type: "classic"
            }
          },
          formats: [{
            name: "format_number",
            maxDecimalPlaces: 2,
            decimalPlaces: 2,
            maxSymbols: 20,
            textAlign: "right",
            nullValue: "0"
          }],
          slice: {
            rows: [{
                uniqueName: "Ferme",
                caption: await translatedwords.getTranslatedWord($translate("Ferme"))
              },
              {
                uniqueName: "superficie",
                caption: await translatedwords.getTranslatedWord($translate("Superficie"))
              }
            ],
            columns: [{
                uniqueName: "date",
                caption: await translatedwords.getTranslatedWord($translate("Date"))
              },
              {
                uniqueName: "[Measures]"
              }
            ],
            measures: [{
              uniqueName: "QTE",
              aggregation: "sum",
              format: "format_number"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      pivot.expandAllData();
      NProgress.done();
      NProgress.remove();
    }

    function loadAllDataSpinner_detail() {
      $q.all([societe.getSociete(_url)]).then((values) => {
        pc.societes_d_real = values[0].data;
        setTimeout(function() {
          $('#Societe_d_real').selectpicker('val', values[0].data[0].ID);
          $scope.societe_d_real = values[0].data[0].ID;
          $("#Societe_d_real").selectpicker('refresh');
          pc.societe_change_detail_realisation();
        }, 100);
        NProgress.done();
      });
    }
    loadAllDataSpinner_detail();
    //END 'Détail des réalisations' (functions)

  });