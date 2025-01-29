'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:HarvastDetailCtrl
 * @description
 * # HarvastDetailCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('HarvastDetailCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $q,
    PeriodeEstimation,
    societe,
    TypeVarieteService,
    FermeService,
    VarieteService,
    parcellecultural, translatedwords,
    campagneagricole,
    _url) {
    var pc = this;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.periode_array_to_choose = [{
        ID: 1,
        label: 'Aujourd\'hui',
        from: moment().format('YYYYMMDD'),
        to: moment().format('YYYYMMDD')
      },
      {
        ID: 2,
        label: 'Semaine prochaine',
        from: moment().add(1, 'weeks').startOf('isoWeek').format('YYYYMMDD'),
        to: moment().add(1, 'weeks').endOf('isoWeek').format('YYYYMMDD')
      },
      {
        ID: 3,
        label: 'Période',
        from: null,
        to: null
      }
    ]
    pc.obj = {
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

    setTimeout(function() {
      $("#Societe").selectpicker('refresh');
      $("#periode").selectpicker('refresh');
      $("#periode_estimation").selectpicker('refresh');
      $("#type_variete").selectpicker('refresh');
      $("#domaine_detail_prevision").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
    }, 100);

    $scope.periode = 1;
    var pivot;

    $q.all([campagneagricole.getCampagneAgricole()]).then((values) => {
      var canGo = true;
      angular.forEach(values[0].data, function(value, key) {
        if (canGo && moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          $scope.currentCampagne = value.Code;
          canGo = false;
        }
      });
      setTimeout(function() {
        $("#periode_estimation").selectpicker('refresh');
      }, 100);
    });

    pc.getPeriodeEstimation = (estimationPeriode) => {
      return moment(estimationPeriode.Date_Debut).format('YYYY-MM-DD') + " / " + moment(estimationPeriode.Date_Fin).format('YYYY-MM-DD') + " (" + estimationPeriode.CodePeriode + ")";
    }

    setTimeout(function() {
      $('#periode').selectpicker('val', pc.periode_array_to_choose[0].ID);
    }, 100);

    pc.domaine_change_detail_prevision = () => {
      pc.variete_detail_prevision_array = [];
      pc.parcelles_detail_prevision_array = [];

      NProgress.start();
      if ($scope.domaine_detail_prevision && $scope.domaine_detail_prevision.length > 0 && !$scope.domaine_detail_prevision.includes(0)) {
        pc.obj.idferme = $scope.domaine_detail_prevision;
      } else {
        pc.obj.idferme = [];
        angular.forEach(pc.domaine_detail_prevision_array, (v, k) => {
          pc.obj.idferme.push(v.idfermes);
        });

      }

      if (pc.obj.idferme.length > 0) {
        $q.all([VarieteService.getVarieteByFarm(pc.obj), parcellecultural.showbydomaineIfExist({
          DOMAINE: pc.obj.idferme
        })]).then((values) => {
          pc.variete_detail_prevision_array = values[0].data;
          pc.parcelles_detail_prevision_array = values[1].data;


          setTimeout(function() {
            $("#variete").selectpicker('refresh');
            $("#parcelle").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        setTimeout(function() {
          $("#variete").selectpicker('refresh');
          $("#parcelle").selectpicker('refresh');
          NProgress.done();
        }, 100);
        NProgress.done();
      }

    }

    pc.parcelle_change_detail_prevision = () => {
      if ($scope.parcelle_detail_prevision && $scope.parcelle_detail_prevision.length > 0 && !$scope.parcelle_detail_prevision.includes(0)) {
        pc.obj.PARCELLE = $scope.parcelle_detail_prevision;
      } else pc.obj.PARCELLE = [0];
    }

    pc.variete_change_detail_prevision = () => {

      NProgress.start();
      if ($scope.variete_detail_prevision && $scope.variete_detail_prevision.length > 0 && !$scope.variete_detail_prevision.includes(0)) {
        pc.obj.VARIETE = $scope.variete_detail_prevision;
      } else pc.obj.VARIETE = [0];

      parcellecultural.showbyDomaineVarieteIfExist({
        DOMAINE: pc.obj.idferme,
        VARIETE: pc.obj.VARIETE
      }).then(e => {

        pc.parcelles_detail_prevision_array = e.data;
        setTimeout(function() {
          $("#parcelle").selectpicker('refresh');
          NProgress.done();
        }, 100);
      });
    }

    pc.societe_change_detail_prevision = () => {
      if ($scope.societe) {
        pc.periode_estimation_array = [];
        pc.type_variete_array = [];
        pc.domaine_detail_prevision_array = [];
        pc.variete_detail_prevision_array = [];
        pc.parcelles_detail_prevision_array = [];
        $q.all([PeriodeEstimation.getPeriodeEstimation({
            CAMPAGNE: $scope.currentCampagne,
            ID_Societe: $scope.societe
          }),
          TypeVarieteService.showBySociete({
            ID_Societe: $scope.societe
          })
        ]).then((values) => {
          pc.periode_estimation_array = values[0].data;
          pc.type_variete_array = values[1].data;


          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 100);
          NProgress.done();
        });
      }

    }

    pc.type_variete_change = () => {
      pc.domaine_detail_prevision_array = [];
      pc.variete_detail_prevision_array = [];
      pc.parcelles_detail_prevision_array = [];

      if ($scope.type_variete) {
        pc.obj.TYPE_VARIETE = $scope.type_variete;
        FermeService.byTypeVariete({
          idfamille_variete: $scope.type_variete
        }).then(e => {
          pc.domaine_detail_prevision_array = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
          }, 100);
        });
      } else {
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 100);
        pc.obj.TYPE_VARIETE = 0;
      }

    }

    function loadAllDataSpinner_detail() {
      $q.all([societe.getSociete(_url)]).then((values) => {
        pc.societes = values[0].data;
        setTimeout(function() {
          $('#Societe').selectpicker('val', values[0].data[0].ID);
          $scope.societe = values[0].data[0].ID;
          $("#Societe").selectpicker('refresh');
          pc.societe_change_detail_prevision();
        }, 100);
        NProgress.done();
      });
    }

    loadAllDataSpinner_detail();
    pc.periode_change = () => {
      if ($scope.periode) {
        if ($scope.periode > 2) {
          $(".periode_estimation").fadeIn();
          pc.obj.FROM = pc.obj.TO = null;
        } else {
          $(".periode_estimation").fadeOut();
          pc.obj.FROM = (pc.periode_array_to_choose.find(e => e.ID == $scope.periode)).from;
          pc.obj.TO = (pc.periode_array_to_choose.find(e => e.ID == $scope.periode)).to;
        }
      }
    }

    pc.periode_estimation_change = () => {
      pc.obj.FROM = moment($scope.periode_estimation.Date_Debut).format('YYYYMMDD');
      pc.obj.TO = moment($scope.periode_estimation.Date_Fin).format('YYYYMMDD');
    }

    pc.loadDataDetailPrevision = () => {
      if ($scope.periode) {
        if ($scope.periode == 1) {
          PeriodeEstimation.getDetailPrevisionAujourdhui(pc.obj).then(e => {

            angular.forEach(e.data, (v, k) => {
              v.QTE /= 1000;
              v.QTE = parseFloat(v.QTE).toFixed(2)
            });
            renderRocks_detailPrevision(e.data)
          });
        } else if ($scope.periode == 2) {
          pc.obj.FROM = pc.obj.today;
          PeriodeEstimation.getDetailSemaineProchaine(pc.obj).then(e => {
            angular.forEach(e.data, (v, k) => {
              v.QTE /= 1000;
              v.QTE = parseFloat(v.QTE).toFixed(2)
            });
            renderRocks_detailPrevision(e.data)
          })
        } else {
          pc.obj.FROM = pc.obj.today;
          PeriodeEstimation.getDetailPeriode(pc.obj).then(e => {
            angular.forEach(e.data, (v, k) => {
              v.QTE /= 1000;
              v.QTE = parseFloat(v.QTE).toFixed(2)
            });
            renderRocks_detailPrevision(e.data)
          });
        }
      }
    }

    pc.loadDataDetailPrevision();

    async function renderRocks_detailPrevision(data) {
      pivot = new Flexmonster({
        container: "wdr-component",
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

  });