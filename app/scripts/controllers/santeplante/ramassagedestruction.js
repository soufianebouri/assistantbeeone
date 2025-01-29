'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:SanteplanteRamassagedestructionCtrl
 * @description
 * # SanteplanteRamassagedestructionCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('SanteplanteRamassagedestructionCtrl', function($scope, DTOptionsBuilder, translatedwords, $window, $translatePartialLoader, $translate, DTColumnBuilder, $q, $compile, $mdDialog, campagneagricole, toastr, RamassageDestruction, parcellecultural, $state, $cookies, DTDefaultOptions, savefilter) {


    var pc = this;
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.dtInstance = {};
    pc.Ramassageaction = {};
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.obj = {
      "STANDARD": true,
      "DOMAINE": [pc.IDFerme],
      "PARCELLE": [0],
      "DATE_DEBUT": 0,
      "DATE_FIN": moment().format('YYYYMMDD')
    };

    //check saved filter
    if (!angular.equals(savefilter.getFilters(), {})) {
      pc.obj.DATE_DEBUT = savefilter.getFilters().DATE_DEBUT;
      pc.obj.DATE_FIN = savefilter.getFilters().DATE_FIN;

      $scope.date_debut = moment(pc.obj.DATE_DEBUT, 'YYYY-MM-DD').toDate();
      $scope.date_fin = moment(pc.obj.DATE_FIN, 'YYYY-MM-DD').toDate();
    }

    $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme)]).then((values) => {
      pc.parcelles_array = values[0].data;
      NProgress.done();
      NProgress.remove();
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

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        RamassageDestruction.getRamassage(pc.obj).then(function(result) {
          pc.obj.STANDARD = false;
          defer.resolve(result.data);
          NProgress.done();
        });
        return defer.promise;
      })
      .withDOM('<lf<t>ip>')
      .withPaginationType('simple_numbers')
      .withDisplayLength(10)
      .withOption('createdRow', createdRow)
      .withOption('headerCallback', headerCallback)
      .withOption('order', [0, 'asc'])
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
        },
        {
          text: "<i class='fa fa-reorder'></i>",
          action: function(e, dt, node, config) {
            $state.go("fichesdesuiviramassageetdestructiondesfruits");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Fiches de ramassage et destruction des fruits"))
        }
      ]);

    DTDefaultOptions.setLoadingTemplate('<br/><br/><br/><br/><center><img src="././images/loading.gif"/></center>');

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('dateramassage').withTitle(translatedwords.getTranslatedWord($translate("Date de ramassage"))).renderWith(function(data, type, full, meta) {
        return moment(full.dateramassage).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Date_Destruction').withTitle(translatedwords.getTranslatedWord($translate("Date de destruction"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Destruction).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Decharge').withTitle(translatedwords.getTranslatedWord($translate("Déchargement"))).renderWith(function(data, type, full, meta) {
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
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Actions"))).renderWith(function(data, type, full, meta) {
        pc.Ramassageaction[data.ID] = data;
        return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.Ramassageaction[ ' + data.ID + '])"><i class="fa fa-edit"></i></button>&nbsp;' +
          '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.Ramassageaction[' + data.ID + '])" )"=""><i class="fa fa-trash-o"></i></button>';
      }).withOption('width', '5%').withClass('nowraptd all')
    ];


    //Modifer
    pc.edit = function(data) {

      $q.all([parcellecultural.ShowByDomaineEncours(pc.IDFerme)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.data);
      });


    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/suiviRamassage/EditRamassage.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          locals: {
            ParcelleCulturale: ParcelleCulturale,
            data: data
          }
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogControllerEdit($scope, $mdDialog, ParcelleCulturale, data) {
      $scope.ParcelleCulturale = ParcelleCulturale;
      $scope.data = data;
      $scope.datedecreation = new Date(moment($scope.data.DateCreated).format("YYYY-MM-DD"));
      $scope.datededestruction = new Date(moment($scope.data.Date_Destruction).format("YYYY-MM-DD"));
      $scope.datederamassage = new Date(moment($scope.data.dateramassage).format("YYYY-MM-DD"));

      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.ID_ParcelleCulturale;
        }
      }

      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Annuler = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.Modifier = async function() {
        toastr.clear();
        $scope.onUpdate();
        $scope.mydatedecreation = moment($scope.datedecreation).format('YYYYMMDD');
        $scope.mydatededestruction = moment($scope.datededestruction).format('YYYYMMDD');
        $scope.mydatederamassage = moment($scope.datederamassage).format('YYYYMMDD');

        if ($scope.parcelleculturale && $scope.datedecreation && $scope.datededestruction && $scope.datederamassage) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              RamassageDestruction.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "datededestruction": $scope.mydatededestruction,
                "deteramassage": $scope.mydatederamassage,
                "parcelleculturale": $scope.parcelleculturale,
                "Decharge": $scope.data.Decharge,
                "Enfouissement": $scope.data.Enfouissement,
                "Incineration": $scope.data.Incineration,
                "Code_compagne": result.data[0].Code_compagne
              }).then(async function(res) {
                NProgress.done();
                pc.resedit = res.data;
                if (pc.resedit[0].message == 'ajout reussi') {
                  toastr.clear();
                  toastr.info(await translatedwords.getTranslatedWord($translate("Modification réussie")), {
                    closeButton: true
                  });
                  $mdDialog.hide();
                  document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
                  pc.dtInstance.reloadData();
                  $scope.progress = false;
                } else {
                  toastr.clear();
                  toastr.error(await translatedwords.getTranslatedWord($translate("an error occured ")) + res.data[0].description, {
                    closeButton: true
                  });
                  $scope.progress = false;
                }
              });
            } else {
              toastr.clear();
              toastr.error(await translatedwords.getTranslatedWord($translate("La date n'appartient a aucune campagne agricole !")), {
                closeButton: true
              });
              $scope.progress = false;
            }
          });
        } else {
          toastr.clear();
          toastr.error(await translatedwords.getTranslatedWord($translate("Veuillez renseigner tous les champs obligatoires")), {
            closeButton: true
          });
        }

      };
    }


    pc.delete = async function(c) {
      pc.IDRamassage = c.ID;
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            RamassageDestruction.delete({
              ID: pc.IDRamassage
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



    //by parcelle cultural
    pc.parcelle_change = function() {
      NProgress.start();
      var parcelle = $scope.parcelle.parcelle;

      if (validateInput(parcelle) || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0))
        parcelle = [0];

      pc.obj.PARCELLE = parcelle;
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };

    //starting date change listner
    pc.date_debut_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_debut;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_DEBUT = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };

    //by date_fin
    pc.date_fin_change = function() {
      NProgress.start();
      var dateToChoose = $scope.date_fin;
      if (validateInput(dateToChoose))
        dateToChoose = 0;

      pc.obj.DATE_FIN = moment(dateToChoose).format('YYYYMMDD');
      savefilter.setFilters(pc.obj);
      try {
        pc.dtInstance.reloadData();
      } catch (e) {}
      NProgress.done();
      NProgress.remove();
    };

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

  });