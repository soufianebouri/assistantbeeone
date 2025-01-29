'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteComptagedesravageursSynthesesurveillanceCtrl
 * @description
 * # SanteplanteComptagedesravageursSynthesesurveillanceCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteComptagedesravageursSynthesesurveillanceCtrl', function($scope, translatedwords, $window, DTOptionsBuilder, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, comptagedesravageursSynthesesurveillance, parcellecultural, Cible, _url, savefilter) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.AllDistinctedCible = [];
    pc.AllArbreParcelle = [];
    pc.AllnbrInsect = [];
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.reload = true;
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#Cible").selectpicker('refresh');
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
    $scope.LoadParcelleCultural = Cible.getCible(_url).then(function(res) {
      pc.cibes = res.data;
    });

    //load Cible
    $scope.LoadCible = parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme).then(function(res) {
      pc.parcellescultural = res.data;
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "CIBLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([$scope.LoadParcelleCultural, $scope.LoadCible]).then(function(values) {
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#Cible").selectpicker('refresh');
      }, 1000);
    });

    pc.loadData = () => {
      $q.all([comptagedesravageursSynthesesurveillance.getDistinctedCible(pc.obj), comptagedesravageursSynthesesurveillance.getArbreParcelle(pc.obj), comptagedesravageursSynthesesurveillance.getNbrInsectes(pc.obj)]).then(function(values) {
        pc.AllDistinctedCible = values[0].data;
        pc.AllArbreParcelle = values[1].data;
        pc.AllnbrInsect = values[2].data;
        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    }

    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.getAsArray = function(number) {
      return new Array(number);
    }




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
      pc.loadData();
    };

    //by cible
    $scope.cible_change = function() {

      if ($scope.cible.cible === null || $scope.cible.cible === "" || $scope.cible.cible === undefined || $scope.cible.cible === 0 || $scope.cible.cible === "0" || !$scope.cible.cible || $scope.cible.cible.length === 0 || $scope.cible.cible.includes(0)) {
        $scope.cible_sel = [0];
      } else {
        $scope.cible_sel = $scope.cible.cible;
      }

      pc.obj.CIBLE = $scope.cible_sel;
      pc.loadData();
    };

    //by date_debutl
    $scope.date_debut_change = function() {

      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }
      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      pc.loadData();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }
      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      pc.loadData();
    };

    //print table pdf
    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Synthèse de surveillance.xls",
        preserveColors: true
      });
    };

    pc.getPourcentageInsect = function(nbrArbre, nbrRavageur) {
      var nbrArbre = nbrArbre;
      var nbrRavageur = nbrRavageur;
      var res_porcentage = "";
      if (nbrArbre == "" || nbrRavageur == "" || !nbrArbre || !nbrRavageur) {
        res_porcentage = "";
      } else {
        if (parseFloat(nbrArbre) == 0 || parseFloat(nbrRavageur) == 0) {
          res_porcentage = "0 %";
        } else {
          res_porcentage = (parseFloat(nbrRavageur) / (parseFloat(nbrArbre) * 5)) * 100;
          res_porcentage = res_porcentage.toFixed(2) + " %";
        }
      }
      return res_porcentage;
    }


    //search table listner
    $("#search").on("keyup", function() {
      if (pc.AllArbreParcelle.length != 0) {
        var value = $(this).val().toLowerCase();
        var classShow = [];
        $("table tr").each(function(index) {
          if (index != 0) {

            var $row = $(this);

            $row.find("td").each(function(index) {
              var id = $(this).text().toLowerCase();
              if (id.indexOf(value) != 0) {
                if (!classShow.includes($row.attr('class'))) {
                  $("." + $row.attr('class')).hide();
                }
              } else {
                $("." + $row.attr('class')).show();
                classShow.push($row.attr('class'));
              }

            });
          }
        });
      }
    })

    pc.markThoseLine = (Reference) => {
      $('tr').css('background-color', '');
      $('.' + Reference.replace(/ /g, "_")).css('background-color', '#fff6b5');
    };


    //DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



  });