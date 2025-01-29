'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:DossierpersonnelSalariesCtrl
 * @description
 * # DossierpersonnelSalariesCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('DossierpersonnelSalariesCtrl', function($scope, translatedwords,
    $compile,
    $uibModal,
    _url,
    DTOptionsBuilder,
    DTColumnBuilder, $translatePartialLoader, $translate, $window,
    $q,
    Salaries, DTDefaultOptions) {


    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.edit = edit;
    pc.delete = deleteRow;
    pc.dtInstance = {};
    pc.data = {
      "modalTitle": {
        "create": "Ajouter un salarie",
        "update": "Mise a jour"
      },
      "niveau": "Salarie",
      "baseUrl": _url,
      "confirmeDeleteText": "Etes-vous sur de supprimer ce Salarie ?",
      "confirme": "Confirmation",
      "action": "insert",
      "updateSalarie": {}
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        Salaries.getSalaries(_url).then(function(result) {
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('order', [0, 'asc'])
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye' data-toggle='tooltip' data-placement='top' title='Tooltip on top'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdf',
          text: "<i class='fa fa-file-pdf-o'></i>",
          className: 'SetSize',
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('Mat').withTitle(translatedwords.getTranslatedWord($translate("Matricule"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Nom"))),
      DTColumnBuilder.newColumn('Prenom').withTitle(translatedwords.getTranslatedWord($translate("Prénom"))),
      DTColumnBuilder.newColumn('CIN').withTitle(translatedwords.getTranslatedWord($translate("CIN"))),
      DTColumnBuilder.newColumn('CNSS').withTitle(translatedwords.getTranslatedWord($translate("CNSS"))),
      DTColumnBuilder.newColumn('Dat_Nai').withTitle(translatedwords.getTranslatedWord($translate("Date de naissance"))).renderWith(function(data) {
        if (data) {
          return moment(data).format('MM/DD/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Lieu_Nai').withTitle(translatedwords.getTranslatedWord($translate("Lieu de naissance"))),
      DTColumnBuilder.newColumn('Tel').withTitle(translatedwords.getTranslatedWord($translate("Tel"))),
      DTColumnBuilder.newColumn('Adr').withTitle(translatedwords.getTranslatedWord($translate("Adresse"))).withClass('td-nowrap'),
      DTColumnBuilder.newColumn('Ville').withTitle(translatedwords.getTranslatedWord($translate("Ville"))),
      DTColumnBuilder.newColumn('Email').withTitle(translatedwords.getTranslatedWord($translate("Email"))),
      DTColumnBuilder.newColumn('Situ_Fam').withTitle(translatedwords.getTranslatedWord($translate("Situation familiale"))),
      DTColumnBuilder.newColumn('NBEnft').withTitle(translatedwords.getTranslatedWord($translate("Nombre d'enfants"))),
      DTColumnBuilder.newColumn('Niveau_Scol').withTitle(translatedwords.getTranslatedWord($translate("niveau scolaire"))),
      DTColumnBuilder.newColumn('Salaire_mensuel').withTitle(translatedwords.getTranslatedWord($translate("Salaire mensuel"))),
      DTColumnBuilder.newColumn('Echelle').withTitle(translatedwords.getTranslatedWord($translate("Echelle"))),
      DTColumnBuilder.newColumn('Date_Embauche').withTitle(translatedwords.getTranslatedWord($translate("Date d'embauche"))),
      DTColumnBuilder.newColumn('Salaire_Journalier').withTitle(translatedwords.getTranslatedWord($translate("Salaire journalier"))),
      DTColumnBuilder.newColumn('Salaire_Horaire').withTitle(translatedwords.getTranslatedWord($translate("Salaire horaire"))),
      DTColumnBuilder.newColumn('Mode_reglement').withTitle(translatedwords.getTranslatedWord($translate("Mode de reglement"))),
      DTColumnBuilder.newColumn('Banque_Compte').withTitle(translatedwords.getTranslatedWord($translate("Compte bancaire"))),
      DTColumnBuilder.newColumn('Date_cree').withTitle(translatedwords.getTranslatedWord($translate("Date de création"))).renderWith(function(data) {
        if (data) {
          return moment(data).format('MM/DD/YYYY');
        } else {
          return "";
        }
      })
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function edit(c) {

    }

    function deleteRow(c) {

    }

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

  });