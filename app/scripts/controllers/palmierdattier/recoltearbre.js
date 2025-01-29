'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PalmierdattierRecoltearbreCtrl
 * @description
 * # PalmierdattierRecoltearbreCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PalmierdattierRecoltearbreCtrl', function($scope, DTOptionsBuilder, savefilter, translatedwords, $http, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, toastr, recolteArbre, $state, $cookies, parcellecultural, DTDefaultOptions, $mdDialog) {

    //alert();
    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    $scope.RecolteArbreAction = {};
    pc.dtInstance = {};
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());


    var permission_data = JSON.parse($window.localStorage.getItem('permission'));
    var permission = {
      modules_array: permission_data[0],
      rubriques_array: permission_data[1],
      sous_modules_array: permission_data[2]
    }

    pc.isAdmin = $cookies.getObject('globals').currentUser.isAdmin;
    pc.idUser = $cookies.getObject('globals').currentUser.ID;


    var opsemisAccess = _.filter(permission.sous_modules_array, {
      ss_module: 'Recolte_Arbre'
    });

    $scope.canIAction = () => {
      if (pc.isAdmin)
        return {
          add: true,
          update: true,
          delete: true
        }
      return {
        add: opsemisAccess[0].a,
        update: opsemisAccess[0].u,
        delete: opsemisAccess[0].d
      }
    }

    pc.obj = {
      "DOMAINE": [$cookies.getObject('globals').ferme.IDFerme],
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD'),
      page: {
        page: 0,
        pages: 0,
        start: 0,
        end: 10,
        length: 10,
        recordsTotal: 0,
        recordsDisplay: 0,
        serverSide: true
      },
      searchText: '',
      columnlastSort: [0, 'asc']
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $q.all([parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme)]).then((values) => {
      pc.parcelles_array = values[0].data;


      setTimeout(function() {
        $(".selectpicker").selectpicker('refresh');
      }, 1000);
    });

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


    pc.dtOptions = DTOptionsBuilder.newOptions()
      .withOption('ajax', function(data, callback, settings, cols) {
        // make an ajax request using data.start and data.length
        //if (settings.aoData.length > 0) {
        var api = this.api();
        var pgNo = api.page.info();

        var currPg = pgNo.page;
        var totalPg = pgNo.pages;
        // get the label where i need to print the page number details
        var myEl = angular.element(document.querySelector('#pgNoDetail'));
        pc.obj.page = pgNo;

        var columnlastSort = settings.aaSorting[0];
        pc.obj.columnlastSort = (columnlastSort != 0) ? columnlastSort : [0, 'asc'];

        //  }

        pc.obj.searchText = document.querySelector('.dataTables_filter input').value;
        NProgress.start();
        $http({
          method: 'POST',
          url: recolteArbre.getTreesForDatatable(),
          data: pc.obj
        }).then(function(res) {
          callback({
            recordsTotal: res.data.recordsTotal,
            recordsFiltered: res.data.recordsFiltered,
            data: res.data.data
          });
          NProgress.done();
        });

      })
      .withDataProp('data')
      .withOption('processing', false) //for show progress bar
      .withOption('serverSide', true) // for server side processing
      .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers
      .withDisplayLength(10)
      .withOption('lengthMenu', [10, 50, 100, 200])
      .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))

      .withButtons([{
          text: "<i class='fa fa-clone'></i>",
          className: 'pull-left',
          action: function(e, dt, node, config) {
            if (pc.isAdmin) {
              $state.go("recoltearbre_check_dulication");
            } else {
              toastr.clear();
              toastr.warning("Malheureusement, vous n'avez pas le droit d'accéder !", {
                closeButton: true
              });
            }
          },
          titleAttr: "Détecteur de duplication"
        },
        {
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL',
          customizeData: function(d) {
            var exportBody = GetDataToExport();
            d.body.length = 0;
            d.body.push.apply(d.body, exportBody);
            NProgress.done();
          }
        },
        {
          text: "<i class='fa fa-map-marker'></i>",
          action: function(e, dt, node, config) {
            $state.go("recoltearbremap");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue cartographique"))
        },
        {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("recoltearbregraphique");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Vue graphique"))
        }, {
          text: "<i class='fa fa-qrcode'></i>",
          action: function(e, dt, node, config) {
            pc.openQrDialog();
          },
          titleAttr: "QR CODE"
        }
      ]);


    function GetDataToExport() {
      var jsonResult = $.ajax({
        url: recolteArbre.getURLALLTreesByFiltre(),
        data: pc.obj,
        method: 'POST',
        success: function(result) {},
        async: false
      });
      var exportBody = jsonResult.responseJSON;
      return exportBody.map(function(el) {
        return Object.keys(el).map(function(key) {
          if (key == 'Statut') {
            return (el[key]) ? 'Archivée' : 'En cours'
          } else if (key == 'DateCreated') {
            return moment(el[key]).format('DD/MM/YYYY')
          } else {
            return el[key]
          }
        });
      });
    }


    pc.openQrDialog = function() {
      $mdDialog.show({
          controller: DialogControllerAdd,
          templateUrl: '././views/templates/recolte/AddQrCode.html',
          parent: angular.element(document.body),
          targetEvent: "ev",
          clickOutsideToClose: false
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });

    }




    function DialogControllerAdd($scope, $mdDialog) {
      $scope.allowed = true;
      $scope.generating = false;
      $scope.idUser = pc.idUser
      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };
      $scope.Generer = function() {
        if ($scope.nbrCaisse > 0) {
          $scope.generating = true;
          setTimeout($scope.generatePdf, 4000)

        }
      };

      $scope.dateQr = null;
      $scope.changenbrCaisse = function() {
        $scope.dateQr = moment().format('DDMMYYYYHHmmss');
      }

      $scope.console = function(index) {}

      $scope.generatePdf = function() {
        //alert(expeditionByID);
        var type = "";
        var dateFeri = "";

        var w = 1000;
        var h = 1000;
        var left = Number((screen.width / 2) - (w / 2));
        var tops = Number((screen.height / 2) - (h / 2));

        var mywindow = window.open('_self', 'PRINT', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + tops + ', left=' + left, '');

        //window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        mywindow.document.write('<html><head><title></title>');
        mywindow.document.write('</head><body ><center>QR CODE</center>');

        mywindow.document.write('<br/>');
        mywindow.document.write(document.getElementById("printeable").innerHTML);



        //mywindow.document.write(document.getElementById("sss").innerHTML);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();

        return true;
      }

      //from px to cm plz check this https://everythingfonts.com/font/tools/units/cm-to-px
      $scope.generateQr = function(b, id) {
        $('#' + id).html("");
        new QRCode(id, {
          text: $scope.formatQrText(b),
          /*width: 37.795276,
          height: 37.795276,*/
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L
        });
      }

      $scope.printExcel = (e) => {

        $("#refQr").table2excel({
          filename: "Références QR-Code - " + $scope.dateQr + ".xls",
          preserveColors: true
        });
      };


      $scope.formatQrText = function(index) {
        var c = "";
        return c.concat(index, $scope.dateQr, pc.idUser);
      }
    }





    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        if (full.DateCreated)
          return moment(full.DateCreated).format('DD/MM/YYYY');
        return "";
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Quantite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))),
      DTColumnBuilder.newColumn('Code_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))),
      DTColumnBuilder.newColumn('Nom').withTitle(translatedwords.getTranslatedWord($translate("Ouvrier"))).renderWith(function(data, type, full, meta) {
        return full.Nom + " " + full.Prenom;
      }),
      DTColumnBuilder.newColumn('QR_caisse').withTitle(translatedwords.getTranslatedWord($translate("Qr Caisse"))),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        $scope.RecolteArbreAction[data.ID] = data;
        var deletebtn = ($scope.canIAction().delete) ? '<button class="btn btn-danger btn-xs" title="Supprimer" onclick="angular.element(this).scope().delete(' + full.ID + ')" ng-click="" )"=""><i class="fa fa-trash-o"></i></button>' : '';
        return deletebtn;
      }).withOption('width', '8%').withClass('nowraptd all')
    ];

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');


    $scope.delete = async function(c) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            recolteArbre.deleteweb({
              ID: c
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
      return '<button class="btn btn-warning btn-xs" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };
    //starting date change listner
    pc.date_debut_change = function() {

      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
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
      savefilter.setFilters(pc.obj);
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}


    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });