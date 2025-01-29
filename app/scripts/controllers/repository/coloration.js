'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RepositoryColorationCtrl
 * @description
 * # RepositoryColorationCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RepositoryColorationCtrl', function($scope, $translatePartialLoader, $translate, $window,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder,
    $q,
    NiveauColorationService,
    DTDefaultOptions, translatedwords,
    parametragestockage
  ) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.edit = edit;
    pc.delete = deleteRow;
    pc.dtInstance = {};
    pc.colorationObject = {};
    pc.idColoration = -1;
    pc.parametragestockage = [];
    pc.PicturesHostNiveauColoration = "";
    pc.data = {
      "modalTitle": {
        "create": "Ajouter un niveau de coloration",
        "update": "Mise a jour"
      },
      "niveau": "Niveau de coloration",
      "Variete": "Variete",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur de supprimer ce niveau ?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateColoration": {}
    };

    pc.parametragestockage = parametragestockage.getAll().then((values) => {
      pc.parametragestockage = values.data;
      NProgress.done();
      NProgress.remove();
      return pc.PicturesHostNiveauColoration = pc.parametragestockage[0].Host + pc.parametragestockage[0].Rep_Niveau_Coloration + '/';
    });

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        NiveauColorationService.getColoration(_url).then(function(result) {

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
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            pc.showModal('', "c");
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Niveau_Coloration').withTitle(translatedwords.getTranslatedWord($translate("Niveau de coloration"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Photo').withTitle(translatedwords.getTranslatedWord($translate("Photo"))).renderWith(function(data, type, full, meta) {
        if (full.Photo) {
          var pics = full.Photo.split(",");
          var imghtml = "<table><tr>";
          pics.forEach(function(item, index) {
            if (item != 'noimg.png')
              imghtml += `<td><a ng-click="pc.showimg('${pc.PicturesHostNiveauColoration+item}', '${full.Variete}')">` +
              `<img src="${pc.PicturesHostNiveauColoration+item}" width="50px" height="50px" class=""/>  ` +
              `</a></td>`;
          });
          return imghtml + '</tr></table>';

        } else {

          return '';
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).withOption('width', '10%').notSortable().withClass('nowraptd all')
      .renderWith(actionsHtml)
    ];

    pc.showimg = function(img, variete) {
      $.magnificPopup.open({
        tClose: 'Fermer (Esc)',
        tLoading: 'Chargement...',
        delegate: 'a',
        items: {
          src: img
        },
        closeOnContentClick: true,
        closeBtnInside: true,
        mainClass: 'mfp-fade',
        image: {
          titleSrc: function() {
            return '<b style="text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;"><u>Variété</u> : ' + variete + '</b>';
          }
        },
        gallery: {
          enabled: true
        },
        type: 'image'
      });
    }

    function edit(c) {
      pc.data.updateColoration.ID = c.ID;
      pc.data.updateColoration.Niveau_Coloration = c.Niveau_Coloration;
      pc.data.updateColoration.ID_Culture = c.ID_Culture;
      pc.showModal('', "u");
      // Edit some data and call server to make changes...
      // Then reload the data so that DT is refreshed
      //pc.dtInstance.reloadData();
    }

    function deleteRow(c) {
      pc.idColoration = c.ID;
      pc.showModal('', "d");
      // Delete some data and call server to make changes...
      // Then reload the data so that DT is refreshed
    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    function actionsHtml(data, type, full, meta) {
      pc.colorationObject[data.ID] = data;
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.colorationObject[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.colorationObject[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');
    pc.showModal = function(size, req) {
      var template = './views/templates/addcolorationmodal.html';
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
        controller: 'ModalColorationCtrl',
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
          NiveauColorationService.deleteColoration(_url, {
            ID: pc.idColoration
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