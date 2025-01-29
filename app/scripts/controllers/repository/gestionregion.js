'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryGestionregionCtrl
 * @description
 * # RepositoryGestionregionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryGestionregionCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    gestionPays,
    $filter,
    $location, translatedwords,
    $state,
    DTDefaultOptions
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.edit = edit;
    pc.delete = deleteRow;
    pc.dtInstance = {};
    pc.obj = {};
    pc.idToDelete = -1;
    pc.data = {
      "modalTitle": {
        "create": "Ajouter region/zone",
        "update": "Mise a jour",
        "createRegion": "Ajouter une region",
        "managePays": "Gerer les pays"
      },
      "Pays": "Pays",
      "region": "Région",
      "zone": "Zone",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur de supprimer cette zone ?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateObj": {}
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        gestionPays.getCountriesWithData(_url).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            $filter('escapeObject')(result.data[i], false);
            pc.obj[result.data[i].idZ] = result.data[i];
          }
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
        }, {
          text: "<i class='fa fa-plus'></i> " + translatedwords.getTranslatedWord($translate("Ajouter Région/Zone")),
          key: '2',
          action: function(e, dt, node, config) {
            pc.showModal('', "c");
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter Région/Zone"))
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
          text: "<i class='fa fa-plus'></i> " + translatedwords.getTranslatedWord($translate("Pays")),
          key: '1',
          action: function(e, dt, node, config) {
            $state.go('gestionPays');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Gestion des Pays"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Pays').withTitle(translatedwords.getTranslatedWord($translate("Pays"))),
      DTColumnBuilder.newColumn('Region').withTitle(translatedwords.getTranslatedWord($translate("Région"))),
      DTColumnBuilder.newColumn('Zone').withTitle(translatedwords.getTranslatedWord($translate("Zone"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '10%').notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];

    function edit(c) {
      pc.data.updateObj = {
        ...c
      };

      pc.showModal('', "u");
      // Edit some data and call server to make changes...
      // Then reload the data so that DT is refreshed
      //pc.dtInstance.reloadData();
    }

    function deleteRow(c) {
      pc.idZoneToDelete = c.idZ;
      pc.idRegionToDelete = c.idR;
      pc.showModal('', "d");
      // Delete some data and call server to make changes...
      // Then reload the data so that DT is refreshed
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.idZ + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.idZ + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');
    pc.showModal = function(size, req) {
      var template = './views/templates/gestionregion.html';
      pc.data.action = "insert";

      if (req == "d") {
        template = './views/templates/modalconfirmedeleteregionzone.html';
        pc.data.action = "delete";
      } else if (req == "u") {
        pc.data.action = "update";
      }

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'ModalGestionRegionCtrl',
        controllerAs: 'pc',
        size: size,
        resolve: {
          data: function() {
            return pc.data;
          }
        }
      });

      modalInstance.result.then(function(res) {
        if (res == 'deleteZone') {
          gestionPays.deleteZone(_url, {
            ID: pc.idZoneToDelete
          }).then(function(result) {
            if (result.data[0].message == "ajout reussi") {
              pc.dtInstance.reloadData();
            } else {

              alert("Error : " + result.data[0].description);
            }
          });
        } else if (res == 'deleteRegion') {
          gestionPays.deleteRegion(_url, {
            ID: pc.idRegionToDelete
          }).then(function(result) {
            if (result.data[0].message == "ajout reussi") {
              pc.dtInstance.reloadData();
            } else {

              alert("Error : " + result.data[0].description);
            }
          });
        } else if (res == 'insert') {
          pc.dtInstance.reloadData();
        }
      }, function() {});

    };
  });