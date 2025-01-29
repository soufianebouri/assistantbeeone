'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryRefarbreqrcodeCtrl
 * @description
 * # RepositoryRefarbreqrcodeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryRefarbreqrcodeCtrl', function($scope, $q, _url, translatedwords, toastr, $translatePartialLoader, $translate, $window, Arbre, $state, domaine, parcellecultural, $cookies, savefilter) {
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
    pc.FarmeName = $cookies.getObject('globals').ferme.NomFerme;
    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0]
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
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

    pc.IDFERME = $cookies.getObject('globals').ferme.IDFerme;
    pc.loadSynthesisData = () => {
      $q.all([Arbre.getArbreByParcelle(pc.obj)]).then(function(values) {
        pc.ListeArbre = values[0].data;
        $scope.reload = false;
        NProgress.done();
        pc.manageViews();
      });
    }

    pc.generateCode = (qrcode, id) => {
      setTimeout(function() {
        $('#' + id).html("");
        new QRCode(id, {
          text: qrcode,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }, 1000);
    }

    $("#printThis").height(heightOfTable);
    $(".flex-container").height(heightOfTable);

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

    pc.manageViews();


    $q.all([
      parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme)
    ]).then((values) => {
      pc.parcellescultural = values[0].data;
      NProgress.done();
      NProgress.remove();
      $scope.reload = false;
      pc.manageViews();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
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
    $scope.NiveauColoration = [];
    //by parcelle cultural
    pc.parcelle_change = function() {
      if ($scope.parcelleculturalsel === null || $scope.parcelleculturalsel === "" || $scope.parcelleculturalsel === undefined || $scope.parcelleculturalsel === 0 || $scope.parcelleculturalsel === "0" || !$scope.parcelleculturalsel || $scope.parcelleculturalsel.length === 0 || $scope.parcelleculturalsel.includes(0)) {
        $scope.parcelle_sel = [0];

      } else {
        $scope.parcelle_sel = $scope.parcelleculturalsel;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;

      NProgress.done();


    };



    pc.Search = async function() {
      $scope.reload = true;
      pc.manageViews();
      pc.loadSynthesisData();
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
    /*    pc.printExcel = (e) => {
          $("#tableDataShow").table2excel({
            // CSS class classes that are not imported into the rows of the exported table
            exclude: ".noExl",
            // Name of the exported Excel document
            name: "Excel Document Name",
            // Name of Excel file
            filename: "test",
            //File suffix name
            fileext: ".xls",
            //Exclude Exporting Pictures
            exclude_img: true,
            //Exclude export hyperlinks
            exclude_links: false,
            //Whether to exclude the contents in the export input box
            exclude_inputs: false
          });
          /*var divToPrint = document.getElementById("tableDataShow");
          var newWin = window.open("", "newWin");
          newWin.document.write(divToPrint.outerHTML);
          setTimeout(function() {
            newWin.print();
          }, 1000)*/
    //};

    pc.printExcel = function(e) {
      //alert(expeditionByID);
      var type = "";
      var dateFeri = "";

      var w = 1000;
      var h = 1000;
      var left = Number((screen.width / 2) - (w / 2));
      var tops = Number((screen.height / 2) - (h / 2));

      var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

      //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
      mywindow.document.write('<html><head><title></title>');
      mywindow.document.write('</head><body >');
      //header
      mywindow.document.write('<table border="1" style="width:100%; background:#e0efda" >' +
        '<tr>' +
        '<th rowspan="3" style="width:30%;"></th>' +
        '<th style="width:40%;">' + pc.FarmeName + '</th>' +
        '<th rowspan="3" style="width:30%;"><b></b> <br/> </th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">Le ' + moment().format('DD/MM/YYYY') + '</th>' +
        '</tr>' +
        '<tr>' +
        '<th style="width:40%;">QR Code des Arbres</th>' +
        '</tr>' +
        '</table>');





      mywindow.document.write('<br/>');

      mywindow.document.write('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + moment().format('DD/MM/YYYY') + ' à ' + moment().format('HH:mm') + '</td></tr></table>');

      mywindow.document.write('<br/>');
      mywindow.document.write(document.getElementById("printThis").innerHTML);



      //mywindow.document.write(document.getElementById("sss").innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();

      return true;
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });