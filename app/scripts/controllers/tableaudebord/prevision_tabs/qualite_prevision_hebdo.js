'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:QualitePrevisionHebdoCtrl
 * @description
 * # QualitePrevisionHebdoCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('QualitePrevisionHebdoCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $q,
    PeriodeEstimation,
    campagneagricole, translatedwords,
    _url) {
    var pc = this;
    $q.all([campagneagricole.getCampagneAgricole()]).then((values) => {
      var canGo = true;

      angular.forEach(values[0].data, function(value, key) {
        if (canGo && moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          $scope.currentCampagne = value.Code;
          canGo = false;
          PeriodeEstimation.qualitePrevisionHebdo({
            DEBUT_CAMPAGNE: value.Date_debut,
            today: moment().format('YYYYMMDD')
          }).then(e => {
            angular.forEach(e.data, (v, k) => {
              v.Prevu /= 1000;
              v.Prevu = parseFloat(v.Prevu).toFixed(2);
              v.Realise /= 1000;
              v.Realise = parseFloat(v.Realise).toFixed(2)
            });
            renderRocks_previsionHebdo(e.data);
          })
        }
      });
    });

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    async function renderRocks_previsionHebdo(data) {
      var pivot_previsionHebdo = new Flexmonster({
        container: "rocks_hebdo",
        componentFolder: "https://cdn.flexmonster.com/",
        toolbar: false,
        height: $(window).height() - ($(window).height() / 4),
        report: {
          dataSource: {
            data: [{
              "Libelle": {
                type: "String"
              },
              "Prevu": {
                type: "number"
              },
              "Realise": {
                type: "number"
              },
              "Type_variete": {
                type: "String"
              },
              "ferme": {
                type: "String"
              },
              "ecart": {
                type: "number"
              },
              "weeks": {
                type: "number"
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
                uniqueName: "Libelle",
                caption: await translatedwords.getTranslatedWord($translate("Producteur"))
              },
              {
                uniqueName: "ferme",
                caption: await translatedwords.getTranslatedWord($translate("Ferme"))
              },
              {
                uniqueName: "Type_variete",
                caption: await translatedwords.getTranslatedWord($translate("Type de variete"))
              },
              {
                uniqueName: "weeks",
                caption: await translatedwords.getTranslatedWord($translate("Semaine"))
              }
            ],
            columns: [{
              uniqueName: "[Measures]"
            }],
            measures: [{
                uniqueName: "Prevu",
                aggregation: "sum",
                format: "format_number"
              },
              {
                uniqueName: "Realise",
                aggregation: "sum",
                format: "format_number"
              },
              {
                uniqueName: "ecart",
                formula: "(1 - (sum('Prevu')/sum('Realise')))*100",
                caption: await translatedwords.getTranslatedWord($translate("Ecart en %")),
                format: "format_number"
              }
            ]


          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      pivot_previsionHebdo.expandAllData();
      NProgress.done();
      NProgress.remove();
    }

  });