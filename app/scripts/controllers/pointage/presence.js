'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PointagePresenceCtrl
 * @description
 * # PointagePresenceCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PointagePresenceCtrl', function($scope, _url, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, $state, DTDefaultOptions, $cookies, presence, Ouviers) {

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
    $scope.updateDataPresence = function(data) {
      return presence.getPresence(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataPresence(pc.obj).then(function(res) {
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
        var api = this.api();
        var nCells = nRow.getElementsByTagName('td');
        $scope.allData = aaData;
        $scope.sumHr = 0;
        angular.forEach($scope.allData, function(mydata) {
          if (mydata.Sortie) {
            var firstTime = moment(mydata.Heure_entree, 'HH:mm:ss');
            var lastTime = moment(mydata.Heure_sortie, 'HH:mm:ss');
            var asHr = lastTime.diff(firstTime, 'minutes') / 60;
            $scope.sumHr += parseFloat(asHr);
          }
        })
        nCells[0].innerHTML = ' Total : ' + $scope.sumHr.toFixed(2) + ' hr';
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
      DTColumnBuilder.newColumn('Matricule').withTitle(translatedwords.getTranslatedWord($translate("Matricule"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Personnel"))),
      DTColumnBuilder.newColumn('Date_entree').withTitle(translatedwords.getTranslatedWord($translate("Date entrée"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_entree).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Heure_entree').withTitle(translatedwords.getTranslatedWord($translate("Heure entrée"))),
      DTColumnBuilder.newColumn('Date_sortie').withTitle(translatedwords.getTranslatedWord($translate("Date sortie"))).renderWith(function(data, type, full, meta) {
        if (full.Sortie) {
          return moment(full.Date_sortie).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Heure_sortie').withTitle(translatedwords.getTranslatedWord($translate("Heure sortie"))).renderWith(function(data, type, full, meta) {
        if (full.Sortie) {
          return full.Heure_sortie;
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Heure_sortie').withTitle(translatedwords.getTranslatedWord($translate("Nbr heure présence"))).renderWith(function(data, type, full, meta) {
        if (full.Sortie) {
          var firstTime = moment(full.Heure_entree, 'HH:mm:ss');
          var lastTime = moment(full.Heure_sortie, 'HH:mm:ss');
          var asHr = lastTime.diff(firstTime, 'minutes') / 60;
          return '<p align="right">' + asHr.toFixed(2) + '</p>';
        } else {
          return "";
        }
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