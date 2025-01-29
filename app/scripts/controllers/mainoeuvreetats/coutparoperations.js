'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:MainoeuvreetatsCoutparoperationsCtrl
 * @description
 * # MainoeuvreetatsCoutparoperationsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('MainoeuvreetatsCoutparoperationsCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, coutparoperations, $state, DTDefaultOptions, $cookies, $templateCache) {
    var pc = this;
    pc.dtInstance = {};
    pc.dtInstanceParOperation = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.reload = true;
    pc.NbrPersonne = [];
    pc.HSdeclaree = [];
    $scope.familleoperationTable = true;

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());

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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "DATE_DEBUT": 0,
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');


    pc.manageViews = () => {
      if ($scope.reload) {
        $("#loadingData").show();
        $("#printThis").hide();
      } else {
        $("#loadingData").hide();
        $("#printThis").show();
      }
    };

    pc.loadData = () => {
      if ($scope.familleoperationTable) {
        $q.all([coutparoperations.getNbrPersonne(pc.obj), coutparoperations.getHSdeclaree(pc.obj)]).then(function(values) {
          pc.NbrPersonne = values[0].data;
          pc.HSdeclaree = values[1].data;
          pc.dtInstance.reloadData();
          $scope.reload = false;
          pc.manageViews();
          NProgress.done();
        });
      } else {
        $q.all([coutparoperations.getOperationNbrPersonne(pc.obj), coutparoperations.getOperationHSdeclaree(pc.obj)]).then(function(values) {
          pc.OperationNbrPersonne = values[0].data;
          pc.OperationHSdeclaree = values[1].data;
          pc.dtInstanceParOperation.reloadData();
          $scope.reload = false;
          pc.manageViews();
          NProgress.done();
        });
      }
    }


    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      $scope.reload = true;
      pc.manageViews();
      pc.loadData();
    };

    //get data and refresh datatable
    $scope.updateCoutOperation = function(data) {
      return coutparoperations.getByFamilleCulture(data);
    };

    //get data and refresh datatable
    $scope.updateOperation = function(data) {
      return coutparoperations.getByOperation(data);
    };

    //by type
    $scope.type_change = function(type) {
      if (type == 1) {
        $scope.familleoperationTable = true;
        $("#FamilleOperation").addClass("btn-success");
        $("#Operation").removeClass("btn-success");
      } else {
        $("#FamilleOperation").removeClass("btn-success");
        $("#Operation").addClass("btn-success");
        $scope.familleoperationTable = false;
      }
      pc.manageViews();
      pc.loadData();
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateCoutOperation(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('footerCallback', function(nRow, aaData, iStart, iEnd, aiDisplay) {
        var nCells = nRow.getElementsByTagName('th');
        $scope.allData = aaData;
        $scope.sumcout = 0;
        angular.forEach($scope.allData, function(mydata) {
          $scope.sumcout += parseFloat(mydata.cout);
        })
        nCells[2].innerHTML = '<p align="right">' + $scope.sumcout.toFixed(2) + '</p>';
      })
      .withOption('initComplete', function() {
        // do what evrithing
      })
      .withOption('order', [0, 'asc'])
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left',
          titleAttr: 'Visibilité'
        },
        {
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
      DTColumnBuilder.newColumn('mois').withTitle('Mois').renderWith(function(data, type, full, meta) {
        $scope.mydate = '01/' + full.mois + '/2018';
        return moment($scope.mydate, 'YYYY-MM-DD').locale('fr').format('MMMM') + ' ' + full.annee;
      }),
      DTColumnBuilder.newColumn('FamilleOperation').withTitle('Famille opération'),
      DTColumnBuilder.newColumn('cout').withTitle('Coût').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.cout.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr Jour / Home').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.nbr_jour.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr PR').renderWith(function(data, type, full, meta) {
        $scope.nbr_pr = 0;
        angular.forEach(pc.NbrPersonne, function(pers) {
          if (pers.mois == full.mois && pers.annee == full.annee && pers.IDFamilleOperation == full.IDFamilleOperation) {
            $scope.nbr_pr += pers.nbr_personne;
          }
        })
        return '<p align="right">' + $scope.nbr_pr.toFixed(2) + '</p>';

      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr HS').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.hs.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr HS(déclaré)').renderWith(function(data, type, full, meta) {
        $scope.nbr_hscnss = 0;
        angular.forEach(pc.HSdeclaree, function(hsdeclare) {
          if (hsdeclare.mois == full.mois && hsdeclare.annee == full.annee && hsdeclare.IDFamilleOperation == full.IDFamilleOperation) {
            $scope.nbr_hscnss += hsdeclare.hs_declaree;
          }
        })
        return '<p align="right">' + $scope.nbr_hscnss.toFixed(2) + '</p>';
      })
    ];



    pc.dtOptionsParOperation = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        if (!$scope.familleoperationTable) {
          $scope.updateOperation(pc.obj).then(function(res) {
            defer.resolve(res.data);
            NProgress.done();
          });
        } else {
          defer.resolve([]);
          NProgress.done();
        }

        return defer.promise;
      })
      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('footerCallback', function(nRow, aaData, iStart, iEnd, aiDisplay) {
        var nCells = nRow.getElementsByTagName('th');
        $scope.allData = aaData;
        $scope.sumcout = 0;
        angular.forEach($scope.allData, function(mydata) {
          $scope.sumcout += parseFloat(mydata.cout);
        })
        nCells[2].innerHTML = '<p align="right">' + $scope.sumcout.toFixed(2) + '</p>';
      })
      .withOption('initComplete', function() {
        // do what evrithing
      })
      .withOption('order', [0, 'asc'])
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))


      .withButtons([{
          extend: 'colvis',
          text: "<i class='fa fa-eye'></i>",
          className: 'pull-left'
        },
        {
          text: "<i class='fa fa-search'></i>",
          action: function(e, dt, node, config) {
            $scope.ReverseDisplay('filter_form');
          }
        },
        {
          extend: 'copy',
          text: "<i class='fa fa-copy'></i>"
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>"
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>"
        }
      ]);

    pc.dtColumnsParOpeation = [
      DTColumnBuilder.newColumn('mois').withTitle('Mois').renderWith(function(data, type, full, meta) {
        $scope.mydate = '01/' + full.mois + '/2018';
        return moment($scope.mydate, 'YYYY-MM-DD').locale('fr').format('MMMM') + ' ' + full.annee;
      }),
      DTColumnBuilder.newColumn('OpeRef_Intitule').withTitle('Opération'),
      DTColumnBuilder.newColumn('cout').withTitle('Coût').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.cout.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr Jour / Home').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.nbr_jour.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr PR').renderWith(function(data, type, full, meta) {
        $scope.nbr_pr = 0;
        angular.forEach(pc.OperationNbrPersonne, function(pers) {
          if (pers.mois == full.mois && pers.annee == full.annee && pers.IDOperation_REF == full.IDOperation_REF) {
            $scope.nbr_pr += pers.nbr_personne;
          }
        })
        return '<p align="right">' + $scope.nbr_pr.toFixed(2) + '</p>';

      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr HS').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.hs.toFixed(2) + '</p>';
      }),
      DTColumnBuilder.newColumn(null).withTitle('Nbr HS(déclaré)').renderWith(function(data, type, full, meta) {
        $scope.nbr_hscnss = 0;
        angular.forEach(pc.OperationHSdeclaree, function(hsdeclare) {
          if (hsdeclare.mois == full.mois && hsdeclare.annee == full.annee && hsdeclare.IDOperation_REF == full.IDOperation_REF) {
            $scope.nbr_hscnss += hsdeclare.hs_declaree;
          }
        })
        return '<p align="right">' + $scope.nbr_hscnss.toFixed(2) + '</p>';
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