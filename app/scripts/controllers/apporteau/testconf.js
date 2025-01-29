'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:ApporteauTestconfCtrl
 * @description
 * # ApporteauTestconfCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('ApporteauTestconfCtrl', function($scope, translatedwords, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, testConf, parcelleCultural, $state, _url, $cookies, DTDefaultOptions, toastr) {

    //getAllParcelleCultural
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.getParcelName = getParcelName;
    pc.parcels = [];
    pc.testconformiter = {};
    pc.dtInstance = {};
    pc.showtable = true;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    pc.obj = {
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };


    //starting date change listner
    pc.date_debut_change = function() {
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;
      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    //by date_fin
    pc.date_fin_change = function() {
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      $scope.reload = true;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
    };

    //toggle filter show
    pc.ReverseDisplay = (d) => {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    $(function() {
      $(document).on('mouseenter', ".showBig", function() {
        $(this).css({
          "font-size": parseInt($(this).css("font-size")) + 5
        });

      });

      $(document).on('mouseleave', ".showBig", function() {
        $(this).css({
          "font-size": parseInt($(this).css("font-size")) - 5
        });
      });
    });

    function getParcelName(id) {
      return pc.parcels.find(e => {
        if (e.ID == id) return e.Ref
      });
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

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    //get data and refresh datatable
    $scope.updateTestConformite = function(data) {
      return testConf.getDetails(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateTestConformite(pc.obj).then(function(res) {
          defer.resolve(res.data);
          NProgress.done();
        });
        return defer.promise;
      })
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
          });
        });
        return nRow;
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
      DTColumnBuilder.newColumn('Reference').withTitle(translatedwords.getTranslatedWord($translate("Référence"))),
      DTColumnBuilder.newColumn('DATE').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DATE).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Utilisateur').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn('Dose_Pourcentage').withTitle(translatedwords.getTranslatedWord($translate("Dose"))).withOption('width', '5%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + (full.Dose_Pourcentage) ? full.Dose_Pourcentage.toFixed(2) : 0 + '</p>';
      }),
      DTColumnBuilder.newColumn('Taux_conformite').withTitle(translatedwords.getTranslatedWord($translate("Taux de conformité (%)"))).withOption('width', '5%').renderWith(function(data, type, full, meta) {
        return '<p align="right">' + (full.Taux_conformite) ? (full.Taux_conformite.toFixed(2) * 100) : 0 + '</p>';
      }),
      DTColumnBuilder.newColumn('Cas_Conformite').withTitle(translatedwords.getTranslatedWord($translate("Etat"))),
      DTColumnBuilder.newColumn('Description').withTitle(translatedwords.getTranslatedWord($translate("Description"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.testconformiter[data.IDTest_Conformite] = data;
        return '<button class="btn btn-warning btn-xs" ng-click="pc.detailsTestConformite(pc.testconformiter[' + data.IDTest_Conformite + '])">' +
          '   <i class="fa fa-eye"></i>' +
          '</button>' +
          '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.testconformiter[' + data.IDTest_Conformite + '])" )"=""><i class="fa fa-trash-o"></i></button>';
      }).withOption('width', '5%').withClass('nowraptd all')
    ];


    pc.delete = async function(c) {
      pc.IDTestConformiter = c.IDTest_Conformite;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            testConf.delete({
              ID: pc.IDTestConformiter
            }).then(async function(result) {
              if (result.data[0].message == "ajout reussi") {
                //validate success
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                NProgress.done();
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + result.data[0].description, {
                  closeButton: true
                });
              }
            });
          });
        }
      });

    }

    pc.showtable_toggle = function() {
      pc.showtable = true;
    }

    pc.detailsTestConformite = function(data) {
      pc.TestConformiteByID = data;
      pc.parcelles = [];
      pc.goutteurs = [];
      pc.showtable = false;
      if (document.getElementById('filter_form').style.display === "block") {
        document.getElementById('filter_form').style.display = "none";
      }

      testConf.getParcelles({
        "IDTESTCONFORMITE": pc.TestConformiteByID.IDTest_Conformite
      }).then(function(res) {
        pc.parcelles = res.data;
        NProgress.done();
      });

      testConf.getGoutteurs({
        "IDTESTCONFORMITE": pc.TestConformiteByID.IDTest_Conformite
      }).then(function(res) {
        pc.goutteurs = res.data;
        NProgress.done();
      });

    };

    function edit(c) {}

    function deleteRow(c) {}

    function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())($scope);
    }

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    function headerCallback(header) {
      if (!pc.headerCompiled) {
        // Use this headerCompiled field to only compile header once
        pc.headerCompiled = true;
        $compile(angular.element(header).contents())($scope);
      }
    }


  });