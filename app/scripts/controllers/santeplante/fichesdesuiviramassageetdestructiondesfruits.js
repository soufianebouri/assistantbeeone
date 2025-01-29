'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteFichesdesuiviramassageetdestructiondesfruitsCtrl
 * @description
 * # SanteplanteFichesdesuiviramassageetdestructiondesfruitsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteFichesdesuiviramassageetdestructiondesfruitsCtrl', function($scope, translatedwords, $window, $translatePartialLoader, $translate, DTOptionsBuilder, DTColumnBuilder, $q, $compile, RamassageDestruction, $state, DTDefaultOptions, $cookies, parcellecultural, toastr, savefilter) {
    var pc = this;
    pc.dtInstance = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    pc.ref = "";
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
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

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme)]).then(function(values) {
      pc.parcellescultural = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });


    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "DATE_DEBUT": 0,
      "PARCELLE_CULTURAL": [0],
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    pc.search = function() {
      pc.ref = "";
      pc.dtInstance.reloadData();
    }

    //by parcelle cultural
    $scope.parcelle_change = function() {

      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;

    };

    //by date_debutl
    $scope.date_debut_change = function() {
      if ($scope.date_debut === null || $scope.date_debut === "" || $scope.date_debut === undefined || $scope.date_debut === 0 || $scope.date_debut === "0" || !$scope.date_debut || $scope.date_debut.length === 0) {
        $scope.date_debut_sel = 0;
      } else {
        $scope.date_debut_sel = $scope.date_debut;
      }
      pc.obj.DATE_DEBUT = moment($scope.date_debut_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }
      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
    };

    //get data and refresh datatable
    $scope.updateDataRamassageFiche = function(data) {
      return RamassageDestruction.getRamassageFiche(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataRamassageFiche(pc.obj).then(function(res) {
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
      .withOption('order', [])
      .withScroller()
      .withOption('responsive', true)
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
          title: '',
          customize: function(win) {
            pc.printer(win);
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          //pageSize: 'A4',
          orientation: 'landscape',
          filename: translatedwords.getTranslatedWord($translate("Fiche de suivi de ramassage et destruction des fruits")),
          exportOptions: {
            columns: ':visible',
            search: 'applied',
            order: 'applied'
          },
          title: '',
          customize: function(doc) {
            pc.pdf(doc);
          },
          titleAttr: 'PDF'
        },
        {
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          customize: function(xlsx) {
            pc.excel(xlsx);
          },
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-list'></i>",
          action: function(e, dt, node, config) {
            $state.go("ramassageDestruction");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Ramassage / destructions des fruits"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('dateramassage').withTitle(translatedwords.getTranslatedWord($translate("Date de ramassage"))).renderWith(function(data, type, full, meta) {
        if (full.dateramassage)
          return moment(full.dateramassage).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("Réf Parcelle culturale"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Decharge').withTitle(translatedwords.getTranslatedWord($translate("Décharge"))).renderWith(function(data, type, full, meta) {
        if (full.Decharge) {
          return '<span>Oui</span>';
        } else {
          return '<span>Non</span>';
        }
      }),
      DTColumnBuilder.newColumn('Enfouissement').withTitle(translatedwords.getTranslatedWord($translate("Enfouissement"))).renderWith(function(data, type, full, meta) {
        if (full.Enfouissement) {
          return '<span>Oui</span>';
        } else {
          return '<span>Non</span>';
        }
      }),
      DTColumnBuilder.newColumn('Incineration').withTitle(translatedwords.getTranslatedWord($translate("Incinération"))).renderWith(function(data, type, full, meta) {
        if (full.Incineration) {
          return '<span>Oui</span>';
        } else {
          return '<span>Non</span>';
        }
      }),
      DTColumnBuilder.newColumn('Date_Destruction').withTitle(translatedwords.getTranslatedWord($translate("Date de destruction"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Destruction)
          return moment(full.Date_Destruction).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Crée par"))).renderWith(function(data, type, full, meta) {
        return full.Nom + " " + full.Prenom;
      })
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    pc.printer = function(win) {
      if (pc.obj.DATE_DEBUT == 0) {
        pc.date1 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
        pc.date2 = pc.date1;
      } else {
        pc.date1 = moment(pc.obj.DATE_DEBUT).format("DD/MM/YYYY");
        pc.date2 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
      }


      $(win.document.body)
        .prepend('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '</td></tr></table><br/>');

      $(win.document.body)
        .prepend('<table border="1" style="width:100%; bg-color:#e0efda" >' +
          '<tr>' +
          '<th rowspan="3" style="width:30%;"><center>' + pc.NomFerme + '<center></th>' +
          '<th style="width:40%;"><center>Fiche de suivi de ramassage et destruction des fruits</center></th>' +
          '<th rowspan="3" style="width:30%;"><center>Réf</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>De ' + pc.date1 + ' à ' + pc.date2 + '</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>Liste de diffusion</center></th>' +
          '</tr>' +
          '</table><br/>'
        );
    }

    pc.excel = function(xlsx) {
      if (pc.obj.DATE_DEBUT == 0) {
        pc.date1 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
        pc.date2 = pc.date1;
      } else {
        pc.date1 = moment(pc.obj.DATE_DEBUT).format("DD/MM/YYYY");
        pc.date2 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
      }


      var sheet = xlsx.xl.worksheets['sheet1.xml'];
      $('row:first c', sheet).attr('s', '42');
      var downrows = 3;
      var clRow = $('row', sheet);
      //update Row
      clRow.each(function() {
        var attr = $(this).attr('r');
        var ind = parseInt(attr);
        ind = ind + downrows;
        $(this).attr("r", ind);
      });

      // Update  row > c
      $('row c ', sheet).each(function() {
        var attr = $(this).attr('r');
        var pre = attr.replace(/[1-9]/g, ''); //A
        var ind = parseInt(attr.replace(/[^\d.]/g, '')); //1
        ind = ind + downrows;
        $(this).attr("r", pre + ind);
      });

      function Addrow(index, data) {
        var msg = '<row r="' + index + '">';
        for (var i = 0; i < data.length; i++) {
          var key = data[i].k;
          var value = data[i].v;
          msg += '<c t="inlineStr" r="' + key + index + '">';
          msg += '<is>';
          msg += '<t>' + value + '</t>';
          msg += '</is>';
          msg += '</c>';
        }
        msg += '</row>';
        return msg;
      }

      //insert
      var r1 = Addrow(1, [{
        k: 'A',
        v: ''
      }, {
        k: 'B',
        v: 'Verger : ' + pc.NomFerme
      }, {
        k: 'C',
        v: ''
      }]);


      var r2 = Addrow(2, [{
        k: 'A',
        v: ''
      }, {
        k: 'B',
        v: ''
      }, {
        k: 'C',
        v: 'De ' + pc.date1
      }, {
        k: 'D',
        v: 'à ' + pc.date2
      }]);

      var r3 = Addrow(3, [{
        k: 'A',
        v: ''
      }, {
        k: 'B',
        v: ''
      }, {
        k: 'D',
        v: 'Mode de destruction'
      }]);

      sheet.childNodes[0].childNodes[1].innerHTML = r1 + r2 + r3 + sheet.childNodes[0].childNodes[1].innerHTML;
    }

    pc.pdf = function(doc) {
      if (pc.obj.DATE_DEBUT == 0) {
        pc.date1 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
        pc.date2 = pc.date1;
      } else {
        pc.date1 = moment(pc.obj.DATE_DEBUT).format("DD/MM/YYYY");
        pc.date2 = moment(pc.obj.DATE_FIN).format("DD/MM/YYYY");
      }

      doc.styles.title.fontSize = 9;
      doc['header'] = (function(page, pages) {
        return {
          columns: [{
              bold: true,
              fontsize: '100px',
              text: pc.NomFerme,
              alignment: 'left'
            },
            {
              bold: true,
              fontsize: '100px',
              text: 'Fiche de ramassage et destruction des fruits',
              alignment: 'center'
            },
            {
              text: [{
                  text: page.toString(),
                  italics: true
                },
                ' / ',
                {
                  text: pages.toString(),
                  italics: true
                }
              ],
              alignment: 'right'
            }
          ],
          margin: [60, 18, 80, 100]
        }
      });

      // Create a footer
      doc['footer'] = (function(page, pages) {
        return {
          columns: [{
              bold: true,
              fontsize: '100px',
              text: 'Copyright ' + pc.NomFerme,
              alignment: 'left'
            },
            {
              alignment: 'center',
              bold: true,
              text: ['Page ', {
                text: page.toString()
              }, ' / ', {
                text: pages.toString()
              }]
            },
            {
              bold: true,
              fontsize: '100px',
              text: 'BEE ONE ' + pc.YearNow,
              alignment: 'right'
            }

          ],
          margin: [10, 0]
        }
      });

      doc.content.splice(0, 0, {
        columns: [{
          alignment: 'left',
          text: '\n'
        }],
        margin: [10, 0]
      });

      doc.content.splice(0, 0, {
        columns: [{
          alignment: 'left',
          text: 'De ' + pc.date1 + ' à ' + pc.date2
        }, {
          alignment: 'right',
          text: 'Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow
        }],
        margin: [10, 0]
      });

    }

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

  });