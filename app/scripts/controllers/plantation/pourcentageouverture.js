'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PourcentageouvertureCtrl
 * @description
 * # PourcentageouvertureCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PourcentageouvertureCtrl', function($scope, translatedwords, DTOptionsBuilder, $translatePartialLoader, $translate, $window, DTColumnBuilder, $q, $compile, pourcentageOuverture, $mdDialog, $state, campagneagricole, domaine, parcellecultural, DTDefaultOptions, $cookies, toastr, savefilter) {

    //alert();
    var pc = this;
    pc.dtInstance = {};
    pc.OuvertureObject = {};
    var titleHtml = '<input type="checkbox" ng-model="pc.selectAll" ng-click="pc.toggleAll(pc.selectAll, pc.selected)">';
    pc.selected = {};
    pc.selectAll = false;
    pc.toggleAll = toggleAll;
    pc.toggleOne = toggleOne;
    pc.IDFerme = $cookies.getObject('globals').ferme.IDFerme;
    pc.IDSociete = $cookies.getObject('globals').ferme.IDSociete;
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


    //load Parcelle cultural list by domaine
    $scope.LoadParcelleCultural = parcellecultural.getParcelleCulturalByFerme($cookies.getObject('globals').ferme.IDFerme).then(function(res) {
      pc.parcellescultural = res.data;
    });

    //set date input
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();

    $q.all([$scope.LoadDomaine, $scope.LoadParcelleCultural]).then(function(values) {


      setTimeout(function() {
        $("#Parcelle").selectpicker('refresh');
      }, 1000);
    });

    pc.obj = {
      "DOMAINE": $cookies.getObject('globals').ferme.IDFerme,
      "PARCELLE_CULTURAL": [0],
      "DATE_DEBUT": 0,
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

    //by parcelle cultural
    $scope.parcelle_change = function() {

      if ($scope.parcelle.parcelle === null || $scope.parcelle.parcelle === "" || $scope.parcelle.parcelle === undefined || $scope.parcelle.parcelle === 0 || $scope.parcelle.parcelle === "0" || !$scope.parcelle.parcelle || $scope.parcelle.parcelle.length === 0 || $scope.parcelle.parcelle.includes(0)) {
        $scope.parcelle_sel = [0];
      } else {
        $scope.parcelle_sel = $scope.parcelle.parcelle;
      }

      pc.obj.PARCELLE_CULTURAL = $scope.parcelle_sel;
      pc.dtInstance.reloadData();


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
      pc.dtInstance.reloadData();


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
      pc.dtInstance.reloadData();


    };

    //get data and refresh datatable
    $scope.updateDataOuverture = function(data) {
      return pourcentageOuverture.getByFiltre(data);
    };

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $scope.updateDataOuverture(pc.obj).then(function(res) {
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
          extend: 'excel',
          text: "<i class='fa fa-file-excel-o'></i>",
          titleAttr: 'EXCEL'
        },
        {
          text: "<i class='fa fa-table'></i>",
          action: function(e, dt, node, config) {
            $state.go("synthesePourcentageOuverture");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Synthèse de pourcentage d'ouverture"))
        },
        {
          text: "<i class='fa fa-th'></i>",
          action: function(e, dt, node, config) {
            $state.go("syntheseouvertureparparcelle");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Synthèse de pourcentage d'ouverture par parcelle"))
        }
      ]);

    pc.dtColumns = [
      DTColumnBuilder.newColumn('DateCreated').withTitle(translatedwords.getTranslatedWord($translate("Date"))).renderWith(function(data, type, full, meta) {
        return moment(full.DateCreated).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Culture').withTitle(translatedwords.getTranslatedWord($translate("Culture"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Porte_greffe').withTitle(translatedwords.getTranslatedWord($translate("Porte-Greffe"))),
      DTColumnBuilder.newColumn('Num_Arbre').withTitle(translatedwords.getTranslatedWord($translate("Arbre"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + full.Num_Arbre + '</p>';
      }),
      DTColumnBuilder.newColumn('Orientation').withTitle(translatedwords.getTranslatedWord($translate("Orientation"))),
      DTColumnBuilder.newColumn('f_floral').withTitle(translatedwords.getTranslatedWord($translate("Bouton floral"))).renderWith(function(data, type, full, meta) {
        if (full.f_floral !== null)
          return '<p align="right">' + full.f_floral + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('f_ferme').withTitle(translatedwords.getTranslatedWord($translate("F fermées"))).renderWith(function(data, type, full, meta) {
        if (full.f_ferme !== null)
          return '<p align="right">' + full.f_ferme + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('f_ouvertes').withTitle(translatedwords.getTranslatedWord($translate("F ouvertes"))).renderWith(function(data, type, full, meta) {
        if (full.f_ouvertes !== null)
          return '<p align="right">' + full.f_ouvertes + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('f_petales_chutes').withTitle(translatedwords.getTranslatedWord($translate("F pétales chutées"))).renderWith(function(data, type, full, meta) {
        if (full.f_petales_chutes !== null)
          return '<p align="right">' + full.f_petales_chutes + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('f_nouee').withTitle(translatedwords.getTranslatedWord($translate("F nouées"))).renderWith(function(data, type, full, meta) {
        if (full.f_nouee !== null)
          return '<p align="right">' + full.f_nouee + '</p>';
        return "";
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Observateur"))),
      DTColumnBuilder.newColumn(null).withOption('width', '5%').withTitle(translatedwords.getTranslatedWord($translate("Actions"))).notSortable()
      .renderWith(actionsHtml).withClass('nowraptd all')
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
      pc.OuvertureObject[data.ID] = data;
      return "<center><button class='btn btn-warning btn-xs' title='Modifier' ng-click='pc.edit(pc.OuvertureObject[  " + data.ID + " ])'><i class='fa fa-edit'></i></button>&nbsp;" +
        "<button class='btn btn-danger btn-xs' title='Supprimer' ng-click='pc.delete(" + data.ID + ")'><i class='fa fa-trash'></i></button><center>";
    }


    //Modifer
    pc.edit = function(data) {
      $q.all([parcellecultural.getParcelleCulturalByFerme(pc.IDFerme)]).then((values) => {
        $scope.ParcelleCulturale = values[0].data;
        $scope.data = data;
        document.getElementById("filter_form").style.display = "none";
        $scope.showAdvancedEdit("ev", $scope.ParcelleCulturale, $scope.data);
      });
    }


    $scope.showAdvancedEdit = function(ev, ParcelleCulturale, data) {
      $mdDialog.show({
          controller: DialogControllerEdit,
          templateUrl: '././views/templates/Suivipourcentageouverture/EditPourcentageOuverture.html',
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
      $scope.orientationArr = [{
        'name': 'E',
        'key': 1
      }, {
        'name': 'O',
        'key': 2
      }, {
        'name': 'N',
        'key': 3
      }, {
        'name': 'S',
        'key': 4
      }, {
        'name': 'C',
        'key': 5
      }];

      $scope.onUpdate = () => {
        if (!$scope.parcelleculturale) {
          $scope.parcelleculturale = $scope.data.ID_Parcelle;
        }
        if (!$scope.orientation) {
          $scope.orientation = $scope.data.Orientation;
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
        if ($scope.parcelleculturale && $scope.data.Num_Arbre && $scope.orientation && $scope.data.f_floral >= 0 && $scope.data.f_ferme >= 0 && $scope.data.f_ouvertes >= 0 && $scope.data.f_petales_chutes >= 0 && $scope.data.f_nouee >= 0) {
          //check campagneagricole
          $scope.progress = true;
          campagneagricole.getCodeCampagneByIDSocieteDate({
            "IDSOCIETE": pc.IDSociete,
            "DATE": $scope.mydatedecreation
          }).then(async function(result) {
            NProgress.done();
            if (result.data.length > 0) {
              //Edit
              pourcentageOuverture.update({
                "ID": $scope.data.ID,
                "datedecreation": $scope.mydatedecreation,
                "parcelleculturale": $scope.parcelleculturale,
                "Num_Arbre": $scope.data.Num_Arbre,
                "orientation": $scope.orientation,
                "Code_compagne": result.data[0].Code_compagne,
                "f_floral": $scope.data.f_floral,
                "f_ferme": $scope.data.f_ferme,
                "f_ouvertes": $scope.data.f_ouvertes,
                "f_petales_chutes": $scope.data.f_petales_chutes,
                "f_nouee": $scope.data.f_nouee
              }).then(async function(res) {
                NProgress.done();
                pc.rescreate = res.data;
                if (pc.rescreate[0].message == 'ajout reussi') {
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

    //Delete StadePheno
    pc.delete = async function(ID) {
      toastr.clear();
      toastr.info("<button type='button' id='confirmationRevertYes' class='btn btn-danger'>" + await translatedwords.getTranslatedWord($translate("Je confirme")) + "</button>", await translatedwords.getTranslatedWord($translate("Veuillez confirmer !")), {
        closeButton: true,
        allowHtml: true,
        onShown: function(toast) {
          $("#confirmationRevertYes").click(function() {
            pourcentageOuverture.delete({
              "ID": ID
            }).then(async function(res) {
              NProgress.done();
              pc.rescreate = res.data;
              if (pc.rescreate[0].message == 'ajout reussi') {
                toastr.clear();
                toastr.info(await translatedwords.getTranslatedWord($translate("Suppression réussie")), {
                  closeButton: true
                });
                pc.dtInstance.reloadData();
              } else {
                toastr.clear();
                toastr.error(await translatedwords.getTranslatedWord($translate("Le serveur ne répond pas, veuillez réessayer ultérieurement !")), {
                  closeButton: true
                });
              }
            });
          });
        }
      });


    }

  });