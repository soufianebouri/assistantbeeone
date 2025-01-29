'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteFichesdesuividechangementpheromoneCtrl
 * @description
 * # SanteplanteFichesdesuividechangementpheromoneCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteFichesdesuividechangementpheromoneCtrl', function($scope, $window, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, changementpheromone, $state, DTDefaultOptions, $cookies, ParcellePhysique, toastr, _url) {
    var pc = this;
    pc.dtInstance = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('globals').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
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



    $q.all([ParcellePhysique.getAllParcellePhysique(_url, pc.IDFerme)]).then(function(values) {
      pc.parcellephysiques = values[0].data;
      NProgress.done();
      NProgress.remove();
      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });


    pc.obj = {
      "DOMAINE": pc.IDFerme,
      "PARCELLE": [null]
    };

    $scope.parcelle_sel = [0];

    pc.search = function() {
      pc.ref = "";
      pc.isearching = true;
      pc.dtInstance.reloadData();
    }

    //by parcelle cultural
    $scope.parcelle_change = function() {

      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE = $scope.parcelle_sel;

    };


    //get data and refresh datatable
    $scope.updateDataChangementPheroFiche = function(data) {
      return changementpheromone.getByFiltreFiche(data);
    };


    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        if (pc.isearching) {
          $scope.updateDataChangementPheroFiche(pc.obj).then(function(res) {
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
          filename: translatedwords.getTranslatedWord($translate("Fiches de suivi de changement de phéromone")),
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
            $state.go("changementpheromone");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Changement des phéromones"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('ref').withTitle(translatedwords.getTranslatedWord($translate("N° Parcelle physique"))).notSortable().renderWith(function(data, type, full, meta) {
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
      DTColumnBuilder.newColumn('Code_Piege').withTitle(translatedwords.getTranslatedWord($translate("N° Piège"))).notSortable(),
      DTColumnBuilder.newColumn('Date_Installation').withTitle(translatedwords.getTranslatedWord($translate("Date d'instalation du piége"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Installation)
          return moment(full.Date_Installation).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_1').withTitle(translatedwords.getTranslatedWord($translate("Date 1°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_1)
          return moment(full.dtc_1).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_2').withTitle(translatedwords.getTranslatedWord($translate("Date 2°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_2)
          return moment(full.dtc_2).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_3').withTitle(translatedwords.getTranslatedWord($translate("Date 3°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_3)
          return moment(full.dtc_3).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_4').withTitle(translatedwords.getTranslatedWord($translate("Date 4°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_4)
          return moment(full.dtc_4).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_5').withTitle(translatedwords.getTranslatedWord($translate("Date 5°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_5)
          return moment(full.dtc_5).format('DD/MM/YYYY');
        return "";
      }).notSortable(),
      DTColumnBuilder.newColumn('dtc_6').withTitle(translatedwords.getTranslatedWord($translate("Date 6°changement"))).renderWith(function(data, type, full, meta) {
        if (full.dtc_6)
          return moment(full.dtc_6).format('DD/MM/YYYY');
        return "";
      }).notSortable()
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');



    pc.printer = function(win) {

      win.open();
      $(win.document.body)
        .prepend('<table border="1" style="background:#e0efda;right: 0;width:100%" ><tr><td align="right">Imprimé le ' + pc.DateNow + ' à ' + pc.TimeNow + '</td></tr></table><br/>');

      $(win.document.body)
        .prepend('<table border="1" style="width:100%; bg-color:#e0efda" >' +
          '<tr>' +
          '<th rowspan="2" style="width:30%;"><center>' + pc.NomFerme + '<center></th>' +
          '<th style="width:40%;"><center>Fiches de suivi de changement de phéromone</center></th>' +
          '<th rowspan="2" style="width:30%;"><center>Réf</center></th>' +
          '</tr>' +
          '<tr>' +
          '<th style="width:40%;"><center>Liste de diffusion</center></th>' +
          '</tr>' +
          '</table><br/>'
        );
    }

    pc.excel = function(xlsx) {


      var sheet = xlsx.xl.worksheets['sheet1.xml'];
      $('row:first c', sheet).attr('s', '42');
      var downrows = 2;
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
        k: 'D',
        v: 'Suivi de changement de phéromone,DDVP,Attractant des Femelle'
      }, {
        k: 'M',
        v: ''
      }, {
        k: 'O',
        v: ''
      }]);

      sheet.childNodes[0].childNodes[1].innerHTML = r1 + r2 + sheet.childNodes[0].childNodes[1].innerHTML;
    }

    pc.pdf = function(doc) {

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
              text: 'Fiches de suivi de changement de phéromone',
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