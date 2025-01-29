'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:actualisationDemandeCtrl
 * @description
 * # actualisationDemandeCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('actualisationDemandeCtrl', function($scope, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, parcellecultural, campagneagricole,
    PeriodeEstimation, societe, VarieteService, domaine, translatedwords, DTDefaultOptions, $uibModal, $mdDialog, $element, toastr, _url, EstimationActualise, pushNotifActualise, cultureService, BusinessUnit, FermeService) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};

    var heightOfTable = $(window).height() - ($("#filter_form").height() * 2) - 40;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();


    pc.dataModal = {};

    $q.all([cultureService.getCultureIdName(_url), VarieteService.getNameIdVariete(_url)]).then((values) => {
      pc.dataModal.culture_array = values[0].data;
      pc.dataModal.variete_array = values[1].data;
      NProgress.done();
    });


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        pushNotifActualise.getNotifActualise().then(function(result) {

          for (var i = 0; i < result.data.length; i++) {
            result.data[i].date_actualisation = moment(result.data[i].date_actualisation).format('YYYY-MM-DD');
          }
          defer.resolve(result.data);
        });
        NProgress.done();
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withOption('responsive', true)
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))
      .withOption('scrollY', heightOfTable)

      .withOption('responsive', true)
      .withButtons([{
          text: "<i class='fa fa-retweet'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            if (pc.dataModal) {
              pushNotifActualise.showModal({
                test: pc.dataModal,
                dtInstance: pc.dtInstance
              });
            }
          },
          className: 'pull-left'
        },
        {
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
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
      DTColumnBuilder.newColumn('profil').withTitle(translatedwords.getTranslatedWord($translate("Opérateur"))),
      DTColumnBuilder.newColumn('date_actualisation').withTitle(translatedwords.getTranslatedWord($translate("Date notif")))
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

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