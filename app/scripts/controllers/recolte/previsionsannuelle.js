'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionsannuelleCtrl
 * @description
 * # PrevisionsannuelleCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionsannuelleCtrl', function($scope, $translatePartialLoader, translatedwords, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, parcellecultural, DTDefaultOptions, $mdDialog, $interval, societe, campagneagricole, domaine, modalAddPrevisionAnnuel, PeriodeEstimation, VarieteService, _url, $filter) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};
    var heightOfTable = $(window).height() - ($("#filter_form").height() * 2) - 40;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    pc.societes = [];

    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);



    $scope.showAdvanced = function(ev) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: '././views/templates/prevision/UploadFromExcelPrevisionAnnyelle.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog) {
      $scope.societes = pc.societes;
      $scope.domaines = pc.domaines;
      $scope.parcelles = pc.parcelles;

      $scope.onFileClick = function(obj, idx) {};
      $scope.onFileRemove = function(obj, idx) {};
      $scope.onSubmitClick = function(files) {};

      $scope.getIdsociete = function(data) {
        var idSociete = [];
        var checkSociete = false;
        angular.forEach(data, function(mydata) {
          checkSociete = false;
          var Societe = mydata.Societe;

          angular.forEach($scope.societes, async function(mydatasocietes) {
            if (mydatasocietes.Rais_Social == Societe) {
              idSociete.push(mydatasocietes.ID);
              checkSociete = false;
            } else {
              checkSociete = true;
            }
          });

        });

        return idSociete;
      }

      $scope.getIdfermes = function(data) {
        var idFerme = [];
        angular.forEach(data, function(mydata) {
          var Ferme = mydata.Ferme;
          angular.forEach($scope.domaines, function(mydataferme) {
            if (mydataferme.Nom == Ferme) {
              idFerme.push(mydataferme.IDFermes);
            }
          });
        });
        return idFerme;
      }

      $scope.getIdParcelles = function(data) {
        var idParcelle = [];
        angular.forEach(data, function(mydata) {
          var Parcelle = mydata.Parcelle;
          var Ferme = mydata.Ferme;
          angular.forEach($scope.parcelles, function(mydataparcelle) {
            if (mydataparcelle.Reference == Parcelle && mydataparcelle.Nom == Ferme) {
              idParcelle.push(mydataparcelle.ID);
            }
          });
        });
        return idParcelle;
      }

      function ProcessExcel(data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
          type: 'binary'
        });

        /*workbook.SheetNames.forEach(function(sheetName) {})*/
        var sheetName = workbook.SheetNames[0];

        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        var json_object = JSON.stringify(XL_row_object);
        //delete \n
        var json_object_n = json_object.split("///\\\\\\n").join("");
        //delete spaces
        var json_object_spaceleft = json_object_n.split('" ').join('"');
        var json_object_spaceright = json_object_spaceleft.split(' "').join('"');
        $scope.xlsxdata = JSON.parse(json_object_spaceright);

        if ($scope.xlsxdata.length > 0) {

          if ('Societe' in $scope.xlsxdata[0] && 'Ferme' in $scope.xlsxdata[0] && 'Parcelle' in $scope.xlsxdata[0] && 'PeriodeEstimation' in $scope.xlsxdata[0] && 'Quantite' in $scope.xlsxdata[0]) {

          } else {

          }
        } else {

        }



        //Fetch the name of First Sheet.
        /*var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);


        //Add the data rows from Excel file.
        for (var i = 0; i < excelRows.length; i++) {

        }*/
      };

      $scope.DownloadModele = function() {
        window.location.assign('././views/modelexls/Model_Pevisions_Annuelle.xlsx');
      };

      $scope.Annuler = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Ajouter = function() {
        //$mdDialog.cancel();document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
        var fileUpload = $("#fileInput")[0];

        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;


        if (typeof(FileReader) != "undefined") {
          var reader = new FileReader();

          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function(e) {
              ProcessExcel(e.target.result);
            };

            reader.readAsBinaryString(fileUpload.files[0]);
          } else {
            //For IE Browser.
            reader.onload = function(e) {
              var data = "";
              var bytes = new Uint8Array(e.target.result);
              for (var i = 0; i < bytes.byteLength; i++) {
                data += String.fromCharCode(bytes[i]);
              }
              ProcessExcel(data);
            };
            reader.readAsArrayBuffer(fileUpload.files[0]);
          }
        } else {
          alert("This browser does not support HTML5.");
        }

      };
    }

    pc.obj = {
      "ID_Societe": 0,
      "CAMPAGNE": "",
      "DOMAINE": 1,
      "PARCELLE": [0],
      "ID_PERIODE": 0,
      "VARIETE": [0]
    };
    pc.filterWithItems = {
      societe: -1
    };

    $q.all([societe.getSociete(_url),
      domaine.getDomaine()
    ]).then((values) => {
      pc.societes = values[0].data;
      if (pc.societes.length) {
        pc.filterWithItems.societe = pc.societes[0].ID;
        campagneagricole.getCampagneAgricoleByIDSociete(pc.societes[0].ID).then(e => {
          pc.compagne_array = e.data;
          pc.domaines = values[1].data;
          if (pc.domaines.length) {
            $q.all([VarieteService.getVarieteByFarm({
              idferme: pc.domaines[0].IDFermes
            }), parcellecultural.getParcelleCulturalByFerme(pc.domaines[0].IDFermes)]).then(e => {
              pc.variete_array = e[0].data;
              pc.parcelles_array = e[1].data;
              angular.forEach(pc.compagne_array, function(value, key) {
                if (moment().isBetween(moment(value.Date_debut).subtract(1, 'd'), moment(value.Date_Fin).add(1, 'd'))) {
                  pc.current_campagne = value.Code;
                  setTimeout(function() {
                    pc.obj.ID_Societe = pc.societes[0].ID;
                    pc.obj.CAMPAGNE = pc.current_campagne;
                    pc.obj.DOMAINE = pc.domaines[0].IDFermes;
                    $('#Societe').selectpicker('val', pc.societes[0].ID);
                    $('#Domaine').selectpicker('val', pc.domaines[0].IDFermes);
                    $('#compagne').selectpicker('val', pc.current_campagne);
                    $(".selectpicker").selectpicker('refresh');
                  }, 1000);

                  NProgress.done();
                }
              });
            });
          }
          NProgress.done();
        });

      }
    });

    pc.societe_change = function() {
      var societe = $scope.societe;
      if (validateInput(societe))
        societe = 0;
      pc.obj.ID_Societe = societe;
      pc.variete_array = [];
      pc.parcelles_array = [];
      pc.filterWithItems.societe = societe;
      setTimeout(function() {
        $("#Domaine").selectpicker('refresh');
        $("#parcelle").selectpicker('refresh');
        $("#variete").selectpicker('refresh');
      }, 1000);
      //load variety
    };

    pc.domaine_change = function() {
      var domaine = $scope.domaine;
      if (validateInput(domaine))
        domaine = 0;
      pc.obj.DOMAINE = domaine;

      $q.all([VarieteService.getVarieteByFarm({
        idferme: pc.obj.DOMAINE
      }), parcellecultural.getParcelleCulturalByFerme(pc.obj.DOMAINE)]).then(e => {
        pc.variete_array = e[0].data;
        pc.parcelles_array = e[1].data;
        setTimeout(function() {
          $("#parcelle").selectpicker('refresh');
          $("#variete").selectpicker('refresh');
        }, 1000);
        NProgress.done();
      });
    }

    pc.compagne_change = function() {
      var compagne = $scope.compagne;
      if (validateInput(compagne))
        compagne = 0;
      pc.obj.CAMPAGNE = compagne;
    }

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.load = () => {
      pc.dtInstance.reloadData();
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        PeriodeEstimation.getEstimationAnnuelle(pc.obj).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].DateCreated = moment(result.data[i].DateCreated).format('YYYY-MM-DD');
            result.data[i].DateModification = moment(result.data[i].DateModification).format('YYYY-MM-DD');
            result.data[i].Date_Saisie = moment(result.data[i].Date_Saisie).format('YYYY-MM-DD');
          }
          defer.resolve(result.data);
        });
        NProgress.done();
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
      .withOption('responsive', true)
      .withScroller()
      .withLanguage($.getJSON(`/scripts/i18n/datatable/${$window.localStorage.getItem("lang").toLowerCase()}.json`, function(data) {
        return data
      }))
      .withOption('scrollY', heightOfTable)

      .withButtons([{
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            //$scope.showAdvancedAdd();
            modalAddPrevisionAnnuel.showModal({
              test: "HIII",
              reload: pc.load
            });
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
        },
        {
          text: "<i class='fa fa-upload'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            $scope.showAdvanced("ev");
          },
          className: 'pull-left',
          titleAttr: translatedwords.getTranslatedWord($translate("Importation excel"))
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
      DTColumnBuilder.newColumn('CodePeriode').withTitle(translatedwords.getTranslatedWord($translate("Période"))),
      DTColumnBuilder.newColumn('Date_Saisie').withTitle(translatedwords.getTranslatedWord($translate("Date de saisie"))),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Qauntite').withTitle(translatedwords.getTranslatedWord($translate("Quantité"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + $filter('numberwithspace')(full.Qauntite) + ' Kg</p>';
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
    };

    //by parcelle cultural
    pc.variete_change = function() {

      var variete = $scope.variete.variete;

      if (validateInput(variete) || $scope.variete.variete.length === 0 || $scope.variete.variete.includes(0))
        variete = [0];
      pc.obj.VARIETE = variete;
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });