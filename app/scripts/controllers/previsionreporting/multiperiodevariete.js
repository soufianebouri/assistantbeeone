'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionreportingMultiperiodevarieteCtrl
 * @description
 * # PrevisionreportingMultiperiodevarieteCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionreportingMultiperiodevarieteCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, multiperiodevariete, campagneagricole, VarieteService, _url, toastr, domaine, societe, $filter) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    $scope.skip = false;
    pc.AllVariete = [];
    pc.AllPeriode = [];
    pc.AllQauntite = [];
    pc.campagneagricole = [];
    pc.domaines = [];
    pc.varietes = [];
    pc.datenow = moment().format('YYYYMMDD');

    //document.getElementById("myfarm").style.display = "none";
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Campagne").selectpicker('refresh');
      $("#Periode").selectpicker('refresh');
      $("#Variete").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#Societe").selectpicker('refresh');
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


    //load periodeestimation
    $scope.LoadCampagneagricole = campagneagricole.getCampagneAgricole(_url).then(function(res) {
      pc.campagneagricole = res.data;
    });

    //load varietes
    /*$scope.LoadVarieteService = VarieteService.getVarieteByFarmSociete({
      "DOMAINE": [0],
      "SOCIETE": "0"
    }).then(function(res) {
      pc.varietes = res.data;
    });*/

    //load domaines
    $scope.LoadDomaine = domaine.getDomaine().then(function(res) {
      pc.domaines = res.data;
    });

    //load Societe
    $scope.LoadSociete = societe.getSociete(_url).then(function(res) {
      pc.societes = res.data;
    });

    pc.obj = {
      "SOCIETE": "0",
      "DOMAINE": [0],
      "CAMPAGNE": "0",
      "PERIODE": [0],
      "VARIETE": [0],
      "DATENOW": pc.datenow
    };


    $q.all([$scope.LoadCampagneagricole, $scope.LoadSociete, $scope.LoadDomaine]).then(function(values) {
      if (pc.societes.length > 0) {
        pc.obj.SOCIETE = pc.societes[0].ID;
        $scope.societe_sel = pc.societes[0].ID;
        pc.obj.DATENOW = "0";

        $scope.variete_sel = [0];
        VarieteService.getVarieteByFarmSociete({
          "DOMAINE": [0],
          "SOCIETE": pc.societes[0].ID
        }).then(function(res) {
          pc.varietes = res.data;
          setTimeout(function() {
            $('#Variete option').attr("selected", false);
            $("#Variete").selectpicker('refresh');
          }, 1000);
        });
        if (pc.campagneagricole.length > 0) {
          angular.forEach(pc.campagneagricole, function(data) {
            if (moment(new Date(), 'YYYY-MM-DD').isBetween(moment(data.Date_debut, 'YYYY-MM-DD').subtract(1, "days"), moment(data.Date_Fin, 'YYYY-MM-DD').add(1, 'days'))) {
              pc.obj.CAMPAGNE = data.Code;
              pc.obj.DATENOW = "0";
              setTimeout(function() {
                $('#Campagne').selectpicker('refresh');
                $('#Campagne').selectpicker('val', data.Code);
              }, 1000);
            }
            $scope.periode_sel = [0];
            multiperiodevariete.showperiodes({
              "SOCIETE": pc.societes[0].ID,
              "CAMPAGNE": data.Code,
              "PERIODE": [0],
              "DATENOW": '0'
            }).then(function(res) {
              pc.periodes = res.data;
              setTimeout(function() {
                $('#Periode option').attr("selected", false);
                $("#Periode").selectpicker('refresh');
              }, 1000);
            });
          });
        } else {
          setTimeout(function() {
            $("#Campagne").selectpicker('refresh');
          }, 1000);
        }

        setTimeout(function() {
          $('#Societe').selectpicker('refresh');
          $('#Societe').selectpicker('val', pc.societes[0].ID);
          $("#Domaine").selectpicker('refresh');
        }, 1000);
        pc.loadData();
      } else {
        setTimeout(function() {
          $("#Societe").selectpicker('refresh');
        }, 1000);
      }


      setTimeout(function() {
        $("#Domaine").selectpicker('refresh');
        $("#Periode").selectpicker('refresh');
        $("#Variete").selectpicker('refresh');
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
      $q.all([multiperiodevariete.showvarietes(pc.obj), multiperiodevariete.showperiodes(pc.obj), multiperiodevariete.showquantite(pc.obj)]).then(function(values) {
        pc.AllVariete = values[0].data;
        pc.AllPeriode = values[1].data;
        pc.AllQauntite = values[2].data;
        $scope.skip = true;
        $scope.reload = false;
        pc.manageViews();
        NProgress.done();
      });
    }

    //pc.loadData();

    pc.gettotalperiode = function(dataperiode, IDperiode) {
      pc.totalperiode = 0;
      angular.forEach(dataperiode, function(data) {
        if (parseInt(data.ID_Obs_PeriodeEstimation) == parseInt(IDperiode))
          pc.totalperiode += parseFloat(data.quantite);
      })
      return $filter('numberwithspace')(pc.totalperiode.toFixed(2)) + " Kg";
    }

    pc.gettotalvariete = function(dataperiode, IDvariete) {
      pc.totalvariete = 0;
      angular.forEach(dataperiode, function(data) {
        if (data.IDvariete == IDvariete)
          pc.totalvariete += parseFloat(data.quantite);
      })
      return $filter('numberwithspace')(pc.totalvariete.toFixed(2)) + " Kg";
    }

    pc.gettotal = function(dataperiode) {
      pc.total = 0;
      angular.forEach(dataperiode, function(data) {
        pc.total += parseFloat(data.quantite);
      })
      return $filter('numberwithspace')(pc.total.toFixed(2)) + " Kg";
    }

    pc.gettotalCell = function(datacell, IDvariete, IDPeriode) {
      pc.totalcellchart = "";
      pc.totalcell = 0;
      pc.findit = false;
      angular.forEach(datacell, function(data) {
        if (data.IDvariete == IDvariete && data.ID_Obs_PeriodeEstimation == IDPeriode) {
          pc.totalcell += parseFloat(data.quantite);
          pc.findit = true;
        }
      })

      if (pc.findit) {
        return $filter('numberwithspace')(pc.totalcell.toFixed(2));
      } else {
        return pc.totalcellchart;
      }
    }

    //by Societe
    $scope.societe_change = function() {
      if ($scope.societe.societe === null || $scope.societe.societe === "" || $scope.societe.societe === undefined || $scope.societe.societe === 0 || $scope.societe.societe === "0" || !$scope.societe.societe || $scope.societe.societe.length === 0) {
        $scope.societe_sel = "0";
      } else {
        $scope.societe_sel = $scope.societe.societe;
        $scope.variete_sel = [0];
        VarieteService.getVarieteByFarmSociete({
          "DOMAINE": [0],
          "SOCIETE": $scope.societe.societe
        }).then(function(res) {
          pc.varietes = res.data;
          setTimeout(function() {
            $('#Variete option').attr("selected", false);
            $("#Variete").selectpicker('refresh');
          }, 1000);
        });

        $scope.periode_sel = [0];
        multiperiodevariete.showperiodes({
          "SOCIETE": $scope.societe_sel,
          "CAMPAGNE": $scope.campagne_sel,
          "PERIODE": [0],
          "DATENOW": '0'
        }).then(function(res) {
          pc.periodes = res.data;
          setTimeout(function() {
            $('#Periode option').attr("selected", false);
            $("#Periode").selectpicker('refresh');
          }, 1000);
        });

      }

      setTimeout(function() {
        $('#Domaine option').attr("selected", false);
        $("#Domaine").selectpicker('refresh');
        $('#Campagne option').attr("selected", false);
        $("#Campagne").selectpicker('refresh');
        $('#Periode option').attr("selected", false);
        $("#Periode").selectpicker('refresh');
      }, 1000);


      pc.obj.SOCIETE = $scope.societe_sel;
      pc.obj.DOMAINE = [0];
      pc.obj.PERIODE = [0];
      pc.obj.VARIETE = [0];
      pc.obj.DATENOW = '0';
      if ($scope.skip) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }

    };

    //by domaine
    $scope.domaine_change = function() {

      if ($scope.domaine.domaine === null || $scope.domaine.domaine === "" || $scope.domaine.domaine === undefined || $scope.domaine.domaine === 0 || $scope.domaine.domaine === "0" || !$scope.domaine.domaine || $scope.domaine.domaine.length === 0) {
        $scope.domaine_sel = [0];
      } else {
        $scope.domaine_sel = $scope.domaine.domaine;
      }

      $scope.variete_sel = [0];
      VarieteService.getVarieteByFarmSociete({
        "DOMAINE": $scope.domaine_sel,
        "SOCIETE": $scope.societe_sel
      }).then(function(res) {
        pc.varietes = res.data;
        setTimeout(function() {
          $('#Variete option').attr("selected", false);
          $("#Variete").selectpicker('refresh');
        }, 1000);
      });

      pc.obj.DOMAINE = $scope.domaine_sel;
      pc.obj.PERIODE = [0];
      pc.obj.VARIETE = [0];
      pc.obj.DATENOW = '0';
      if ($scope.skip) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };

    //by campgane
    $scope.campagne_change = function() {
      if ($scope.campagne.campagne === null || $scope.campagne.campagne === "" || $scope.campagne.campagne === undefined || $scope.campagne.campagne === 0 || $scope.campagne.campagne === "0" || !$scope.campagne.campagne || $scope.campagne.campagne.length === 0) {
        $scope.campagne_sel = "0";
      } else {
        $scope.campagne_sel = $scope.campagne.campagne;
        $scope.periode_sel = [0];
        multiperiodevariete.showperiodes({
          "SOCIETE": $scope.societe_sel,
          "CAMPAGNE": $scope.campagne_sel,
          "PERIODE": [0],
          "DATENOW": '0'
        }).then(function(res) {
          pc.periodes = res.data;
          setTimeout(function() {
            $('#Periode option').attr("selected", false);
            $("#Periode").selectpicker('refresh');
          }, 1000);
        });
      }

      pc.obj.CAMPAGNE = $scope.campagne_sel;
      pc.obj.PERIODE = [0];
      pc.obj.DATENOW = '0';

      if ($scope.skip) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };

    //by periode
    $scope.periode_change = function() {
      if ($scope.periode.periode === null || $scope.periode.periode === "" || $scope.periode.periode === undefined || $scope.periode.periode === 0 || $scope.periode.periode === "0" || !$scope.periode.periode || $scope.periode.periode.length === 0 || $scope.periode.periode.includes(0)) {
        $scope.periode_sel = [0];
      } else {
        $scope.periode_sel = $scope.periode.periode;
      }
      pc.obj.PERIODE = $scope.periode_sel;
      pc.obj.DATENOW = '0';
      if ($scope.skip) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };

    //by variete
    $scope.variete_change = function() {
      if ($scope.variete.variete === null || $scope.variete.variete === "" || $scope.variete.variete === undefined || $scope.variete.variete === 0 || $scope.variete.variete === "0" || !$scope.variete.variete || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0)) {
        $scope.variete_sel = [0];
      } else {
        $scope.variete_sel = $scope.variete.variete;
      }
      pc.obj.VARIETE = $scope.variete_sel;
      pc.obj.DATENOW = '0';
      if ($scope.skip) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
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
        name: "multiperiodevariete",
        filename: "Analyse multi périodes multi variétés.xls",
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