'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsJournaldepaieCtrl
 * @description
 * # MainoeuvreetatsJournaldepaieCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsJournaldepaieCtrl', function($scope, translatedwords, DTOptionsBuilder, DTColumnBuilder, $translatePartialLoader, $translate, $window, $q, $compile, $state, DTDefaultOptions, $cookies, $templateCache, _url, Ouviers, campagneagricole, toastr, periodepaie, journaldepaie, parametrespaie) {
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    pc.enjour = 1;
    pc.enjourchange = 1;
    $scope.typeCNSS = 1;
    pc.details = false;
    pc.typepaie = 1;
    pc.typepaiechange = 1;
    pc.personnels = [];
    pc.campagneagricole = [];
    $("#enjour").hide();
    $("#enheure").hide();
    pc.detailschange = false;
    pc.JournalPaie = [];
    pc.PSPNSbyPersonnel = [];
    pc.JournalPaieAUnite = [];
    pc.AllParametresPaie = [];
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Personnel").selectpicker('refresh');
      $("#Campagne").selectpicker('refresh');
      $("#Periode").selectpicker('refresh');
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.date_debut = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "PAYEPAR": 1,
      "SOCIETE": pc.IDSociete,
      "PERSONNEL": [0],
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD'),
      "CNSS": 1
    };


    $scope.personnel_sel = [0];
    $scope.campagne_sel = 0;
    $scope.periode_sel = 0;
    $scope.date_debut_sel = moment($scope.date_fin).format('YYYYMMDD');
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');


    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThishoraire").hide();
        $("#printThisunite").hide();
      } else {
        $("#loadingData").hide();
        $("#printThishoraire").show();
        $("#printThisunite").show();
      }
    };

    //load data
    $q.all([Ouviers.getAllOuviers(_url), campagneagricole.getCampagneAgricole(_url), periodepaie.getPeriodeEstimation(), journaldepaie.getJournalPaieSansDetails(pc.obj), journaldepaie.getPSPNSbyPersonnel(pc.obj), parametrespaie.getParametresPaie()]).then(function(values) {
      pc.personnels = values[0].data;
      pc.campagneagricole = values[1].data;
      pc.periodepaies = values[2].data;
      pc.JournalPaie = values[3].data;
      pc.PSPNSbyPersonnel = values[4].data;
      pc.AllParametresPaie = values[5].data[0].HS_Nbre_HeuresJour;
      $scope.reload = false;
      pc.manageViews();
      NProgress.done();
      setTimeout(function() {
        $("#Personnel").selectpicker('refresh');
        $("#Campagne").selectpicker('refresh');
        $("#Periode").selectpicker('refresh');
      }, 1000);
    });

    //by typepointage
    $scope.typepaie_change = function(typepaie) {
      if (typepaie == 1) {
        $("#paie_horaire").addClass("btn-info");
        $("#paie_unite").removeClass("btn-info");
      } else {
        $("#paie_horaire").removeClass("btn-info");
        $("#paie_unite").addClass("btn-info");
      }
      pc.typepaie = typepaie;
    };


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

    //by personnel
    $scope.personnel_change = function() {
      if ($scope.personnel.personnel === null || $scope.personnel.personnel === "" || $scope.personnel.personnel === undefined || $scope.personnel.personnel === 0 || $scope.personnel.personnel === "0" || !$scope.personnel.personnel || $scope.personnel.personnel.length === 0 || $scope.personnel.personnel.includes(0)) {
        $scope.personnel_sel = [0];
      } else {
        $scope.personnel_sel = $scope.personnel.personnel;
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
      }
    };

    //by type
    $scope.type_change = function(type) {
      if (type == 1) {
        $("#enjour").addClass("btn-success");
        $("#enheure").removeClass("btn-success");
        //enable date debut && date forin
        $('#date_debut').attr('disabled', false);
        $('#date_fin').attr('disabled', false);
      } else {
        $("#enjour").removeClass("btn-success");
        $("#enheure").addClass("btn-success");
      }
      pc.enjour = type;
    };

    //by CNSS
    $scope.cnss_change = function(typeCNSS) {
      if (typeCNSS == 1) {
        $("#sanscnss").addClass("btn-warning");
        $("#aveccnss").removeClass("btn-warning");
        $("#touscnss").removeClass("btn-warning");
      } else if (typeCNSS == 2) {
        $("#sanscnss").removeClass("btn-warning");
        $("#aveccnss").addClass("btn-warning");
        $("#touscnss").removeClass("btn-warning");
      } else {
        $("#sanscnss").removeClass("btn-warning");
        $("#aveccnss").removeClass("btn-warning");
        $("#touscnss").addClass("btn-warning");
      }
      $scope.typeCNSS = typeCNSS;
    };

    //by details
    $scope.onChangeDetails = function(cbState) {
      pc.details = cbState;
      if (pc.details) {
        $("#enjour").show();
        $("#enheure").show();
      } else {
        $("#enjour").hide();
        $("#enheure").hide();
      }
    };

    pc.rechercher = function() {
      pc.detailschange = pc.details;
      pc.typepaiechange = pc.typepaie;
      pc.enjourchange = pc.enjour;
      pc.obj.PERSONNEL = $scope.personnel_sel;
      pc.obj.DATE_DEBUT = $scope.date_debut_sel;
      pc.obj.DATE_FIN = $scope.date_fin_sel;
      pc.obj.CNSS = $scope.typeCNSS;
      pc.obj.PAYEPAR = pc.typepaie;

      if (pc.typepaie == 1) {
        //horaire
        if (pc.details) {
          //avec details
          $q.all([journaldepaie.getJournalPaieAvecDetails(pc.obj), journaldepaie.getPSPNSbyPersonnel(pc.obj)]).then(function(values) {
            pc.JournalPaie = values[0].data;
            pc.PSPNSbyPersonnel = values[1].data;
            $scope.reload = false;
            pc.manageViews();
            NProgress.done();
          });
        } else {
          //sans details
          $q.all([journaldepaie.getJournalPaieSansDetails(pc.obj), journaldepaie.getPSPNSbyPersonnel(pc.obj)]).then(function(values) {
            pc.JournalPaie = values[0].data;
            pc.PSPNSbyPersonnel = values[1].data;
            $scope.reload = false;
            pc.manageViews();
            NProgress.done();
          });
        }
      } else {
        //a unité
        $q.all([journaldepaie.getJournalPaieAUnite(pc.obj)]).then(function(values) {
          pc.JournalPaieAUnite = values[0].data;
          $scope.reload = false;
          pc.manageViews();
          NProgress.done();
        });
      }
    };


    pc.selGetPsByPersonnel = function(idpersonnel) {
      $scope.ps = 0;
      $scope.pns = 0;
      angular.forEach(pc.PSPNSbyPersonnel, function(data) {
        if (parseInt(data.Pers_Id) == parseInt(idpersonnel)) {
          $scope.ps += data.pn;
          $scope.pns += data.pns;
        }
      })
      return [$scope.ps, $scope.pns];
    }

    //print table pdf
    pc.printPdf = (e) => {
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //print table Excel printThishoraire
    pc.printThishoraire = (e) => {
      var copyTable = $("#printThishoraire").clone(false).attr('id', '_copy_dailySales');

      copyTable.insertAfter($("#dailySales"));
      if (!pc.details) {
        copyTable.find('.hide-data').remove();
      }
      copyTable.table2excel({
        exclude: ".noExl",
        exclude_img: true,
        file_ext: ".xls",
        name: "Journal de paie",
        filename: "Journal de paie.xls",
        preserveColors: true
      });
    };

    //print table Excel printThisunite
    pc.printThisunite = (e) => {
      var copyTable = $("#printThisunite").clone(false).attr('id', '_copy_dailySales');

      //copyTable.insertAfter($("#dailySales"));
      //copyTable.find('.hide-data').remove(); //removing rows while exporting
      copyTable.table2excel({
        exclude: ".noExl",
        exclude_img: true,
        file_ext: ".xls",
        name: "Journal de paie",
        filename: "Journal de paie.xls",
        preserveColors: true
      });
    };

    //search table listner
    $("#search").on("keyup", function() {
      if (pc.JournalPaie.length != 0 || pc.JournalPaieAUnite.length != 0) {
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
  });