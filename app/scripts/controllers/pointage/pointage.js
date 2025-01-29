'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PointagePointageCtrl
 * @description
 * # PointagePointageCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PointagePointageCtrl', function($scope, DTOptionsBuilder, translatedwords, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, pointage, $state, DTDefaultOptions, $cookies, $templateCache) {
    var pc = this;
    pc.dtInstance = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.showtable = true;

    pc.hj_total = 0;
    pc.quantite_total = 0;
    pc.cout_total = 0;
    pc.montant_total = 0;
    pc.cout_total_parcelle = 0;
    pc.cout_total_centre = 0;

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

    //by date_debutl
    $scope.date_debut_change = function() {
      NProgress.start();
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }

      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    $scope.date_fin_change = function() {
      NProgress.start();
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }

      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      pc.dtInstance.reloadData();
      NProgress.done();
      NProgress.remove();
    };

    $scope.type = "Type";

    //get data and refresh datatable
    $scope.updatePointage = function(data) {
      return pointage.getByFiltre(data);
    };


    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    //détails pointage
    pc.detailspointage = function(data) {
      pc.pointageByID = data;
      pc.personnels = [];
      pc.parcelles = [];
      pc.centres = [];
      pc.showtable = false;
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      pointage.getByPersonnel({
        "IDPointage": pc.pointageByID.IDPointage
      }).then(function(res) {
        pc.personnels = res.data;
        NProgress.done();
      });

      if (!pc.pointageByID.Is_CC) {
        pointage.getByParcelle({
          "IDPointage": pc.pointageByID.IDPointage
        }).then(function(res) {
          pc.parcelles = res.data;
          NProgress.done();
        });
      } else {
        pointage.getByCentre({
          "IDPointage": pc.pointageByID.IDPointage
        }).then(function(res) {
          pc.centres = res.data;
          NProgress.done();
        });
      }


    }

    pc.getSumcout_total_montant_total = function(data) {
      pc.montant_total = 0;
      angular.forEach(data, function(pers) {
        pc.montant_total += parseFloat(pers.Montant_prime);
      })
      return pc.montant_total;
    }

    pc.getSumcout_total_cout_total = function(data) {
      pc.cout_total = 0;
      angular.forEach(data, function(pers) {
        pc.cout_total += parseFloat(pers.cout);
      })
      return pc.cout_total;
    }

    pc.getSumcout_total_quantite_total = function(data) {
      pc.quantite_total = 0;
      angular.forEach(data, function(pers) {
        pc.quantite_total += parseFloat(pers.qte);
      })
      return pc.quantite_total;
    }


    pc.getSumcout_total_hj_total = function(data) {
      pc.hj_total = 0;
      angular.forEach(data, function(pers) {
        pc.hj_total += parseFloat(pers.HJ);
      })
      return pc.hj_total;
    }

    pc.getSumcout_total_parcelle = function(data) {
      pc.cout_total_parcelle = 0;
      angular.forEach(data, function(parcel) {
        pc.cout_total_parcelle += parseFloat(parcel.COUT);
      })
      return pc.cout_total_parcelle;
    }

    pc.getSumcout_total_centre = function(data) {
      pc.cout_total_centre = 0;
      angular.forEach(data, function(centre) {
        pc.cout_total_centre += parseFloat(centre.Cout);
      })
      return pc.cout_total_centre;
    }

    pc.setasdouble = function(val) {
      var Cout_Totale_val = parseFloat(val).toFixed(2);
      if (isNaN(Cout_Totale_val)) {
        Cout_Totale_val = "";
      }
      return Cout_Totale_val;
    }

    pc.getFormatTime = function(time_fomrmat_shosen) {
      pc.time_fomrmat = '';
      pc.time_fomrmat_four = time_fomrmat_shosen.substring(0, 4);
      pc.time_fomrmat = time_fomrmat_shosen.substring(0, 2) + ':' + time_fomrmat_shosen.substring(2, 4);
      return pc.time_fomrmat;
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updatePointage(pc.obj).then(function(res) {
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
      .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        $('td', nRow).bind('click', function() {
          $scope.$apply(function() {
            $('td').css("background-color", "");
            $('td', nRow).css('background-color', '#fff6b5');
            pc.detailspointage(aData);
          });
        });
        return nRow;
      })
      .withOption('footerCallback', function(nRow, aaData, iStart, iEnd, aiDisplay) {
        var nCells = nRow.getElementsByTagName('th');
        $scope.allData = aaData;
        $scope.sumcout = 0;
        angular.forEach($scope.allData, function(mydata) {
          $scope.sumcout += parseFloat(mydata.Cout_Totale);
        })
        nCells[0].innerHTML = "Compteur : " + parseInt($scope.allData.length);
        nCells[3].innerHTML = "Somme : " + $scope.sumcout.toFixed(2);
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
          titleAttr: translatedwords.getTranslatedWord($translate("Visibilité"))
        },
        {
          extend: 'collection',
          text: "TYPE <i class='fa fa-chevron-down'></i>",
          buttons: [{
              text: translatedwords.getTranslatedWord($translate("Tous")),
              action: function(e, dt, node, config) {
                $scope.searchByType("");
              },
              className: 'SetSize'
            },
            {
              text: "Horaire",
              action: function(e, dt, node, config) {
                $scope.searchByType("Horaire");
              },
              className: 'SetSize'
            },
            {
              text: "à l'unité",
              action: function(e, dt, node, config) {
                $scope.searchByType("à l'unité");
              },
              className: 'SetSize'
            }
          ]
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
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Oper_liste').withTitle(translatedwords.getTranslatedWord($translate("Opération"))),
      DTColumnBuilder.newColumn('Type').withTitle(translatedwords.getTranslatedWord($translate("Mode"))).renderWith(function(data, type, full, meta) {
        if (full.Type == 1) {
          return "<span class='badge-green'>Horaire</span>";
        } else if (full.Type == 2) {
          return "<span class='badge-orange'>à l'unité</span>";
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn('Cout_Totale').withTitle(translatedwords.getTranslatedWord($translate("Coût"))).renderWith(function(data, type, full, meta) {
        var Cout_Totale = parseFloat(full.Cout_Totale).toFixed(2);
        if (isNaN(Cout_Totale)) {
          Cout_Totale = "";
        }
        return '<p align="right">' + Cout_Totale + '</p>';
      })
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    $scope.searchByType = function(type_text) {
      pc.dtInstance.DataTable.search(type_text).draw();
    };

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