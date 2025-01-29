'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsAtatdesvariablesCtrl
 * @description
 * # MainoeuvreetatsAtatdesvariablesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsAtatdesvariablesCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, atatdesvariables, $state, DTDefaultOptions, $cookies, $templateCache, _url, Ouviers, campagneagricole, toastr, jourferie, jourrepos, periodepaie) {
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    $scope.sansprimes = 1;
    $scope.sansprimeschange = 1;
    $scope.typeCNSS = 1;
    pc.personnels = [];
    pc.campagneagricole = [];
    pc.jourferiers = [];
    pc.jourrepos = [];
    pc.AllCongerDate = [];
    pc.periodepaies = [];
    pc.Alletatvarieble = [];
    pc.AllOperationPrincipale = [];
    pc.AllNbrJourOperation = [];
    pc.AllNbrJourAutreOperation = [];
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
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PRIME": 1,
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
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    //load personnel Data ref
    $q.all([Ouviers.getAllOuviers(_url), campagneagricole.getCampagneAgricole(_url), jourferie.getJourferiers(), jourrepos.getJourRepos($cookies.getObject('globals').ferme.IDFerme), atatdesvariables.getCongerDates(pc.obj), periodepaie.getPeriodeEstimation(), atatdesvariables.getEtatVariable(pc.obj), atatdesvariables.getOperationPrincipale(pc.obj), atatdesvariables.getNbrJourOperation(pc.obj), atatdesvariables.getNbrJourAutreOperation(pc.obj)]).then(function(values) {
      pc.personnels = values[0].data;
      pc.campagneagricole = values[1].data;
      pc.jourferiers = values[2].data;
      pc.jourrepos = values[3].data;
      pc.AllCongerDate = values[4].data;
      pc.periodepaies = values[5].data;
      pc.Alletatvarieble = values[6].data;
      pc.AllOperationPrincipale = values[7].data;
      pc.AllNbrJourOperation = values[8].data;
      pc.AllNbrJourAutreOperation = values[9].data;
      $scope.reload = false;
      pc.manageViews();
      NProgress.done();
      setTimeout(function() {
        $("#Personnel").selectpicker('refresh');
        $("#Campagne").selectpicker('refresh');
        $("#Periode").selectpicker('refresh');
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
        $("#sansprimes").addClass("btn-success");
        $("#avecprime").removeClass("btn-success");
        //enable date debut && date forin
        $('#date_debut').attr('disabled', false);
        $('#date_fin').attr('disabled', false);
      } else {
        $("#sansprimes").removeClass("btn-success");
        $("#avecprime").addClass("btn-success");
        //desable date debut && date forin
        $('#date_debut').attr('disabled', true);
        $('#date_fin').attr('disabled', true);

        //refresh periode
        $scope.periode_sel = 0;
        setTimeout(function() {
          $('#Periode option').attr("selected", false);
          $("#Periode").selectpicker('refresh');
        }, 1000);

      }
      $scope.sansprimes = type;
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

    /*pc.loadData = () => {
      if ($scope.sansprimes) {
        $q.all([getEtatVariable.getCongerDates(pc.obj)]).then(function(values) {
          pc.AllCongerDate = values[0].data;
          pc.dtInstance.reloadData();
          $scope.reload = false;
          pc.manageViews();
          NProgress.done();
        });
      }
    }

    pc.loadData();*/

    pc.rechercher = function() {
      if ($scope.sansprimes == 1) {
        //sans primes
        $scope.reload = true;
        pc.manageViews();
        $scope.sansprimeschange = $scope.sansprimes;
        pc.obj.PRIME = $scope.sansprimes;
        pc.obj.PERSONNEL = $scope.personnel_sel;
        pc.obj.DATE_DEBUT = $scope.date_debut_sel;
        pc.obj.DATE_FIN = $scope.date_fin_sel;
        pc.obj.CNSS = $scope.typeCNSS;
        $q.all([atatdesvariables.getEtatVariable(pc.obj), atatdesvariables.getCongerDates(pc.obj), atatdesvariables.getOperationPrincipale(pc.obj), atatdesvariables.getNbrJourOperation(pc.obj), atatdesvariables.getNbrJourAutreOperation(pc.obj)]).then(function(values) {
          pc.Alletatvarieble = values[0].data;
          pc.AllCongerDate = values[1].data;
          pc.AllOperationPrincipale = values[2].data;
          pc.AllNbrJourOperation = values[3].data;
          pc.AllNbrJourAutreOperation = values[4].data;
          $scope.reload = false;
          pc.manageViews();
          NProgress.done();
        });

      } else {
        //Avec prime
        if ($scope.periode_sel == 0) {
          toastr.clear();
          toastr.info("Veuillez choisir une periode de paie !!", {
            closeButton: true
          });
        } else {
          $scope.sansprimeschange = $scope.sansprimes;
          $scope.reload = true;
          pc.manageViews();
          $scope.sansprimeschange = $scope.sansprimes;
          pc.obj.PRIME = $scope.sansprimes;
          pc.obj.PERSONNEL = $scope.personnel_sel;
          pc.obj.DATE_DEBUT = $scope.date_debut_sel;
          pc.obj.DATE_FIN = $scope.date_fin_sel;
          pc.obj.CNSS = $scope.typeCNSS;
          $q.all([atatdesvariables.getEtatVariable(pc.obj), atatdesvariables.getNamesPrime(pc.obj), atatdesvariables.getSumPrimeByPersonnel(pc.obj)]).then(function(values) {
            pc.Alletatvarieble = values[0].data;
            pc.AllNamesPrime = values[1].data;
            pc.AllSumPrimeByPersonnel = values[2].data;
            $scope.reload = false;
            pc.manageViews();
            NProgress.done();
          });
        }
      }
    };

    pc.setcells_getPrime = function(idpersonnel, idprime) {
      $scope.sumprime = 0;
      angular.forEach(pc.AllSumPrimeByPersonnel, function(data) {
        if (parseInt(data.Pers_Id) == parseInt(idpersonnel) && parseInt(data.IDPrime) == parseInt(idprime)) {
          $scope.sumprime += data.nbr_jour;
        }
      })
      return $scope.sumprime;
    }

    pc.setcells_getJrSup = function(nbr_jour, nbr_jour_conge) {
      if (parseFloat(nbr_jour) + parseFloat(nbr_jour_conge) > 26) {
        var joursup = parseFloat(nbr_jour) + parseFloat(nbr_jour_conge) - 26;
        var nbrjour = parseFloat(nbr_jour) - joursup;
      } else {
        var joursup = 0;
        var nbrjour = parseFloat(nbr_jour);
      }
      return [nbrjour, joursup];
    }

    pc.setcells_getnbrjourparpersonnel = function(idpersonnel, idoperation) {
      $scope.nbroperation = 0;
      angular.forEach(pc.AllNbrJourOperation, function(data) {
        if (parseInt(data.ID) == parseInt(idpersonnel) && parseInt(data.OpeRef_Id) == parseInt(idoperation)) {
          $scope.nbroperation += data.nbr_jour;
        }
      })
      return $scope.nbroperation;
    }

    pc.setcells_getnbrjourparpersonnelothers = function(idpersonnel) {
      $scope.nbroperationotre = 0;
      angular.forEach(pc.AllNbrJourAutreOperation, function(data) {
        if (parseInt(data.ID) == parseInt(idpersonnel)) {
          $scope.nbroperationotre += data.nbr_jour;
        }
      })
      return $scope.nbroperationotre;
    }

    //get dates between two dates
    $scope.enumerateDaysBetweenDates = function(startDate, endDate, dayname) {
      var nbrjr = 0;
      var mydayname = pc.getDayrepoName(dayname);

      startDate = moment(startDate);
      endDate = moment(endDate);

      var now = startDate;

      while (now.isBefore(endDate) || now.isSame(endDate)) {
        //dates.push(now.format('D/M'));
        var myday = moment(now, "DD-MM-YYYY");
        if (mydayname == myday.locale('fr').format('dddd')) {
          nbrjr++;
        }
        now.add(1, 'days');
      }
      return nbrjr;
    };

    pc.getDayrepoName = function(reposday) {
      var reposday = parseInt(reposday);
      var day;
      switch (reposday) {
        case 1:
          day = "lundi";
          break;
        case 2:
          day = "mardi";
          break;
        case 3:
          day = "mercredi";
          break;
        case 4:
          day = "jeudi";
          break;
        case 5:
          day = "vendredi";
          break;
        case 6:
          day = "samedi";
          break;
        case 7:
          day = "dimanche";
      }
      return day;
    }

    $scope.getnbrbetweendates = function(startDate, endDate) {
      var nbrbetweendates = 0;
      startDate = moment(startDate);
      endDate = moment(endDate);
      var now = startDate;
      while (now.isBefore(endDate) || now.isSame(endDate)) {
        nbrbetweendates++;
        now.add(1, 'days');
      }
      return nbrbetweendates;
    };

    $scope.getnbrferierbetweendates = function(startDate, endDate, mydate) {
      var nbrferierbetweendates = 0;
      var startDate = moment(startDate);
      var endDate = moment(endDate);
      var myday = moment(mydate);
      var now = startDate;
      while (now.isBefore(endDate) || now.isSame(endDate)) {
        if (moment(myday, "DD").format('DD') == moment(now, "DD").format('DD') && moment(mydate, "MM").format('MM') == moment(now, "MM").format('MM')) {
          nbrferierbetweendates++;
        }
        now.add(1, 'days');
      }
      return nbrferierbetweendates;
    };

    pc.setcells_getnbrconge = function(idpersonnel) {
      $scope.nbrjrconge = 0;
      $scope.alldates = [];
      angular.forEach(pc.AllCongerDate, function(data) {
        if (parseInt(data.Pers_Id) == parseInt(idpersonnel)) {
          $scope.nbrjrconge += data.nbrdays;
          angular.forEach(pc.jourferiers, function(dataferie) {
            var myMois = dataferie.MOIS;
            if (parseInt(dataferie.MOIS) <= 9) {
              myMois = '0' + parseInt(dataferie.MOIS);
            }
            var myDay = dataferie.JOUR;
            if (parseInt(dataferie.JOUR) <= 9) {
              myDay = '0' + parseInt(dataferie.JOUR);
            }
            var dateferier = moment(data.Conge_Dat_Dep, 'YYYY-MM-DD').format('YYYY') + '-' + myMois + '-' + myDay + 'T00:00:00.000Z';
            $scope.nbrjrconge -= $scope.getnbrferierbetweendates(moment(data.Conge_Dat_Dep, 'YYYY-MM-DD'), moment(data.Conge_Dat_Arr, 'YYYY-MM-DD'), moment(dateferier, 'YYYY-MM-DD'));
          })

          if (!data.Repos_Inclus && parseInt(pc.jourrepos[0].JOUR) > 0) {
            $scope.nbrjrconge -= $scope.enumerateDaysBetweenDates(moment(data.Conge_Dat_Dep, 'YYYY-MM-DD'), moment(data.Conge_Dat_Arr, 'YYYY-MM-DD'), pc.jourrepos[0].JOUR);
          }
        }
      })
      return $scope.nbrjrconge;
    }
    //searchOnTable by categorie
    pc.searchByCategorieOnTable = function(categorie) {
      if (pc.Alletatvarieble.length != 0) {
        var value = categorie.toLowerCase();
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
    }
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
        name: "Etatdesvariables",
        filename: "Etat des variables.xls",
        preserveColors: true
      });
    };

    //print table Excel
    pc.printExcelAvecPrime = (e) => {
      $("#tableDataShowAvecPrime").table2excel({
        exclude: ".noExl",
        exclude_img: true,
        file_ext: ".xls",
        name: "Etatdesvariables",
        filename: "Etat des variables.xls",
        preserveColors: true
      });
    };

    //search table listner
    $("#search").on("keyup", function() {
      if (pc.Alletatvarieble.length != 0) {
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