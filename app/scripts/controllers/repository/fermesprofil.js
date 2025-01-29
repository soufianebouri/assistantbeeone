'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryFermesprofilCtrl
 * @description
 * # RepositoryFermesprofilCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryFermesprofilCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, translatedwords,
    $q, $translatePartialLoader, $translate, $window,
    FermesProfil,
    $filter
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
        "create": "Ajouter un profil",
        "update": "Mise a jour"
      },
      "ferme": "Ferme",
      "profil": "Profil",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur ?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateObj": {}
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        FermesProfil.getFermesProfil(_url).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = (result.data[i].DateCreated) ? moment(result.data[i].DateCreated).format('YYYY-MM-DD') : result.data[i].DateCreated;
            $filter('escapeObject')(result.data[i], false);
            pc.obj[result.data[i].ID] = result.data[i];
          }
          defer.resolve(result.data);
        });
        return defer.promise;
      })
      .withOption('createdRow', createdRow)
      .withDOM('lfrti')
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))
      .withOption('scrollY', $(window).height() / 2)
      .withButtons([{
          extend: 'colvis',
          text: '<span style="color:green"><b>Visibilité' + ' <i class="fa fa-angle-down"></i></b></span>',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          extend: 'copy',
          text: '<span style="color:green"><b>Copier</b></span>',
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: '<span style="color:green"><b>Imprimer</b></span>',
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'excel',
          text: '<span style="color:green"><b>Excel</b></span>',
          titleAttr: 'EXCEL'
        },
        {
          text: '<span style="color:green"><b>' + pc.data.modalTitle.create + '</b></span>',
          key: '1',
          action: function(e, dt, node, config) {
            pc.showModal('', "c");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        }
      ]);
    pc.dtColumns = [
      DTColumnBuilder.newColumn('user').withTitle(translatedwords.getTranslatedWord($translate("Profil"))),
      DTColumnBuilder.newColumn('nomFerme').withTitle(translatedwords.getTranslatedWord($translate("Ferme"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Créer par"))),
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date création"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];

    function edit(c) {
      pc.data.updateObj = {
        ...c
      };
      pc.showModal('', "u");
    }

    function deleteRow(c) {
      pc.idToDelete = c.ID;
      pc.showModal('', "d");
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    function formatFeatures(data, type, full, meta) {
      return '<span>' + ((data == 0) ? 'Mâle' : 'Femalle') + '</span>';
    }

    function formatEtatFermesProfil(data, type, full, meta) {
      if (data) {
        return '<span>' + ((data == 0) ? 'Piège ouvert' : 'Piège fermé') + '</span>';
      } else {
        return '<span></span>';
      }
    }

    pc.showModal = function(size, req) {
      var template = './views/templates/fermesprofil.html';
      pc.data.action = "insert";

      if (req == "d") {
        template = './views/templates/modalconfirmedelete.html';
        pc.data.action = "delete";
      } else if (req == "u") {
        pc.data.action = "update";
      }

      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'ModalFermesProfilCtrl',
        controllerAs: 'pc',
        size: size,
        resolve: {
          data: function() {
            return pc.data;
          }
        }
      });

      modalInstance.result.then(function(res) {
        if (res == 'delete') {
          FermesProfil.deleteFermesProfil(_url, {
            ID: pc.idToDelete
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