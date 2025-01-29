'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryGestionterminauxCtrl
 * @description
 * # RepositoryGestionterminauxCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryGestionterminauxCtrl', function(
    $scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, $translatePartialLoader, $translate, $window, translatedwords,
    $q,
    gestionterminaux,
    $filter
  ) {
    var pc = this;
    pc.obj = {};

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        gestionterminaux.getAll().then(function(result) {
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))

      .withButtons([{
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
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },


      ]);


    pc.dtColumns = [
      DTColumnBuilder.newColumn('idsysteme').withTitle(translatedwords.getTranslatedWord($translate("ID de l'Appareil"))),
      DTColumnBuilder.newColumn('apk').withTitle(translatedwords.getTranslatedWord($translate("Application"))),
      DTColumnBuilder.newColumn('login').withTitle(translatedwords.getTranslatedWord($translate("Login"))),
      DTColumnBuilder.newColumn('nom').withTitle(translatedwords.getTranslatedWord($translate("Nom"))),
      DTColumnBuilder.newColumn('maj').withTitle(translatedwords.getTranslatedWord($translate("Mise à jour")))
    ];

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }



  });