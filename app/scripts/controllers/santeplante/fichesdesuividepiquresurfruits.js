'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteFichesdesuividepiquresurfruitsCtrl
 * @description
 * # SanteplanteFichesdesuividepiquresurfruitsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteFichesdesuividepiquresurfruitsCtrl', function($scope, translatedwords, DTOptionsBuilder, $window, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, piquressurfruits, $state, DTDefaultOptions, $cookies, parcellecultural, toastr, savefilter) {
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
    $scope.updateDataPiqueSurFruitsFiche = function(data) {
      return piquressurfruits.getByFiltreFiche(data);
    };



    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataPiqueSurFruitsFiche(pc.obj).then(function(res) {
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
      .withOption('order', false)
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
          className: 'custom-dt-print',
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer"))
        },
        {
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          //pageSize: 'A4',
          orientation: 'landscape',
          filename: translatedwords.getTranslatedWord($translate("Fiches de suivi des piqûres sur fruits")),
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
            $state.go("piquressurfruits");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Piqûres sur fruits"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("N° Parcelle culturale"))).notSortable().renderWith(function(data, type, full, meta) {
        if (meta.row == 0) {
          pc.ref = full.ref.toString();
          return full.ref;
        } else {
          if (full.ref.trim() !== pc.ref.trim()) {
            pc.ref = full.ref.toString();
            return full.ref;
          } else {
            return "<p style='display:none;'>" + full.ref + "</p>";
          }
        }
      }),
      DTColumnBuilder.newColumn('Num_Arbre').withTitle(translatedwords.getTranslatedWord($translate("N° Arbre"))).notSortable(),
      DTColumnBuilder.newColumn('_33').withTitle('33').notSortable().renderWith(function(data, type, full, meta) {
        if (full._33 !== null)
          return full._33.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_34').withTitle('34').notSortable().renderWith(function(data, type, full, meta) {
        if (full._34 !== null)
          return full._34.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_35').withTitle('35').notSortable().renderWith(function(data, type, full, meta) {
        if (full._35 !== null)
          return full._35.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_36').withTitle('36').notSortable().renderWith(function(data, type, full, meta) {
        if (full._36 !== null)
          return full._36.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_37').withTitle('37').notSortable().renderWith(function(data, type, full, meta) {
        if (full._37 !== null)
          return full._37.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_38').withTitle('38').notSortable().renderWith(function(data, type, full, meta) {
        if (full._38 !== null)
          return full._38.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_39').withTitle('39').notSortable().renderWith(function(data, type, full, meta) {
        if (full._39 !== null)
          return full._39.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_40').withTitle('40').notSortable().renderWith(function(data, type, full, meta) {
        if (full._40 !== null)
          return full._40.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_41').withTitle('41').notSortable().renderWith(function(data, type, full, meta) {
        if (full._41 !== null)
          return full._41.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_42').withTitle('42').notSortable().renderWith(function(data, type, full, meta) {
        if (full._42 !== null)
          return full._42.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_43').withTitle('43').notSortable().renderWith(function(data, type, full, meta) {
        if (full._43 !== null)
          return full._43.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_44').withTitle('44').notSortable().renderWith(function(data, type, full, meta) {
        if (full._44 !== null)
          return full._44.toString();
        return "";
      }),
      DTColumnBuilder.newColumn('_45').withTitle('45').notSortable().renderWith(function(data, type, full, meta) {
        if (full._45 !== null)
          return full._45.toString();
        return "";
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
          '<th style="width:40%;"><center>Fiches de suivi des piqûres sur fruits</center></th>' +
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
        k: 'C',
        v: 'Nombre de Fruits infectes / Semaines'
      }, {
        k: 'M',
        v: ''
      }, {
        k: 'O',
        v: ''
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
              text: 'Fiches de suivi des piqûres sur fruits',
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