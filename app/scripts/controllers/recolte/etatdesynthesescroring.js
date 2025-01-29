'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteEtatdesynthesescroringCtrl
 * @description
 * # RecolteEtatdesynthesescroringCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteEtatdesynthesescroringCtrl', function($scope, $q, translatedwords, toastr,
    ProfilCalibre, VarieteService, $translatePartialLoader, $translate, $window, scoring, domaine,
    familleCible, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    //var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme
    //set date input
    $scope.reload = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      "DOMAINE": [0],
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD'),
      "variete": [0]
    };

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



    pc.all_colorations = []
    pc.all_cibles_1 = function(data) {
      try {
        return data.filter(item => item.Categorie === 'Défauts physiologiques' || item.Categorie === 'Défauts physilogiques');
      } catch (error) {
        return []
      }
    }


    pc.all_cibles_2 = function(data) {
      try {

        return data.filter(item => item.Categorie === 'Dégâts climatiques');
      } catch (error) {
        return []
      }
    }

    pc.all_cibles_3 = function(data) {
      try {
        return data.filter(item => item.Categorie === 'Dégâts des ravageurs');
      } catch (error) {
        return []
      }
    }

    pc.loadSynthesisData = async () => {

      $q.all([scoring.get_for_etat(pc.obj),
        scoring.get_for_etat_scoring_calibre(pc.obj),
        scoring.get_for_etat_cible(pc.obj),
        scoring.get_for_etat_scoring_cible(pc.obj),
        scoring.get_for_etat_coloration(pc.obj),
        scoring.get_for_etat_scoring_coloration(pc.obj),
        scoring.get_for_etat_scoring_estimation(pc.obj),
        scoring.get_distincted_calibre(pc.obj)
      ]).then(async function(values) {
        pc.scoring_data = values[0].data;
        //pc.all_calibreforSynthese = values[1].data;
        pc.scoring_calibre = values[1].data;

        pc.all_cibles = values[2].data;

        $scope.defaut_physiologique_cols = $scope.get_number_cibles(pc.all_cibles, 1);
        $scope.degat_climatiques_cols = $scope.get_number_cibles(pc.all_cibles, 2);
        $scope.degat_des_ravageurs_cols = $scope.get_number_cibles(pc.all_cibles, 3);


        $scope.all_cibles_values = values[3].data;

        pc.all_colorations = values[4].data;
        $scope.coloration_cols = pc.all_colorations.length;
        pc.all_colorations_values = values[5].data;


        pc.estimation = values[6].data;
        pc.distincted_calibre = values[7].data;
        $scope.all_calibreforSynthese_cols = pc.distincted_calibre.length;


        setTimeout(() => {
          $scope.reload = false;
          NProgress.done();
          pc.manageViews();
        }, 5000);


      });
    }

    $scope.get_estimation_value = (ParcelleCulturale) => {
      var Tonnage_estime = null;
      var Tonnage_estime_ha = null;
      var found_it = false;
      angular.forEach(pc.estimation, function(value) {
        if (value.ParcelleCulturale == ParcelleCulturale && !found_it) {
          Tonnage_estime += value.Tonnage_estime
          Tonnage_estime_ha += value.Tonnage_estime_ha
          found_it = true;
        }
      })
      return {
        Tonnage_estime: Tonnage_estime,
        Tonnage_estime_ha: Tonnage_estime_ha
      }

    }


    $scope.get_values_from_cible_total = (id, idscoring, data, NbrFruitEchantillonCalibre) => {
      var nbrValeur = 0;
      if (id === 1) {
        angular.forEach($scope.all_cibles_values, function(value) {
          if ((value.Categorie == "Défauts physiologiques" || value.Categorie == "Défauts physilogiques") && value.IDScoring == idscoring) {
            nbrValeur += value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      } else if (id === 2) {
        angular.forEach($scope.all_cibles_values, function(value) {
          if (value.Categorie == "Dégâts climatiques" && value.IDScoring === idscoring) {
            nbrValeur += value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      } else {
        angular.forEach($scope.all_cibles_values, function(value) {
          if (value.Categorie == "Dégâts des ravageurs" && value.IDScoring === idscoring) {
            nbrValeur += value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      }
      return nbrValeur
    }


    $scope.get_coloration_value = (idscoring, id_coloration) => {
      var nbrValeur = null;
      angular.forEach(pc.all_colorations_values, function(value) {
        if (value.IDScoring == idscoring && value.ID_Coloration == id_coloration) {
          nbrValeur = value.valeur
        }
      })
      return nbrValeur

    }


    $scope.get_values_from_cible_avrage = (idscoring, NbrFruitEchantillon, data, NbrFruitEchantillonCalibre) => {
      try {
        var nbrValeur = 0;
        angular.forEach(data, function(value) {
          if (value.IDScoring == idscoring) {
            nbrValeur += value.valeur
          }
        })
        return (nbrValeur / NbrFruitEchantillonCalibre * 100)
      } catch (error) {
        return 0
      }
    }

    $scope.get_values_from_cible = (id, idscoring, idcible, data, NbrFruitEchantillonCalibre) => {
      var nbrValeur = '';
      if (id === 1) {
        angular.forEach(data, function(value) {
          if ((value.Categorie == "Défauts physiologiques" || value.Categorie == "Défauts physilogiques") && value.IDCible == idcible && value.IDScoring == idscoring) {
            nbrValeur = value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      } else if (id === 2) {
        angular.forEach($scope.all_cibles_values, function(value) {
          if (value.Categorie == "Dégâts climatiques" && value.IDCible === idcible && value.IDScoring === idscoring) {
            nbrValeur = value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      } else {
        angular.forEach($scope.all_cibles_values, function(value) {
          if (value.Categorie == "Dégâts des ravageurs" && value.IDCible === idcible && value.IDScoring === idscoring) {
            nbrValeur = value.valeur / NbrFruitEchantillonCalibre * 100
          }
        })
      }
      return nbrValeur
    }



    $scope.get_number_cibles = (data, id) => {
      var nbrValeur = 0;
      if (id === 1) {
        angular.forEach(data, function(value) {
          if (value.Categorie === "Défauts physiologiques" || value.Categorie === "Défauts physilogiques") {
            nbrValeur++
          }
        })
      } else if (id === 2) {
        angular.forEach(data, function(value) {
          if (value.Categorie === "Dégâts climatiques") {
            nbrValeur++
          }
        })
      } else {
        angular.forEach(data, function(value) {
          if (value.Categorie === "Dégâts des ravageurs") {
            nbrValeur++
          }
        })
      }

      return nbrValeur
    }

    $scope.get_mensuration = (Calibre, ID, scoring_calibre) => {
      var nbrValeur = 0;
      angular.forEach(pc.scoring_calibre, function(value) {
        if (value.Calibre === Calibre && value.ID_scoring === ID) {
          nbrValeur += value.Porcentage
        }
      })
      return nbrValeur
    }

    $scope.get_nbr_days = (date1, date2) => {
      if (!date1 || !date2) {
        $scope.daysBetween = null;
        return;
      }
      var momentDate1 = moment(date1);
      var momentDate2 = moment(date2);

      var diffDays = momentDate2.diff(momentDate1, 'days');
      if (diffDays < 0) diffDays *= -1;
      return (diffDays + 1);
    };




    // $("#printThis").height(heightOfTable);
    //  $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
      $("#Ferme").selectpicker('refresh')
    }, 1000);

    pc.manageViews();


    $q.all([
      parcellecultural.getParcelleCulturalByFerme(pc.IDFerme),
      familleCible.getall(),
      VarieteService.showVarieteByCultureFerme({
        FERME: pc.IDFerme,
        culture: [0]
      }),
      domaine.list_only_arbo()
    ]).then((values) => {
      //pc.parcellescultural = values[0].data;
      //pc.parcellescultural_duplicata = values[0].data;
      pc.familles = values[1].data;
      pc.variete_array = values[2].data;
      pc.fermes = values[3].data;
      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
        $("#Ferme").selectpicker('refresh')
      }, 1000);
    });


    //Welcome to LISTNERS & Events

    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      //$("#printThis").height(heightOfTable);
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


    pc.Ferme_change = function() {

      var ferme = $scope.ferme.ferme;
      if (validateInput(ferme) || $scope.ferme.ferme.length === 0 || $scope.ferme.ferme.includes(0)) {
        ferme = [0];
      }
      pc.obj.DOMAINE = ferme;

      pc.obj.PARCELLE_CULTURAL = [0];

      $q.all([
        parcellecultural.showbydomaine_variete({
          iddomaine: pc.obj.DOMAINE,
          variete: pc.obj.variete,
          multiferme: true
        })
      ]).then((values) => {
        pc.parcellescultural = values[0].data;
        pc.parcellescultural_duplicata = values[0].data;
        $scope.parcelle = [];
        pc.obj.PARCELLE_CULTURAL = [0];

        NProgress.done();
        NProgress.remove();
        setTimeout(function() {
          $("#Parcelle").selectpicker('refresh');
        }, 1000);
      });

    };

    //by parcelle cultural
    pc.parcelle_change = function() {
      NProgress.start();
      var parcelle = $scope.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.length === 0 || $scope.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE_CULTURAL = parcelle;

      NProgress.done();
      NProgress.remove();
    };

    pc.variete_change = async function() {
      NProgress.start();
      var variete = $scope.variete.variete;

      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        variete = [0];

      pc.obj.variete = variete;



      $q.all([
        parcellecultural.showbydomaine_variete({
          iddomaine: pc.obj.DOMAINE,
          variete: pc.obj.variete,
          multiferme: true
        })
      ]).then((values) => {
        pc.parcellescultural = values[0].data;
        $scope.parcelle = [];
        pc.obj.PARCELLE_CULTURAL = [0];

        NProgress.done();
        NProgress.remove();
        setTimeout(function() {
          $("#Parcelle").selectpicker('refresh');
        }, 1000);
      });


    };




    pc.Search = async function() {
      if (
        pc.obj.DOMAINE !== null &&
        pc.obj.DOMAINE !== undefined &&
        pc.obj.DOMAINE !== "" &&
        pc.obj.DOMAINE !== 0 &&
        !(Array.isArray(pc.obj.DOMAINE) && pc.obj.DOMAINE.length === 0 || (pc.obj.DOMAINE.length === 1 && pc.obj.DOMAINE[0] === 0))
      ) {
        if (pc.obj.DATE_FIN && pc.obj.DATE_DEBUT) {
          $scope.reload = true;
          await pc.loadSynthesisData();
          pc.manageViews();
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }
      } else {
        toastr.clear();
        toastr.error("Veuillez renseigner vos fermes.", {
          closeButton: true
        });
      }

    }


    //pc.Search();

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
      $("#scoring").table2excel({
        filename: "Etat de synthèse - Scoring.xls",
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