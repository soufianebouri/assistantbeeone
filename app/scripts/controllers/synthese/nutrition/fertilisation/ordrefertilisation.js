'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:OrdrefertilisationCtrl
 * @description
 * # OrdrefertilisationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('OrdrefertilisationCtrl', function($scope, $cookies, translatedwords, ordrefertlisation, Bloc, $filter, $state, $translatePartialLoader, $translate, $window) {
    var pc = this;
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 3);
    $("#printThis").height(heightOfTable);
    $("#printThis").hide();
    //$('*[class^="nom_bac"]').hide();
    pc.showtable = true;
    pc.showBac = false;
    pc.typeOperation_array = [{
      id: 1,
      lab: "Fertigation"
    }, {
      id: 2,
      lab: "Epandage"
    }, {
      id: 3,
      lab: "Apport Folaire"
    }];
    pc.dtInstance = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.hour = moment().format("hh:mm");
    //toggle filter show
    $scope.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    $scope.makeClass = function(Designation, ID) {
      return $filter('TextWithoutSpace')(Designation + '_' + ID);
    }
    //loading purpose
    pc.manageViews = () => {
      if ($scope.reload) {
        $("#noData").hide();
        $("#printThis").hide();
        $("#loadingData").show();
      } else {
        $("#loadingData").hide();
      }
    };

    pc.noData = (state) => {
      if (!state) {
        $("#noData").hide();
        $("#printThis").show();
      } else {
        $("#noData").show();
        $("#printThis").hide();
      }
    }

    pc.manageViews();

    setTimeout(function() {
      $("#typeOperation").selectpicker('refresh');
      $("#bloc").selectpicker('refresh');
    }, 1000);


    pc.obj = {
      "DOMAINE": $cookies.getObject('beeoneAssistant').ferme.IDFerme,
      "OPERATION": null,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD'),
      "DETAIL": false,
      "BLOC": 0
    };

    Bloc.getBlocByFarm($cookies.getObject('beeoneAssistant').ferme.IDFerme).then(e => {

      pc.bloc_array = e.data;
    });

    pc.loadData = () => {
      NProgress.start();
      ordrefertlisation.getEtatFertigation(pc.obj).then(res => {
        (res.data.length > 0) ? (pc.noData(false)) : (pc.noData(true));
        $scope.reload = false;
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].Qte_Ordre = res.data[i].Qte_Ordre.toString().replace(".", ",");
        }
        pc.orderArray = res.data;

        pc.manageViews();
      });
      NProgress.done();
      NProgress.remove();
    }

    pc.datail_change = function() {
      if (pc.obj.OPERATION != null) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };



    //starting date change listner
    pc.blocChange = function() {
      if (pc.obj.OPERATION != null) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };
    //starting date change listner
    pc.typeOperationChange = function() {
      if (pc.obj.OPERATION != null) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
        if (pc.obj.OPERATION != 1) {
          $(".hideIfFerti").hide();
          pc.obj.BLOC = 0;
        } else {
          $(".hideIfFerti").show();
        }
        $("#bloc").selectpicker('refresh');
      }

    };

    //starting date change listner
    pc.date_debut_change = function() {
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');

      if (pc.obj.OPERATION != null) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }

    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      if (pc.obj.OPERATION != null) {
        $scope.reload = true;
        pc.manageViews();
        pc.loadData();
      }
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    //search table listner
    $("#search").on("keyup", function() {
      $("#loadingData").show();
      $("#printThis").hide();
      var value = $(this).val().toLowerCase();

      sleep(100).then(() => {
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
        $("#loadingData").hide();
        $("#printThis").show();

      });
    })

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    //print table pdf
    pc.printPdf = (e) => {
      $("#thead").show();
      $("#tfoot").show();

      $("#theadEmty").show();
      $("#printThis").height("100%");
      javascript: window.print();
    };

    //envent trigger after print (cancel or success)
    window.addEventListener("afterprint", function(event) {
      $("#thead").hide();
      $("#tfoot").hide();

      $("#theadEmty").hide();
      $("#printThis").height(heightOfTable);
    });

    //print table Excel
    pc.printExcel = (e) => {
      $("#tableDataShow").table2excel({
        filename: "Table.xls",
        preserveColors: true
      });
    };

    pc.markThoseLine = (Reference, id) => {
      $('tr').css('background-color', '');
      $('.' + Reference + "_" + id).css('background-color', '#fff6b5');
    };

    pc.showDetailOrde = (id, type) => {

      loadDataDetail(id, type);
      $('tr').not('tr[class$="_' + id + '"],tr[class$="dontHide"]').hide();
      pc.toggleVisibilityElem(type);
    };

    pc.toggleVisibilityElem = (type) => {
      if ($("#searchWidget").is(":visible")) {
        $("#searchWidget").hide();
        $("#actionButtons").hide();
        $("#search_div").hide();
        if (type == 'Fertigation')
          pc.showBac = true;
        else pc.showBac = false;
        pc.showtable = false;
      } else {
        $('tr').show();
        $("#searchWidget").show();
        $("#actionButtons").show();
        $("#search_div").show();
        $("#detailSecteur").hide();
        $("#detailParcelles").hide();
        pc.showBac = false;
        pc.showtable = true;
      }

    };

    pc.goBack = () => {
      $state.go("ordrefertlisation");
    }

    function loadDataDetail(id, type) {
      if ($("#searchWidget").is(":visible")) {
        if (type == 'Fertigation') {
          //Fertigation
          ordrefertlisation.getByID({
            "IDFertilisation": id
          }).then(function(res) {
            angular.forEach(res.data, function(value, key) {
              $("#" + $scope.makeClass(value.engrais_nom, id)).html(value.nom_bac);
            })

          });

          ordrefertlisation.getSecteurByID({
            "IDFertilisation": id
          }).then(function(res) {
            pc.secteurs = res.data;

            $("#detailSecteur").show();
          });
        } else {
          ordrefertlisation.getParcelleByID({
            "IDFertilisation": id
          }).then(function(res) {
            pc.parcelles = res.data;
            $("#detailParcelles").show();
          });
        }
      }

    }

  });