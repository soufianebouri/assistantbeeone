'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteEtatdesyntheseagreageCtrl
 * @description
 * # RecolteEtatdesyntheseagreageCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteEtatdesyntheseagreageCtrl', function($scope, $q, translatedwords, toastr, analyseQualitative, $translatePartialLoader, $translate, $window, AgreageFruit, pourcentageOuverture, familleCible, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
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
      "DOMAINE": $cookies.getObject('beeoneAssistant').ferme.IDFerme,
      "PARCELLE_CULTURAL": [],
      "FamilleCible": [],
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
      $q.all([AgreageFruit.getAllObs_Agreage_temp(pc.obj), AgreageFruit.getAllcategorie_cible(pc.obj), AgreageFruit.getAllcible(pc.obj), AgreageFruit.getAllObs_Agreage_detail_temp(pc.obj)]).then(function(values) {

        pc.AllObs_Agreage_temp = values[0].data;
        pc.Allcategorie_cible = values[1].data;
        pc.Allcible = values[2].data;
        pc.AllObs_Agreage_detail_temp = values[3].data;
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    $scope.getNbnCible = (AllObs_Agreage_detail_temp, ID_ParcelleCulturale, ID_cible, IDcategorie_cible, Date_Agriage, Ref_Bon_Livraison) => {
      var nbrValeur = '';
      angular.forEach(AllObs_Agreage_detail_temp, function(value) {
        if (value.IDParcelleCulturale == ID_ParcelleCulturale && value.maladie_id == ID_cible && value.IDcategorie_cible == IDcategorie_cible && value.Date_Agriage == Date_Agriage && value.Ref_Bon_Livraison == Ref_Bon_Livraison) {
          nbrValeur = value.maladie_value
        }
      })

      return nbrValeur
    }


    $scope.getTotalCible = (AllObs_Agreage_detail_temp, ID_ParcelleCulturale, Date_Agriage, Ref_Bon_Livraison) => {
      var nbrValeur = 0;
      angular.forEach(AllObs_Agreage_detail_temp, function(value) {
        if (value.IDParcelleCulturale == ID_ParcelleCulturale && value.Date_Agriage == Date_Agriage && value.Ref_Bon_Livraison == Ref_Bon_Livraison) {
          nbrValeur += value.maladie_value
        }
      })

      return nbrValeur
    }
    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#Familles").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([
      parcellecultural.getParcelleCulturalByFerme($cookies.getObject('beeoneAssistant').ferme.IDFerme),
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
        $("#Famille").selectpicker('refresh');
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

    pc.famille_change = function() {
      NProgress.start();
      var famille = $scope.famille.famille;

      if (validateInput(famille) || $scope.famille.famille.length === 0 || $scope.famille.famille.includes(0))
        famille = [0];

      pc.obj.FamilleCible = famille;
      NProgress.done();
      NProgress.remove();
    };

    pc.Search = async function() {
      if (pc.obj.PARCELLE_CULTURAL.length > 0 && pc.obj.FamilleCible.length > 0 && pc.obj.DATE_FIN && pc.obj.DATE_DEBUT) {
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
        filename: "Etat de synthèse Agréage.xls",
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