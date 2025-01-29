'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecoltePrevisiondemainCtrl
 * @description
 * # RecoltePrevisiondemainCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecoltePrevisiondemainCtrl', function($scope, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, parcellecultural, campagneagricole,
    PeriodeEstimation, societe, VarieteService, domaine, DTDefaultOptions, $uibModal, translatedwords, $mdDialog, $element, toastr, _url, $filter, BusinessUnit, FermeService) {

    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};

    var heightOfTable = $(window).height() - ($("#filter_form").height() * 2) - 40;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.currentCampId = -1;
    pc.obj = {
      "ID_Societe_Societe": [0],
      "ID_Societe": 0,
      "CAMPAGNE": "",
      "DOMAINE": 0,
      "PARCELLE": [0],
      "VARIETE": [0]
    };

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Producteur").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);

    pc.filterWithItems = {
      societe: -1
    };

    pc.canSearch = () => {
      if (pc.obj.ID_Societe == 0 || pc.obj.DOMAINE == 0) {
        return true;
      }
      return false;
    }

    $q.all([campagneagricole.getCampagneAgricole(),
      societe.getSociete(_url),
      domaine.getDomaine(),
      BusinessUnit.getBusinessUnit(pc.obj)
    ]).then((values) => {
      pc.societes = values[1].data;
      if (pc.societes.length) {
        pc.filterWithItems.societe = pc.societes[0].ID;
        pc.compagne_array = values[0].data;
        pc.domaines = values[2].data;
        pc.producteurs = values[3].data;
        if (pc.domaines.length) {
          $q.all([VarieteService.getVarieteByFarm({
            idferme: pc.domaines[0].IDFermes
          }), parcellecultural.getParcelleCulturalByFerme(pc.domaines[0].IDFermes)]).then(e => {
            pc.variete_array = e[0].data;
            pc.parcelles_array = e[1].data;
            angular.forEach(pc.compagne_array, function(value, key) {
              if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
                pc.current_campagne = value.Code;
                setTimeout(function() {
                  $(".selectpicker").selectpicker('refresh');
                  $('#Societe').selectpicker('val', pc.societes[0].ID);
                  $('#Domaine').selectpicker('val', pc.domaines[0].IDFermes);
                  $('#compagne').selectpicker('val', pc.current_campagne);
                  pc.obj.ID_Societe = pc.societes[0].ID;
                  pc.obj.CAMPAGNE = pc.current_campagne;
                  pc.obj.DOMAINE = pc.domaines[0].IDFermes;
                  pc.dtInstance.reloadData();
                }, 1000);
              }
            });
          });
        }
        NProgress.done();
      }
    });

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        PeriodeEstimation.getEstimationDemain(pc.obj).then(function(result) {

          for (var i = 0; i < result.data.length; i++) {
            result.data[i].Date_Saisie = moment(result.data[i].Date_Saisie).format('YYYY-MM-DD');
            result.data[i].Date_Reel = moment(result.data[i].Date_Reel).format('YYYY-MM-DD');
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
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))
      .withOption('scrollY', heightOfTable)

      .withOption('responsive', true)
      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
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
      DTColumnBuilder.newColumn('CodePeriode').withTitle(translatedwords.getTranslatedWord($translate("Période"))),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Qauntite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + $filter('numberwithspace')(full.Qauntite) + ' Kg</p>';
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Opérateur")))
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

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

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || parcelle.length === 0 || parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;

    };

    //by variety
    pc.variete_change = function() {

      var variete = $scope.variete.variete;

      if (validateInput(variete) || variete.length === 0 || variete.includes(0))
        variete = [0];

      pc.obj.VARIETE = variete;
    };

    pc.domaine_change = function() {
      var domaine = $scope.domaine;
      if (validateInput(domaine))
        domaine = 0;
      pc.obj.DOMAINE = domaine;

      $q.all([VarieteService.getVarieteByFarm({
        idferme: pc.obj.DOMAINE
      }), parcellecultural.getParcelleCulturalByFerme(pc.obj.DOMAINE)]).then(e => {

        pc.variete_array = e[0].data;
        pc.parcelles_array = e[1].data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
        }, 1000);
      });
    };

    pc.societe_change = function() {
      var societe = $scope.societe;
      if (validateInput(societe))
        societe = 0;
      pc.obj.ID_Societe = societe;
      pc.filterWithItems.societe = societe;
      pc.variete_array = [];
      pc.parcelles_array = [];
      setTimeout(function() {
        $("#Domaine").selectpicker('refresh');
      }, 1000);
      //load variety
    };


    pc.producteur_change = function() {
      NProgress.start();
      pc.domaines = [];

      if ($scope.producteur && $scope.producteur.length > 0 && !$scope.producteur.includes(0)) {
        pc.obj.ID_Societe = $scope.producteur;
        FermeService.bySociete({
          Societe: pc.obj.ID_Societe_Societe,
          businessUnit: pc.obj.ID_Societe
        }).then(e => {
          pc.domaines = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            $("#Domaine").selectpicker('refresh');
            NProgress.done();
          }, 1000);
        })
      } else {
        pc.obj.ID_Societe = [0];
        NProgress.done();
      }

    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });