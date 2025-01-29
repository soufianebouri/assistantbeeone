'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteAjustementDesCalibresCtrl
 * @description
 * # RecolteAjustementDesCalibresCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteAjustementDesCalibresCtrl', function($scope, $q, translatedwords, toastr,$mdDialog,
    $translatePartialLoader, $translate, $window, scoring, domaine,
    $cookies, savefilter) {
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
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
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



    pc.loadSynthesisData = async () => {

      $q.all([scoring.scoring_size(pc.obj)
      ]).then(async function(values) {
        pc.scoring_size = values[0].data;
        setTimeout(() => {
          $scope.reload = false;
          NProgress.done();
          pc.manageViews();
        }, 5000);
      });
    }


    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Ferme").selectpicker('refresh')
    }, 1000);

    pc.manageViews();


    $q.all([
      domaine.list_only_arbo()
    ]).then((values) => {
      pc.fermes = values[0].data;
      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Ferme").selectpicker('refresh')
      }, 1000);
    });


    
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

    pc.adjust_data = function() {
      $mdDialog.show({
          controller: Dialogscript_forcumulbufarm,
          templateUrl: '././views/templates/clone_data_scoring/procession_adjust_calibre.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false,
          hasBackdrop: true,
          escapeToClose: false
        })
        .then(function(answer) {}, function() {});
    }


    function Dialogscript_forcumulbufarm($scope, $mdDialog) {

      
      toastr.clear();

      scoring.adjust_calibres(pc.obj).then(async e => {
        if (e.data.message == "Ajustement reussie") {
          //validate success
          toastr.clear();
          toastr.info("Ajustement reussie", {
            closeButton: true
          });
          NProgress.done();
          document.getElementsByClassName('left_col')[0].style.zIndex = 999999;         
          $mdDialog.cancel();
          pc.scoring_size = [];
        } else {
          toastr.clear();
          toastr.error(e.data.description, {
            closeButton: true
          });
          NProgress.done();          
          $mdDialog.cancel();
        }
      }).catch(async es => {
        toastr.clear();
        toastr.error(es.message, {
          closeButton: true
        });        
        $mdDialog.cancel();
        NProgress.done();
      });


      $scope.hideAvancer = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };


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