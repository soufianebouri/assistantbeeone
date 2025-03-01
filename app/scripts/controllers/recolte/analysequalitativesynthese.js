'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAnalysequalitativesyntheseCtrl
 * @description
 * # RecolteAnalysequalitativesyntheseCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAnalysequalitativesyntheseCtrl', function($scope, $q, cultureService, translatedwords, toastr, $translatePartialLoader, VarieteService, $translate, $window, analyseQualitative, NiveauColorationService, pourcentageOuverture, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
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
    pc.IDferme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.obj = {
      "DOMAINE": $cookies.getObject('beeoneAssistant').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "CULTURE": 0,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };


    analyseQualitative.getmodeAnalyseQualitative({
      farm: pc.IDferme
    }).then(function(result) {
      try {
        if (result.data[0].mode_analyse_qualitative) {
          $state.go('analyseQualitativesimplified');
        }
      } catch (e) {
        $state.go('analyseQualitative');
      }

    }).catch(async e => {
      toastr.clear();
      toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
        closeButton: true
      });
    });


    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    pc.clear_data = () => {
      pc.Obs_Analyse_Qualitative = [];
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
      $q.all([analyseQualitative.getForSynthese(pc.obj)]).then(function(values) {
        pc.Obs_Analyse_Qualitative = values[0].data[0];
        pc.Obs_Analyse_Qualitative_Fermete_Fruit = values[0].data[1];
        pc.Obs_Analyse_Qualitative_Fermete_Peau = values[0].data[2];
        pc.Obs_Analyse_Qualitative_Feuilles = values[0].data[3];
        pc.Obs_Analyse_Qualitative_Coloration = values[0].data[4];
        pc.Obs_Analyse_Qualitative_Observation = values[0].data[5];
        pc.Obs_Analyse_Qualitative_Feuilles_Observation = values[0].data[6];
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#culture").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([
      parcellecultural.getParcelleCulturalByFerme($cookies.getObject('beeoneAssistant').ferme.IDFerme),
      cultureService.getCultureByFerme($cookies.getObject('beeoneAssistant').ferme.IDFerme)
      /*,
            analyseQualitative.getForSynthese(pc.obj)*/
    ]).then((values) => {
      pc.parcellescultural = values[0].data;
      pc.culture_array = values[1].data;
      /*pc.Obs_Analyse_Qualitative = values[1].data[0];
      pc.Obs_Analyse_Qualitative_Fermete_Fruit = values[1].data[1];
      pc.Obs_Analyse_Qualitative_Fermete_Peau = values[1].data[2];
      pc.Obs_Analyse_Qualitative_Feuilles = values[1].data[3];
      pc.Obs_Analyse_Qualitative_Coloration = values[1].data[4];
      pc.Obs_Analyse_Qualitative_Observation = values[1].data[5];
      pc.Obs_Analyse_Qualitative_Feuilles_Observation = values[1].data[6];*/

      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#culture").selectpicker('refresh');
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

    pc.getArrayFromJson = async function(json, key) {
      let arr = [];
      for (var i = 0; i < json.length; i++) {
        (key === 0) ? arr.push(json[i].ID): arr.push(json[i].Variete);
      }
      return arr
    }

    //starting date change listner
    pc.date_debut_change = function() {
      pc.clear_data();
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
      pc.clear_data();
      NProgress.start();
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      NProgress.done();
      NProgress.remove();
    };
    $scope.NiveauColoration = [];


    pc.culture_change = () => {
      pc.clear_data();
      NProgress.start();
      if ($scope.culture) {
        pc.obj.CULTURE = $scope.culture;
        pc.obj.PARCELLE = 0;
      } else {
        pc.obj.VARIETE = 0;
      }

      $q.all([parcellecultural.getParcelleByVarieteCulture({
        culture: [pc.obj.CULTURE],
        VARIETE: [0],
        FERME: $cookies.getObject('beeoneAssistant').ferme.IDFerme
      }), NiveauColorationService.getColorationbyculture({
        ID_Culture: pc.obj.CULTURE
      })]).then((values) => {
        pc.parcellescultural = values[0].data;
        $scope.NiveauColoration = values[1].data;
        setTimeout(function() {
          $("#Parcelle").selectpicker('refresh');
          $('#Parcelle').selectpicker('deselectAll');
          NProgress.done();
        }, 100);
      });
    }

    //by parcelle cultural
    pc.parcelle_change = async function() {
      pc.clear_data();
      var parcelle = $scope.parcelleculturalsel;
      if (validateInput(parcelle) || !$scope.parcelleculturalsel) {
        parcelle = {};
      } else {
        pc.obj.PARCELLE_CULTURAL = await pc.getArrayFromJson(parcelle, 0);
        //pc.obj.VARIETE = await pc.getArrayFromJson(parcelle, 1);

        /*
          NiveauColorationService.getColorationbyculture({
            ID_Varietes: pc.obj.VARIETE
          }).then(e => {
            NProgress.done();
            $scope.NiveauColoration = e.data;
          }).catch(async e => {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Connexion au serveur perdu, réessayer ultérieurement ")) + e.data, {
              closeButton: true
            });
          });*/
      }
      NProgress.done();

    };


    pc.Search = async function() {
      if (pc.obj.PARCELLE_CULTURAL.length > 0 && pc.obj.PARCELLE_CULTURAL[0] !== 0 && pc.obj.DATE_FIN && pc.obj.DATE_DEBUT && pc.obj.CULTURE) {
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
        filename: "Synthèse d analyses de maturité des fruits.xls",
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