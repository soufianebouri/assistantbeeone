'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteExpeditionssyntheseCtrl
 * @description
 * # RecolteExpeditionssyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteExpeditionssyntheseCtrl', function($scope, $q, $cookies, translatedwords, $translatePartialLoader, $translate, $window, expeditions, parcellecultural, toastr, VarieteService) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    var pivot = undefined;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.mode_affichage = 1;
    $scope.unite = 1;
    $scope.ha = false;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#VarieteSelection").selectpicker('refresh');
    }, 1000);

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
      "MODE": 1,
      "UNITE": 1,
      "HA": true,
      "VARIETE": [0],
      "DATE_DEBUT": moment($scope.date_fin).format('YYYYMMDD'),
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    pc.mode_affichage_change = (mode) => {
      $scope.mode_affichage = mode;
      pc.obj.MODE = $scope.mode_affichage;
      if ($scope.mode_affichage == 1) {
        $('#Journalier').addClass('btn-success');
        $('#Mensuel').removeClass('btn-success');
      } else {
        $('#Journalier').removeClass('btn-success');
        $('#Mensuel').addClass('btn-success');
      }
    }

    pc.unite_change = (unite) => {
      $scope.unite = unite;
      pc.obj.UNITE = $scope.unite;
      if ($scope.unite == 1) {
        $('#unite').addClass('btn-warning');
        $('#Kg').removeClass('btn-warning');
      } else {
        $('#unite').removeClass('btn-warning');
        $('#Kg').addClass('btn-warning');
      }
    }

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), VarieteService.getVarieteByParcel(pc.obj), expeditions.showExpeditionForPivot(pc.obj)]).then(function(values) {
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
      pc.obj.HA = $scope.ha;
      $q.all([expeditions.showExpeditionForPivot(pc.obj)]).then(function(values) {
        renderData(values[0].data);
        NProgress.done();
      });
    }

    $scope.print = () => {
      pivot.print();
    }

    $scope.exportData = (type) => {
      pivot.exportTo(type, {
        filename: "Expéditions - Fiche de suivi des quantités récoltés",
        pageOrientation: "landscape"
      });
    }

    $scope.getoptionspivot = function(mode, unite, ha, title, qtemsg) {
      var myoption = {};
      var mymesure = {};


      if (mode == 1) {
        //journalier
        var myoption = {
          grid: {
            type: "classic",
            title: title,
            showTotals: "off",
            showGrandTotals: "on"
          },
          datePattern: "dd/MM/yyyy"
        }
      } else {
        //Mensuel
        var myoption = {
          grid: {
            type: "classic",
            title: title,
            showTotals: "off",
            showGrandTotals: "on"
          },
          datePattern: "MM/yyyy"
        }
      }

      if (unite == 1) {
        //unite
        if (!ha) {
          var mymesure = {
            uniqueName: "Qte_unite",
            format: "format_number",
            caption: qtemsg,
            formula: "SUM('Qte_unite')"
          }
        } else {
          var mymesure = {
            uniqueName: "Qte_unite_ha",
            format: "format_number",
            caption: qtemsg,
            formula: "SUM('Qte_unite_ha')"
          }
        }
      } else {
        //kg
        if (!ha) {
          var mymesure = {
            uniqueName: "Qte_kg",
            format: "format_number",
            caption: qtemsg,
            formula: "SUM('Qte_kg')"
          }
        } else {
          var mymesure = {
            uniqueName: "Qte_kg_ha",
            format: "format_number",
            caption: qtemsg,
            formula: "SUM('Qte_kg_ha')"
          }
        }
      }

      return [myoption, mymesure]
    }

    async function renderData(data) {
      var title = "";
      if (data.length == 0) {
        title = await translatedwords.getTranslatedWord($translate("Sorry, Data Not Available, Please Check The Filtre Settings"));
      }


      var setoptions = $scope.getoptionspivot($scope.mode_affichage, $scope.unite, $scope.ha, title, await translatedwords.getTranslatedWord($translate("Somme quantité récoltée")));
      var modeldata = [{
        "Culture": {
          type: "string"
        },
        "Variete": {
          type: "string"
        },
        "Ref": {
          type: "string"
        },
        "Sup": {
          type: "number"
        },
        "DATE": {
          type: "date string"
        },
        "Qte_unite": {
          type: "number"
        },
        "Qte_unite_ha": {
          type: "number"
        },
        "Qte_kg": {
          type: "number"
        },
        "Qte_kg_ha": {
          type: "number"
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
            options: setoptions[0],
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
                uniqueName: "Culture",
                caption: await translatedwords.getTranslatedWord($translate("Culture"))
              }, {
                uniqueName: "Variete",
                caption: await translatedwords.getTranslatedWord($translate("Variété"))
              }, {
                uniqueName: "Ref",
                caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale"))
              }, {
                uniqueName: "Sup",
                caption: await translatedwords.getTranslatedWord($translate("Superficie"))
              }],
              columns: [{
                uniqueName: "Measures"
              }, {
                uniqueName: "DATE",
                caption: await translatedwords.getTranslatedWord($translate("DATE"))
              }],
              measures: [setoptions[1]]
            }
          },
          global: {
            localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
          }
        }

      );
      pivot.expandAllData();
    }

  });