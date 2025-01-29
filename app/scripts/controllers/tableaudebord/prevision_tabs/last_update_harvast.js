'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:LastUpdateHarvastCtrl
 * @description
 * # LastUpdateHarvastCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('LastUpdateHarvastCtrl', function($scope, $translatePartialLoader, $translate, $window,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    $compile,
    PeriodeEstimation, translatedwords,
    _url) {

    var pc = this;

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

    pc.dtOptions3 = DTOptionsBuilder.fromFnPromise(function() {
        NProgress.start();
        var defer = $q.defer();
        PeriodeEstimation.lastUpdate(moment().format('YYYYMMDD')).then(e => {
          angular.forEach(e.data, (v, k) => {
            v.Aujourdhui /= 1000;
            v.Demain /= 1000;
            v.SemenCours /= 1000;
            v.SemProchaine /= 1000;

            v.Aujourdhui = parseFloat(v.Aujourdhui).toFixed(2);
            v.Demain = parseFloat(v.Demain).toFixed(2);
            v.SemenCours = parseFloat(v.SemenCours).toFixed(2);
            v.SemProchaine = parseFloat(v.SemProchaine).toFixed(2);
          });
          defer.resolve(e.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('ordering', false)
      .withOption('paging', false)
      .withOption('searching', false)
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
      //.withOption('scrollY', heightOfTable)
      ;

    pc.dtColumns3 = [
      DTColumnBuilder.newColumn('Type_variete').withTitle(translatedwords.getTranslatedWord($translate("Type de varieté"))),
      DTColumnBuilder.newColumn('Aujourdhui').withTitle(translatedwords.getTranslatedWord($translate("Aujourd'hui"))),
      DTColumnBuilder.newColumn('Demain').withTitle(translatedwords.getTranslatedWord($translate("Demain"))),
      DTColumnBuilder.newColumn('SemenCours').withTitle(translatedwords.getTranslatedWord($translate("Semaine en cours"))),
      DTColumnBuilder.newColumn('SemProchaine').withTitle(translatedwords.getTranslatedWord($translate("Semaine prochaine")))
    ];


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

  });