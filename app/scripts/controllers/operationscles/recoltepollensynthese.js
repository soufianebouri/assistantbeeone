'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OperationsclesRecoltepollensyntheseCtrl
 * @description
 * # OperationsclesRecoltepollensyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OperationsclesRecoltepollensyntheseCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, $q, $cookies, recoltepollen, parcellecultural, toastr) {

    var pc = this;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.YearNow = moment().format('YYYY');
    pc.MonthNow = moment().format('MM');
    var pivot = undefined;
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
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

    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": moment($scope.date_fin).format('YYYYMMDD'),
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD'),
      "YEAR": pc.YearNow,
      "MONTH": pc.MonthNow
    };

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme), recoltepollen.getRecoltePollenParParcelle(pc.obj)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      renderData(values[1].data);
      NProgress.done();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });




    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    //by parcelle cultural
    $scope.parcelle_change = function() {

      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }
      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
    };

    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');

    };

    //by date_fin
    $scope.date_fin_change = function() {

      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');

    };

    //by year & month
    /*$scope.yearmonth_change = async function() {
      toastr.clear();
      if (moment($scope.yearmonth).isValid()) {
        $scope.year_sel = moment($scope.yearmonth).format('YYYY');
        $scope.month_sel = moment($scope.yearmonth).format('MM');
        pc.obj.YEAR = $scope.year_sel;
        pc.obj.MONTH = $scope.month_sel;
      } else {
        $scope.year_sel = 0;
        $scope.month_sel = 0;
        toastr.info(await translatedwords.getTranslatedWord($translate("veuillez choisir un date valide !")), {
          closeButton: true
        });
      }

    };*/

    pc.search = function() {
      $q.all([recoltepollen.getRecoltePollenParParcelle(pc.obj)]).then(function(values) {
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

    $scope.exportData = (type) => {
      pivot.exportTo(type, {
        filename: "Récolte du pollen - Vue synthétique",
        pageOrientation: "landscape"
      });
    }

    function renderData(data) {
      var modeldata = [{
        "DateCreated": {
          type: "date string"
        },
        "Qualite": {
          type: "number"
        },
        "Ref": {
          type: "String"
        }
      }];

      //componentFolder: "https://cdn.flexmonster.com/",
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
                type: "classic"
              },
              datePattern: "dd/MM/yyyy"
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
                caption: "Parcelle culturale"
              }],
              columns: [{
                uniqueName: "DateCreated",
                caption: "Date"
              }, {
                uniqueName: "Measures"
              }],
              measures: [{
                uniqueName: "Qualite",
                aggregation: "sum",
                format: "format_number",
                caption: "Quantité",
                active: true
              }]
            }
          },
          global: {
            localization: "https://cdn.webdatarocks.com/loc/en.json"
          }
        }

      );
    }

  });