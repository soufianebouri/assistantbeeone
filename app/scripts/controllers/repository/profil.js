'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryProfilCtrl
 * @description
 * # RepositoryProfilCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryProfilCtrl', function($scope,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, $translatePartialLoader, $translate, $window, translatedwords,
    $q,
    Profil,
    $filter
  ) {

    var pc = this;
    pc.edit = edit;
    pc.delete = deleteRow;
    pc.dtInstance = {};
    pc.obj = {};
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.idToDelete = -1;
    pc.data = {
      "modalTitle": {
        "create": "Ajouter un utilisateur",
        "update": "Mise a jour"
      },
      "Nom": "Nom",
      "Prenom": "Prenom",
      "Phone": "Téléphone",
      "Mail": "Email",
      "Login": "Login",
      "Password": "Mot de passe",
      "isAdmin": "Admin",
      "Etat": "Etat compte",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur de supprimer cette utilisateur?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateObj": {}
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        Profil.getProfil(_url).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            //unescape
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
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Nom"))),
      DTColumnBuilder.newColumn('Prenom').withTitle(translatedwords.getTranslatedWord($translate("Prenom"))),
      DTColumnBuilder.newColumn('Phone').withTitle(translatedwords.getTranslatedWord($translate("Téléphone"))),
      DTColumnBuilder.newColumn('Mail').withTitle(translatedwords.getTranslatedWord($translate("Email"))),
      DTColumnBuilder.newColumn('Login').withTitle(translatedwords.getTranslatedWord($translate("Login"))),
      DTColumnBuilder.newColumn('Password').withTitle(translatedwords.getTranslatedWord($translate("mot de passe"))),
      DTColumnBuilder.newColumn('isAdmin').withTitle(translatedwords.getTranslatedWord($translate("Admin"))).renderWith(formatAdmin),
      DTColumnBuilder.newColumn('Etat').withTitle(translatedwords.getTranslatedWord($translate("Etat"))).renderWith(formatEtat),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable().withClass('nowraptd all')
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
      pc.idToDelete = c.ID;
      pc.showModal('', "d");
      // Delete some data and call server to make changes...
      // Then reload the data so that DT is refreshed
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" 	title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    function formatAdmin(data, type, full, meta) {
      if (data) {
        return '<span>' + ((data == 0) ? 'Utilisateur simple' : 'Admin') + '</span>';
      } else {
        return "<span></span>";
      }
    }

    function formatEtat(data, type, full, meta) {
      if (data) {
        return '<span>' + ((data == 0) ? 'Débloquer' : 'Bloquer') + '</span>';
      } else {
        return "<span></span>";
      }
    }

    pc.showModal = function(size, req) {
      var template = './views/templates/profil.html';
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
        controller: 'ModalProfilCtrl',
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
          Profil.deleteProfil(_url, {
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