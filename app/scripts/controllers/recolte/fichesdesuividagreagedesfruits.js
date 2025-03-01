'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:RecolteFichesdesuividagreagedesfruitsCtrl
 * @description
 * # RecolteFichesdesuividagreagedesfruitsCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('RecolteFichesdesuividagreagedesfruitsCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, AgreageFruit, $state, DTDefaultOptions, $cookies, parcellecultural, toastr) {
    var pc = this;
    pc.dtInstance = {};
    pc.IDFerme = $cookies.getObject('beeoneAssistant').ferme.IDFerme;
    pc.NomFerme = $cookies.getObject('beeoneAssistant').ferme.NomFerme;
    pc.YearNow = moment().format('YYYY');
    pc.DateNow = moment().format('DD/MM/YYYY');
    pc.TimeNow = moment().format('HH:mm');
    pc.date1 = "";
    pc.date2 = "";
    pc.ref = "";
    $scope.detailsAgreages = []
    $scope.organiseAgreage = function(data) {}
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Parcelle").selectpicker('refresh');
    }, 1000);

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
      "DATE_DEBUT": 20060101,
      "PARCELLE_CULTURAL": [0],
      "DATE_FIN": moment($scope.date_fin).format('YYYYMMDD')
    };

    $scope.parcelle_sel = [0];
    $scope.date_debut_sel = 0;
    $scope.date_fin_sel = moment($scope.date_fin).format('YYYYMMDD');

    pc.search = function() {
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
    };

    //by date_fin
    $scope.date_fin_change = function() {
      if ($scope.date_fin === null || $scope.date_fin === "" || $scope.date_fin === undefined || $scope.date_fin === 0 || $scope.date_fin === "0" || !$scope.date_fin || $scope.date_fin.length === 0) {
        $scope.date_fin_sel = 0;
      } else {
        $scope.date_fin_sel = $scope.date_fin;
      }
      pc.obj.DATE_FIN = moment($scope.date_fin_sel).format('YYYYMMDD');
    };

    //get data and refresh datatable
    $scope.updateDataAgreageFruitsFiche = function(data) {
      return AgreageFruit.getAgreageFruitFiche(data);
    };

    $scope.table = []
    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        AgreageFruit.getAllDetailVueAgreageFruit(pc.obj).then(function(result) {
          defer.resolve(result.data);
          NProgress.done();
        })
        return defer.promise;
      })

      .withOption('deferRender', true)
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [])
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
          titleAttr: translatedwords.getTranslatedWord($translate("Imprimer")),
          title: '',
          customize: function(win) {
            pc.printer(win);
          }
        },
        {
          extend: 'pdfHtml5',
          text: "<i class='fa fa-file-pdf-o'></i>",
          //pageSize: 'A4',
          orientation: 'landscape',
          filename: translatedwords.getTranslatedWord($translate("Fiche de suivi d'agréage des fruits")),
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
            $state.go("agreagefruitOld");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Agréage des fruits"))
        }
      ]);
    /*
      Campagne: "undefined"
Conformite: "Conforme"
CreatedBy: "null null"
DateCreated: "2020-12-06T00:00:00.000Z"
Date_Agriage: "2020-12-26T00:00:00.000Z"
Date_Recolte: "2020-12-20T00:00:00.000Z"
Etat: 1
ID: 8
ID_Ferme: 10002
ID_ParcelleCulturale: 281474976710904
ID_Profil: 1
Nbr_Caisse: 15
Ref: "PC3"
Ref_Bon_Livraison: "45"
TimeCreated: "13:22"
cible: "Acarien rouge↵"
culture: 281474976720662
dateCreatedMobile: "2020-12-06T00:00:00.000Z"
id_detail: 38
maladie_id: 58
maladie_value: 25
nom_culture: "CULTURE15"
sup: 1
variete: 281474976720678
      */
    pc.dtColumns = [
      DTColumnBuilder.newColumn('Date_Agriage').withTitle(translatedwords.getTranslatedWord($translate("Date d'agréage"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Agriage).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Date_Recolte').withTitle(translatedwords.getTranslatedWord($translate("Date de récolte"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Recolte).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle"))),
      DTColumnBuilder.newColumn('nom_culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Conformite').withTitle(translatedwords.getTranslatedWord($translate("Conformité"))),
      DTColumnBuilder.newColumn('Nbr_Caisse').withTitle(translatedwords.getTranslatedWord($translate("Nombre de caisses"))),
      DTColumnBuilder.newColumn('cible').withTitle(translatedwords.getTranslatedWord($translate("Inconformité"))),
      DTColumnBuilder.newColumn('maladie_value').withTitle(translatedwords.getTranslatedWord($translate("Pourcentage"))),
      DTColumnBuilder.newColumn('Ref_Bon_Livraison').withTitle(translatedwords.getTranslatedWord($translate("Bon de livraison")))
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
          '<th style="width:40%;"><center>Fiche de suivi d\'agréage des fruits</center></th>' +
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
        k: 'F',
        v: 'Controle phytosanitaire'
      }, {
        k: 'L',
        v: 'Résultat du contrôle'
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
              text: 'Fiche de suivi d\'agréage des fruits',
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