'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsBordereaucnssCtrl
 * @description
 * # MainoeuvreetatsBordereaucnssCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsBordereaucnssCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, bordereaucnss, $state, DTDefaultOptions, $cookies, $templateCache, _url, campagneagricole, toastr, periodepaie) {
    var pc = this;
    $scope.reload = true;
    pc.campagneagricole = [];
    pc.Param_JR = 1;
    pc.Param_MOIS = null;
    pc.periodepaies = [];
    pc.AllBordoreauCnss = [];
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Campagne").selectpicker('refresh');
      $("#Periode").selectpicker('refresh');
      $("#Periode2").selectpicker('refresh');
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.date_debut = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "SOCIETE": pc.IDSociete,
      "Param_JR": 1,
      "Param_MOIS": null,
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };


    $scope.campagne_sel = 0;
    $scope.periode_sel = 0;
    $scope.date_debut_sel = moment($scope.date_fin).format('YYYYMMDD');
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    //load personnel Data ref
    $q.all([campagneagricole.getCampagneAgricole(_url), periodepaie.getPeriodeEstimation(), bordereaucnss.GetBordoreauCnss(pc.obj)]).then(function(values) {
      pc.campagneagricole = values[0].data;
      pc.periodepaies = values[1].data;
      pc.AllBordoreauCnss = values[2].data;
      $scope.reload = false;
      pc.manageViews();
      NProgress.done();
      setTimeout(function() {
        $("#Campagne").selectpicker('refresh');
        $("#Periode").selectpicker('refresh');
        $("#Periode2").selectpicker('refresh');
      }, 1000);
    });

    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
        $scope.date_debut_sel = moment($scope.date_debut_sel).format('YYYYMMDD');
      }
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
        $scope.date_fin_sel = moment($scope.date_fin_sel).format('YYYYMMDD');
      }
    };

    //by campagne
    $scope.campagne_change = function() {
      if ($scope.campagne.campagne === null || $scope.campagne.campagne === "" || $scope.campagne.campagne === undefined || $scope.campagne.campagne === 0 || $scope.campagne.campagne === "0" || !$scope.campagne.campagne || $scope.campagne.campagne.length === 0) {
        $scope.campagne_sel = 0;
      } else {
        $scope.campagne_sel = $scope.campagne.campagne.Code;
      }
      setTimeout(function() {
        $('#Periode option').attr("selected", false);
        $("#Periode").selectpicker('refresh');
        $("#Periode2").selectpicker('refresh');
      }, 1000);
    };


    //by periode
    $scope.periode_change = function() {
      if ($scope.periode.periode === null || $scope.periode.periode === "" || $scope.periode.periode === undefined || $scope.periode.periode === 0 || $scope.periode.periode === "0" || !$scope.periode.periode || $scope.periode.periode.length === 0) {
        $scope.periode_sel = 0;
      } else {
        $scope.periode_sel = $scope.periode.periode;
        $scope.date1 = moment($scope.periode_sel.date_debut).format('YYYY-MM-DD');
        $scope.date2 = moment($scope.periode_sel.Date_fin).format('YYYY-MM-DD');
        $scope.date_debut = moment($scope.date1, 'YYYY-MM-DD').toDate();
        $scope.date_fin = moment($scope.date2, 'YYYY-MM-DD').toDate();
        $scope.date_debut_sel = moment($scope.periode_sel.date_debut).format('YYYYMMDD');
        $scope.date_fin_sel = moment($scope.periode_sel.Date_fin).format('YYYYMMDD');

        setTimeout(function() {
          $('#Periode2 option').attr("selected", false);
          $("#Periode2").selectpicker('refresh');
        }, 1000);
      }
    };

    //by periode2
    $scope.periode2_change = function() {
      if ($scope.periode2.periode2 === null || $scope.periode2.periode2 === "" || $scope.periode2.periode2 === undefined || $scope.periode2.periode2 === 0 || $scope.periode2.periode2 === "0" || !$scope.periode2.periode2 || $scope.periode2.periode2.length === 0) {
        $scope.periode2_sel = 0;
      } else {
        $scope.periode2_sel = $scope.periode2.periode2;
        $scope.date2 = moment($scope.periode2_sel.Date_fin).format('YYYY-MM-DD');
        $scope.date_fin = moment($scope.date2, 'YYYY-MM-DD').toDate();
        $scope.date_fin_sel = moment($scope.periode2_sel.Date_fin).format('YYYYMMDD');
      }
    };

    //by type
    $scope.type_change = function(type) {
      if (type == 1) {
        if ($("#horaire").hasClass("btn-success")) {
          $("#horaire").removeClass("btn-success");

        } else {
          $("#horaire").addClass("btn-success");
        }

      } else if (type == 2) {
        if ($("#salarie").hasClass("btn-success")) {
          $("#salarie").removeClass("btn-success");
        } else {
          $("#salarie").addClass("btn-success");
        }
      }
      $scope.sansprimes = type;
    };


    pc.rechercher = function() {
      if ($("#horaire").hasClass("btn-success")) {
        pc.Param_JR = 1;
        pc.Param_MOIS = null;
      }
      if ($("#salarie").hasClass("btn-success")) {
        pc.Param_JR = null;
        pc.Param_MOIS = 3;
      }
      if (($("#salarie").hasClass("btn-success") && $("#horaire").hasClass("btn-success")) || (!$("#salarie").hasClass("btn-success") && !$("#horaire").hasClass("btn-success"))) {
        pc.Param_JR = 1;
        pc.Param_MOIS = 3;
      }
      pc.obj.Param_JR = pc.Param_JR;
      pc.obj.Param_MOIS = pc.Param_MOIS;
      pc.obj.DATE_DEBUT = $scope.date_debut_sel;
      pc.obj.DATE_FIN = $scope.date_fin_sel;

      $q.all([bordereaucnss.GetBordoreauCnss(pc.obj)]).then(function(values) {
        pc.AllBordoreauCnss = values[0].data;
        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    };


    //print table pdf
    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        exclude: ".noExl",
        exclude_img: true,
        file_ext: ".xls",
        name: "BordereauCNSS",
        filename: "Bordereau CNSS.xls",
        preserveColors: true
      });
    };

    //search table listner
    $("#search").on("keyup", function() {
      if (pc.AllBordoreauCnss.length != 0) {
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

  });