'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteComptagepiegeagefichedesurveillanceCtrl
 * @description
 * # SanteplanteComptagepiegeagefichedesurveillanceCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteComptagepiegeagefichedesurveillanceCtrl', function($scope, $window, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, ComptagePiege, $state, DTDefaultOptions, $cookies, Cible, toastr, _url) {
    var pc = this;
    pc.dtInstance = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.MonthNow = moment().format('MM');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.ref = "";
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.createdby = "";
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Cible").selectpicker('refresh');
    }, 1000);

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }



    $q.all([Cible.getCible(_url)]).then(function(values) {
      pc.cibles = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#Cible").selectpicker('refresh');
      }, 1000);
    });


    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "YEAR": pc.YearNow,
      "MONTH": pc.MonthNow,
      "CIBLE": 0
    };

    pc.checkerforfebruary = function(yr) {
      //if true 29 Days else 28 Days
      return (yr % 400) ? ((yr % 100) ? ((yr % 4) ? false : true) : false) : true;
    }

    pc.checkNbrDays = function(month, year) {
      if (month == 2) {
        if (pc.checkerforfebruary(year)) {
          //pc._28 = true;
          pc._29 = true;
        } else {
          //pc._28 = true;
          pc._29 = false;
        }
        pc._30 = false;
        pc._31 = false;
      } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        pc._29 = true;
        pc._30 = true;
        pc._31 = true;
      } else {
        pc._29 = true;
        pc._30 = true;
        pc._31 = false;
      }
    }

    pc.getMonthName = function(month) {
      var m = "";
      switch (month) {
        case "01":
          m = "Janvier";
          break;
        case "02":
          m = "Février";
          break;
        case "03":
          m = "Mars";
          break;
        case "04":
          m = "Avril";
          break;
        case "05":
          m = "Mai";
          break;
        case "06":
          m = "Juin";
          break;
        case "07":
          m = "Juillet";
          break;
        case "08":
          m = "Août";
          break;
        case "09":
          m = "Septembre";
          break;
        case "10":
          m = "Octobre";
          break;
        case "11":
          m = "Novembre";
          break;
        case "12":
          m = "Décembre";
          break;
      }
      return m;
    }

    $scope.cible_sel = 0;
    $scope.year_sel = pc.YearNow;
    $scope.month_sel = pc.MonthNow;
    pc.checkNbrDays(pc.MonthNow, $scope.year_sel);

    pc.search = async function() {
      toastr.clear();
      pc.ref = "";
      pc.createdby = "";
      if (pc.obj.CIBLE != 0) {
        $q.all([ComptagePiege.getComptagePiegeFicheProfil(pc.obj)]).then(function(values) {
          if (values[0].data.length != 0) {
            pc.createdby = values[0].data[0].Nom + ' ' + values[0].data[0].Prenom;
          }
          pc.checkNbrDays($scope.month_sel, $scope.year_sel);
          pc.MonthNow = $scope.month_sel;
          pc.isearching = true;
          pc.dtInstance.reloadData();
        });

      } else {
        toastr.info(await translatedwords.getTranslatedWord($translate("veuillez choisir un cible !")), {
          closeButton: true
        });
      }
    }

    //by cible cultural
    $scope.cible_change = function() {

      if ($scope.cible.cible === null || $scope.cible.cible === "" || $scope.cible.cible === undefined || $scope.cible.cible === 0 || $scope.cible.cible === "0" || !$scope.cible.cible || $scope.cible.cible.length === 0) {
        $scope.cible_sel = 0;
      } else {
        $scope.cible_sel = $scope.cible.cible.ID_cible;
        pc.obj.CIBLE = $scope.cible_sel;
        pc.cibleobj = $scope.cible.cible;
      }

    };

    //by year & month
    $scope.yearmonth_change = async function() {
      toastr.clear();
      if (moment($scope.yearmonth).isValid()) {
        $scope.year_sel = moment($scope.yearmonth).format('YYYY');
        $scope.month_sel = moment($scope.yearmonth).format('MM');
        pc.obj.YEAR = $scope.year_sel;
        pc.obj.MONTH = $scope.month_sel;
      } else {
        $scope.year_sel = 0;
        $scope.month_sel = 0;
        toastr.info(await translatedwords.getTranslatedWord($translate("veuillez choisir une date valide !")), {
          closeButton: true
        });
      }

    };







    //get data and refresh datatable
    $scope.updateDataComptagePiegeFiche = function(data) {
      return ComptagePiege.getComptagePiegeFiche(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        if (pc.isearching) {
          $scope.updateDataComptagePiegeFiche(pc.obj).then(function(res) {
            defer.resolve(res.data);
            NProgress.done();
          });
        } else {
          defer.resolve([]);
        }
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
          exportOptions: {
            columns: ':visible'
            //search: 'applied',
            //order: 'applied'
          },
          text: "<i class='fa fa-copy'></i>",
          titleAttr: translatedwords.getTranslatedWord($translate("Copie"))
        },
        {
          extend: 'print',
          text: "<i class='fa fa-print'></i>",
          title: '',
          exportOptions: {
            columns: ':visible'
            //search: 'applied',
            //order: 'applied'
          },
          customize: function(win) {
            pc.printer(win);
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          pageSize: 'FOLIO',
          orientation: 'landscape',
          filename: translatedwords.getTranslatedWord($translate("Fiche de surveillance des pièges")),
          exportOptions: {
            columns: ':visible'
            //search: 'applied',
            //order: 'applied'
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
          exportOptions: {
            columns: ':visible'
            //search: 'applied',
            //order: 'applied'
          },
          customize: function(xlsx) {
            pc.excel(xlsx);
          },
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go('ComptagePiegeageMap');
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        },
        {
          text: "<i class='fa fa-list'></i>",
          action: function(e, dt, node, config) {
            $state.go("comptagePiege");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Comptage piégeage"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("N°Parcelle"))).renderWith(function(data, type, full, meta) {
        if (meta.row == 0) {
          pc.ref = full.ref.toString();
          return full.ref;
        } else {
          if (full.ref.trim() !== pc.ref.trim()) {
            pc.ref = full.ref.toString();
            return full.ref;
          } else {
            return "";
          }
        }
      }),
      DTColumnBuilder.newColumn('Code_Piege').withTitle(translatedwords.getTranslatedWord($translate("N°Piège"))).notSortable(),
      DTColumnBuilder.newColumn('Ligne').withTitle(translatedwords.getTranslatedWord($translate("Ligne"))).notSortable(),
      DTColumnBuilder.newColumn('Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))).notSortable(),
      DTColumnBuilder.newColumn('Date_Installation').withTitle(translatedwords.getTranslatedWord($translate("Date d'instalation"))).notSortable().renderWith(function(data, type, full, meta) {
        if (full.Date_Installation)
          return moment(full.Date_Installation).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('_01').withTitle('1').notSortable().renderWith(function(data, type, full, meta) {
        if (full._01 !== null)
          return full._01.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_02').withTitle('2').notSortable().renderWith(function(data, type, full, meta) {
        if (full._02 !== null)
          return full._02.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_03').withTitle('3').notSortable().renderWith(function(data, type, full, meta) {
        if (full._03 !== null)
          return full._03.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_04').withTitle('4').notSortable().renderWith(function(data, type, full, meta) {
        if (full._04 !== null)
          return full._04.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_05').withTitle('5').notSortable().renderWith(function(data, type, full, meta) {
        if (full._05 !== null)
          return full._05.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_06').withTitle('6').notSortable().renderWith(function(data, type, full, meta) {
        if (full._06 !== null)
          return full._06.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_07').withTitle('7').notSortable().renderWith(function(data, type, full, meta) {
        if (full._07 !== null)
          return full._07.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_08').withTitle('8').notSortable().renderWith(function(data, type, full, meta) {
        if (full._08 !== null)
          return full._08.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_09').withTitle('9').notSortable().renderWith(function(data, type, full, meta) {
        if (full._09 !== null)
          return full._09.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_10').withTitle('10').notSortable().renderWith(function(data, type, full, meta) {
        if (full._10 !== null)
          return full._10.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_11').withTitle('11').notSortable().renderWith(function(data, type, full, meta) {
        if (full._11 !== null)
          return full._11.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_12').withTitle('12').notSortable().renderWith(function(data, type, full, meta) {
        if (full._12 !== null)
          return full._12.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_13').withTitle('13').notSortable().renderWith(function(data, type, full, meta) {
        if (full._13 !== null)
          return full._13.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_14').withTitle('14').notSortable().renderWith(function(data, type, full, meta) {
        if (full._14 !== null)
          return full._14.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_15').withTitle('15').notSortable().renderWith(function(data, type, full, meta) {
        if (full._15 !== null)
          return full._15.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_16').withTitle('16').notSortable().renderWith(function(data, type, full, meta) {
        if (full._16 !== null)
          return full._16.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_17').withTitle('17').notSortable().renderWith(function(data, type, full, meta) {
        if (full._17 !== null)
          return full._17.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_18').withTitle('18').notSortable().renderWith(function(data, type, full, meta) {
        if (full._18 !== null)
          return full._18.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_19').withTitle('19').notSortable().renderWith(function(data, type, full, meta) {
        if (full._19 !== null)
          return full._19.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_20').withTitle('20').notSortable().renderWith(function(data, type, full, meta) {
        if (full._20 !== null)
          return full._20.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_21').withTitle('21').notSortable().renderWith(function(data, type, full, meta) {
        if (full._21 !== null)
          return full._21.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_22').withTitle('22').notSortable().renderWith(function(data, type, full, meta) {
        if (full._22 !== null)
          return full._22.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_23').withTitle('23').notSortable().renderWith(function(data, type, full, meta) {
        if (full._23 !== null)
          return full._23.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_24').withTitle('24').notSortable().renderWith(function(data, type, full, meta) {
        if (full._24 !== null)
          return full._24.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_25').withTitle('25').notSortable().renderWith(function(data, type, full, meta) {
        if (full._25 !== null)
          return full._25.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_26').withTitle('26').notSortable().renderWith(function(data, type, full, meta) {
        if (full._26 !== null)
          return full._26.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_27').withTitle('27').notSortable().renderWith(function(data, type, full, meta) {
        if (full._27 !== null)
          return full._27.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_28').withTitle('28').notSortable().renderWith(function(data, type, full, meta) {
        if (full._28 !== null)
          return full._28.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_29').withTitle('29').notSortable().renderWith(function(data, type, full, meta) {
        if (full._29 !== null)
          return full._29.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_30').withTitle('30').notSortable().renderWith(function(data, type, full, meta) {
        if (full._30 !== null)
          return full._30.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_31').withTitle('31').notSortable().renderWith(function(data, type, full, meta) {
        if (full._31 !== null)
          return full._31.toString();
        return "";
      })
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    pc.printer = function(win) {
      var cible = "";
      if (pc.cibleobj) {
        cible = pc.cibleobj.Cible;
      }

      $(win.document.body)
        .prepend('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="center"> Nombre d\'individu ( ' + pc.getMonthName(pc.MonthNow) + ' ' + pc.YearNow + ' )&nbsp;&nbsp;</td></tr></table><br/><br/><br/>');

      $(win.document.body)
        .prepend('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '&nbsp;&nbsp;</td></tr></table><br/><br/><br/>');

      $(win.document.body)
        .prepend('<table border="1" style="width:100%; bg-color:#e0efda" >' +
          '<tr>' +
          '<th rowspan="4" style="width:30%;"><center>' + pc.NomFerme + '<center></th>' +
          '<th style="width:40%;"><center>Fiche de surveillance des pièges</center></th>' +
          '<th rowspan="4" style="width:30%;"><center>Réf</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>Cible :  ' + cible + '</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>Opérateur :  ' + pc.createdby + '</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>Liste de distribution : Technicien, Gérant </center></th>' +
          '</tr>' +
          '</table><br/><br/><br/>'
        );

      $(win.document.body).css('font-size', '2px');
    }

    pc.excel = function(xlsx) {

      var cible = "";
      if (pc.cibleobj) {
        cible = pc.cibleobj.Cible;
      }

      var sheet = xlsx.xl.worksheets['sheet1.xml'];
      $('row:first c', sheet).attr('s', '42');
      var downrows = 5;
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
        v: 'Opérateur : ' + pc.createdby
      }, {
        k: 'C',
        v: ''
      }, {
        k: 'D',
        v: 'Fiche de surveillance des pièges'
      }]);

      var r3 = Addrow(3, [{
        k: 'A',
        v: ''
      }, {
        k: 'B',
        v: 'Cible : ' + cible
      }, {
        k: 'D',
        v: 'Liste de distribution : Technicien, Gérant'
      }]);

      var r4 = Addrow(4, [{
        k: 'A',
        v: ''
      }]);

      var r5 = Addrow(5, [{
        k: 'C',
        v: 'Cordonnés'
      }, {
        k: 'F',
        v: 'Nombre d\'individu ( ' + pc.getMonthName(pc.MonthNow) + ' ' + pc.YearNow + ' )'
      }]);

      sheet.childNodes[0].childNodes[1].innerHTML = r1 + r2 + r3 + r4 + r5 + sheet.childNodes[0].childNodes[1].innerHTML;
    }

    pc.pdf = function(doc) {

      var cible = "";
      if (pc.cibleobj) {
        cible = pc.cibleobj.Cible;
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
              text: 'Fiche de surveillance des piègess',
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
          text: 'Nombre d\'individu ( ' + pc.getMonthName(pc.MonthNow) + ' ' + pc.YearNow + ' )'
        }, {
          alignment: 'right',
          text: 'Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow
        }],
        margin: [10, 0]
      });

      doc.content.splice(0, 0, {
        columns: [{
          alignment: 'left',
          text: 'cible : ' + cible
        }],
        margin: [10, 0]
      });

      doc.content.splice(0, 0, {
        columns: [{
          alignment: 'left',
          text: 'Opérateur : ' + pc.createdby
        }],
        margin: [10, 0]
      });

      doc.content.splice(0, 0, {
        columns: [{
          alignment: 'center',
          text: 'Liste de distribution : Technicien, Gérant'
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