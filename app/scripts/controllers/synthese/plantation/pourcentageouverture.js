'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SynthesePlantationPourcentageouvertureCtrl
 * @description
 * # SynthesePlantationPourcentageouvertureCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SynthesePlantationPourcentageouvertureCtrl', function($scope, translatedwords, $window, $q, pourcentageOuverture, $translatePartialLoader, $translate, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);

    //set date input
    $scope.reload = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      "STANDARD": true,
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "CAMPAGNE_AGRICOLE": 0,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    pc.orientation = ['O', 'N', 'S', 'C', 'Total'];
    //loading purpose
    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.loadSynthesisData = () => {
      $q.all([pourcentageOuverture.getParcelWithArbre(pc.obj), pourcentageOuverture.getParcelWithOrientation(pc.obj)]).then(function(values) {
        pc.parcelWithArbre = values[0].data;
        pc.nbrfeuillebyfiltre = values[1].data;
        $scope.reload = false;
        pc.manageViews();
      });
    }

    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Domaine").selectpicker('refresh');
      $("#Campagne").selectpicker('refresh');
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([campagneagricole.getCampagneAgricole(),
      domaine.getDomaine(),
      parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme),
      pourcentageOuverture.getParcelWithArbre(pc.obj),
      pourcentageOuverture.getParcelWithOrientation(pc.obj)
    ]).then((values) => {

      pc.campagnes = values[0].data;
      pc.domaines = values[1].data;
      pc.parcellescultural = values[2].data;
      pc.parcelWithArbre = values[3].data;
      pc.nbrfeuillebyfiltre = values[4].data;
      //to tell the WS that we need custom data with date,parcel and so on ...
      pc.obj.STANDARD = false;

      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Domaine").selectpicker('refresh');
        $("#Campagne").selectpicker('refresh');
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });


    //Welcome to LISTNERS & Events

    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      $("#printThis").height(heightOfTable);
    });

    //search table listner
    $("#search").on("keyup", function() {
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
    })

    //starting date change listner
    pc.date_debut_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.reload = true;
      pc.manageViews();
      pc.loadSynthesisData();
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    pc.date_fin_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      $scope.reload = true;
      pc.manageViews();
      pc.loadSynthesisData();
      NProgress.done();
      NProgress.remove();
    };

    //by parcelle cultural
    pc.parcelle_change = function() {
      NProgress.start();
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;
      $scope.reload = true;
      pc.manageViews();
      pc.loadSynthesisData();
      NProgress.done();
      NProgress.remove();
    };

    //toggle filter show
    pc.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    //print table pdf
    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Synthèse de pourcentage d ouverture.xls",
        preserveColors: true
      });
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });