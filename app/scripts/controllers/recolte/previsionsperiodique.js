'use strict';

/**
 * @ngdoc function
 * @name beeOneWebFrontApp.controller:PrevisionsperiodiqueCtrl
 * @description
 * # PrevisionsperiodiqueCtrl
 * Controller of the beeOneWebFrontApp
 */
angular.module('beeOneWebFrontApp')
  .controller('PrevisionsperiodiqueCtrl', function($scope, $translatePartialLoader, $translate, $window, DTOptionsBuilder, DTColumnBuilder, $q, $compile, AgreageFruit, $state, $cookies, parcellecultural, campagneagricole,
    PeriodeEstimation, societe, VarieteService, domaine, DTDefaultOptions, $uibModal, translatedwords, $mdDialog, $element, toastr, _url, $filter, BusinessUnit, FermeService) {

    //alert();
    var pc = this;
    $translatePartialLoader.addPart('conduitetechnique');
    $translate.use($window.localStorage.getItem("lang").toLowerCase());
    $translate.refresh($window.localStorage.getItem("lang").toLowerCase());
    pc.dtInstance = {};

    var heightOfTable = $(window).height() - ($("#filter_form").height() * 2) - 40;
    $scope.date_fin = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.current_date = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').toDate();
    $scope.currentCampId = -1;
    pc.obj = {
      "ID_Societe_Societe": [0],
      "ID_Societe": 0,
      "CAMPAGNE": "",
      "DOMAINE": [0],
      "PARCELLE": [0],
      "ID_PERIODE": 0,
      "VARIETE": [0]
    };
    var accessObject = angular.fromJson($window.sessionStorage.getItem(3));
    var canGo = true;
    var permission = {};
    pc.branchePermission = angular.fromJson($window.sessionStorage.getItem(1));
    angular.forEach(accessObject[pc.branchePermission.module], (k, v) => {
      if (canGo && k[pc.branchePermission.rubrique]) {
        var canGoInner = true;
        canGo = false;
        angular.forEach(k[pc.branchePermission.rubrique], (ks, vs) => {
          if (canGoInner && ks["ss_menu_name"] == pc.branchePermission.submodule) {
            canGoInner = false;
            permission = ks;
          }
        });
      }
    });





    setTimeout(function() {
      $(".selectpicker").selectpicker();
      $("#Societe").selectpicker('refresh');
      $("#Producteur").selectpicker('refresh');
      $("#Domaine").selectpicker('refresh');
      $("#compagne").selectpicker('refresh');
      $("#periode").selectpicker('refresh');
      $("#parcelle").selectpicker('refresh');
      $("#variete").selectpicker('refresh');
    }, 1000);



    pc.filterWithItems = {
      societe: -1
    };

    $q.all([societe.getSociete(_url),
      domaine.getDomaine(),
      BusinessUnit.getBusinessUnit(pc.obj)
    ]).then((values) => {
      pc.societes = values[0].data;
      pc.filterWithItems.societe = pc.societes[0].ID;
      pc.domaines = values[1].data;
      pc.producteurs = values[2].data;
      if (pc.societes.length && pc.domaines.length) {
        $q.all([VarieteService.getVarieteByFarm({
            idferme: pc.obj.DOMAINE,
            multi: 'true'
          }), parcellecultural.showbydomaineIfExist(pc.obj),
          campagneagricole.getCampagneAgricoleByIDSociete(pc.societes[0].ID)
        ]).then(async e => {
          pc.variete_array = e[0].data;
          pc.parcelles_array = e[1].data;
          pc.compagne_array = e[2].data;
          await asyncForEach(pc.compagne_array, async (d) => {
            var canGo = true;
            if (canGo && moment().isBetween(moment(d.Date_debut).subtract(1, 'd'), moment(d.Date_Fin).add(1, 'd'))) {
              pc.current_campagne = d.Code;
              canGo = false;
            }
          });
          pc.loadEstimamtionPeriodique(pc.societes[0].ID);
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            $('#Societe').selectpicker('val', pc.societes[0].ID);
            $('#compagne').selectpicker('val', pc.current_campagne);
            pc.obj.ID_Societe = pc.societes[0].ID;
            pc.obj.CAMPAGNE = pc.current_campagne;
          }, 1000);
        });
      }
    });

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    pc.loadEstimamtionPeriodique = (id_soc) => {
      PeriodeEstimation.getPeriodeEstimation({
        ID_Societe: id_soc,
        CAMPAGNE: pc.current_campagne
      }).then(e => {
        pc.estimation_periode_array = e.data;
        setTimeout(function() {
          $(".selectpicker").selectpicker('refresh');
          $('#compagne').selectpicker('val', pc.current_campagne);
          pc.obj.CAMPAGNE = pc.current_campagne;
        }, 1000);
        NProgress.done();
      });
    }

    $scope.ReverseDisplay = function(d) {
      if (document.getElementById(d).style.display === "none") {
        document.getElementById(d).style.display = "block";
      } else {
        document.getElementById(d).style.display = "none";
      }
    }

    pc.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        PeriodeEstimation.getEstimationPeriodique(pc.obj).then(function(result) {
          for (var i = 0; i < result.data.length; i++) {
            result.data[i].Date_Saisie = moment(result.data[i].Date_Saisie).format('YYYY-MM-DD');
            result.data[i].Date_Reel = moment(result.data[i].Date_Reel).format('YYYY-MM-DD');
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


      .withButtons([{
          text: "<i class='fa fa-plus'></i>",
          key: '1',
          action: function(e, dt, node, config) {
            if (pc.estimation_periode_array) {
              pc.showModal('', "c");
            } else {
              toastr.info(translatedwords.getTranslatedWord($translate("Veuillez attendre la fin de telechargement de données")), {
                closeButton: true
              });
            }

          },
          className: 'pull-left' + (($cookies.getObject('globals').assistUser.isAdmin) ? '' : (((permission.a) ? '' : ' disabled'))),
          titleAttr: translatedwords.getTranslatedWord($translate("Ajouter"))
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
        },
        {
          text: "<i class='fa fa-area-chart'></i>",
          action: function(e, dt, node, config) {
            $state.go("previsionPeriodiqueGraphe");
          },
          titleAttr: translatedwords.getTranslatedWord($translate("Consultation prévisions Prévisions période"))
        }
      ]);



    pc.dtColumns = [
      DTColumnBuilder.newColumn('CodePeriode').withTitle(translatedwords.getTranslatedWord($translate("Période"))),
      DTColumnBuilder.newColumn('Date_Saisie').withTitle(translatedwords.getTranslatedWord($translate("Date de saisie"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Saisie).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Date_Reel').withTitle(translatedwords.getTranslatedWord($translate("Jour"))).renderWith(function(data, type, full, meta) {
        return moment(full.Date_Reel).format('DD/MM/YYYY');
      }),
      DTColumnBuilder.newColumn('Ref').withTitle(translatedwords.getTranslatedWord($translate("Parcelle culturale"))),
      DTColumnBuilder.newColumn('Variete').withTitle(translatedwords.getTranslatedWord($translate("Variété"))),
      DTColumnBuilder.newColumn('Qauntite').withTitle(translatedwords.getTranslatedWord($translate("Quantité estimée"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + $filter('numberwithspace')(full.Qauntite) + ' Kg</p>';
      }),
      DTColumnBuilder.newColumn('Qte_Actualise').withTitle(translatedwords.getTranslatedWord($translate("Quantité actualisée"))).renderWith(function(data, type, full, meta) {
        return '<p align="right">' + $filter('numberwithspace')(full.Qte_Actualise) + ' Kg</p>';
      }),
      DTColumnBuilder.newColumn('Date_Actualise').withTitle(translatedwords.getTranslatedWord($translate("Date d'actualisation"))).renderWith(function(data, type, full, meta) {
        if (full.Date_Actualise) {
          return moment(full.Date_Actualise).format('DD/MM/YYYY');
        } else {
          return "";
        }
      }),
      DTColumnBuilder.newColumn(null).withTitle(translatedwords.getTranslatedWord($translate("Statut"))).renderWith(function(data, type, full, meta) {
        var statuts = "";
        if (full.is_Actualise == 1) {
          statuts = "<span class='badge-green_withe'>Actualisée</span> ";
        }
        if (full.is_not_Recolte == 1) {
          statuts += "<span class='badge-blue-unclear_withe'>Pas de récolte</span>";
        }
        return statuts;
      }),
      DTColumnBuilder.newColumn('CreatedBy').withTitle(translatedwords.getTranslatedWord($translate("Opérateur")))
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
      return '<button class="btn btn-warning btn-xs" title="Modifier" ng-click="pc.edit(pc.obj[' + data.ID + '])">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger btn-xs" title="Supprimer" ng-click="pc.delete(pc.obj[' + data.ID + '])" )"="">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }

    //by parcelle cultural
    pc.parcelle_change = function() {

      var parcelle = $scope.parcelle.parcelle;
      NProgress.start();
      if (validateInput(parcelle) || parcelle.length === 0 || parcelle.includes(0)) {
        parcelle = [0];
        $q.all([VarieteService.getVarieteByFarm({
          idferme: pc.obj.DOMAINE,
          multi: 'true'
        })]).then(e => {
          pc.variete_array = e[0].data;

          setTimeout(function() {
            $("#variete").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      } else {
        VarieteService.getVarieteByParcel({
          PARCELLE_CULTURAL: parcelle
        }).then(e => {
          pc.variete_array = e.data;

          setTimeout(function() {
            $("#variete").selectpicker('refresh');
            NProgress.done();
          }, 100);
        })
      }

      pc.obj.PARCELLE = parcelle;

    };

    //by variety
    pc.variete_change = function() {

      var variete = $scope.variete.variete;

      if (validateInput(variete) || variete.length === 0 || variete.includes(0))
        variete = [0];

      pc.obj.VARIETE = variete;
    };


    //by variety
    pc.periode_change = function() {

      var periode = $scope.periode_estimation_id.periode_estimation_id;

      if (validateInput(periode) || periode.length === 0 || periode.includes(0))
        periode = 0;

      pc.obj.ID_PERIODE = periode;
    };

    //by date_fin
    pc.compagne_change = function() {
      if ($scope.compagne != null) {
        pc.obj.CAMPAGNE = $scope.compagne;
        PeriodeEstimation.getPeriodeEstimation(pc.obj).then(e => {
          pc.estimation_periode_array = e.data
          setTimeout(function() {
            NProgress.done();
            NProgress.remove();
            $(".selectpicker").selectpicker('refresh');
          }, 1000);
        });
      }
    };

    pc.domaine_change = function() {
      NProgress.start();
      var domaine = $scope.domaine;
      if ($scope.domaine && $scope.domaine.length > 0 && !$scope.domaine.includes(0))
        pc.obj.DOMAINE = domaine;
      else {
        pc.obj.DOMAINE = [];
        angular.forEach(pc.domaines, (v, k) => {
          if (v.ID_societe == pc.filterWithItems.societe)
            pc.obj.DOMAINE.push(v.IDFermes);
        });
      }

      if (pc.obj.DOMAINE.length > 0) {
        $q.all([VarieteService.getVarieteByFarm({
          idferme: pc.obj.DOMAINE,
          multi: 'true'
        }), parcellecultural.showbydomaineIfExist(pc.obj)]).then(e => {
          pc.variete_array = e[0].data;
          pc.parcelles_array = e[1].data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            NProgress.done();
          }, 100);
        });
      }
    };

    pc.societe_change = function() {
      if ($scope.societe != null) {
        pc.obj.ID_Societe = $scope.societe;
        pc.filterWithItems.societe = $scope.societe;

        campagneagricole.getCampagneAgricoleByIDSociete(pc.obj.ID_Societe).then(async e => {
          pc.compagne_array = e.data;
          await asyncForEach(pc.compagne_array, async (d) => {
            var canGo = true;
            if (canGo && moment().isBetween(moment(d.Date_debut).subtract(1, 'd'), moment(d.Date_Fin).add(1, 'd'))) {
              pc.current_campagne = d.Code;
              canGo = false;
            }
          });
          pc.loadEstimamtionPeriodique(pc.obj.ID_Societe);
        });

      }
    };

    pc.producteur_change = function() {

      NProgress.start();
      pc.domaines = [];
      if ($scope.producteur && $scope.producteur.length > 0) {
        pc.obj.ID_Societe = $scope.producteur;
        FermeService.bySociete({
          Societe: pc.obj.ID_Societe_Societe,
          businessUnit: pc.obj.ID_Societe
        }).then(e => {
          pc.domaines = e.data;
          setTimeout(function() {
            $(".selectpicker").selectpicker('refresh');
            $("#Domaine").selectpicker('refresh');
            NProgress.done();
          }, 1000);
        })
      } else {
        pc.obj.ID_Societe = [0];
        NProgress.done();
      }

    };

    pc.getPeriodeEstimation = (estimationPeriode) => {
      return moment(estimationPeriode.Date_Debut).format('YYYY-MM-DD') + " / " + moment(estimationPeriode.Date_Fin).format('YYYY-MM-DD') + " (" + estimationPeriode.CodePeriode + ")";
    }

    function validateInput(data) {
      if (data === null || data === "" || data === undefined || data === 0 || data === "0" || !data || data === 0) {
        return true;
      }
      return false;
    }

    function DialogController($scope, $mdDialog) {
      $scope.societes = pc.societes;
      $scope.fermes = pc.domaines;
      $scope.estimationPeriode = [];
      $scope.getPeriodeEstimation = pc.getPeriodeEstimation;
      $scope.periodeToShow = {};
      $scope.searchTerm;
      $scope.hide = function() {
        $mdDialog.hide();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
        document.getElementsByClassName('left_col')[0].style.zIndex = 999999;
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };

      $scope.Societe_changed = function() {
        $scope.Ferme_changed();
        PeriodeEstimation.getPeriodeEstimation({
          ID_Societe: $scope.societe,
          CAMPAGNE: pc.current_campagne
        }).then(e => {
          $scope.estimationPeriode = e.data;
          NProgress.done();
        });
      };

      $scope.Ferme_changed = function() {
        $scope.parcel = [];
        $scope.selectedParcel = null;
      };

      $scope.loadParcel = () => {
        if ($scope.parcel.length > 0) {
          return $scope.parcel;
        }

        return parcellecultural.getParcelleCulturalByFerme($scope.ferme).then(e => {
          $scope.parcel = e.data;
        });
      }

      $scope.saveData = function() {
        var rqtPart = "('" + moment().format('YYYY-MM-DD') + "','" + moment().format("HH:mm:ss") + "','" + $cookies.getObject('globals').assistUser.Nom + " " + $cookies.getObject('globals').assistUser.Prenom + "',";
        rqtPart += "'" + pc.current_campagne + "',0,'" + moment().format('YYYY-MM-DD') + "','" + moment($scope.selectedDay).format('YYYY-MM-DD') + "',";
        var qrtGlob = "";
        angular.forEach($scope.selectedParcel, function(value, key) {
          qrtGlob += rqtPart + value.QT + "," + $scope.periodeToShow.ID + "," + $scope.ferme + "," + value.ID + ",NULL),";
        });
        qrtGlob = qrtGlob.substring(0, qrtGlob.length - 1);
        PeriodeEstimation.createEstimationPeriode({
          DATA: qrtGlob
        }).then(async e => {
          pc.resdelete = e.data;
          if (pc.resdelete[0].message == 'ajout reussi') {
            toastr.clear();
            toastr.info(await translatedwords.getTranslatedWord($translate("Action reussite")), {
              closeButton: true
            });
            pc.dtInstance.reloadData();
            $scope.cancel();
          } else {
            toastr.clear();
            toastr.error(await translatedwords.getTranslatedWord($translate("Une erreur est survenue !")), {
              closeButton: true
            });
          }
        });
      };

      $scope.onlyWeekendsPredicate = function(date) {
        return moment(date).isBetween(moment($scope.periodeToShow.Date_Debut).subtract(1, 'd'), moment($scope.periodeToShow.Date_Fin).add(1, 'd'));
      };

      $scope.periode_changed = function() {
        var keepGoing = true;
        angular.forEach($scope.estimationPeriode, function(value, key) {
          if (keepGoing) {
            if (value.ID == $scope.periode) {
              $scope.periodeToShow = value;
              keepGoing = false;
            }
          }

        });
      }




      $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
      };

      $element.find('input').on('keydown', function(ev) {
        ev.stopPropagation();
      });
    }

    pc.showModal = function(size, req) {
      var template = './views/templates/prevision/addprevisionperiodiquemodal.html';
      //pc.data.action = "insert";

      /*if (req == "d") {
        template = './views/templates/modalconfirmedelete.html';
        pc.data.action = "delete";
      } else if (req == "u") {
        pc.data.action = "update";
      }*/

      $mdDialog.show({
          controller: DialogController,
          templateUrl: template,
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });

      /*var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: template,
        controller: 'PrevisionPeriodiqueCtrl',
        controllerAs: 'pc',
        size: size,
        resolve: {
          data: function() {
            return {};
          }
        }
      });

      modalInstance.result.then(function(res) {
        if (res == 'delete') {

        } else if (res == 'insert') {
          pc.dtInstance.reloadData();
        }
      }, function() {});*/

    };

  });
