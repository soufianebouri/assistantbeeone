'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsConsultationparouvrierCtrl
 * @description
 * # MainoeuvreetatsConsultationparouvrierCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsConsultationparouvrierCtrl', function($scope, translatedwords, _url, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, consultationparouvrier, Ouviers) {

    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Personnel").selectpicker('refresh');
    }, 1000);

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

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


    //load Personnel cultural list by domaine
    $scope.LoadPersonnel = Ouviers.getAllOuviers(_url).then(function(res) {
      pc.personnels = res.data;
    });

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([$scope.LoadDomaine, $scope.LoadPersonnel]).then(function(values) {
      setTimeout(function() {
        $("#Personnel").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PERSONNEL": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };


    $scope.personnel_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    //by personnel
    $scope.personnel_change = function() {
      if ($scope.personnel.personnel === null || $scope.personnel.personnel === "" || $scope.personnel.personnel === undefined || $scope.personnel.personnel === 0 || $scope.personnel.personnel === "0" || !$scope.personnel.personnel || $scope.personnel.personnel.length === 0 || $scope.personnel.personnel.includes(0)) {
        $scope.personnel_sel = [0];
      } else {
        $scope.personnel_sel = $scope.personnel.personnel;
      }

      pc.obj.PERSONNEL = $scope.personnel_sel;
      pc.dtInstance.reloadData();
    };

    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();
    };

    //get data and refresh datatable
    $scope.updateDataConsultationOuvrier = function(data) {
      return consultationparouvrier.getByFiltre(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataConsultationOuvrier(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withScroller()
      .withOption('responsive', true)
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          },
          titleAttr: 'Rechercher'
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>",
          titleAttr: 'Copie'
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          titleAttr: 'Imprimer'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DATE').withTitle('Date').renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Mat').withTitle('Matricule'),
      DTColumnBuilder.newColumn('Nom').withTitle('Nom'),
      DTColumnBuilder.newColumn('Prenom').withTitle('Prénom'),
      DTColumnBuilder.newColumn('Qte_Unite').withTitle('Quantité').renderWith(function(data, type, full, meta) {
        var Qte_Unite = parseFloat(full.Qte_Unite).toFixed(2);
        if (isNaN(Qte_Unite)) {
          Qte_Unite = "";
        }
        return '<p align="right">' + Qte_Unite + '</p>';
      }),
      DTColumnBuilder.newColumn('DJ1').withTitle('D.J1(4H)').renderWith(function(data, type, full, meta) {
        if (full.DJ1) {
          return '<i class="fa fa-check"></i>';
        } else {

          return '<i class="fa fa-remove"></i>';
        }
      }),
      DTColumnBuilder.newColumn('DJ2').withTitle('D.J2(4H)').renderWith(function(data, type, full, meta) {
        if (full.DJ2) {
          return '<i class="fa fa-check"></i>';
        } else {

          return '<i class="fa fa-remove"></i>';
        }
      }),
      DTColumnBuilder.newColumn('HJ').withTitle('HR').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.HJ + '</p>';
      }),
      DTColumnBuilder.newColumn('HS_NM').withTitle('0%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.HS_NM + '</p>';
      }),
      DTColumnBuilder.newColumn('HS_25').withTitle('25%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.HS_25 + '</p>';
      }),
      DTColumnBuilder.newColumn('HS_50').withTitle('50%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.HS_50 + '</p>';
      }),
      DTColumnBuilder.newColumn('HS_100').withTitle('100%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.HS_100 + '</p>';
      }),
      DTColumnBuilder.newColumn('Cout').withTitle('Coût').renderWith(function(data, type, full, meta) {
        var Cout_Totale = parseFloat(full.Cout).toFixed(2);
        if (isNaN(Cout_Totale)) {
          Cout_Totale = "";
        }
        return '<p align="right">' + Cout_Totale + '</p>';
      })
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
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

  });