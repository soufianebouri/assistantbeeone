'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsLesabsencesCtrl
 * @description
 * # MainoeuvreetatsLesabsencesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsLesabsencesCtrl', function($scope, translatedwords, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $translatePartialLoader, $translate, $window, lesabsences, $state, DTDefaultOptions, $cookies, $templateCache, _url, jourferie, jourrepos) {
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    pc.jourferiers = [];
    pc.jourrepos = [];
    pc.ALLAbsences = [];
    pc.ALLPersonnel = [];
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    pc.IDDomaine = $cookies.getObject('globals').ferme.IDFerme;


    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

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
    $scope.date_fin_tab = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": pc.IDDomaine,
      "DATE_FIN": moment().format('YYYYMMDD'),
      "SOCIETE": pc.IDSociete
    };

    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    //load absences Data ref
    $q.all([lesabsences.getAbsences(pc.obj), jourferie.getJourferiers(), jourrepos.getJourRepos($cookies.getObject('globals').ferme.IDFerme), lesabsences.getAllPersonnel(pc.obj)]).then(function(values) {
      pc.ALLAbsences = values[0].data;
      pc.jourferiers = values[1].data;
      pc.jourrepos = values[2].data;
      pc.ALLPersonnel = values[3].data;
      $scope.reload = false;
      pc.manageViews();
      NProgress.done();
    }).then(function(value) {
      $scope.date_fin_tab = $scope.date_fin;

      $scope.getcheker = false;
      $scope.mydayname = pc.getDayrepoName(pc.jourrepos[0].JOUR);
      var myday = moment($scope.date_fin_tab, "DD-MM-YYYY");
      if ($scope.mydayname == myday.locale('fr').format('dddd')) {
        $scope.getcheker = true;
      }

      var mydaycheckferier = moment($scope.date_fin_tab);
      $scope.nbrjrferier = 0;
      var promiseferier = angular.forEach(pc.jourferiers, function(dataferie) {
        var myMois = dataferie.MOIS;
        if (parseInt(dataferie.MOIS) <= 9) {
          myMois = '0' + parseInt(dataferie.MOIS);
        }
        var myDayy = dataferie.JOUR;
        if (parseInt(dataferie.JOUR) <= 9) {
          myDayy = '0' + parseInt(dataferie.JOUR);
        }
        var dateferier = moment().format('YYYY') + '-' + myMois + '-' + myDayy + 'T00:00:00.000Z';
        dateferier = moment(dateferier, 'YYYY-MM-DD');
        if (moment(dateferier, "DD").format('DD') == moment(mydaycheckferier, "DD").format('DD') && moment(dateferier, "MM").format('MM') == moment(mydaycheckferier, "MM").format('MM')) {
          $scope.getcheker = true;
        }
      });
    });




    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
        $scope.date_fin_sel = moment($scope.date_fin_sel).format('YYYYMMDD');
      }
    };


    pc.rechercher = function() {
      $scope.reload = true;
      $scope.date_fin_tab = $scope.date_fin;

      $scope.getcheker = false;
      $scope.mydayname = pc.getDayrepoName(pc.jourrepos[0].JOUR);
      var myday = moment($scope.date_fin_tab, "DD-MM-YYYY");
      if ($scope.mydayname == myday.locale('fr').format('dddd')) {
        $scope.getcheker = true;
      }

      var mydaycheckferier = moment($scope.date_fin_tab);
      $scope.nbrjrferier = 0;
      var promiseferier = angular.forEach(pc.jourferiers, function(dataferie) {
        var myMois = dataferie.MOIS;
        if (parseInt(dataferie.MOIS) <= 9) {
          myMois = '0' + parseInt(dataferie.MOIS);
        }
        var myDayy = dataferie.JOUR;
        if (parseInt(dataferie.JOUR) <= 9) {
          myDayy = '0' + parseInt(dataferie.JOUR);
        }
        var dateferier = moment().format('YYYY') + '-' + myMois + '-' + myDayy + 'T00:00:00.000Z';
        dateferier = moment(dateferier, 'YYYY-MM-DD');
        if (moment(dateferier, "DD").format('DD') == moment(mydaycheckferier, "DD").format('DD') && moment(dateferier, "MM").format('MM') == moment(mydaycheckferier, "MM").format('MM')) {
          $scope.getcheker = true;
        }
      });

      pc.manageViews();
      $q.all([lesabsences.getAbsences(pc.obj), lesabsences.getAllPersonnel(pc.obj), promiseferier]).then(function(values) {
        pc.ALLAbsences = values[0].data;
        pc.ALLPersonnel = values[1].data;
        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    };

    pc.getDayrepoName = function(reposday) {
      var reposday = parseInt(reposday);
      var day = "";
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


    //searchOnTable by categorie
    pc.searchByCategorieOnTable = function(categorie) {
      if (pc.ALLAbsences.length != 0) {
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
        name: "lesabsences",
        filename: "Les absences.xls",
        preserveColors: true
      });
    };


    //search table listner
    $("#search").on("keyup", function() {
      if (pc.ALLAbsences.length != 0) {
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