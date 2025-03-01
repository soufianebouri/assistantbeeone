'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RealisationSyntheseCtrl
 * @description
 * # RealisationSyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RealisationSyntheseCtrl', function(ApportEau, $cookies, translatedwords, $window, $q, campagneagricole, $scope, BilanNutritionnel, savefilter, $translatePartialLoader, $translate) {
    var pc = this;
    var pivot = "";
    $scope.currentNavItem = 'realisation';
    pc.Mode_fert = 0;
    pc.obj = {
      STANDARD: false,
      DATE_DEBUT: moment().format('YYYYMMDD'),
      DATE_FIN: moment().format('YYYYMMDD'),
      FERME: $cookies.getObject('beeoneAssistant').ferme.IDFerme,
      Mode_fert: 0
    }

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

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

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

    $q.all([campagneagricole.getCampagneAgricoleByIDSociete($cookies.getObject('beeoneAssistant').ferme.IDSociete), BilanNutritionnel.getmodefert(pc.obj)]).then((values) => {
      var canGo = true;
      pc.campagne = values[0].data;

      if (values[1].data.length > 0) {
        try {
          pc.Mode_fert = values[1].data[0].Mode_fert;
          pc.obj.Mode_fert = pc.Mode_fert;
        } catch (error) {
          pc.Mode_fert = 1;
          pc.obj.Mode_fert = 1;
        }
      } else {
        pc.Mode_fert = 1;
        pc.obj.Mode_fert = 1;
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
      ApportEau.getApportsEngrais(pc.obj).then(e => {
        angular.forEach(e.data, (v, k) => {
          v.Date_Realisation = moment(v.Date_Realisation).format('YYYY-MM-DD');
          v.Ref = v.Ref + ` (${parseFloat(v.Sup).toFixed(2)})`;
        });
        renderRocks_detailRealisation(e.data);
        NProgress.done();
      })
    }

    $scope.exportData = (type) => {
      pivot.exportTo(type);
    }

    function renderRocks_detailRealisation(data) {
      var mymesureha = [];
      if (pc.Mode_fert == 1) {
        //avancer
        mymesureha = [{
          uniqueName: "Quantité",
          format: "format_number",
          caption: "Quantité",
          formula: "sum('la_somme_Quantite')"
        }, {
          uniqueName: "Quantité / Ha",
          format: "format_number",
          caption: "Quantité / Ha",
          formula: "sum('la_somme_Quantite') / sum('Sup')"
        }]
      } else {
        //simplifier
        mymesureha = [{
          uniqueName: "Quantité",
          format: "format_number",
          caption: "Quantité",
          formula: "sum('la_somme_Quantite') * sum('Sup')"
        }, {
          uniqueName: "Quantité / Ha",
          format: "format_number",
          caption: "Quantité / Ha",
          formula: "sum('la_somme_Quantite')"
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
              "Date_Realisation": {
                type: "date string"
              },
              "Designation": {
                type: "String"
              },
              "unite": {
                type: "String"
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
              "la_somme_Quantite": {
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
                caption: "Culture"
              },
              {
                uniqueName: "Variete",
                caption: "Variete"
              },
              {
                uniqueName: "Intitule",
                caption: "Groupe op"
              },
              {
                uniqueName: "Ref",
                caption: "Parcelle culturale(Sup)"
              },
              {
                uniqueName: "Designation",
                caption: "Engrais"
              },
              {
                uniqueName: "unite",
                caption: "Unité"
              }
            ],
            columns: [{
                uniqueName: "Date_Realisation",
                caption: "Date realisation"
              },
              {
                uniqueName: "[Measures]"
              }
            ],
            measures: mymesureha
          }
        },
        global: {
          localization: "./scripts/model/webdatarocktranstale.json"
        }
      });
      pivot.expandAllData();
      NProgress.done();
      NProgress.remove();
    }

  });