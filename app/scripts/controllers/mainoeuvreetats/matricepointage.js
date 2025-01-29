'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsMatricepointageCtrl
 * @description
 * # MainoeuvreetatsMatricepointageCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsMatricepointageCtrl', function($scope, translatedwords, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, $translatePartialLoader, $translate, $window, DTDefaultOptions, $cookies, matricepointage, Ouviers, _url, toastr, periodepaie, campagneagricole) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    $scope.modepointage = 1;
    pc.typepointage = 1;
    pc.alldates = [];
    pc.AllPersonnel = [];
    pc.AllPointage = [];
    pc.AllPersonnelConge = [];
    pc.periodepaies = [];
    pc.campagneagricole = [];
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

    //load personnel
    $scope.LoadPersonnel = Ouviers.getAllOuviers(_url).then(function(res) {
      pc.personnels = res.data;
    });

    //load periodepaie
    $scope.LoadPeriodepaie = periodepaie.getPeriodeEstimation().then(function(res) {
      pc.periodepaies = res.data;
    });

    //load periodeestimation
    $scope.LoadCampagneagricole = campagneagricole.getCampagneAgricole(_url).then(function(res) {
      pc.campagneagricole = res.data;
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PERSONNEL": [0],
      "TYPEPOINTAGE": 1,
      "DATE_DEBUT": moment().format('YYYYMMDD'),
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //get dates between two dates
    $scope.enumerateDaysBetweenDates = function(startDate, endDate) {
      var dates = [];

      startDate = moment(startDate);
      endDate = moment(endDate);

      var now = startDate,
        dates = [];

      while (now.isBefore(endDate) || now.isSame(endDate)) {
        dates.push(now.format('DD/MM/YYYY'));
        now.add(1, 'days');
      }
      return dates;
    };

    pc.alldates = $scope.enumerateDaysBetweenDates(moment($scope.date_fin).format('YYYYMMDD'), moment($scope.date_fin).format('YYYYMMDD'));

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.date_min = moment().subtract(70, "days").toDate();
    $q.all([$scope.LoadPersonnel, $scope.LoadCampagneagricole, $scope.LoadPeriodepaie]).then(function(values) {
      setTimeout(function() {
        $("#Personnel").selectpicker('refresh');
        $("#Campagne").selectpicker('refresh');
        $("#Periode").selectpicker('refresh');
      }, 1000);
    });

    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.loadData = () => {
      $q.all([matricepointage.getPersonnel(pc.obj), matricepointage.getPointage(pc.obj), matricepointage.getPersonnelConge(pc.obj)]).then(function(values) {
        pc.AllPersonnel = values[0].data;
        pc.AllPointage = values[1].data;
        pc.AllPersonnelConge = values[2].data;
        //get plage dates

        $scope.date_start = pc.obj.DATE_DEBUT;
        $scope.date_end = pc.obj.DATE_FIN;

        if ($scope.date_start != "" && $scope.date_end != "") {
          pc.alldates = $scope.enumerateDaysBetweenDates(moment($scope.date_start).format('YYYYMMDD'), moment($scope.date_end).format('YYYYMMDD'));
        } else {
          pc.alldates = [];
        }

        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    }

    pc.loadData();

    pc.getAsArray = function(number) {
      return new Array(number);
    }

    pc.SetCols = function(mydataclos, Pers_Id, date) {
      //$scope.mydata = JSON.parse("'" + mydata + "'");
      var span_inner = "";
      var classcolors = "";
      angular.forEach(mydataclos, function(mydata) {
        if (mydata.Pers_Id == Pers_Id && mydata.DATE == date) {

          var Jour_Ferie = mydata.Jour_Ferie; /*Jour_Ferie*/
          var Jour_repos = mydata.Jour_repos; /*Jour_repos*/
          var selected_date = mydata.DATE; /*DATE*/

          angular.forEach(pc.AllPersonnelConge, function(data) {
            //var range = moment().range(data.Conge_Dat_Dep, data.Conge_Dat_Arr);
            if (moment(selected_date, 'YYYY-MM-DD').isBetween(moment(data.Conge_Dat_Dep, 'YYYY-MM-DD'), moment(data.Conge_Dat_Arr, 'YYYY-MM-DD'))) {
              classcolors = "badge-yellow";
              $scope.isConge = true;
            }
          })
          if (Jour_Ferie && !$scope.isConge) {
            classcolors = "badge-green";
          }
          if (Jour_repos && !$scope.isConge) {
            classcolors = "badge-blue-unclear";
          }

          var Qte_Unite = mydata.Qte_Unite; /*Unité*/
          var Nombre_jour = mydata.Nombre_jour; /*0J*/
          var HS_NM = mydata.HS_NM; /*0%*/
          var HS_25 = mydata.HS_25; /*25%*/
          var HS_50 = mydata.HS_50; /*50%*/
          var HS_100 = mydata.HS_100; /*100%*/
          var Montant_prime = mydata.Montant_prime; /*Montant_prime*/

          var seuil_horaire = mydata.seuil_horaire; /*seuil_horaire*/
          var Unite_Operation = mydata.Unite_Operation; /*Unite_Operation*/
          var cout = mydata.cout; /*cout*/
          var HJ = mydata.HJ; /*HJ*/
          var Jour_Ferie = mydata.Jour_Ferie; /*Jour_Ferie*/
          var Jour_repos = mydata.Jour_repos; /*Jour_repos*/

          if (pc.typepointage == 1) {
            //Horaire
            if ($scope.modepointage == 1) {
              //Pointage JH
              if (Qte_Unite > 0) {
                span_inner += Qte_Unite + ' ' + Unite_Operation + ' <br/>';
              }
              if (parseInt(Nombre_jour) > 0) {
                span_inner += "<font size='4'><b>X</b></font><br/>";
              } else {
                span_inner += "<font size='4'><b>/</b></font><br/>";
              }
              if (HS_NM > 0) {
                span_inner += HS_NM + 'HS à 0%<br/>';
              }
              if (HS_25 > 0) {
                span_inner += HS_25 + 'HS à 25%<br/>';
              }
              if (HS_50 > 0) {
                span_inner += HS_50 + 'HS à 50%<br/>';
              }
              if (HS_100 > 0) {
                span_inner += HS_100 + 'HS à 100%<br/>';
              }
              if (Montant_prime > 0) {
                span_inner += 'Prime : ' + Montant_prime.toFixed(2) + ' Dh<br/>';
              }
            } else if ($scope.modepointage == 2) {
              //Pointage couts
              if (cout > 0) {
                span_inner += cout.toFixed(2) + ' DH <br/>';
              }
            } else if ($scope.modepointage == 3) {
              //Pointage heure
              if (Qte_Unite > 0) {
                span_inner += Qte_Unite + ' ' + Unite_Operation + ' <br/>';
              }
              if (parseInt(HJ) < parseInt(seuil_horaire)) {
                span_inner += "<font size='4'><b>X</b></font><br/>";
              } else {
                span_inner += "<font size='4'><b>/</b></font><br/>";
              }
              if (HS_NM > 0) {
                span_inner += HS_NM + 'HS à 0%<br/>';
              }
              if (HS_25 > 0) {
                span_inner += HS_25 + 'HS à 25%<br/>';
              }
              if (HS_50 > 0) {
                span_inner += HS_50 + 'HS à 50%<br/>';
              }
              if (HS_100 > 0) {
                span_inner += HS_100 + 'HS à 100%<br/>';
              }
              if (Montant_prime > 0) {
                span_inner += 'Prime : ' + Montant_prime.toFixed(2) + ' Dh<br/>';
              }
            }
          } else if (pc.typepointage == 2) {
            //à l'unité
            if ($scope.modepointage == 1) {
              //Pointage JH
              if (Qte_Unite > 0) {
                span_inner += Qte_Unite + ' ' + Unite_Operation + ' <br/>';
              }
              if (cout > 0) {
                span_inner += cout.toFixed(2) + ' DH <br/>';
              }
            } else if ($scope.modepointage == 2) {
              //Pointage couts
              if (cout > 0) {
                span_inner += cout.toFixed(2) + ' DH <br/>';
              }
            } else if ($scope.modepointage == 3) {
              //Pointage heure
              if (Qte_Unite > 0) {
                span_inner += Qte_Unite + ' ' + Unite_Operation + ' <br/>';
              }
              if (cout > 0) {
                span_inner += cout.toFixed(2) + ' DH <br/>';
              }
            }
          }
        }
      })


      return "<center><span class='" + classcolors + "'>" + span_inner + "</span></center>";
    }

    pc.SetColsTotal = function(mydataTotal, Pers_Id) {
      $scope.totalcout = 0;
      angular.forEach(mydataTotal, function(data) {
        if (data.Pers_Id == Pers_Id) {
          $scope.totalcout += parseFloat(data.cout);
        }
      })
      return $scope.totalcout.toFixed(2);
    }

    /*pc.SetColsColor = function(mydata) {
      var classcolors = "";
      $scope.isConge = false;
      if (mydata) {
        var Jour_Ferie = mydata.Jour_Ferie;
        var Jour_repos = mydata.Jour_repos;
        var selected_date = mydata.DATE;

        angular.forEach(pc.AllPersonnelConge, function(data) {
          if (moment(selected_date, 'YYYY-MM-DD').isBetween(moment(data.Conge_Dat_Dep, 'YYYY-MM-DD'), moment(data.Conge_Dat_Arr, 'YYYY-MM-DD'))) {
            classcolors = "cols-conge";
            $scope.isConge = true;
          }
        })
        if (Jour_Ferie && !$scope.isConge) {
          classcolors = "cols-ferie";
        }
        if (Jour_repos && !$scope.isConge) {
          classcolors = "cols-ropos";
        }
      }
      return classcolors;
    }*/

    pc.modepointage_change = function(modepointages) {
      $scope.modepointage = modepointages;
      NProgress.set(0.4);
      setTimeout(function() {
        NProgress.done();
      }, 1000);
    }

    $scope.personnel_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    //by personnel
    $scope.personnel_change = function() {
      if ($scope.personnel.personnel === null || $scope.personnel.personnel === "" || $scope.personnel.personnel === undefined || $scope.personnel.personnel === 0 || $scope.personnel.personnel === "0" || !$scope.personnel.personnel || $scope.personnel.personnel.length === 0 || $scope.personnel.personnel.includes(0)) {
        $scope.personnel_sel = [0];
      } else {
        $scope.personnel_sel = $scope.personnel.personnel;
      }
      pc.obj.PERSONNEL = $scope.personnel_sel;
      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //by campagne
    $scope.campagne_change = function() {
      if ($scope.campagne.campagne === null || $scope.campagne.campagne === "" || $scope.campagne.campagne === undefined || $scope.campagne.campagne === 0 || $scope.campagne.campagne === "0" || !$scope.campagne.campagne || $scope.campagne.campagne.length === 0) {
        $scope.campagne_sel = 0;
      } else {
        $scope.campagne_sel = $scope.campagne.campagne.Code;
        if (moment(new Date(), 'YYYY-MM-DD').isBetween(moment($scope.campagne.campagne.Date_debut, 'YYYY-MM-DD').subtract(1, 'd'), moment($scope.campagne.campagne.Date_Fin, 'YYYY-MM-DD').add(1, 'd'))) {
          pc.obj.DATE_DEBUT = moment(new Date(), 'YYYY-MM-DD');
          pc.obj.DATE_FIN = moment(new Date(), 'YYYY-MM-DD');
        } else {
          pc.obj.DATE_DEBUT = "";
          pc.obj.DATE_FIN = "";
        }
      }

      setTimeout(function() {
        $('#Periode option').attr("selected", false);
        $("#Periode").selectpicker('refresh');
      }, 1000);

      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //by periode
    $scope.periode_change = function() {
      if ($scope.periode.periode === null || $scope.periode.periode === "" || $scope.periode.periode === undefined || $scope.periode.periode === 0 || $scope.periode.periode === "0" || !$scope.periode.periode || $scope.periode.periode.length === 0) {
        $scope.periode_sel = 0;
      } else {
        $scope.periode_sel = $scope.periode.periode;
        pc.obj.DATE_DEBUT = moment($scope.periode_sel.date_debut).format('YYYYMMDD');
        pc.obj.DATE_FIN = moment($scope.periode_sel.Date_fin).format('YYYYMMDD');
      }



      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //by typepointage
    $scope.typepointage_change = function(typepointage, idbtn) {
      if (idbtn == 'pointage_horaire') {
        $("#pointage_horaire").addClass("btn-success");
        $("#pointage_unite").removeClass("btn-success");
      } else {
        $("#pointage_horaire").removeClass("btn-success");
        $("#pointage_unite").addClass("btn-success");
      }
      pc.typepointage = typepointage;
      pc.obj.TYPEPOINTAGE = typepointage;
      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
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
        name: "MatricePointage",
        filename: "Matrice de pointage.xls",
        preserveColors: true
      });
    };

    //search table listner
    $("#search").on("keyup", function() {
      if (pc.AllPersonnel.length != 0) {
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


    //DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



  });