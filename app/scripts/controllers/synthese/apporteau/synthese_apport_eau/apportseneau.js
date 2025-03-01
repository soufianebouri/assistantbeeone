'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SyntheseApportEauCtrl
 * @description
 * # SyntheseApportEauCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SyntheseApportEauCtrl', function($scope, DTOptionsBuilder, translatedwords, $window, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, ApportEau, $state, $uibModal, $cookies, GroupeOperationnel, ParcellePhysique, VarieteService, _url, DTDefaultOptions) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 5);
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.apportEauAvancee = [];
    pc.apportEau = {};
    pc.mode_irrigation = 1;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.obj = {
      "VARIETE": 0,
      "PARCELLE": 0,
      "GROUP_OPERATIONNEL": 0,
      "STANDARD": true,
      "FERME": [$cookies.getObject('beeoneAssistant').ferme.IDFerme],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

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

    $q.all([GroupeOperationnel.getGroupeOperationnelByFerme({
        idferme: $cookies.getObject('beeoneAssistant').ferme.IDFerme
      }),
      ParcellePhysique.getParcellePhysique(_url, {
        IDFermes: $cookies.getObject('beeoneAssistant').ferme.IDFerme
      }),
      VarieteService.getVarieteByFarm({
        idferme: $cookies.getObject('beeoneAssistant').ferme.IDFerme
      })
    ]).then((values) => {
      pc.groupe_operationnel_array = values[0].data;
      pc.parcelles_array = values[1].data;
      pc.variete_array = values[2].data;

      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
        NProgress.done();
        NProgress.remove();
      }, 1000);
    });


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        NProgress.start();
        var defer = $q.defer();
        ApportEau.getSyntheseApportEau(pc.obj).then(function(result) {

          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DATE = moment(result.data[i].DATE).format('YYYY-MM-DD');
            result.data[i].Sup = result.data[i].Sup.toFixed(2);
            result.data[i].DOSE_Ordre = result.data[i].DOSE_Ordre.toFixed(2);
            result.data[i].Deficitsurplus = result.data[i].Deficitsurplus.toFixed(2);
            (result.data[i].Moyen == 1) ? result.data[i].dose_barrage = result.data[i].Dose_realise.toFixed(2): result.data[i].dose_nappe = result.data[i].Dose_realise.toFixed(2);
          }
          NProgress.done();
          NProgress.remove();
          defer.resolve(result.data);
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
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-columns'></i>",
          action: function(e, dt, node, config) {
            //$state.go("apportEau");
          },
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Sup').withTitle(translatedwords.getTranslatedWord($translate("Sup (ha)"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Sup + '</p>';
      }),
      DTColumnBuilder.newColumn('DOSE_Ordre').withTitle(translatedwords.getTranslatedWord($translate("Besoin"))).renderWith(function(data, type, full, meta) {
        if (full.DOSE_Ordre)
          return '<p align="right">' + full.DOSE_Ordre + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('dose_barrage').withTitle(translatedwords.getTranslatedWord($translate("Dose barrage"))).withOption('defaultContent', '0').renderWith(function(data, type, full, meta) {
        if (full.dose_barrage)
          return '<p align="right">' + full.dose_barrage + '</p>';
        return '<p align="right">0</p>';
      }),
      DTColumnBuilder.newColumn('dose_nappe').withTitle(translatedwords.getTranslatedWord($translate("Dose nappe"))).renderWith(function(data, type, full, meta) {
        if (full.dose_nappe)
          return '<p align="right">' + full.dose_nappe + '</p>';
        return '<p align="right">0</p>';
      }).withOption('defaultContent', '0'),
      DTColumnBuilder.newColumn('Deficitsurplus').withTitle(translatedwords.getTranslatedWord($translate("Deficit/Surplus (m3)"))).renderWith(function(data, type, full, meta) {
        if (full.Deficitsurplus)
          return '<p align="right">' + full.Deficitsurplus + '</p>';
        return '<p align="right">0</p>';
      })
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
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
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

    //by variete
    pc.variete_change = function() {

      var variete = $scope.variete_id;
      if (validateInput(variete))
        variete = 0;
      pc.obj.VARIETE = variete;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    //by parcelle cultural
    pc.parcelle_change = function() {
      var parcelle = $scope.parcelle_id;
      if (validateInput(parcelle))
        parcelle = 0;
      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    //by parcelle cultural
    pc.groupe_operationnel_change = function() {
      var group = $scope.groupe_operationnel_id;
      if (validateInput(group))
        group = 0;
      pc.obj.GROUP_OPERATIONNEL = group;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    pc.goBack = () => {
      $state.go("apportEau");
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

  });