'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierFichedesuiviprofilcalibreCtrl
 * @description
 * # PalmierdattierFichedesuiviprofilcalibreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierFichedesuiviprofilcalibreCtrl', function($scope, translatedwords, $window, $q, $translatePartialLoader, $translate, $cookies, recoltepollen, parcellecultural, toastr, VarieteService, ProfilCalibre) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    var pivot = undefined;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#VarieteSelection").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "FERME": pc.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "VARIETE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), VarieteService.getVarieteByParcel(pc.obj), ProfilCalibre.getFicheProfilCalibre(pc.obj)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      pc.varietes = values[1].data;
      renderData(values[2].data);
      NProgress.done();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#VarieteSelection").selectpicker('refresh');
      }, 1000);
    });

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //by parcelle cultural
    $scope.parcelle_change = function() {

      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }
      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
    };

    //by variete
    pc.variete_change = function() {
      var variete = $scope.variete.variete;
      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        variete = [0];
      pc.obj.VARIETE = variete;
    };

    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;
      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;
      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
    };


    pc.search = function() {

      $q.all([ProfilCalibre.getFicheProfilCalibre(pc.obj)]).then(function(values) {
        renderData(values[0].data);
        NProgress.done();
      });
    }

    $scope.print = () => {
      /*var options = {
        header: "<div>##CURRENT-DATE##</div>",
        footer: "<div>##PAGE-NUMBER##</div>"
      }*/
      pivot.print();
    }

    $scope.exportData = async (type) => {
      pivot.exportTo(type, {
        filename: await translatedwords.getTranslatedWord($translate("Profil de calibre - Vue synthétiquee")),
        pageOrientation: "landscape"
      });
    }

    async function renderData(data) {
      var title = "";
      if (data.length == 0) {
        title = await translatedwords.getTranslatedWord($translate("Sorry, Data Not Available, Please Check The Filtre Settings"));
      }
      var modeldata = [{
        "Calibre": {
          type: "string"
        },
        "Pourcentage_Calibre": {
          type: "number"
        },
        "Ref": {
          type: "String"
        }
      }];
      pivot = new Flexmonster({
          container: "#wdr-component",
          componentFolder: "https://cdn.flexmonster.com/",
          width: "100%",
          height: 600,
          report: {
            dataSource: {
              data: modeldata.concat(data)
            },
            options: {
              grid: {
                type: "classic",
                title: title,
                showTotals: "off",
                showGrandTotals: "off"
              }
            },
            formats: [{
              name: "format_number",
              maxDecimalPlaces: 2,
              decimalPlaces: 2,
              maxSymbols: 20,
              textAlign: "right",
              thousandsSeparator: " ",
              nullValue: ""
            }],
            slice: {
              rows: [{
                uniqueName: "Ref",
                caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale")),
              }],
              columns: [{
                uniqueName: "Measures"
              }, {
                uniqueName: "Calibre",
                caption: await translatedwords.getTranslatedWord($translate("Calibre")),
              }],
              measures: [{
                uniqueName: "Pourcentage_Calibre",
                format: "format_number",
                caption: await translatedwords.getTranslatedWord($translate("Pourcentage calibre")),
                formula: "average('Pourcentage_Calibre')"
              }]
            }
          },
          global: {
            localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
          }
        }

      );
    }

  });