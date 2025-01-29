'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierComptagearbresyntheseCtrl
 * @description
 * # PalmierdattierComptagearbresyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierComptagearbresyntheseCtrl', function($scope, translatedwords, savefilter, $window, $q, $compile, $translatePartialLoader, $translate, comptageArbre, $state, parcellecultural, $cookies, elementcomptage, toastr) {
    var pc = this;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    var pivot = undefined;

    setTimeout(function() {
      $(".selectpicker").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#Element").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.obj = {
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "PARCELLE": [0],
      "Element": 0,
      "NameElement": "",
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme), elementcomptage.GetElementComptage()]).then((values) => {
      pc.parcelles_array = values[0].data;
      pc.ElementComptage = values[1].data;
      renderData([]);
      NProgress.done();
      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $("#Element").selectpicker('refresh');
      }, 1000);
    });

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.search = async function() {
      if (pc.obj.Element != 0 && pc.obj.Element) {
        $q.all([comptageArbre.getForPivot(pc.obj)]).then(function(values) {
          renderData(values[0].data);
          NProgress.done();
        });
      } else {
        toastr.clear();
        toastr.info(await translatedwords.getTranslatedWord($translate("veuillez choisir un elément de comptage !")), {
          closeButton: true
        });
      }

    }

    //by parcelle cultural
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelle.parcelle;
      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];
      pc.obj.PARCELLE = parcelle;
    };

    //by element
    pc.element_change = function() {
      var element = $scope.element.element;
      pc.obj.Element = element.ID;
      pc.obj.NameElement = element.Nom;
    };

    //starting date change listner
    pc.date_debut_change = function() {
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;
      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;
      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
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
        filename: await translatedwords.getTranslatedWord($translate("Comptage par arbre - Vue synthétique")),
        pageOrientation: "landscape"
      });
    }

    async function renderData(data) {
      var modeldata = [{
        "DateCreated": {
          type: "date string"
        },
        "Nombre": {
          type: "number"
        },
        "Ref": {
          type: "String"
        },
        "Code_Arbre": {
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
            thousandsSeparator: " ",
            nullValue: ""
          }],
          slice: {
            rows: [{
              uniqueName: "Ref",
              caption: await translatedwords.getTranslatedWord($translate("Parcelle culturale"))
            }, {
              uniqueName: "Code_Arbre",
              caption: await translatedwords.getTranslatedWord($translate("Réf arbre"))
            }],
            columns: [{
              uniqueName: "DateCreated",
              caption: pc.obj.NameElement
            }, {
              uniqueName: "[Measures]"
            }],
            measures: [{
              aggregation: 'sum',
              uniqueName: "Nombre",
              grandTotalCaption: "Sum"
            }, {
              aggregation: 'max',
              uniqueName: "Nombre",
              grandTotalCaption: "Max"
            }]
          }
        },
        global: {
          localization: `/scripts/i18n/webdatarock/${$window.localStorage.getItem("lang").toLowerCase()}.json`
        }
      });
      pivot.expandAllData();


    }


  });