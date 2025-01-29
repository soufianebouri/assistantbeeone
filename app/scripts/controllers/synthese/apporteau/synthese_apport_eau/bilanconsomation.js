'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:bilanConsomationCtrl
 * @description
 * # bilanConsomationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('bilanConsomationCtrl', function(ApportEau, $cookies, $q, $window, translatedwords, $translatePartialLoader, $translate, campagneagricole, $scope, BilanNutritionnel, savefilter) {
    var pc = this;
    var pivot = "";
    $scope.currentNavItem = 'realisation';
    pc.mode_irrigation = 0;
    pc.obj = {
      STANDARD: false,
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD'),
      FERME: $cookies.getObject('globals').ferme.IDFerme,
      mode_irrigation: 0
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.refreshCompagne = (id) => {
      setTimeout(function() {
        if (id) {
          $("#compagne").selectpicker('val', id);
        }
        $("#compagne").selectpicker('refresh');
        $(".selectpicker").selectpicker('refresh');
      }, 100);
    }

    pc.refreshCompagne();
    pc.compagne_change = () => {
      var cmp = pc.campagne.find(e => e.ID_compagne == $scope.compagne);
      pc.obj.DATE_DEBUT = moment(cmp.Date_debut).format('YYYYMMDD');
      pc.obj.DATE_FIN = moment(cmp.Date_Fin).format('YYYYMMDD');

      savefilter.setFilters(pc.obj);

      $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(moment(pc.obj.DATE_FIN).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    }

    pc.date_debut_change = function() {
      pc.obj.DATE_DEBUT = moment($scope.date_debut).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
    };

    pc.date_fin_change = function() {
      pc.obj.DATE_FIN = moment($scope.date_fin).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.date_debut = moment(moment(pc.obj.DATE_FIN).format('YYYYMMDD'), 'YYYY-MM-DD').toDate();
    };

    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('globals').ferme.IDSociete), ApportEau.getModeIrrigation({
      id_ferme: $cookies.getObject('globals').ferme.IDFerme
    })]).then((values) => {
      var canGo = true;
      pc.campagne = values[0].data;

      if (values[1].data.length > 0) {
        try {
          pc.mode_irrigation = values[1].data[0].mode_irrigation;
          pc.obj.mode_irrigation = pc.mode_irrigation;
        } catch (error) {
          pc.mode_irrigation = 1;
          pc.obj.mode_irrigation = 1;
        }
      } else {
        pc.mode_irrigation = 1;
        pc.obj.mode_irrigation = 1;
      }

      angular.forEach(values[0].data, function(value, key) {

        if (canGo && !angular.equals(savefilter.getFilters(), {})) {
          if (moment($scope.date_debut).isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
            $scope.currentCampagne = value.Code;
            canGo = false;
            pc.refreshCompagne(value.ID_compagne);
            pc.reload();
          }
        }

        if (angular.equals(savefilter.getFilters(), {}) && canGo && moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
          $scope.currentCampagne = value.Code;
          pc.obj.DATE_DEBUT = moment(value.Date_debut).format('YYYYMMDD');
          pc.obj.DATE_FIN = moment(value.Date_Fin).format('YYYYMMDD');
          $scope.date_debut = moment(moment(pc.obj.DATE_DEBUT).format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
          canGo = false;
          pc.refreshCompagne(value.ID_compagne);
          pc.reload();
        }
      });
    });

    pc.reload = () => {
      ApportEau.bilanconsomationByDateFerme(pc.obj).then(e => {
        /*angular.forEach(e.data, (v, k) => {
          v.DATE = moment(v.DATE).format('YYYY-MM-DD');
          v.Ref = v.Ref;
        });*/
        renderRocks_detailRealisation(e.data);
        NProgress.done();
      })
    }

    $scope.exportData = (type) => {
      pivot.exportTo(type);
    }

    async function renderRocks_detailRealisation(data) {
      var mymesureha = [];
      if (pc.mode_irrigation == 1) {
        //avancer
        mymesureha = [{
          uniqueName: "somme",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Dose")),
          formula: "sum('somme')"
        }, {
          uniqueName: "sommeha",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Dose / Ha")),
          formula: "sum('somme') / min('Sup')"
        }]
      } else {
        //simplifier
        mymesureha = [{
          uniqueName: "Quantité",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Dose")),
          formula: "sum('somme') * min('Sup')"
        }, {
          uniqueName: "Quantité / Ha",
          format: "format_number",
          caption: await translatedwords.getTranslatedWord($translate("Dose / Ha")),
          formula: "min('somme')"
        }]
      }

      pivot = new Flexmonster({
        container: "wdr-component-realisation",
        componentFolder: "https://cdn.flexmonster.com/",
        toolbar: false,
        height: $(window).height() - ($(window).height() / 5),
        report: {
          dataSource: {
            data: [{
              "Culture": {
                type: "String"
              },
              "DATE": {
                type: "date string"
              },
              "Intitule": {
                type: "String"
              },
              "Ref": {
                type: "String"
              },
              "Variete": {
                type: "String"
              },
              "Sup": {
                type: "number"
              },
              "somme": {
                type: "number"
              }
            }].concat(data)
          },
          options: {
            grid: {
              type: "classic",
              showTotals: "off"
            },
            datePattern: "dd/MM/yyyy"
          },
          formats: [{
            name: "format_number",
            maxDecimalPlaces: 2,
            decimalPlaces: 2,
            maxSymbols: 20,
            textAlign: "right",
            divideByZeroValue: "0",
            thousandsSeparator: " ",
            nullValue: ""
          }],
          slice: {
            rows: [{
                uniqueName: "Culture",
                caption: await translatedwords.getTranslatedWord($translate("Culture"))
              },
              {
                uniqueName: "Variete",
                caption: await translatedwords.getTranslatedWord($translate("Variete"))
              },
              {
                uniqueName: "Intitule",
                caption: await translatedwords.getTranslatedWord($translate("Groupe op"))
              },
              {
                uniqueName: "Ref",
                caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale"))
              },
              {
                uniqueName: "Sup",
                caption: await translatedwords.getTranslatedWord($translate("Sup"))
              }
            ],
            columns: [{
                uniqueName: "DATE",
                caption: await translatedwords.getTranslatedWord($translate("Date"))
              },
              {
                uniqueName: "[Measures]"
              }
            ],
            measures: mymesureha
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