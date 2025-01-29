'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteVisitesCtrl
 * @description
 * # SanteplanteVisitesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteVisitesCtrl', function($scope, $q, toastr, visites, translatedwords, $translatePartialLoader, $window, $translate, profilsfermes, analyseQualitative, AgreageFruit, pourcentageOuverture, $state, campagneagricole, domaine, parcellecultural, $cookies, savefilter) {
    NProgress.start();
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);

    //set date input
    $scope.reload = true;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.PicturesHostStadePheno = "";

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DOMAINEName": $cookies.getObject('globals').ferme.NomFerme,
      "Profile": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    //loading purpose
    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
        $("#printThis2").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
        $("#printThis2").hide();
      }
    };

    pc.loadSynthesisData = () => {
      $q.all([visites.getAllFilter(pc.obj)]).then(function(values) {
        pc.AllVisite = values[0].data;
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    $scope.getNbnCible = (AllObs_Agreage_detail_temp, ID_ParcelleCulturale, ID_cible, IDcategorie_cible, Date_Agriage) => {
      var nbrValeur = '';
      angular.forEach(AllObs_Agreage_detail_temp, function(value) {
        if (value.IDParcelleCulturale == ID_ParcelleCulturale && value.maladie_id == ID_cible && value.IDcategorie_cible == IDcategorie_cible && value.Date_Agriage == Date_Agriage) {
          nbrValeur = value.maladie_value
        }
      })

      return nbrValeur
    }

    $("#printThis").height(heightOfTable);
    $("#printThis2").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
      $("#Familles").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([
      visites.getProfileByFerme(pc.obj),
      visites.getHostPics()
    ]).then((values) => {
      pc.Profiles = values[0].data;
      pc.parametragestockage = values[1].data;
      pc.PicturesHostStadePheno = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Obs_Visite + '/';
      pc.Search();
      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Profile").selectpicker('refresh');
      }, 1000);
    });

    pc.showimg = function(host, img, ext) {
      document.getElementById("filter_form").style.display = "none";
      $.magnificPopup.open({
        tClose: 'Fermer (Esc)',
        tLoading: 'Chargement...',
        delegate: 'a',
        items: {
          src: host + img + ext
        },
        closeOnContentClick: true,
        closeBtnInside: true,
        mainClass: 'mfp-fade',
        image: {

        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    }

    pc.delete = async function(IDVisite, Delete_Astuce, position, index) {

      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            if (!Delete_Astuce) {
              Delete_Astuce = '1,1,1,1,1';
              var myarr = Delete_Astuce.split(',');
              myarr[position] = 0;
              Delete_Astuce = myarr.toString();
            } else {
              Delete_Astuce.split(',');
              var myarr = Delete_Astuce.split(',');
              myarr[position] = 0;
              Delete_Astuce = myarr.toString();
            }
            visites.delete({
              ID: IDVisite,
              Delete_Astuce: Delete_Astuce
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                pc.AllVisite[index].Delete_Astuce = Delete_Astuce;
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    //Welcome to LISTNERS & Events

    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      $("#printThis").height(heightOfTable);
      $("#printThis2").height(heightOfTable);
    });



    pc.modules = [{
      ID: 1,
      hash: "#search",
      name: "1. Développement végétal"
    }, {
      ID: 2,
      hash: "#searchtableDataShowIrrigation",
      name: "2. Irrigation"
    }, {
      ID: 3,
      hash: "#searchtableDataShowNutrition",
      name: "3. Nutrition"
    }, {
      ID: 4,
      hash: "#searchtableDataShowPhytosanitaire",
      name: "4. Phytosanitaire"
    }, {
      ID: 5,
      hash: "#searchtableDataShowProduction",
      name: "5. Production"
    }]

    $("#search").on("keyup", function() {
      if (pc.AllVisite.length > 0) {

        var value = $(this).val().toLowerCase();
        $("#tableDataShowDevBody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });

      }
    })
    $("#searchtableDataShowIrrigation").on("keyup", function() {
      if (pc.AllVisite.length > 0) {
        var value = $(this).val().toLowerCase();
        $("#tableDataShowIrrigationBody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      }
    })
    $("#searchtableDataShowNutrition").on("keyup", function() {
      if (pc.AllVisite.length > 0) {
        var value = $(this).val().toLowerCase();
        $("#tableDataShowNutritionBody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      }
    })
    $("#searchtableDataShowPhytosanitaire").on("keyup", function() {
      if (pc.AllVisite.length > 0) {
        var value = $(this).val().toLowerCase();
        $("#tableDataShowPhytosanitaireBody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      }
    })
    $("#searchtableDataShowProduction").on("keyup", function() {
      if (pc.AllVisite.length > 0) {
        var value = $(this).val().toLowerCase();
        $("#tableDataShowProductionBody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      }
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




    pc.Goto_change = function() {
      if ($scope.Goto)
        (function($) {
          $(document).ready(function() {
            $('html, body').animate({
              'scrollTop': $($scope.Goto.hash).offset().top
            }, 2000);
          });
        })(jQuery);
      $scope.Goto = undefined;
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
    pc.profile_change = function() {
      NProgress.start();
      var profile = $scope.profile.profile;

      if (validateInput(profile) || $scope.profile.profile.length === 0 || $scope.profile.profile.includes(0))
        profile = [0];

      pc.obj.Profile = profile;

      NProgress.done();
      NProgress.remove();
    };



    pc.Search = function() {
      if (pc.obj.DATE_DEBUT) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadSynthesisData();
      } else {
        toastr.clear();
        toastr.error("Veuillez renseigner tous les champs obligatoires", {
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
    pc.printExcelDev = (e) => {
      $("#tableDataShowDev").remove("#noExl").table2excel({
        filename: "1. Développement végétal.xls",
        preserveColors: true
      });
    };

    pc.printExcelIrrigation = (e) => {
      $("#tableDataShowIrrigation").table2excel({
        filename: "2. Irrigation - Etat de visite.xls",
        preserveColors: true
      });
    };

    pc.printExcelNutrition = (e) => {
      $("#tableDataShowNutrition").table2excel({
        filename: "3. Nutrition - Etat de visite.xls",
        preserveColors: true
      });
    };

    pc.printExcelPhytosanitaire = (e) => {
      $("#tableDataShowPhytosanitaire").table2excel({
        filename: "4. Phytosanitaire - Etat de visite.xls",
        preserveColors: true
      });
    };

    pc.printExcelProduction = (e) => {
      $("#tableDataShowProduction").table2excel({
        filename: "5. Production - Etat de visite.xls",
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