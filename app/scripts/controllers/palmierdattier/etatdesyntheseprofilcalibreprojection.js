'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl
 * @description
 * # PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierEtatdesyntheseprofilcalibreprojectionCtrl', function($scope, $q, translatedwords, toastr, ProfilCalibre, analyseQualitative, $translatePartialLoader, $translate, $window, AgreageFruit, pourcentageOuverture, familleCible, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
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
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD'),
      "DateProjection": 0
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }


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
      $q.all([ProfilCalibre.getNbreFruitscontroleForSynthese_projection(pc.obj), ProfilCalibre.getCalibreforSynthese_projection(pc.obj), ProfilCalibre.getNbravecdiametreCalibreforSynthese_projection(pc.obj)]).then(function(values) {
        pc.NbreFruitscontroleForSynthese = values[0].data;
        pc.CalibreforSynthese = values[1].data;
        pc.NbravecdiametreCalibreforSynthese = values[2].data;
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    $scope.getPourcentageCalibre = (ID_ParcelleCulturale, Nom_Calibre, Semaine, NbravecdiametreCalibreforSynthese) => {
      var nbrValeur = 0;
      angular.forEach(NbravecdiametreCalibreforSynthese, function(value) {
        if (value.ID_ParcelleCulturale == ID_ParcelleCulturale && value.Calibre == Nom_Calibre && value.Semaine == Semaine) {
          nbrValeur += value.nbravecdiametre
        }
      })
      return nbrValeur
    }

    $scope.getTotalPourcentageCalibre = (ID_ParcelleCulturale, Semaine, NbravecdiametreCalibreforSynthese) => {
      var nbrValeur = 0;
      angular.forEach(NbravecdiametreCalibreforSynthese, function(value) {
        if (value.ID_ParcelleCulturale == ID_ParcelleCulturale && value.Semaine == Semaine) {
          nbrValeur += value.nbravecdiametre
        }
      })
      return nbrValeur
    }

    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([
      parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme),
      familleCible.getall()
    ]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.familles = values[1].data;
      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
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
      NProgress.done();
      NProgress.remove();
    };

    pc.DateProjection_change = function() {
      NProgress.start();
      var dateToChoose = $scope.DateProjection;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DateProjection = moment(dateToChoose).format('YYYYMMDD');
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

      NProgress.done();
      NProgress.remove();
    };



    pc.Search = async function() {
      if (pc.obj.DATE_FIN && pc.obj.DATE_DEBUT) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadSynthesisData();
      } else {
        toastr.clear();
        toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
          closeButton: true
        });
      }
    }
    pc.Search();

    //toggle filter show
    pc.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    pc.ReverseDisplay('filter_form');

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Etat de synthèse Profil Calibre.xls",
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