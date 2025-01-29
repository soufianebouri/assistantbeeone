'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:realisationIrrigationCtrl
 * @description
 * # realisationIrrigationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('realisationIrrigationCtrl', function($scope, DTOptionsBuilder, translatedwords, $translatePartialLoader, $window, $translate, DTColumnBuilder, $q, $compile, ApportEau, $state, $uibModal, $cookies, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 4);
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.apportEauAvancee = [];
    pc.apportEau = {};
    pc.mode_irrigation = 1;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      "STANDARD": true,
      "FERME": [$cookies.getObject('globals').ferme.IDFerme],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
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

    function formatHour(h) {
      return h.slice(0, 2) + ":" + h.slice(2, 4);
    }


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        NProgress.start();
        var defer = $q.defer();

        ApportEau.getApportEtatRealisation(pc.obj).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DATE = moment(result.data[i].DATE).format('YYYY-MM-DD');
            result.data[i].Dose_odre = result.data[i].Dose_odre.toFixed(2);
            result.data[i].Duree = formatHour(result.data[i].Duree);
            result.data[i].Duree_Ordre = formatHour(result.data[i].Duree_Ordre);
            result.data[i].Heure_debut = formatHour(result.data[i].Heure_debut);
            result.data[i].Heure_fin = formatHour(result.data[i].Heure_fin);
            result.data[i].Dose = result.data[i].Dose.toFixed(2);
          }

          ApportEau.getAverageReleveClimatiqueEO(pc.obj).then(e => {
            pc.la_moyenne_E0 = e.data[0].la_moyenne_E0;
            NProgress.done();
            NProgress.remove();
            defer.resolve(result.data);
          });
          pc.obj.STANDARD = false;
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
          });
        });
        return nRow;
      })
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Rechercher"))
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('REF_ordre').withTitle(translatedwords.getTranslatedWord($translate("Refrence"))),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))),
      DTColumnBuilder.newColumn('Bloc').withTitle(translatedwords.getTranslatedWord($translate("Bloc"))),
      DTColumnBuilder.newColumn('Secteur').withTitle(translatedwords.getTranslatedWord($translate("Secteur"))),
      DTColumnBuilder.newColumn('tout_Secteur').withTitle(translatedwords.getTranslatedWord($translate("Tout le secteur"))).withOption('defaultContent', '').renderWith(function(data, type, full, meta) {
        if (full.tout_Secteur) {
          return '<i class="fa fa-check"></i>';
        } else {
          return '<i class="fa fa-remove"></i>';
        }
      }),
      DTColumnBuilder.newColumn('Dose_odre').withTitle(translatedwords.getTranslatedWord($translate("Besoin (m3)"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('Dose').withTitle(translatedwords.getTranslatedWord($translate("Dose realise"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('Duree').withTitle(translatedwords.getTranslatedWord($translate("Duree"))),
      DTColumnBuilder.newColumn('Heure_debut').withTitle(translatedwords.getTranslatedWord($translate("Heure debut"))),
      DTColumnBuilder.newColumn('Heure_fin').withTitle(translatedwords.getTranslatedWord($translate("Heure fin"))),
      DTColumnBuilder.newColumn('OBSERV').withTitle(translatedwords.getTranslatedWord($translate("Observation"))).withOption('defaultContent', ''),
      DTColumnBuilder.newColumn('ss_parcel').withTitle(translatedwords.getTranslatedWord($translate("Sous parcelles"))).withOption('defaultContent', '').withClass('none')
    ];


    function edit(c) {}

    function deleteRow(c) {}

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }
    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //starting date change listner
    pc.date_debut_change = function() {
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      pc.dtInstance.reloadData();
    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    pc.goBack = () => {
      $state.go("apportEau");
    }

  });